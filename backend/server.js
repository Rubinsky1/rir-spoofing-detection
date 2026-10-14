const http = require('http');

const PORT = process.env.PORT || 3001;
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

// Vervang deze functie later door de echte analyse.
function analyse(buffer, filename) {
  const score = Math.round(Math.random() * 1000) / 10;
  return {
    filename,
    sizeBytes: buffer.length,
    manipulated: score >= 50,
    score, // percentage (0-100) dat het bestand gemanipuleerd is
  };
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
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
      return sendJson(res, 413, { error: 'Bestand te groot' });
    }
    chunks.push(chunk);
  });

  req.on('end', () => {
    if (aborted) return;
    if (size === 0) return sendJson(res, 400, { error: 'Geen bestand ontvangen' });
    let filename = 'onbekend';
    try {
      filename = decodeURIComponent(req.headers['x-filename'] || filename);
    } catch {}
    const result = analyse(Buffer.concat(chunks), filename);
    setTimeout(() => sendJson(res, 200, result), 1500); // simuleer rekentijd
  });
}

http
  .createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/api/analyse') return handleAnalyse(req, res);
    sendJson(res, 404, { error: 'Not found' });
  })
  .listen(PORT, () => console.log(`Backend draait op http://localhost:${PORT}`));
