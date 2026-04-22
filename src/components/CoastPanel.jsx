import React from 'react';

/**
 * Known locations along the coast. Discovered but unvisited places
 * show description; visited places are greyed. Hidden (undiscovered)
 * places appear as a silent count so the player knows there's more.
 */
export default function CoastPanel({ locations }) {
  const discovered = locations.filter((l) => l.discovered);
  const hiddenCount = locations.length - discovered.length;

  return (
    <div className="dash-card">
      <h3 className="dash-card-title">The Coast</h3>
      {discovered.length === 0 && (
        <div className="muted">The coast beyond the beach is still unknown.</div>
      )}

      {discovered.map((l) => (
        <div
          key={l.id}
          className={`coast-row ${l.visited ? 'visited' : ''}`}
        >
          <div className="coast-name">{l.name}</div>
          <div className="coast-note">
            {l.visited ? '(visited)' : l.description}
          </div>
        </div>
      ))}

      {hiddenCount > 0 && (
        <div className="coast-hidden muted">
          · {hiddenCount} unknown {hiddenCount === 1 ? 'place' : 'places'} beyond the headlands
        </div>
      )}
    </div>
  );
}
