import React from 'react';
import Modal from './Modal.jsx';

/**
 * List discovered, unvisited locations. Visiting yields whatever
 * oneTimeYield the location had. Also shows visited locations greyed out
 * so the player can see the map filling in.
 */
export default function ExploreModal({ state, onExplore, onClose }) {
  const known = state.locations.filter((l) => l.discovered);
  const unvisited = known.filter((l) => !l.visited);
  const visited = known.filter((l) => l.visited);

  return (
    <Modal title="Explore" onClose={onClose}>
      <p className="prose">
        Send a party to walk to one of these known places.
      </p>

      <div className="choices">
        {unvisited.length === 0 && (
          <div className="muted">
            Nothing new to walk to. Send someone scouting to find more.
          </div>
        )}

        {unvisited.map((l) => {
          const yields = l.oneTimeYield
            ? Object.entries(l.oneTimeYield)
                .map(([k, v]) => `+${v} ${k}`)
                .join(', ')
            : null;

          return (
            <button
              key={l.id}
              className="choice-btn"
              onClick={() => {
                onExplore(l.id);
                onClose();
              }}
            >
              <div>
                <strong>{l.name}</strong>
                {l.unlocksDiplomacy && <span className="sub"> · others live here</span>}
              </div>
              <div className="sub">{l.description}</div>
              {yields && <div className="cost-row"><span className="cost-chip gain">{yields}</span></div>}
            </button>
          );
        })}
      </div>

      {visited.length > 0 && (
        <>
          <p className="prose muted" style={{ marginTop: 16, fontSize: 12 }}>
            Already visited:
          </p>
          <div className="visited-list">
            {visited.map((l) => (
              <div key={l.id} className="muted" style={{ fontSize: 12 }}>
                · {l.name}
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
