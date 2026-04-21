import React from 'react';

/**
 * Right-side panel showing the full roster of named colonists and
 * a scrolling log of recent colony events.
 */
export default function ColonistPanel({ colonists, log }) {
  return (
    <aside className="side-panel">
      <div className="panel-section">
        <h2>Roster</h2>
        {(colonists || []).map((c) => (
          <div key={c.id} className="colonist-card">
            <div className="portrait" aria-hidden="true" />
            <div className="info">
              <div className="name">{c.name}</div>
              <div className="meta">
                {c.origin}
                {c.traits?.length ? ` · ${c.traits.join(', ')}` : ''}
              </div>
              <span className="job">{c.job}</span>
            </div>
          </div>
        ))}
        {(!colonists || colonists.length === 0) && (
          <div className="log-entry">The shore is empty. Trojans are coming ashore…</div>
        )}
      </div>
      <div className="panel-section">
        <h2>Chronicle</h2>
        {(log || []).slice(0, 14).map((entry, i) => (
          <div key={i} className="log-entry">
            <span className="when">{entry.season} D{entry.day}:</span>
            {entry.line}
          </div>
        ))}
      </div>
    </aside>
  );
}
