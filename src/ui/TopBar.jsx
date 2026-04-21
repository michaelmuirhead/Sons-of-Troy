import React from 'react';

const ICONS = {
  food: '🌾',   // (used conceptually — rendered as letter tokens if emoji blocked)
  wood: '🪵',
  stone: '⛰',
  pottery: '🏺',
};

// Fallback glyphs in case emoji don't render cleanly across browsers
const FALLBACK = {
  food: 'F',
  wood: 'W',
  stone: 'S',
  pottery: 'P',
};

function Chip({ kind, value }) {
  return (
    <div className="resource-chip" title={kind}>
      <span className="icon">{ICONS[kind] || FALLBACK[kind]}</span>
      <span className="label">{kind}</span>
      <span className="value">{Math.round(value || 0)}</span>
    </div>
  );
}

export default function TopBar({ colonyName, season, day, resources }) {
  return (
    <header className="top-bar">
      <div>
        <div className="colony-name">{colonyName || 'New Ilion'}</div>
        <div className="season">
          Day {day || 1} · {season || 'Spring'}
        </div>
      </div>
      <div className="resources">
        <Chip kind="food" value={resources?.food ?? 0} />
        <Chip kind="wood" value={resources?.wood ?? 0} />
        <Chip kind="stone" value={resources?.stone ?? 0} />
        <Chip kind="pottery" value={resources?.pottery ?? 0} />
      </div>
    </header>
  );
}
