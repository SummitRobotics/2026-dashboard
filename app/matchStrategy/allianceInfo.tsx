'use client';
import { useState, useEffect } from "react";
import "./allianceInfo.css";
import { Match, PitScoutingData } from "@/app/utils/interfaceSpecs";
import TeamModal from "../components/teamModal";

export default function AllianceInfo({ matchData, pitScoutingData }: { matchData: Match | null, pitScoutingData: Record<string, PitScoutingData>}) {
  const [activeTeam, setActiveTeam] = useState<PitScoutingData>({});


  if (!matchData) {
    return (
      <div className="alliance-info">
        <h3>Alliance Information</h3>
        <p className="text-sm text-muted">No match selected.</p>
      </div>
    );
  }
  const sortedAlliances = [...matchData.alliances].sort((a, b) =>
    a.teams.includes(5468) ? -1 : b.teams.includes(5468) ? 1 : 0
  );



  return (
    <div className="alliance-info">
      <div className="grid grid-cols-2 gap-4 mt-2 p-4">
        {sortedAlliances.map((alliance) => (
          <div key={alliance.color} className={`${alliance.color}-alliance-wrap rounded-lg`}>
            <div className={`p-3 alliance rounded-lg`}>
              <h3 className="text-xl text-center">{alliance.color.toUpperCase()} Alliance</h3>

              <div>
                <p>OPR: {alliance.OPR}</p>
                <p>EPA: {alliance.EPA} (SD: {alliance.epaSD})</p>
                <p className={`teams text-center border-b-2`}>Teams</p>
                <div className="grid grid-cols-4 gap-2 mt-2 p-4 m-2 text-center">
                  <div>{/* Needed for grid alignment */}</div>
                  {alliance.teams.map((team) => (
                    <div key={`team-${team}`} onClick={() => setActiveTeam(pitScoutingData[team])}>{team}</div>
                  ))}
                </div>
              </div>

              <div className="info p-3 rounded-lg m-2">
                <h4 className="text-lg">Auto</h4>
                <div className="grid grid-cols-4 gap-2 mt-2 p-4 text-center">
                  <div className="font-bold text-right">Climb</div>
                  <div>Team 1</div>
                  <div>Team 2</div>
                  <div>Team 3</div>
                </div>
              </div>
              <div className="info p-3 rounded-lg m-2">
                <h4 className="text-lg">Teleop</h4>
                <div className="grid grid-cols-4 gap-2 mt-2 p-4 text-center">
                  <div className="font-bold">Climb</div>
                  <div>Team 1</div>
                  <div>Team 2</div>
                  <div>Team 3</div>
                </div>
              </div>
              <div className="info p-3 rounded-lg m-2">
                <h4 className="text-lg">Endgame</h4>
                <div className="grid grid-cols-4 gap-2 mt-2 p-4 text-center">
                  <div className="font-bold">Climb</div>
                  <div>Team 1</div>
                  <div>Team 2</div>
                  <div>Team 3</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <TeamModal isOpen={Object.keys(activeTeam).length !== 0} onCancel={() => setActiveTeam({})} onConfirm={() => {}} teamData={activeTeam} />
    </div>
  );
}
