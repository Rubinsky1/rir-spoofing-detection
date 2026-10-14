import styles from './TopBar.module.css';

export default function TopBar() {
  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>RIR Spoofing Detectie</h1>
    </header>
  );
}
