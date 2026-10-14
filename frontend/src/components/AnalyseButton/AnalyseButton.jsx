import styles from './AnalyseButton.module.css';

export default function AnalyseButton({ analysing, count, onClick }) {
  const label = count > 1 ? `Analyse (${count} bestanden)` : 'Analyse';
  return (
    <button className={styles.button} disabled={analysing} onClick={onClick}>
      {analysing ? 'Analyseren…' : label}
    </button>
  );
}
