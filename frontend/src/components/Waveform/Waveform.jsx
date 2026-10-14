import { useEffect, useRef } from 'react';
import styles from './Waveform.module.css';

const WIDTH = 900;
const HEIGHT = 160;

export default function Waveform({ peaks, progress, onSeek }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current.getContext('2d');
    c.clearRect(0, 0, WIDTH, HEIGHT);
    if (!peaks) return;
    const played = Math.floor(progress * WIDTH);
    for (let x = 0; x < peaks.length; x++) {
      const h = Math.max(1, peaks[x] * HEIGHT);
      c.fillStyle = x < played ? '#2f6fed' : '#9aa7c2';
      c.fillRect(x, (HEIGHT - h) / 2, 1, h);
    }
  }, [peaks, progress]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek((e.clientX - rect.left) / rect.width);
  };

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      width={WIDTH}
      height={HEIGHT}
      onClick={handleClick}
    />
  );
}
