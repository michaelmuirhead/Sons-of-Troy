import React from 'react';

/**
 * Bottom action bar. All player actions live here. End Day is disabled
 * while an event is active.
 */
export default function ActionBar({ state, onOpen, onEndDay, onReset }) {
  const idle = state.colonists.filter((c) => c.status === 'idle').length;
  const hasEvent = !!state.activeEvent;
  const knownLocs = state.locations.filter((l) => l.discovered && !l.visited)
    .length;

  return (
    <footer className="action-bar">
      <div className="action-group">
        <button
          className="btn primary"
          disabled={hasEvent || idle === 0}
          onClick={() => onOpen('dispatch')}
        >
          Dispatch
          <span className="sub">{idle} idle</span>
        </button>
        <button
          className="btn"
          disabled={hasEvent}
          onClick={() => onOpen('build')}
        >
          Build
        </button>
        <button
          className="btn"
          disabled={hasEvent || knownLocs === 0}
          onClick={() => onOpen('explore')}
        >
          Explore
          <span className="sub">{knownLocs} known</span>
        </button>
      </div>
      <div className="action-group right">
        <button className="btn ghost" onClick={onReset}>
          Reset
        </button>
        <button
          className="btn primary end-day"
          disabled={hasEvent}
          onClick={onEndDay}
        >
          End Day →
        </button>
      </div>
    </footer>
  );
}
