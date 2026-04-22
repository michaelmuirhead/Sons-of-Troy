import React from 'react';
import { TASKS } from '../state/tasks.js';

/**
 * A single row of seven compact house cards across the top of the dashboard.
 * Each card is ~1/7th the width, equal flex. House color sits along the top
 * as a thick accent bar. All seven political stats are readable at a glance.
 *
 * Each card now surfaces the head's age and up to one named notable, so the
 * dashboard carries the political biography of the colony at a glance.
 * Seceded houses are rendered grey and struck-through — the empty place in
 * the council is part of the story.
 */
export default function HouseStrip({ families }) {
  return (
    <div className="house-strip">
      {families.map((f) => (
        <CompactFamilyCard key={f.id} family={f} />
      ))}
    </div>
  );
}

function CompactFamilyCard({ family }) {
  const p = family.population;
  const total =
    (p.warriors || 0) +
    (p.craftsmen || 0) +
    (p.women || 0) +
    (p.children || 0) +
    (p.elders || 0);

  const segments = [
    { key: 'warriors',  value: p.warriors || 0,  color: 'var(--clr-terracotta)' },
    { key: 'craftsmen', value: p.craftsmen || 0, color: 'var(--clr-aegean)' },
    { key: 'women',     value: p.women || 0,     color: 'var(--clr-ochre)' },
    { key: 'children',  value: p.children || 0,  color: 'var(--clr-olive)' },
    { key: 'elders',    value: p.elders || 0,    color: 'var(--clr-muted)' },
  ].filter((s) => s.value > 0);

  const shortName = family.name.replace('House of ', '');
  const headAge = family.head.age ? ` · ${family.head.age}` : '';
  const firstNotable = (family.notables || [])[0];

  const crewLine = family.activeCrew
    ? `${TASKS[family.activeCrew.taskId]?.label || 'Working'} · ${family.activeCrew.daysRemaining}d${family.activeCrew.patronOf ? ' · patron' : ''}`
    : 'Idle';

  if (family.seceded) {
    return (
      <div
        className="hs-card seceded"
        style={{ borderTop: `5px solid ${family.color}` }}
        title={`${family.name} has sailed from New Ilion.`}
      >
        <div className="hs-name" style={{ color: family.color }}>
          {shortName}
        </div>
        <div className="hs-head" style={{ textDecoration: 'line-through' }}>
          sailed
        </div>
        <div className="muted" style={{ fontSize: 10, marginTop: 6 }}>
          {family.ship} is gone.
        </div>
      </div>
    );
  }

  return (
    <div
      className="hs-card"
      style={{
        borderTop: `5px solid ${family.color}`,
      }}
      title={`${family.name} — ${family.epithet}\nHead: ${family.head.name}${headAge ? ` (age ${family.head.age})` : ''}\nShip: ${family.ship}`}
    >
      <div className="hs-name" style={{ color: family.color }}>
        {shortName}
      </div>
      <div className="hs-head">
        {family.head.name.split(' ')[0]}
        {family.head.age && (
          <span className="muted" style={{ marginLeft: 4, fontSize: 9 }}>
            {family.head.age}
          </span>
        )}
      </div>
      {firstNotable && (
        <div className="hs-notable" title={`${firstNotable.name} — ${firstNotable.role}`}>
          <span className="hs-notable-caret">›</span>
          {firstNotable.name.split(' ')[0]}
          <span className="muted" style={{ marginLeft: 4, fontSize: 9 }}>
            {firstNotable.age}
          </span>
        </div>
      )}

      <div className="hs-demo-label">
        <span>{total}</span>
        <span className="muted" style={{ fontSize: 9 }}>
          {(p.warriors || 0)}⚔ {(p.craftsmen || 0)}⚒ {(p.women || 0)}♀
        </span>
      </div>
      <div className="hs-demo-bar">
        {segments.map((s) => (
          <div
            key={s.key}
            className="hs-demo-seg"
            style={{ flex: s.value, background: s.color }}
          />
        ))}
      </div>

      <MiniStat label="INF" value={Math.round(family.influence)} />
      <MiniBar label="AMB" value={family.ambition} color="var(--clr-terracotta)" />
      <MiniBar label="LOY" value={family.loyalty} color="var(--clr-olive)" />

      <div className={`hs-crew ${family.activeCrew ? 'working' : 'idle'}`}>
        {crewLine}
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="hs-mini">
      <span className="hs-mini-lbl">{label}</span>
      <span className="hs-mini-val">{value}</span>
    </div>
  );
}

function MiniBar({ label, value, color }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="hs-mini">
      <span className="hs-mini-lbl">{label}</span>
      <div className="hs-mini-bar">
        <div
          className="hs-mini-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="hs-mini-val">{Math.round(value)}</span>
    </div>
  );
}
