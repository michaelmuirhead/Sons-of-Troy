import React from 'react';
import { TASKS } from '../state/tasks.js';

/**
 * Compact card for one of the seven Trojan houses.
 *
 * Shows:
 *  - House name, epithet, head
 *  - Ship of origin
 *  - Demographic bar (warriors / craftsmen / women / children / elders)
 *  - Influence (raw number), Ambition bar (0–100), Loyalty bar (0–100)
 *  - Current crew status (idle / out on X for Nd)
 *
 * Accent color is the family's house color (left border + name).
 */
export default function FamilyCard({ family }) {
  const p = family.population;
  const total =
    (p.warriors || 0) +
    (p.craftsmen || 0) +
    (p.women || 0) +
    (p.children || 0) +
    (p.elders || 0);

  // Demographic bar segments (skip zero-sized slices).
  const segments = [
    { key: 'warriors',  value: p.warriors || 0,  color: 'var(--clr-terracotta)' },
    { key: 'craftsmen', value: p.craftsmen || 0, color: 'var(--clr-aegean)' },
    { key: 'women',     value: p.women || 0,     color: 'var(--clr-ochre)' },
    { key: 'children',  value: p.children || 0,  color: 'var(--clr-olive)' },
    { key: 'elders',    value: p.elders || 0,    color: 'var(--clr-muted)' },
  ].filter((s) => s.value > 0);

  const crewLine = family.activeCrew
    ? `${TASKS[family.activeCrew.taskId]?.label || 'Working'} — ${family.activeCrew.size} out, ${family.activeCrew.daysRemaining}d left`
    : 'All hands at the hearths.';

  return (
    <div
      className="family-card"
      style={{ borderLeft: `6px solid ${family.color}` }}
    >
      <div className="fc-head" style={{ color: family.color }}>
        {family.name}
      </div>
      <div className="fc-sub">
        <em>{family.epithet}</em> · {family.head.name}
      </div>
      <div className="fc-ship">{family.ship}</div>

      <div className="fc-demo-label">
        <span>{total} souls</span>
        <span>
          {(p.warriors || 0)}w · {(p.craftsmen || 0)}c · {(p.women || 0)}f ·{' '}
          {(p.children || 0)}y · {(p.elders || 0)}e
        </span>
      </div>
      <div className="fc-demo-bar">
        {segments.map((s) => (
          <div
            key={s.key}
            className="fc-demo-seg"
            style={{
              flex: s.value,
              background: s.color,
            }}
            title={`${s.key}: ${s.value}`}
          />
        ))}
        {segments.length === 0 && <div className="fc-demo-empty" />}
      </div>

      <div className="fc-stats">
        <StatLine
          label="Influence"
          value={Math.round(family.influence)}
          bar={null}
        />
        <StatLine
          label="Ambition"
          value={Math.round(family.ambition)}
          bar={{ pct: family.ambition, color: 'var(--clr-terracotta)' }}
        />
        <StatLine
          label="Loyalty"
          value={Math.round(family.loyalty)}
          bar={{ pct: family.loyalty, color: 'var(--clr-olive)' }}
        />
      </div>

      <div className={`fc-crew ${family.activeCrew ? 'working' : ''}`}>
        {crewLine}
      </div>

      <div className="fc-tags">
        {family.stance.map((t) => (
          <span key={t} className="stance-chip">
            {t}
          </span>
        ))}
        {family.preferredTasks.map((tId) => (
          <span key={tId} className="spec-chip" title="Specialty">
            {TASKS[tId]?.label.replace(/^Fell the|^Quarry the|^Tend the|^Fish the|^Scout the|^Forage the/, '').trim() || tId}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatLine({ label, value, bar }) {
  return (
    <div className="fc-stat">
      <div className="fc-stat-top">
        <span className="fc-stat-label">{label}</span>
        <span className="fc-stat-val">{value}</span>
      </div>
      {bar && (
        <div className="fc-stat-bar">
          <div
            className="fc-stat-bar-fill"
            style={{
              width: `${Math.max(0, Math.min(100, bar.pct))}%`,
              background: bar.color,
            }}
          />
        </div>
      )}
    </div>
  );
}
