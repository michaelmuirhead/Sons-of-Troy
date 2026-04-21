import React from 'react';

/**
 * Pottery-style SVG illustrations. Each scene is a small self-contained
 * React component drawn in the palette:
 *   terracotta #c44536  ochre #e07a5f  cream #f4ecd8  black #1a1a1a
 *   aegean #2e5c8a  olive #6b7a3a
 *
 * Figures are silhouette-first (like black-figure pottery) with incised
 * black detail and a meander border around the scene panel.
 */

const PALETTE = {
  terracotta: '#c44536',
  ochre: '#e07a5f',
  black: '#1a1a1a',
  cream: '#f4ecd8',
  aegean: '#2e5c8a',
  olive: '#6b7a3a',
};

/**
 * Frame — a pottery-panel wrapper with meander border, used around every scene.
 */
function Frame({ children, label }) {
  return (
    <svg viewBox="0 0 320 180" className="illustration" role="img" aria-label={label}>
      {/* Cream background */}
      <rect width="320" height="180" fill={PALETTE.cream} />
      {/* Outer black border */}
      <rect x="3" y="3" width="314" height="174" fill="none" stroke={PALETTE.black} strokeWidth="3" />
      {/* Meander frieze top + bottom */}
      <MeanderBand x={10} y={10} width={300} />
      <MeanderBand x={10} y={164} width={300} />
      {/* Scene */}
      <g transform="translate(0, 12)">{children}</g>
    </svg>
  );
}

function MeanderBand({ x, y, width }) {
  const cells = Math.floor(width / 20);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={width} height="6" fill={PALETTE.black} />
      {Array.from({ length: cells }).map((_, i) => (
        <g key={i} transform={`translate(${i * 20 + 2} 1)`} stroke={PALETTE.terracotta} fill="none" strokeWidth="1">
          <rect width="16" height="4" />
          <line x1="4" y1="2" x2="12" y2="2" />
        </g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Individual scenes                                                   */
/* ------------------------------------------------------------------ */

function FoundingScene() {
  return (
    <Frame label="The founding of New Ilion">
      {/* Sea */}
      <rect x="10" y="110" width="300" height="40" fill={PALETTE.aegean} />
      {/* Waves */}
      <g stroke={PALETTE.cream} strokeWidth="1.5" fill="none">
        <path d="M10 125 Q25 120 40 125 T70 125 T100 125 T130 125 T160 125 T190 125 T220 125 T250 125 T280 125 T310 125" />
        <path d="M10 140 Q25 135 40 140 T70 140 T100 140 T130 140 T160 140 T190 140 T220 140 T250 140 T280 140 T310 140" />
      </g>
      {/* Beach */}
      <rect x="10" y="105" width="300" height="10" fill={PALETTE.ochre} />
      {/* Ship */}
      <g transform="translate(40 70)">
        <path d="M0 40 Q40 56 80 40 L72 48 L8 48 Z" fill={PALETTE.black} />
        <rect x="36" y="0" width="3" height="40" fill={PALETTE.black} />
        <path d="M40 4 L72 20 L40 28 Z" fill={PALETTE.terracotta} stroke={PALETTE.black} strokeWidth="1" />
        {/* Prow curl */}
        <path d="M78 42 Q90 34 84 26 Q78 30 78 38 Z" fill={PALETTE.terracotta} stroke={PALETTE.black} />
      </g>
      {/* Figures disembarking */}
      <g fill={PALETTE.terracotta} stroke={PALETTE.black} strokeWidth="1">
        <Figure x={160} y={70} />
        <Figure x={180} y={72} />
        <Figure x={205} y={74} />
      </g>
      {/* Distant smoke of Troy */}
      <g stroke={PALETTE.black} strokeWidth="1" fill="none" opacity="0.55">
        <path d="M280 10 Q275 25 285 40 Q295 55 288 70" />
        <path d="M295 15 Q290 30 300 45 Q308 60 300 75" />
      </g>
    </Frame>
  );
}

function Sail() {
  return (
    <Frame label="A sail on the horizon">
      <rect x="10" y="100" width="300" height="50" fill={PALETTE.aegean} />
      <g stroke={PALETTE.cream} strokeWidth="1.5" fill="none">
        <path d="M10 115 Q40 108 70 115 T130 115 T190 115 T250 115 T310 115" />
        <path d="M10 130 Q40 123 70 130 T130 130 T190 130 T250 130 T310 130" />
      </g>
      {/* Horizon sail — small */}
      <g transform="translate(220 75)">
        <rect x="10" y="8" width="2" height="26" fill={PALETTE.black} />
        <path d="M12 10 L28 24 L12 28 Z" fill={PALETTE.terracotta} stroke={PALETTE.black} strokeWidth="1" />
        <path d="M8 34 L32 34 L28 40 L12 40 Z" fill={PALETTE.black} />
      </g>
      {/* Gulls */}
      <g stroke={PALETTE.black} strokeWidth="2" fill="none">
        <path d="M70 60 Q78 52 86 60 M74 58 Q82 54 90 60" />
        <path d="M140 40 Q148 32 156 40" />
        <path d="M60 30 Q70 22 80 30" />
      </g>
      {/* Watcher on shore */}
      <g fill={PALETTE.terracotta} stroke={PALETTE.black} strokeWidth="1">
        <Figure x={80} y={70} facing="right" />
      </g>
    </Frame>
  );
}

function Owl() {
  return (
    <Frame label="Athena's owl">
      {/* Night-ish ochre background overlay */}
      <rect x="10" y="10" width="300" height="140" fill={PALETTE.ochre} />
      {/* Olive tree branch */}
      <g stroke={PALETTE.black} strokeWidth="3" fill="none">
        <path d="M30 80 Q120 60 260 80" />
        <path d="M80 75 Q80 65 90 62" />
        <path d="M140 70 Q140 60 150 58" />
        <path d="M200 72 Q200 62 210 60" />
      </g>
      {/* Owl */}
      <g transform="translate(135 40)" stroke={PALETTE.black} strokeWidth="2">
        <ellipse cx="25" cy="30" rx="22" ry="26" fill={PALETTE.cream} />
        <path d="M5 16 L15 8 L22 20 Z" fill={PALETTE.cream} />
        <path d="M45 16 L35 8 L28 20 Z" fill={PALETTE.cream} />
        {/* Eyes — large, staring */}
        <circle cx="16" cy="26" r="6" fill={PALETTE.cream} stroke={PALETTE.black} />
        <circle cx="34" cy="26" r="6" fill={PALETTE.cream} stroke={PALETTE.black} />
        <circle cx="16" cy="26" r="3" fill={PALETTE.black} />
        <circle cx="34" cy="26" r="3" fill={PALETTE.black} />
        {/* Beak */}
        <path d="M22 32 L28 32 L25 38 Z" fill={PALETTE.terracotta} />
        {/* Feather ticks */}
        <g stroke={PALETTE.black} fill="none" strokeWidth="1">
          <path d="M10 42 L18 48 M20 44 L28 50 M30 44 L38 50 M40 42 L45 48" />
        </g>
      </g>
      {/* Moon */}
      <circle cx="270" cy="40" r="12" fill={PALETTE.cream} stroke={PALETTE.black} />
    </Frame>
  );
}

function Fever() {
  return (
    <Frame label="A fever passes through the hearths">
      <rect x="10" y="10" width="300" height="140" fill={PALETTE.cream} />
      {/* Hut */}
      <g transform="translate(40 50)" stroke={PALETTE.black} strokeWidth="2">
        <rect x="0" y="30" width="90" height="60" fill={PALETTE.ochre} />
        <path d="M-6 30 L45 0 L96 30 Z" fill={PALETTE.terracotta} />
        <rect x="35" y="60" width="20" height="30" fill={PALETTE.black} />
      </g>
      {/* Figure kneeling / tending */}
      <g fill={PALETTE.terracotta} stroke={PALETTE.black} strokeWidth="1.5">
        <Figure x={175} y={80} pose="kneel" />
      </g>
      {/* Sick figure lying */}
      <g fill={PALETTE.terracotta} stroke={PALETTE.black} strokeWidth="1.5">
        <rect x="210" y="105" width="80" height="8" fill={PALETTE.parchment || '#e8d5b7'} stroke={PALETTE.black} />
        <ellipse cx="250" cy="102" rx="30" ry="8" fill={PALETTE.terracotta} stroke={PALETTE.black} />
        <circle cx="222" cy="98" r="7" fill={PALETTE.terracotta} stroke={PALETTE.black} />
      </g>
      {/* Ravens of omen */}
      <g fill={PALETTE.black}>
        <path d="M40 20 L50 15 L60 20 L55 25 L45 25 Z" />
        <path d="M260 25 L270 20 L280 25 L275 30 L265 30 Z" />
      </g>
    </Frame>
  );
}

function Ship() {
  return (
    <Frame label="A Trojan fleet">
      <rect x="10" y="95" width="300" height="55" fill={PALETTE.aegean} />
      <g stroke={PALETTE.cream} strokeWidth="1.5" fill="none">
        <path d="M10 115 Q40 108 70 115 T130 115 T190 115 T250 115 T310 115" />
        <path d="M10 130 Q40 123 70 130 T130 130 T190 130 T250 130 T310 130" />
      </g>
      {/* Three ships */}
      {[30, 120, 210].map((x, i) => (
        <g key={i} transform={`translate(${x} ${60 + i * 6})`}>
          <rect x="26" y="0" width="2" height="34" fill={PALETTE.black} />
          <path d="M28 4 L60 20 L28 26 Z" fill={PALETTE.terracotta} stroke={PALETTE.black} strokeWidth="1.5" />
          <path d="M0 32 Q30 46 60 32 L54 40 L6 40 Z" fill={PALETTE.black} />
          <path d="M60 32 Q72 24 64 18 Q60 22 60 30 Z" fill={PALETTE.terracotta} stroke={PALETTE.black} strokeWidth="1" />
        </g>
      ))}
    </Frame>
  );
}

function Stranger() {
  return (
    <Frame label="Stranger on the hill">
      {/* Sky band */}
      <rect x="10" y="10" width="300" height="60" fill={PALETTE.ochre} />
      {/* Hill line */}
      <path d="M10 110 Q110 70 170 75 T310 100 L310 150 L10 150 Z" fill={PALETTE.olive} stroke={PALETTE.black} strokeWidth="2" />
      {/* Sun */}
      <circle cx="260" cy="40" r="14" fill={PALETTE.terracotta} stroke={PALETTE.black} strokeWidth="2" />
      <g stroke={PALETTE.black} strokeWidth="1.5">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const rad = (a * Math.PI) / 180;
          const x1 = 260 + Math.cos(rad) * 18;
          const y1 = 40 + Math.sin(rad) * 18;
          const x2 = 260 + Math.cos(rad) * 24;
          const y2 = 40 + Math.sin(rad) * 24;
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      {/* Lone figure on the hill crest */}
      <g fill={PALETTE.black}>
        <Figure x={150} y={70} solid />
      </g>
    </Frame>
  );
}

function Storm() {
  return (
    <Frame label="A storm over the bay">
      <rect x="10" y="10" width="300" height="90" fill={PALETTE.black} />
      <rect x="10" y="95" width="300" height="55" fill={PALETTE.aegean} />
      {/* Lightning */}
      <path d="M150 14 L140 50 L158 50 L148 86" fill="none" stroke={PALETTE.cream} strokeWidth="3" />
      <path d="M220 18 L210 40 L222 40 L215 68" fill="none" stroke={PALETTE.terracotta} strokeWidth="2" />
      {/* Tossing waves */}
      <g stroke={PALETTE.cream} strokeWidth="2" fill="none">
        <path d="M10 110 Q40 95 70 115 T130 115 T190 115 T250 115 T310 115" />
        <path d="M10 130 Q40 116 70 134 T130 134 T190 134 T250 134 T310 134" />
      </g>
      {/* Little boat */}
      <g transform="translate(60 108) rotate(-8)">
        <path d="M0 8 Q18 16 36 8 L32 14 L4 14 Z" fill={PALETTE.black} stroke={PALETTE.cream} strokeWidth="1.5" />
        <rect x="16" y="-8" width="2" height="18" fill={PALETTE.cream} />
      </g>
    </Frame>
  );
}

function Trader() {
  return (
    <Frame label="An amber trader">
      <rect x="10" y="10" width="300" height="140" fill={PALETTE.cream} />
      {/* Beach line */}
      <path d="M10 120 L310 110" stroke={PALETTE.black} strokeWidth="2" />
      {/* Two figures meeting */}
      <g fill={PALETTE.terracotta} stroke={PALETTE.black} strokeWidth="1.5">
        <Figure x={100} y={75} facing="right" />
      </g>
      <g fill={PALETTE.black}>
        <Figure x={200} y={75} solid facing="left" />
      </g>
      {/* Amber pouch */}
      <g>
        <circle cx="155" cy="92" r="7" fill={PALETTE.terracotta} stroke={PALETTE.black} strokeWidth="1.5" />
        <line x1="150" y1="86" x2="155" y2="80" stroke={PALETTE.black} strokeWidth="1.5" />
      </g>
      {/* Sea distant */}
      <rect x="10" y="125" width="300" height="25" fill={PALETTE.aegean} />
    </Frame>
  );
}

function Vision() {
  return (
    <Frame label="Cassandra's vision">
      {/* Altar scene, concentric circles of glow */}
      <rect x="10" y="10" width="300" height="140" fill={PALETTE.ochre} />
      <g fill="none" stroke={PALETTE.black}>
        <circle cx="160" cy="90" r="70" strokeWidth="1" />
        <circle cx="160" cy="90" r="50" strokeWidth="1" />
        <circle cx="160" cy="90" r="30" strokeWidth="1" />
      </g>
      {/* Central priestess */}
      <g fill={PALETTE.terracotta} stroke={PALETTE.black} strokeWidth="1.5">
        <Figure x={160} y={70} pose="arms_up" />
      </g>
      {/* Flame rising */}
      <path d="M156 46 Q160 30 164 46 Q160 40 156 46" fill={PALETTE.terracotta} stroke={PALETTE.black} />
      <path d="M158 38 Q160 26 162 38" fill={PALETTE.cream} stroke={PALETTE.black} />
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Figure primitive — a pottery-style standing person                  */
/* ------------------------------------------------------------------ */

function Figure({ x, y, facing = 'right', pose = 'stand', solid = false }) {
  const dir = facing === 'left' ? -1 : 1;
  const headR = 4;
  if (pose === 'arms_up') {
    return (
      <g transform={`translate(${x} ${y})`}>
        <circle cx="0" cy="0" r={headR} />
        <line x1="0" y1={headR} x2="0" y2="18" strokeWidth="4" stroke="currentColor" />
        <path d="M0 8 L-8 -4 M0 8 L8 -4" strokeWidth="2.5" stroke={solid ? '#1a1a1a' : '#1a1a1a'} fill="none" />
        <path d="M-7 18 L-4 32 M7 18 L4 32" strokeWidth="3" stroke={solid ? '#1a1a1a' : '#1a1a1a'} fill="none" />
        <path d="M-8 6 Q0 24 8 6" />
      </g>
    );
  }
  if (pose === 'kneel') {
    return (
      <g transform={`translate(${x} ${y})`}>
        <circle cx="0" cy="0" r={headR} />
        <path d={`M${-6*dir} 4 Q0 18 ${6*dir} 18 L${6*dir} 22 L${-6*dir} 22 Z`} />
        <path d={`M${-6*dir} 22 L${-8*dir} 30`} stroke="#1a1a1a" strokeWidth="2" fill="none" />
      </g>
    );
  }
  // stand
  return (
    <g transform={`translate(${x} ${y}) scale(${dir} 1)`}>
      <circle cx="0" cy="0" r={headR} />
      <path d="M-5 5 L5 5 L7 20 L-7 20 Z" />
      <path d="M-6 20 L-4 32 M6 20 L4 32" stroke="#1a1a1a" strokeWidth="3" fill="none" />
      <path d="M-5 8 L-10 20 M5 8 L10 20" stroke="#1a1a1a" strokeWidth="2.5" fill="none" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

const SCENES = {
  founding: FoundingScene,
  sail: Sail,
  owl: Owl,
  fever: Fever,
  ship: Ship,
  stranger: Stranger,
  storm: Storm,
  trader: Trader,
  vision: Vision,
};

export default function Illustration({ name }) {
  const Scene = SCENES[name];
  if (!Scene) return null;
  return (
    <div className="illustration-wrap">
      <Scene />
    </div>
  );
}
