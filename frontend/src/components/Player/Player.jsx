import { useEffect, useState } from 'react';
import Waveform from '../Waveform/Waveform.jsx';
import { useWaveform } from '../../hooks/useWaveform.js';
import styles from './Player.module.css';

const STATUS_LABEL = { analysing: 'Analyseren…', done: 'Geanalyseerd', error: 'Fout' };

export default function Player({ file, status, error, onRemove }) {
  const [url, setUrl] = useState(null);
  const [time, setTime] = useState(0);
  const [audio, setAudio] = useState(null);
  const { peaks, duration, error: waveError } = useWaveform(file);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    setTime(0);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className={styles.player}>
      <div className={styles.header}>
        <span className={styles.name}>{file.name}</span>
        {STATUS_LABEL[status] && (
          <span className={`${styles.status} ${styles[status]}`}>{STATUS_LABEL[status]}</span>
        )}
        <button className={styles.remove} title="Verwijderen" onClick={onRemove}>×</button>
      </div>
      <Waveform
        peaks={peaks}
        progress={duration ? time / duration : 0}
        onSeek={(p) => audio && duration && (audio.currentTime = p * duration)}
      />
      {(error || waveError) && <p className={styles.error}>{error || waveError}</p>}
      <audio
        ref={setAudio}
        className={styles.audio}
        src={url ?? undefined}
        controls
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
      />
    </div>
  );
}
