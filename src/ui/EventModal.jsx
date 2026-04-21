import React from 'react';
import { eventBus, EVT } from '../eventBus.js';

/**
 * Renders a single story event at a time. Chooses a choice, emits
 * EVENT_CHOICE back to Phaser, then closes. The parent App owns the
 * `event` state and the onClose callback.
 */
export default function EventModal({ event, onClose }) {
  if (!event) return null;

  function choose(choice) {
    eventBus.emit(EVT.EVENT_CHOICE, { eventId: event.id, choiceId: choice.id });
    onClose();
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <div className="choices">
          {event.choices.map((c) => (
            <button key={c.id} onClick={() => choose(c)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
