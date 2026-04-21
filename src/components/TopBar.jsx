import React from 'react';
import { SEASONS } from '../state/gameState.js';

const ORDER = ['food', 'wood', 'stone', 'faith', 'pottery'];

export default function TopBar({ state }) {
  const season = SEASONS[state.seasonIndex];
  return (
    <header className="top-bar">
      <div>
        <div className="colony-name">{state.colonyName}</div>
        <div className="date">
          Day {state.day} · {season}
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
