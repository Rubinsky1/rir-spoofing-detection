import { useCallback, useState } from 'react';

let counter = 0;

function newSession() {
  counter += 1;
  return { id: crypto.randomUUID(), name: `Sessie ${counter}`, items: [] };
}

function newItem(file) {
  return { id: crypto.randomUUID(), file, status: 'idle', result: null, error: null };
}

// Afgeleide status van een sessie op basis van de bestanden.
export function sessionStatus(session) {
  const { items } = session;
  if (items.some((i) => i.status === 'analysing')) return 'analysing';
  if (items.some((i) => i.status === 'error')) return 'error';
  if (items.length > 0 && items.every((i) => i.status === 'done')) return 'done';
  return 'idle';
}

export function useSessions() {
  const [sessions, setSessions] = useState(() => [newSession()]);
  const [activeId, setActiveId] = useState(() => sessions[0].id);

  const updateItem = useCallback((sessionId, itemId, patch) => {
    setSessions((list) =>
      list.map((s) =>
        s.id === sessionId
          ? { ...s, items: s.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) }
          : s
      )
    );
  }, []);

  const addSession = useCallback(() => {
    const s = newSession();
    setSessions((list) => [...list, s]);
    setActiveId(s.id);
  }, []);

  const removeSession = useCallback(
    (id) => {
      const rest = sessions.filter((s) => s.id !== id);
      if (rest.length === 0) {
        const s = newSession();
        setSessions([s]);
        setActiveId(s.id);
        return;
      }
      setSessions(rest);
      if (id === activeId) setActiveId(rest[rest.length - 1].id);
    },
    [sessions, activeId]
  );

  const addFiles = useCallback((sessionId, files) => {
    const items = files.map(newItem);
    setSessions((list) =>
      list.map((s) => (s.id === sessionId ? { ...s, items: [...s.items, ...items] } : s))
    );
  }, []);

  const removeItem = useCallback((sessionId, itemId) => {
    setSessions((list) =>
      list.map((s) =>
        s.id === sessionId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s
      )
    );
  }, []);

  const analyseItem = useCallback(
    async (sessionId, item) => {
      updateItem(sessionId, item.id, { status: 'analysing', result: null, error: null });
      try {
        const res = await fetch('/api/analyse', {
          method: 'POST',
          headers: { 'X-Filename': encodeURIComponent(item.file.name) },
          body: item.file,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Analyse mislukt');
        updateItem(sessionId, item.id, { status: 'done', result: data });
      } catch (err) {
        updateItem(sessionId, item.id, { status: 'error', error: err.message });
      }
    },
    [updateItem]
  );

  // Analyseert alle bestanden van de sessie tegelijk.
  const analyseAll = useCallback(
    (session) =>
      Promise.all(
        session.items.filter((i) => i.status !== 'analysing').map((i) => analyseItem(session.id, i))
      ),
    [analyseItem]
  );

  const activeSession = sessions.find((s) => s.id === activeId);

  return {
    sessions,
    activeSession,
    setActiveId,
    addSession,
    removeSession,
    addFiles,
    removeItem,
    analyseAll,
  };
}
