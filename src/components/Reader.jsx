import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import FontControls from './FontControls';

export default function Reader({
  title,
  content,
  fontSize,
  initialScrollTop,
  onClose,
  onFontDecrease,
  onFontIncrease,
  onScrollChange,
}) {
  const scrollRef = useRef(null);
  const lastScrollTop = useRef(0);
  const rafId = useRef(0);
  const isMobileRef = useRef(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');

    function handleViewportChange(event) {
      isMobileRef.current = event.matches;
      if (!event.matches) {
        setIsHeaderHidden(false);
      }
    }

    handleViewportChange(media);
    media.addEventListener('change', handleViewportChange);

    return () => {
      media.removeEventListener('change', handleViewportChange);
    };
  }, []);

  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTop = initialScrollTop || 0;
    lastScrollTop.current = initialScrollTop || 0;
  }, [title]);

  function handleScroll(event) {
    const currentScrollTop = event.currentTarget.scrollTop;
    onScrollChange(currentScrollTop);

    if (!isMobileRef.current) return;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      const delta = currentScrollTop - lastScrollTop.current;

      if (currentScrollTop <= 4) {
        setIsHeaderHidden(false);
      } else if (delta > 8) {
        setIsHeaderHidden(true);
      } else if (delta < -8) {
        setIsHeaderHidden(false);
      }

      lastScrollTop.current = currentScrollTop;
    });
  }

  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  return (
    <main className="reader-shell">
      <header className={`reader-header ${isHeaderHidden ? 'is-hidden' : ''}`}>
        <button type="button" className="reader-title" onClick={onClose}>
          {title}
        </button>
        <FontControls onDecrease={onFontDecrease} onIncrease={onFontIncrease} />
      </header>

      <div ref={scrollRef} className="reader-scroll" onScroll={handleScroll}>
        <article className="reader-column" style={{ fontSize: `${fontSize}px` }}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
