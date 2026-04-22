import React from 'react';
import { BUILDINGS } from '../state/buildings.js';
import ResourceGraph from './ResourceGraph.jsx';
import FamilyCard from './FamilyCard.jsx';
import { colonyPopulation } from '../state/families.js';

/**
 * Right-side panel — resource trends, the seven houses, buildings,
 * and discovered locations.
 */
export default function RosterPanel({ state }) {
  const { families, buildings, construction, locations, history } = state;
  const totalPop = colonyPopulation(families);

  return (
    <aside className="side-panel">
      <section className="panel-section">
        <h2>Trends</h2>
        <ResourceGraph history={history} />
      </section>

      <section className="panel-section">
        <h2>Houses ({families.length}) · {totalPop} souls</h2>
        <div className="family-list">
          {families.map((f) => (
            <FamilyCard key={f.id} family={f} />
          ))}
        </div>
      </section>

      <section className="panel-section">
        <h2>Settlement</h2>
        {buildings.length === 0 && construction.length === 0 && (
          <div className="muted">Only the beach, the ships, a ring of fires.</div>
        )}
        {buildings.map((b) => {
          const def = BUILDINGS[b.id];
          return (
            <div key={b.id} className="building-entry">
              <strong>{def?.label || b.id}</strong>
              <div className="muted" style={{ fontSize: 11 }}>
                {def?.description}
              </div>
            </div>
          );
        })}
        {construction.map((b) => {
          const def = BUILDINGS[b.id];
          return (
            <div key={`c_${b.id}`} className="building-entry">
              <strong>{def?.label || b.id}</strong>
              <div className="progress">Building — {b.daysRemaining}d remaining</div>
            </div>
          );
        })}
      </section>

      <section className="panel-section">
        <h2>Known locations</h2>
        {locations.filter((l) => l.discovered).length === 0 && (
          <div className="muted">The coast beyond the beach is still unknown.</div>
        )}
        {locations
          .filter((l) => l.discovered)
          .map((l) => (
            <div
              key={l.id}
              className={`location-entry ${l.visited ? 'visited' : ''}`}
            >
              <div className="loc-name">{l.name}</div>
              <div className="muted" style={{ fontSize: 11 }}>
                {l.visited ? '(visited)' : l.description}
              </div>
            </div>
          ))}
      </section>
    </aside>
  );
}
