import React from 'react';
import Modal from './Modal.jsx';
import { BUILDINGS, canAfford } from '../state/buildings.js';

/**
 * Choose a building to commission. Shows cost chips per building
 * and disables anything unaffordable or already built/under construction.
 */
export default function BuildModal({ state, onBuild, onClose }) {
  const existing = new Set([
    ...state.buildings.map((b) => b.id),
    ...state.construction.map((b) => b.id),
  ]);

  return (
    <Modal title="Build" onClose={onClose}>
      <p className="prose">What will you raise on this shore?</p>
      <div className="choices">
        {Object.values(BUILDINGS).map((b) => {
          const already = existing.has(b.id);
          const afford = canAfford(state.resources, b.cost);
          const disabled = already || !afford;
          const reason = already ? 'already built' : !afford ? 'not enough' : '';

          return (
            <button
              key={b.id}
              className="choice-btn"
              disabled={disabled}
              onClick={() => {
                if (disabled) return;
                onBuild(b.id);
                onClose();
              }}
            >
              <div>
                <strong>{b.label}</strong>
                {reason && <span className="sub"> · {reason}</span>}
              </div>
              <div className="sub">{b.description}</div>
              <div className="cost-row">
                {Object.entries(b.cost).map(([k, v]) => (
                  <span
                    key={k}
                    className={`cost-chip ${
                      (state.resources[k] || 0) < v ? 'insufficient' : ''
                    }`}
                  >
                    {v} {k}
                  </span>
                ))}
                <span className="cost-chip time">{b.days}d</span>
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
