import React from 'react';
import { BUILDINGS } from '../state/buildings.js';

/**
 * Settlement panel — completed buildings + work in progress. Compact
 * enough to sit in the dashboard grid without a scrollbar until the
 * colony grows.
 */
export default function SettlementPanel({ buildings, construction }) {
  const empty = buildings.length === 0 && construction.length === 0;

  return (
    <div className="dash-card">
      <h3 className="dash-card-title">Settlement</h3>
      {empty && (
        <div className="muted">Only the beach, the ships, a ring of fires.</div>
      )}

      {buildings.length > 0 && (
        <div className="dash-sub">Standing</div>
      )}
      {buildings.map((b) => {
        const def = BUILDINGS[b.id];
        return (
          <div key={b.id} className="settlement-row built">
            <span className="settlement-name">{def?.label || b.id}</span>
            <span className="settlement-note">{def?.description}</span>
          </div>
        );
      })}

      {construction.length > 0 && (
        <div className="dash-sub" style={{ marginTop: 6 }}>Under construction</div>
      )}
      {construction.map((b) => {
        const def = BUILDINGS[b.id];
        const pct = def?.days
          ? Math.max(0, Math.min(100, ((def.days - b.daysRemaining) / def.days) * 100))
          : 0;
        return (
          <div key={`c_${b.id}`} className="settlement-row building">
            <div className="settlement-name">{def?.label || b.id}</div>
            <div className="settlement-progress">
              <div
                className="settlement-progress-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="settlement-note">{b.daysRemaining}d left</div>
          </div>
        );
      })}
    </div>
  );
}
