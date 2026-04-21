import React, { useEffect, useRef } from 'react';
import Illustration from '../illustrations/Illustration.jsx';

/**
 * The central prose view of the game. Renders chronicle entries newest-first,
 * with pottery-style SVG illustrations inline on featured entries.
 */
export default function Chronicle({ entries }) {
  const scrollRef = useRef(null);

  // Keep the newest entry visible when new ones arrive
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [entries?.length]);

  return (
    <main className="chronicle" ref={scrollRef}>
      {entries.map((entry, i) => (
        <div
          key={`${entry.day}-${i}`}
          className={`chronicle-entry ${entry.illustration ? 'featured' : ''}`}
        >
          <span className="when">
            {entry.season} D{entry.day}
          </span>
          <div className="text">
            <div>{entry.text}</div>
            {entry.illustration && <Illustration name={entry.illustration} />}
          </div>
        </div>
      ))}
      {entries.length === 0 && (
        <div className="muted">The shore is quiet. Nothing yet remembered.</div>
      )}
    </main>
  );
}
