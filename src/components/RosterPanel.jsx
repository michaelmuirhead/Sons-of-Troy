import React from 'react';
import { BUILDINGS } from '../state/buildings.js';
import { TASKS } from '../state/tasks.js';

/**
 * Right-side roster panel — lists named colonists with their current task,
 * buildings (complete and under construction), and discovered locations.
 */
export default function RosterPanel({ state }) {
  const { colonists, buildings, construction, locations } = state;

  return (
    <aside className="side-panel">
      <section className="panel-section">
        <h2>Roster ({colonists.length})</h2>
        {colonists.map((c) => (
          <div key={c.id} className="colonist-card">
            <div className="name">{c.name}</div>
            <div className="meta">
              {c.origin}
              {c.traits?.length ? ` · ${c.traits.join(', ')}` : ''}
            </div>
            <span className={`status ${c.status === 'idle' ? 'idle' : ''}`}>
              {c.status === 'idle'
                ? 'Idle'
                : `${taskLabel(c.currentTask)} · ${c.taskDaysRemaining}d left`}
            </span>
          </div>
        ))}
      </section>

      <section className="panel-section">
        <h2>Settlement</h2>
        {buildings.length === 0 && construction.length === 0 && (
          <div className="muted">Only the beach, the ship, a ring of fires.</div>
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

function taskLabel(taskId) {
  if (!taskId) return 'Working';
  return TASKS[taskId]?.label || 'Working';
}
