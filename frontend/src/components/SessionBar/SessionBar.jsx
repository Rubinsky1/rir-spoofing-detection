import { sessionStatus } from '../../hooks/useSessions.js';
import styles from './SessionBar.module.css';

const STATUS_LABEL = {
  idle: 'Geen analyse',
  analysing: 'Bezig…',
  done: 'Klaar',
  error: 'Fout',
};

export default function SessionBar({ sessions, activeId, onSelect, onAdd, onRemove }) {
  return (
    <nav className={styles.bar}>
      <button className={styles.add} onClick={onAdd}>+ Nieuwe sessie</button>
      <ul className={styles.list}>
        {sessions.map((s) => {
          const status = sessionStatus(s);
          return (
          <li
            key={s.id}
            className={`${styles.item} ${s.id === activeId ? styles.active : ''}`}
            onClick={() => onSelect(s.id)}
          >
            <div className={styles.info}>
              <span className={styles.name}>{s.name}</span>
              <span className={`${styles.status} ${styles[status]}`}>
                {STATUS_LABEL[status]} · {s.items.length} {s.items.length === 1 ? 'bestand' : 'bestanden'}
              </span>
            </div>
            <button
              className={styles.remove}
              title="Sessie sluiten"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(s.id);
              }}
            >
              ×
            </button>
          </li>
          );
        })}
      </ul>
    </nav>
  );
}
