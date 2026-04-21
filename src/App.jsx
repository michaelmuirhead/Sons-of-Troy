import React, { useEffect, useState } from 'react';
import { eventBus, EVT } from './eventBus.js';
import PhaserGame from './game/PhaserGame.jsx';
import TopBar from './ui/TopBar.jsx';
import ColonistPanel from './ui/ColonistPanel.jsx';
import EventModal from './ui/EventModal.jsx';

export default function App() {
  const [state, setState] = useState({
    colonyName: 'New Ilion',
    day: 1,
    season: 'Spring',
    resources: { food: 0, wood: 0, stone: 0, pottery: 0 },
    colonists: [],
    log: [],
  });

  const [pendingEvent, setPendingEvent] = useState(null);
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const unsubState = eventBus.on(EVT.STATE_UPDATE, (s) => {
      setState((prev) => ({ ...prev, ...s }));
      // Hide splash once first state comes through
      setSplashVisible(false);
    });
    const unsubEvent = eventBus.on(EVT.EVENT_FIRE, (evt) => {
      setPendingEvent(evt);
    });
    return () => {
      unsubState();
      unsubEvent();
    };
  }, []);

  return (
    <div className="app">
      <TopBar
        colonyName={state.colonyName}
        season={state.season}
        day={state.day}
        resources={state.resources}
      />
      <div className="game-area">
        <PhaserGame />
        {splashVisible && (
          <div className={`splash ${splashVisible ? '' : 'hidden'}`}>
            <div>The Last Sons of Troy</div>
            <div style={{ marginTop: 12, fontSize: 12, letterSpacing: 2 }}>
              Beaching the ship on foreign shores…
            </div>
          </div>
        )}
      </div>
      <ColonistPanel colonists={state.colonists} log={state.log} />
      <EventModal event={pendingEvent} onClose={() => setPendingEvent(null)} />
    </div>
  );
}
