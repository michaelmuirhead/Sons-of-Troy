import React from 'react';
import Modal from './Modal.jsx';
import { councilTally, activeHouses } from '../state/families.js';

/**
 * Non-dismissible modal for active story events.
 *
 * For regular events, shows each choice with:
 *  - The supporting houses as colored chips
 *  - Weighted influence they command
 *  - Effects (gains/losses)
 *  - An override warning if the player picks a non-majority choice
 *
 * For crisis events (secession, coup), the council is bypassed — the
 * captain speaks directly. No tally, no override warnings; each choice
 * shows its consequence prose plainly.
 */
export default function EventModal({ event, families, onChoose }) {
  if (!event) return null;

  const isCrisis = !!event.isCrisis;
  const crisisFamily =
    isCrisis && families
      ? families.find((f) => f.id === event.crisisFamilyId)
      : null;

  // --- Crisis mode ---------------------------------------------------------
  if (isCrisis) {
    return (
      <Modal title={event.title} dismissible={false}>
        {crisisFamily && (
          <div
            className="crisis-banner"
            style={{
              borderLeft: `6px solid ${crisisFamily.color}`,
              background: 'var(--clr-cream)',
              padding: '8px 12px',
              margin: '4px 0 10px',
            }}
          >
            <strong style={{ color: crisisFamily.color }}>
              {crisisFamily.name}
            </strong>
            <span className="muted" style={{ marginLeft: 8, fontSize: 11 }}>
              INF {Math.round(crisisFamily.influence)} · AMB {crisisFamily.ambition} · LOY {crisisFamily.loyalty}
            </span>
          </div>
        )}
        <p className="prose">{event.description}</p>
        <div className="choices">
          {event.choices.map((c) => (
            <button
              key={c.id}
              className="choice-btn"
              onClick={() => onChoose(c.id)}
            >
              <div><strong>{c.label}</strong></div>
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
            </button>
          ))}
        </div>
        <div className="council-note">
          No council vote here. The decision falls on the captain alone. The
          houses will remember what you choose.
        </div>
      </Modal>
    );
  }

  // --- Regular event with council tally ------------------------------------
  const voters = families ? activeHouses(families) : [];
  const tally = voters.length > 0 ? councilTally(voters, event.choices) : null;
  let majorityId = null;
  if (tally) {
    let best = -1;
    for (const ch of event.choices) {
      const w = tally[ch.id]?.weight || 0;
      if (w > best) {
        best = w;
        majorityId = ch.id;
      }
    }
  }

  function familyById(id) {
    return families?.find((f) => f.id === id);
  }

  return (
    <Modal title={event.title} dismissible={false}>
      <p className="prose">{event.description}</p>
      <div className="choices">
        {event.choices.map((c) => {
          const supporters = tally?.[c.id]?.families || [];
          const weight = tally?.[c.id]?.weight || 0;
          const isMajority = c.id === majorityId;
          const isMinority = tally && supporters.length > 0 && c.id !== majorityId;
          const noVoice = tally && supporters.length === 0;

          return (
            <button
              key={c.id}
              className="choice-btn"
              onClick={() => onChoose(c.id)}
            >
              <div>
                {c.label}
                {isMajority && (
                  <span className="spec-badge" style={{ marginLeft: 8 }}>
                    Council majority
                  </span>
                )}
              </div>

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

              {c.joinsFamily && (
                <div className="cost-row">
                  <span className="cost-chip gain">+ warrior to {familyById(c.joinsFamily)?.name || c.joinsFamily}</span>
                </div>
              )}

              {supporters.length > 0 && (
                <div className="council-row">
                  <span>Supported by:</span>
                  {supporters.map((id) => {
                    const f = familyById(id);
                    if (!f) return null;
                    return (
                      <span
                        key={id}
                        className="house-chip"
                        style={{ background: f.color }}
                        title={f.name}
                      >
                        {f.name.replace('House of ', '')}
                      </span>
                    );
                  })}
                  <span className="council-weight">· {weight} infl.</span>
                </div>
              )}

              {noVoice && (
                <div className="council-row">
                  <em>No house speaks for this. If you choose it, all will dissent.</em>
                </div>
              )}

              {isMinority && (
                <div className="override-warning">
                  Overriding the council — dissenters will lose loyalty.
                </div>
              )}
            </button>
          );
        })}
      </div>

      {tally && (
        <div className="council-note">
          Each house votes for the option most aligned with its stance.
          Supporters gain influence; dissenters lose some and their ambition
          grows. Choose wisely — the council watches.
        </div>
      )}
    </Modal>
  );
}
