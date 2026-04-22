import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { TASKS, taskDuration } from '../state/tasks.js';
import { availableWorkers, availableWarriors } from '../state/families.js';

/**
 * Three-step dispatch flow:
 *   1. Pick a task.
 *   2. Pick a family. Show specialization badge and available pool.
 *   3. Pick crew size with a slider. Optionally dispatch "on behalf of"
 *      another house (patronage) — the lending house gains influence and
 *      builds a bond, the receiving house gains loyalty.
 *
 * A "dispatch" drains population from that house's buckets and sets an
 * activeCrew counting down days until the task resolves on END_DAY.
 *
 * Tasks that require a building (e.g. potter → kiln) are hidden until the
 * building exists.
 */
export default function DispatchModal({ state, onDispatch, onClose }) {
  const [taskId, setTaskId] = useState(null);
  const [familyId, setFamilyId] = useState(null);
  const [crewSize, setCrewSize] = useState(1);
  const [patronOf, setPatronOf] = useState('');

  const task = taskId ? TASKS[taskId] : null;
  const family = familyId ? state.families.find((f) => f.id === familyId) : null;

  // A family must exist, not be seceded, not be busy.
  const activeFamilies = state.families.filter((f) => !f.seceded);

  // A task's requiresBuilding must be built.
  function taskAvailable(t) {
    if (!t.requiresBuilding) return true;
    return state.buildings.some((b) => b.id === t.requiresBuilding);
  }

  function pool(f, t) {
    return t.warriorsOnly ? availableWarriors(f) : availableWorkers(f);
  }

  // --- Step 1: task picker -------------------------------------------------
  if (!task) {
    return (
      <Modal title="Dispatch" onClose={onClose}>
        <p className="prose">Which task does the council order?</p>
        <div className="choices">
          {Object.values(TASKS).map((t) => {
            const avail = taskAvailable(t);
            return (
              <button
                key={t.id}
                className="choice-btn"
                disabled={!avail}
                onClick={() => avail && setTaskId(t.id)}
              >
                {t.label}
                {!avail && (
                  <span className="spec-badge none" style={{ marginLeft: 6 }}>
                    requires {t.requiresBuilding}
                  </span>
                )}
                <span className="sub">
                  {t.description} · {t.days}d{t.warriorsOnly ? ' · warriors only' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </Modal>
    );
  }

  // --- Step 2: family picker -----------------------------------------------
  if (!family) {
    return (
      <Modal title={`Dispatch · ${task.label}`} onClose={onClose}>
        <p className="prose">
          {task.description} {task.warriorsOnly && <strong>(warriors only)</strong>}
        </p>
        <p className="prose" style={{ fontStyle: 'normal' }}>
          Which house answers the call?
        </p>
        <div className="choices">
          {activeFamilies.map((f) => {
            const p = pool(f, task);
            const busy = !!f.activeCrew;
            const inSpec = f.preferredTasks.includes(task.id);
            const disabled = busy || p < 1;
            return (
              <button
                key={f.id}
                className="choice-btn"
                disabled={disabled}
                onClick={() => {
                  setFamilyId(f.id);
                  setCrewSize(Math.min(3, Math.max(1, p)));
                  setPatronOf('');
                }}
                style={{
                  borderLeft: `6px solid ${f.color}`,
                }}
              >
                <div>
                  <span style={{ color: f.color }}>{f.name}</span>
                  {inSpec ? (
                    <span className="spec-badge">Specialty +50%</span>
                  ) : (
                    <span className="spec-badge none">off-specialty</span>
                  )}
                </div>
                <span className="sub">
                  {busy
                    ? `Out on ${TASKS[f.activeCrew.taskId]?.label || 'duty'}`
                    : task.warriorsOnly
                      ? `${p} warrior${p === 1 ? '' : 's'} available`
                      : `${p} able hands available`}
                  {!busy && ` · ${f.head.name} commands · influence ${Math.round(f.influence)}`}
                </span>
              </button>
            );
          })}
        </div>
        <div className="close-row">
          <button
            className="btn ghost"
            onClick={() => setTaskId(null)}
            style={{ color: 'var(--clr-black)', borderColor: 'var(--clr-black)' }}
          >
            ← Back to tasks
          </button>
        </div>
      </Modal>
    );
  }

  // --- Step 3: crew size slider + patronage --------------------------------
  const maxPool = pool(family, task);
  const safeCrew = Math.max(1, Math.min(crewSize, maxPool));
  const days = taskDuration(task, family, safeCrew);
  const inSpec = family.preferredTasks.includes(task.id);
  const specMul = inSpec ? 1.5 : 1.0;
  const yieldPreview = {};
  for (const [k, v] of Object.entries(task.base || {})) {
    yieldPreview[k] = Math.max(1, Math.round(v * safeCrew * specMul));
  }

  // If acting as patron, the "off-specialty" ambition cost is softened.
  const ambitionDelta = inSpec ? -2 : (patronOf ? +1 : +3);

  const patronCandidates = activeFamilies.filter((f) => f.id !== family.id);
  const patronTarget = patronOf ? activeFamilies.find((f) => f.id === patronOf) : null;

  return (
    <Modal title={`${task.label} · ${family.name}`} onClose={onClose}>
      <p className="prose">
        {family.head.name} stands before the council. How many of the house shall go?
      </p>

      <div className="crew-slider-wrap">
        <div className="crew-slider-val">
          {safeCrew} <span style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--clr-muted)' }}>
            {task.warriorsOnly ? 'warriors' : 'hands'}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={Math.max(1, maxPool)}
          value={safeCrew}
          onChange={(e) => setCrewSize(Number(e.target.value))}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--clr-muted)' }}>
          <span>1</span>
          <span>{maxPool} max</span>
        </div>
      </div>

      <div className="crew-summary">
        <div>
          <strong>{days}</strong> day{days === 1 ? '' : 's'} to complete
          {inSpec && <span className="spec-badge" style={{ marginLeft: 6 }}>Specialty</span>}
        </div>
        {Object.keys(yieldPreview).length > 0 && (
          <div style={{ fontSize: 11, marginTop: 4 }}>
            Expected return:{' '}
            {Object.entries(yieldPreview)
              .map(([k, v]) => `+${v} ${k}`)
              .join(', ')}
            {' '}(±season / luck)
          </div>
        )}
        {task.discoversLocation && (
          <div style={{ fontSize: 11, marginTop: 4, fontStyle: 'italic' }}>
            Scouts may return with news of a new coast.
          </div>
        )}
        <div style={{ fontSize: 10, marginTop: 6, color: 'var(--clr-border)' }}>
          {inSpec
            ? 'This is their house specialty. Ambition will ease.'
            : 'This is work beyond their house\u2019s name. Ambition will rise.'}
          {' '}({ambitionDelta >= 0 ? '+' : ''}{ambitionDelta} ambition)
          {patronOf && ' — softened by the favor done'}
        </div>
      </div>

      <div className="patron-row">
        <label className="patron-label">
          <input
            type="checkbox"
            checked={!!patronOf}
            onChange={(e) =>
              setPatronOf(e.target.checked ? patronCandidates[0]?.id || '' : '')
            }
          />
          <span>
            Dispatch on behalf of another house (<em>patronage</em>)
          </span>
        </label>
        {patronOf && (
          <>
            <select
              className="patron-select"
              value={patronOf}
              onChange={(e) => setPatronOf(e.target.value)}
            >
              {patronCandidates.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            {patronTarget && (
              <div className="patron-note">
                {family.name.replace('House of ', '')} does the labor; the yields belong to
                the colony. {family.name.replace('House of ', '')} earns prestige for the
                favor, and {patronTarget.name.replace('House of ', '')} owes them a bond.
              </div>
            )}
          </>
        )}
      </div>

      <div className="choices" style={{ marginTop: 14 }}>
        <button
          className="choice-btn"
          onClick={() => {
            onDispatch(family.id, task.id, safeCrew, patronOf || null);
            onClose();
          }}
        >
          {patronTarget
            ? `Send ${safeCrew} from ${family.name} on behalf of ${patronTarget.name}`
            : `Send ${safeCrew} from ${family.name}`}
          <span className="sub">{days}d in the field</span>
        </button>
      </div>

      <div className="close-row">
        <button
          className="btn ghost"
          onClick={() => { setFamilyId(null); setPatronOf(''); }}
          style={{ color: 'var(--clr-black)', borderColor: 'var(--clr-black)' }}
        >
          ← Choose another house
        </button>
      </div>
    </Modal>
  );
}
