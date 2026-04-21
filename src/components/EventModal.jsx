import React from 'react';
import Modal from './Modal.jsx';

/**
 * Non-dismissible modal for active story events. The player MUST pick
 * a choice — they cannot close it without resolving.
 */
export default function EventModal({ event, onChoose }) {
  if (!event) return null;

  return (
    <Modal title={event.title} dismissible={false}>
      <p className="prose">{event.description}</p>
      <div className="choices">
        {event.choices.map((c) => (
          <button
            key={c.id}
            className="choice-btn"
            onClick={() => onChoose(c.id)}
          >
            <div>{c.label}</div>
            {c.effects && Object.keys(c.effects).length > 0 && (
              <div className="cost-row">
                {Object.entries(c.effects).map(([k, v]) => (
                  <span
                    key={k}
                    className={`cost-chip ${v < 0 ? '' : 'gain'}`}
                  >
                    {v > 0 ? `+${v}` : v} {k}
                  </span>
                ))}
              </div>
            )}
            {c.addColonist && (
              <div className="cost-row">
                <span className="cost-chip gain">+ {c.addColonist.name}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
}
