import React from 'react';
import { availableWorkers } from '../state/families.js';

/**
 * Bottom action bar. All player actions live here. End Day is disabled
 * while a council event is active.
 */
export default function ActionBar({ state, onOpen, onEndDay, onReset }) {
  const freeHouses = state.families.filter(
    (f) => !f.seceded && !f.activeCrew && availableWorkers(f) > 0,
  ).length;
  const activeHouses = state.families.filter(
    (f) => !f.seceded && f.activeCrew,
  ).length;
  const hasEvent = !!state.activeEvent;
  const knownLocs = state.locations.filter((l) => l.discovered && !l.visited)
    .length;

  return (
    <footer className="action-bar">
      <div className="action-group">
        <button
          className="btn primary"
          disabled={hasEvent || freeHouses === 0}
          onClick={() => onOpen('dispatch')}
        >
          Dispatch
          <span className="sub">
            {freeHouses} house{freeHouses === 1 ? '' : 's'} idle
            {activeHouses > 0 ? ` · ${activeHouses} afield` : ''}
          </span>
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
