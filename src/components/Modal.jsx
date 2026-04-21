import React, { useEffect } from 'react';

/**
 * Generic centered modal with pottery frame. Closes on Escape or overlay click.
 */
export default function Modal({ title, children, onClose, dismissible = true }) {
  useEffect(() => {
    if (!dismissible) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dismissible, onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={() => dismissible && onClose?.()}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h3>{title}</h3>}
        {children}
        {dismissible && (
          <div className="close-row">
            <button className="btn ghost" onClick={onClose} style={{ color: '#1a1a1a', borderColor: '#1a1a1a' }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
