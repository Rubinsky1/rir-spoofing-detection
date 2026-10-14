# RIR Spoofing Detection

A web interface for audio analysis. Upload one or more audio files, play them, and run an analysis that reports whether each file is manipulated and with what score (percentage). The analysis currently returns mock data.

## Getting started

Requirements: Node.js 18+ and npm.

Install the frontend dependencies (the backend has none):

```bash
cd frontend
npm install
```

Start the backend (port 3001):

```bash
cd backend
npm start
```

Start the frontend (in a second terminal):

```bash
cd frontend
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api` requests to the backend.

## Repository structure

```
rir-spoofing-detection/
├── backend/
│   ├── package.json
│   └── server.js            # HTTP API: POST /api/analyse (mock analysis)
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js       # Dev server + /api proxy
    └── src/
        ├── main.jsx         # Entry point
        ├── App.jsx          # Page layout, wires components together
        ├── App.module.css
        ├── index.css        # Global styles and CSS variables
        ├── hooks/
        │   ├── useSessions.js   # Session/file state and analysis requests
        │   └── useWaveform.js   # Decodes audio into waveform peaks
        └── components/      # Each component has its own folder with X.jsx and X.module.css
            ├── TopBar/          # Header
            ├── SessionBar/      # List of sessions, start a new session
            ├── Sidebar/         # Results of the active session
            ├── ResultCard/      # Single result (manipulated, score)
            ├── Pickup/          # File picker / drop zone
            ├── Player/          # Waveform and audio player per file
            ├── Waveform/        # Canvas waveform
            └── AnalyseButton/   # Starts the analysis of all files in a session
```