import { useEffect, useState } from 'react';

const BUCKETS = 900;

// Decodeert het bestand en geeft per bucket de maximale amplitude terug.
export function useWaveform(file) {
  const [state, setState] = useState({ peaks: null, duration: 0, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ peaks: null, duration: 0, error: null });
    if (!file) return undefined;

    (async () => {
      const ctx = new AudioContext();
      try {
        const decoded = await ctx.decodeAudioData(await file.arrayBuffer());
        const data = decoded.getChannelData(0);
        const step = Math.floor(data.length / BUCKETS) || 1;
        const peaks = new Float32Array(BUCKETS);
        for (let i = 0; i < BUCKETS; i++) {
          let max = 0;
          for (let j = i * step; j < (i + 1) * step && j < data.length; j++) {
            max = Math.max(max, Math.abs(data[j]));
          }
          peaks[i] = max;
        }
        if (!cancelled) setState({ peaks, duration: decoded.duration, error: null });
      } catch {
        if (!cancelled) setState({ peaks: null, duration: 0, error: 'Waveform niet beschikbaar' });
      } finally {
        ctx.close();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [file]);

  return state;
}
