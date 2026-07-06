import { useEffect, useMemo, useState } from 'react';
import library from './content/library.json';
import Library from './components/Library';
import Reader from './components/Reader';

const FONT_SIZE_KEY = 'paath.fontSize';
const LAST_SCRIPTURE_KEY = 'paath.lastScripture';
const SCROLL_POSITIONS_KEY = 'paath.scrollPositions';

const DEFAULT_FONT_SIZE = 21;
const MIN_FONT_SIZE = 16;
const MAX_FONT_SIZE = 28;

const markdownModules = import.meta.glob('./content/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

function readNumber(key, fallback) {
  const value = localStorage.getItem(key);
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readJson(key, fallback) {
  const value = localStorage.getItem(key);
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeScrollPositions(value) {
  return value && typeof value === 'object' ? value : {};
}

function fileNameToPath(file) {
  return `./content/${file}`;
}

export default function App() {
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_FONT_SIZE;
    return readNumber(FONT_SIZE_KEY, DEFAULT_FONT_SIZE);
  });

  const [lastScriptureId, setLastScriptureId] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(LAST_SCRIPTURE_KEY) || '';
  });

  const [scrollPositions, setScrollPositions] = useState(() => {
    if (typeof window === 'undefined') return {};
    return normalizeScrollPositions(readJson(SCROLL_POSITIONS_KEY, {}));
  });

  const [activeId, setActiveId] = useState(() => lastScriptureId || '');

  const scriptureMap = useMemo(() => {
    const entries = library.map((item) => {
      const source = markdownModules[fileNameToPath(item.file)];
      return [item.id, source || ''];
    });

    return Object.fromEntries(entries);
  }, []);

  const activeScripture = library.find((item) => item.id === activeId) || null;
  const activeContent = activeScripture ? scriptureMap[activeScripture.id] || '' : '';

  useEffect(() => {
    localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem(LAST_SCRIPTURE_KEY, lastScriptureId);
  }, [lastScriptureId]);

  useEffect(() => {
    localStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(scrollPositions));
  }, [scrollPositions]);

  function openScripture(id) {
    setActiveId(id);
    setLastScriptureId(id);
  }

  function closeReader() {
    setActiveId('');
  }

  function changeFontSize(delta) {
    setFontSize((current) => {
      const next = current + delta;
      return Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, next));
    });
  }

  function updateScrollPosition(id, position) {
    setScrollPositions((current) => ({
      ...current,
      [id]: position,
    }));
  }

  if (!activeScripture) {
    return <Library items={library} onOpen={openScripture} />;
  }

  return (
    <Reader
      title={activeScripture.title}
      content={activeContent}
      fontSize={fontSize}
      initialScrollTop={scrollPositions[activeScripture.id] || 0}
      onClose={closeReader}
      onFontDecrease={() => changeFontSize(-1)}
      onFontIncrease={() => changeFontSize(1)}
      onScrollChange={(position) => updateScrollPosition(activeScripture.id, position)}
    />
  );
}
