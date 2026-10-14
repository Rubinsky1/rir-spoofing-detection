import TopBar from './components/TopBar/TopBar.jsx';
import SessionBar from './components/SessionBar/SessionBar.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Pickup from './components/Pickup/Pickup.jsx';
import Player from './components/Player/Player.jsx';
import AnalyseButton from './components/AnalyseButton/AnalyseButton.jsx';
import { useSessions } from './hooks/useSessions.js';
import styles from './App.module.css';

export default function App() {
  const {
    sessions,
    activeSession,
    setActiveId,
    addSession,
    removeSession,
    addFiles,
    removeItem,
    analyseAll,
  } = useSessions();

  const { items } = activeSession;
  const analysing = items.some((i) => i.status === 'analysing');

  return (
    <div className={styles.app}>
      <TopBar />
      <div className={styles.body}>
        <SessionBar
          sessions={sessions}
          activeId={activeSession.id}
          onSelect={setActiveId}
          onAdd={addSession}
          onRemove={removeSession}
        />
        <main className={items.length ? styles.mainFilled : styles.main}>
          {items.length ? (
            <div className={styles.workspace}>
              <div className={styles.actions}>
                <AnalyseButton
                  analysing={analysing}
                  count={items.length}
                  onClick={() => analyseAll(activeSession)}
                />
                <Pickup compact onFiles={(f) => addFiles(activeSession.id, f)} />
              </div>
              {items.map((item) => (
                <Player
                  key={item.id}
                  file={item.file}
                  status={item.status}
                  error={item.error}
                  onRemove={() => removeItem(activeSession.id, item.id)}
                />
              ))}
            </div>
          ) : (
            <Pickup onFiles={(f) => addFiles(activeSession.id, f)} />
          )}
        </main>
        <Sidebar items={items} />
      </div>
    </div>
  );
}
