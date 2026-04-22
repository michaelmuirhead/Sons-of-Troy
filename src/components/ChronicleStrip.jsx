import React, { useState } from 'react';
import Modal from './Modal.jsx';

/**
 * A slim chronicle strip at the bottom of the dashboard. Shows the last
 * 2 entries with an "Open chronicle" button that expands to the full
 * history in a modal.
 */
export default function ChronicleStrip({ entries }) {
  const [open, setOpen] = useState(false);
  const recent = (entries || []).slice(0, 2);

  return (
    <>
      <div className="chronicle-strip">
        <div className="cs-entries">
          {recent.length === 0 && (
            <div className="muted">The shore is quiet. Nothing yet remembered.</div>
          )}
          {recent.map((entry, i) => (
            <div key={`${entry.day}-${i}`} className="cs-entry">
              <span className="cs-when">
                {entry.season} D{entry.day}
              </span>
              <span className="cs-text">{entry.text}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="cs-open"
          onClick={() => setOpen(true)}
        >
          Open Chronicle
          <span className="cs-count">{entries?.length || 0}</span>
        </button>
      </div>

      {open && (
        <Modal title="The Chronicle of New Ilion" onClose={() => setOpen(false)}>
          <div className="chronicle-full">
            {(entries || []).map((entry, i) => (
              <div key={`${entry.day}-${i}`} className="chronicle-entry">
                <span className="when">
                  {entry.season} D{entry.day}
                </span>
                <div className="text">{entry.text}</div>
              </div>
            ))}
            {(!entries || entries.length === 0) && (
              <div className="muted">The shore is quiet. Nothing yet remembered.</div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
