import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { TASKS, taskDuration } from '../state/tasks.js';

/**
 * Two-step dispatch: pick a task, then pick an idle colonist.
 */
export default function DispatchModal({ state, onDispatch, onClose }) {
  const [taskId, setTaskId] = useState(null);

  const idle = state.colonists.filter((c) => c.status === 'idle');
  const task = taskId ? TASKS[taskId] : null;

  return (
    <Modal title="Dispatch" onClose={onClose}>
      {!task ? (
        <>
          <p className="prose">Which task do you send someone to?</p>
          <div className="choices">
            {Object.values(TASKS).map((t) => (
              <button
                key={t.id}
                className="choice-btn"
                onClick={() => setTaskId(t.id)}
              >
                {t.label} <span className="sub">{t.description} · {t.days}d</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="prose">
            <strong>{task.label}</strong> — {task.description} ({task.days}d)
          </p>
          <p className="prose" style={{ fontStyle: 'normal' }}>Who do you send?</p>
          <div className="choices">
            {idle.length === 0 && (
              <div className="muted">No one is idle. Wait for a task to complete.</div>
            )}
            {idle.map((c) => {
              const d = taskDuration(task, c);
              const extra = d < task.days ? ` · ${d}d (faster)` : '';
              return (
                <button
                  key={c.id}
                  className="choice-btn"
                  onClick={() => {
                    onDispatch(c.id, task.id);
                    onClose();
                  }}
                >
                  {c.name}
                  <span className="sub">
                    {c.origin} · {c.traits?.join(', ') || 'no noted traits'}{extra}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="close-row">
            <button className="btn ghost" onClick={() => setTaskId(null)} style={{ color: '#1a1a1a', borderColor: '#1a1a1a' }}>
              ← Back to tasks
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
