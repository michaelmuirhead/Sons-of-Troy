import React, { useState } from 'react';

/**
 * Line chart of resource levels over time. Pure SVG, no dependencies.
 *
 * `history` is an array of { day, food, wood, stone, faith, pottery, population }
 * snapshots, one per day. We draw one polyline per toggled metric, auto-scaled
 * to the visible range.
 */

const METRICS = [
  { key: 'food',       label: 'Food',    color: '#c44536' }, // terracotta
  { key: 'wood',       label: 'Wood',    color: '#6b7a3a' }, // olive
  { key: 'stone',      label: 'Stone',   color: '#2e5c8a' }, // aegean
  { key: 'faith',      label: 'Faith',   color: '#e07a5f' }, // ochre
  { key: 'pottery',    label: 'Pottery', color: '#7a6a54' }, // muted
  { key: 'bronze',     label: 'Bronze',  color: '#a07030' }, // aged bronze
  { key: 'population', label: 'Souls',   color: '#1a1a1a' }, // black
];

const DEFAULT_ON = new Set(['food', 'wood', 'stone']);

export default function ResourceGraph({ history }) {
  const [active, setActive] = useState(DEFAULT_ON);

  if (!history || history.length === 0) {
    return (
      <div className="graph-empty muted">
        No record yet. End a day to begin the chronicle of numbers.
      </div>
    );
  }

  const w = 288;          // SVG intrinsic width
  const h = 140;          // SVG intrinsic height
  const padL = 26;
  const padR = 6;
  const padT = 8;
  const padB = 20;

  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  // X axis: days across the full history window
  const days = history.map((h) => h.day);
  const dMin = days[0];
  const dMax = days[days.length - 1];
  const dSpan = Math.max(1, dMax - dMin);

  // Y axis: max over all *active* metrics (plus a small floor so a flat 0
  // line doesn't fill the whole chart)
  const activeKeys = [...active];
  let yMax = 0;
  for (const snap of history) {
    for (const k of activeKeys) {
      if (snap[k] > yMax) yMax = snap[k];
    }
  }
  if (yMax < 10) yMax = 10;
  // round up to nearest 5 for a cleaner axis
  yMax = Math.ceil(yMax / 5) * 5;

  function x(day) {
    return padL + ((day - dMin) / dSpan) * innerW;
  }
  function y(value) {
    return padT + innerH - (value / yMax) * innerH;
  }

  const gridLines = 4;
  const gridSteps = Array.from({ length: gridLines + 1 }, (_, i) => i);

  function toggle(key) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="resource-graph">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height="auto"
        role="img"
        aria-label="Resource history"
      >
        {/* Grid + Y ticks */}
        {gridSteps.map((i) => {
          const gy = padT + (innerH / gridLines) * i;
          const val = Math.round(yMax - (yMax / gridLines) * i);
          return (
            <g key={`grid-${i}`}>
              <line
                x1={padL}
                y1={gy}
                x2={padL + innerW}
                y2={gy}
                stroke="#d8c7a6"
                strokeWidth="1"
              />
              <text
                x={padL - 4}
                y={gy + 3}
                textAnchor="end"
                fontSize="8"
                fill="#7a6a54"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* X-axis label: first + last day */}
        <text x={padL} y={h - 6} fontSize="9" fill="#7a6a54">
          D{dMin}
        </text>
        <text
          x={padL + innerW}
          y={h - 6}
          textAnchor="end"
          fontSize="9"
          fill="#7a6a54"
        >
          D{dMax}
        </text>

        {/* Axes */}
        <line
          x1={padL}
          y1={padT}
          x2={padL}
          y2={padT + innerH}
          stroke="#1a1a1a"
          strokeWidth="1"
        />
        <line
          x1={padL}
          y1={padT + innerH}
          x2={padL + innerW}
          y2={padT + innerH}
          stroke="#1a1a1a"
          strokeWidth="1"
        />

        {/* Lines */}
        {METRICS.filter((m) => active.has(m.key)).map((m) => {
          const points = history
            .map((snap) => `${x(snap.day).toFixed(1)},${y(snap[m.key] || 0).toFixed(1)}`)
            .join(' ');
          return (
            <polyline
              key={m.key}
              points={points}
              fill="none"
              stroke={m.color}
              strokeWidth="1.75"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      <div className="graph-legend">
        {METRICS.map((m) => {
          const on = active.has(m.key);
          return (
            <button
              key={m.key}
              type="button"
              className={`legend-chip ${on ? 'on' : 'off'}`}
              onClick={() => toggle(m.key)}
              style={{
                borderColor: m.color,
                color: on ? '#f4ecd8' : m.color,
                background: on ? m.color : 'transparent',
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
