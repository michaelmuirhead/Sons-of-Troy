import React from 'react';
import HouseStrip from './HouseStrip.jsx';
import SeasonPanel from './SeasonPanel.jsx';
import ResourceGraph from './ResourceGraph.jsx';
import SettlementPanel from './SettlementPanel.jsx';
import CoastPanel from './CoastPanel.jsx';
import ChronicleStrip from './ChronicleStrip.jsx';
import { colonyPopulation } from '../state/families.js';

/**
 * Main dashboard. One vertical flow: house strip on top, a 3-column
 * grid of panels in the middle, chronicle strip at the bottom.
 *
 * The old vertical side-panel is retired — every panel is visible up
 * front, and the chronicle slides out of the way into a modal.
 */
export default function Dashboard({ state }) {
  const { families, buildings, construction, locations, history, chronicle } = state;
  const totalPop = colonyPopulation(families);

  return (
    <main className="dashboard">
      <section className="dash-houses">
        <div className="dash-houses-title">
          <span>The Seven Houses of New Ilion</span>
          <span className="muted" style={{ marginLeft: 10, fontSize: 11 }}>
            {totalPop} souls
          </span>
        </div>
        <HouseStrip families={families} />
      </section>

      <section className="dash-grid">
        <div className="dash-col dash-col-left">
          <SeasonPanel state={state} />
          <CoastPanel locations={locations} />
        </div>

        <div className="dash-col dash-col-center">
          <div className="dash-card">
            <h3 className="dash-card-title">Resource Trends</h3>
            <ResourceGraph history={history} />
          </div>
        </div>

        <div className="dash-col dash-col-right">
          <SettlementPanel buildings={buildings} construction={construction} />
        </div>
      </section>

      <ChronicleStrip entries={chronicle} />
    </main>
  );
}
