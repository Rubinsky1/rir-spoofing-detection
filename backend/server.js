const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');

const PORT = process.env.PORT || 3001;
const PYTHON = process.env.PYTHON || 'python3';
const SCRIPT = path.join(__dirname, '..', 'analysis', 'analyse.py');
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

// Saves the upload to a temp file, runs the Python analysis on it and returns the parsed JSON.
async function analyse(buffer, filename) {
  const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'rir-'));
  const ext = path.extname(filename).replace(/[^.\w]/g, '').slice(0, 10);
  const file = path.join(dir, `upload${ext}`);
  try {
    await fs.promises.writeFile(file, buffer);
    const stdout = await new Promise((resolve, reject) => {
      execFile(PYTHON, [SCRIPT, file], { timeout: 120000 }, (err, out, stderr) => {
        if (err) return reject(new Error(stderr.trim() || err.message));
        resolve(out);
      });
    });
    const result = JSON.parse(stdout);
    if (result.error) throw new Error(result.error);
    return { ...result, filename };
  } finally {
    await fs.promises.rm(dir, { recursive: true, force: true });
  }
}

function handleAnalyse(req, res) {
  const chunks = [];
  let size = 0;
  let aborted = false;

  req.on('data', (chunk) => {
    if (aborted) return;
    size += chunk.length;
    if (size > MAX_UPLOAD_BYTES) {
      aborted = true;
      res.setHeader('Connection', 'close');
      return sendJson(res, 413, { error: 'File too large' });
    }
    chunks.push(chunk);
  });

  req.on('end', async () => {
    if (aborted) return;
    if (size === 0) return sendJson(res, 400, { error: 'No file received' });
    let filename = 'unknown';
    try {
      filename = decodeURIComponent(req.headers['x-filename'] || filename);
    } catch {}
    try {
      sendJson(res, 200, await analyse(Buffer.concat(chunks), filename));
    } catch (err) {
      console.error('Analysis failed:', err.message);
      sendJson(res, 500, { error: 'Analysis failed' });
    }
  });
}

http
  .createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/api/analyse') return handleAnalyse(req, res);
    sendJson(res, 404, { error: 'Not found' });
  })
  .listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
