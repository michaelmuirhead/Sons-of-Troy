import React from 'react';
import { SEASONS } from '../state/gameState.js';

const ORDER = ['food', 'wood', 'stone', 'faith', 'pottery', 'bronze', 'amber'];

export default function TopBar({ state }) {
  const season = SEASONS[state.seasonIndex];
  return (
    <header className="top-bar">
      <div>
        <div className="colony-name">
          {state.colonyName}
          {state.monarchy && (
            <span
              className="spec-badge"
              style={{ marginLeft: 8, background: 'var(--clr-terracotta)', color: 'var(--clr-cream)' }}
              title="The council has been dissolved."
            >
              Kingdom
            </span>
          )}
        </div>
        <div className="date">
          Year {state.year || 1} · Day {state.day} · {season}
        </div>
      </div>
      <div className="resources">
        {ORDER.map((kind) => (
          <div key={kind} className="resource-chip">
            <span className="label">{kind}</span>
            <span className="value">{Math.round(state.resources[kind] || 0)}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
