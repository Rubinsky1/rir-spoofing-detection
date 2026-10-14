import styles from './ResultCard.module.css';

export default function ResultCard({ name, result }) {
  const { manipulated, score } = result;

  return (
    <div className={styles.card}>
      <div className={styles.name}>{name}</div>
      <div className={styles.row}>
        <span>Gemanipuleerd</span>
        <strong className={manipulated ? styles.bad : styles.good}>{String(manipulated)}</strong>
      </div>
      <div className={styles.row}>
        <span>Score</span>
        <strong>{score}%</strong>
      </div>
      <div className={styles.bar}>
        <div
          className={`${styles.fill} ${manipulated ? styles.fillBad : ''}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
