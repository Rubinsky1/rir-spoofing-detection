import ResultCard from '../ResultCard/ResultCard.jsx';
import styles from './Sidebar.module.css';

// Toont alleen de resultaten van de bestanden van de actieve sessie.
export default function Sidebar({ items }) {
  const withResults = items.filter((i) => i.result);

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Resultaten</h2>
      {withResults.length === 0 ? (
        <p className={styles.empty}>Nog geen resultaten.</p>
      ) : (
        <div className={styles.list}>
          {withResults.map((i) => (
            <ResultCard key={i.id} name={i.file.name} result={i.result} />
          ))}
        </div>
      )}
    </aside>
  );
}
