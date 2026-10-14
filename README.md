# RIR Spoofing Detection

A web interface for audio analysis. Upload one or more audio files, play them, and run an analysis that reports whether each file is manipulated and with what score (percentage). The analysis currently returns mock data.

## Getting started

Requirements: Node.js 18+, npm and Python 3 (`python3` must be on the PATH, or set the `PYTHON` environment variable).

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

Open http://localhost:5173. 

## Repository structure

```
rir-spoofing-detection/
├── backend/
│   ├── package.json
│   └── server.js            # HTTP API: POST /api/analyse, runs the Python script
├── analysis/
│   └── analyse.py           # Artificial vs. real RIR detection (mock data for now)
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js       
    └── src/
        ├── main.jsx         
        ├── App.jsx          
        ├── App.module.css
        ├── index.css        
        ├── hooks/
        │   ├── useSessions.js   
        │   └── useWaveform.js   
        └── components/      
            ├── TopBar/          
            ├── SessionBar/      
            ├── Sidebar/         
            ├── ResultCard/      
            ├── Pickup/          
            ├── Player/          
            ├── Waveform/        
            └── AnalyseButton/   
```