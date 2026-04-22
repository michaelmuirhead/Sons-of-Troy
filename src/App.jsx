import React, { useEffect, useReducer, useState } from 'react';
import TopBar from './components/TopBar.jsx';
import Dashboard from './components/Dashboard.jsx';
import ActionBar from './components/ActionBar.jsx';
import DispatchModal from './components/DispatchModal.jsx';
import BuildModal from './components/BuildModal.jsx';
import ExploreModal from './components/ExploreModal.jsx';
import EventModal from './components/EventModal.jsx';
import {
  reducer,
  createInitialState,
  saveState,
  loadState,
  clearSave,
} from './state/gameState.js';

/**
 * The Last Sons of Troy — text-based prototype, dashboard layout.
 *
 * Top bar with colony identity + resources, then a dashboard that
 * shows the seven houses and all colony state at a glance. The
 * chronicle lives as a strip at the bottom and opens to full prose
 * in a modal. Story events block End Day until the council has voted.
 */
export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const saved = loadState();
    return saved || createInitialState();
  });

  const [openModal, setOpenModal] = useState(null);

  // Save on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  function handleReset() {
    if (!window.confirm('Abandon this colony and start again?')) return;
    clearSave();
    dispatch({ type: 'LOAD', state: createInitialState() });
    setOpenModal(null);
  }

  return (
    <div className="app">
      <TopBar state={state} />

      <Dashboard state={state} />

      <ActionBar
        state={state}
        onOpen={(which) => setOpenModal(which)}
        onEndDay={() => dispatch({ type: 'END_DAY' })}
        onReset={handleReset}
      />

      {openModal === 'dispatch' && (
        <DispatchModal
          state={state}
          onDispatch={(familyId, taskId, crewSize, patronOf) =>
            dispatch({ type: 'DISPATCH_CREW', familyId, taskId, crewSize, patronOf })
          }
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === 'build' && (
        <BuildModal
          state={state}
          onBuild={(buildingId) =>
            dispatch({ type: 'BUILD', buildingId })
          }
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === 'explore' && (
        <ExploreModal
          state={state}
          onExplore={(locationId) =>
            dispatch({ type: 'EXPLORE_LOCATION', locationId })
          }
          onClose={() => setOpenModal(null)}
        />
      )}

      {state.activeEvent && (
        <EventModal
          event={state.activeEvent}
          families={state.families}
          onChoose={(choiceId) =>
            dispatch({ type: 'RESOLVE_EVENT', choiceId })
          }
        />
      )}
    </div>
  );
}
