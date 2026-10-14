import { useRef, useState } from 'react';
import styles from './Pickup.module.css';

// Bestandskiezer: groot in het midden als er nog geen bestanden zijn, compact als knop erna.
export default function Pickup({ onFiles, compact = false }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList ?? []).filter((f) => f.type.startsWith('audio/'));
    if (files.length) onFiles(files);
  };

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept="audio/*"
      multiple
      hidden
      onChange={(e) => {
        handleFiles(e.target.files);
        e.target.value = '';
      }}
    />
  );

  if (compact) {
    return (
      <>
        <button className={styles.compact} onClick={() => inputRef.current.click()}>
          Bestanden toevoegen
        </button>
        {input}
      </>
    );
  }

  return (
    <div
      className={`${styles.pickup} ${dragging ? styles.dragging : ''}`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <div className={styles.icon}>🎵</div>
      <p className={styles.text}>Sleep één of meerdere audiobestanden hierheen</p>
      <span className={styles.button}>Upload audio</span>
      {input}
    </div>
  );
}
