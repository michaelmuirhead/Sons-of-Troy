import React from 'react';
import { SEASONS } from '../state/gameState.js';

const DAYS_PER_SEASON = 12;

/**
 * Calendar / season widget. Shows the day, the current season wheel,
 * progress through the season, and any upcoming event cooldown hint.
 */
export default function SeasonPanel({ state }) {
  const season = SEASONS[state.seasonIndex];
  const dayInYear = state.day % (DAYS_PER_SEASON * SEASONS.length);
  const dayInSeason = dayInYear % DAYS_PER_SEASON;
  const progressPct = (dayInSeason / DAYS_PER_SEASON) * 100;

  const cooldown = state.eventCooldown ?? 0;
  const eventHint = state.activeEvent
    ? '— council is in session —'
    : cooldown <= 1
      ? 'The air feels heavy. An omen is near.'
      : cooldown <= 3
        ? 'The days are ordinary, for now.'
        : 'The colony goes about its work in peace.';

  // The "wheel" — four wedges, the active one highlighted.
  return (
    <div className="season-panel">
      <div className="season-head">
        <div className="season-day">Day {state.day}</div>
        <div className="season-label">{season}</div>
      </div>

      <svg viewBox="0 0 80 80" className="season-wheel" role="img" aria-label={`Season: ${season}`}>
        {SEASONS.map((s, i) => {
          const startAngle = (i * Math.PI) / 2 - Math.PI / 2;
          const endAngle = ((i + 1) * Math.PI) / 2 - Math.PI / 2;
          const isActive = i === state.seasonIndex;
          const cx = 40;
          const cy = 40;
          const r = 32;
          const x1 = cx + r * Math.cos(startAngle);
          const y1 = cy + r * Math.sin(startAngle);
          const x2 = cx + r * Math.cos(endAngle);
          const y2 = cy + r * Math.sin(endAngle);
          const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
          const colors = {
            Spring: '#6b7a3a',
            Summer: '#e07a5f',
            Autumn: '#c44536',
            Winter: '#2e5c8a',
          };
          const labelAngle = (startAngle + endAngle) / 2;
          const lr = r * 0.65;
          const lx = cx + lr * Math.cos(labelAngle);
          const ly = cy + lr * Math.sin(labelAngle);
          return (
            <g key={s}>
              <path
                d={path}
                fill={colors[s]}
                stroke="#1a1a1a"
                strokeWidth="1"
                opacity={isActive ? 1 : 0.35}
              />
              <text
                x={lx}
                y={ly + 2}
                textAnchor="middle"
                fontSize="7"
                fontWeight={isActive ? 'bold' : 'normal'}
                fill={isActive ? '#f4ecd8' : '#1a1a1a'}
                style={{ letterSpacing: 1, textTransform: 'uppercase' }}
              >
                {s.substring(0, 3)}
              </text>
            </g>
          );
        })}
        {/* Center circle */}
        <circle cx="40" cy="40" r="4" fill="#1a1a1a" />
      </svg>

      <div className="season-progress">
        <div className="season-progress-label">
          <span>Day {dayInSeason + 1} of {DAYS_PER_SEASON}</span>
          <span className="muted">in {season}</span>
        </div>
        <div className="season-progress-bar">
          <div
            className="season-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="season-hint">{eventHint}</div>
    </div>
  );
}
