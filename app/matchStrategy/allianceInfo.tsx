'use client';
import { useState, useEffect } from "react";
import "./allianceInfo.css";
import { Match, PitScoutingData, ProcessedTeamData } from "@/app/utils/interfaceSpecs";
import TeamModal from "../components/teamModal";
import { fetchMatchScoutingData } from "../utils/scoutingDataFetcher";
import { match } from "assert";


const labels = {
  teamID: 'Team Number',
  matches_played: 'Matches Played',
  on_field: 'On Field',
  rank_points: 'Ranking Points',
  start_position: 'Starting Position',
  teleop: {
    snowblow_neutral1: 'Pass From Neutral 1',
    snowblow_neutral2: 'Pass From Neutral 2',
    snowblow_alliance: 'Pass From Alliance',
    out_of_bounds: 'Shot Out of Bounds',
    move_shoot: 'Move & Shoot',
    bump: 'Navigate Bump',
    trench: 'Navigate Trench',
    driver_skill: 'Driver Skill',
    defense: 'Plays Defense',
    speed: 'Speed'
  },
  endgame: {
    climb_level: 'Climb Levels',
    climb_location: 'Climb Locations'
  },
  assessment: {
    died: 'Died on Field',
    tipped: 'Tipped Over',
    fuel_spill: 'Spilled Fuel',
    stuck_fuel: 'Stuck on Fuel',
    stuck_bump: 'Stuck on Bump'
  },
  auto: {
    moved: 'Moved',
    fuel_depot: 'Fuel From Depot',
    fuel_outpost: 'Fuel From Outpost',
    fuel_neutral: 'Fuel From Neutral',
    climb_score: 'Climb Score',
    climb_location: 'Climb Location',
  }
};

export default function AllianceInfo({ matchData, pitScoutingData, matchScoutingData }: { matchData: Match | null, pitScoutingData: Record<string, PitScoutingData>, matchScoutingData: Record<string, ProcessedTeamData> | null}) {
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
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 mt-2 p-4">
        {sortedAlliances.map((alliance) => {
          console.log(JSON.stringify(matchScoutingData![alliance.teams[0]]));
          return(
            <div key={alliance.color} className={`${alliance.color}-alliance-wrap rounded-lg`}>
              <div className={`p-3 alliance rounded-lg`}>
                <h3 className="text-xl text-center">{alliance.color.toUpperCase()} Alliance</h3>

                <div>
                  <p>OPR: {alliance.OPR}</p>
                  <p>EPA: {alliance.EPA} (SD: {alliance.epaSD})</p>
                  <p className={`teams text-center border-b-2`}>Teams</p>
                  <div className="grid grid-cols-4 gap-2 mt-2 p-6 m-2 text-center">
                    <div>{/* Needed for grid alignment */}</div>
                    {alliance.teams.map((team) => (
                      <div key={`team-${team}`} onClick={() => setActiveTeam(pitScoutingData[team])}>{team}</div>
                    ))}
                  </div>
                </div>

                <div className="info p-3 rounded-lg m-2">
                  <h4 className="text-lg">Auto</h4>
                  <div className="grid grid-cols-4 gap-2 mt-2 p-2 text-center">
                    {Object.keys(matchScoutingData![alliance.teams[0]].auto).map((key) => (
                      <>
                        <div key={`label-${key}`} className="font-bold text-right">{labels[key]}</div>
                        <div key={`${alliance.teams[0]}-${key}`}>{matchScoutingData![alliance.teams[0]].auto[key as keyof ProcessedTeamData['auto']]}</div>
                        <div key={`${alliance.teams[1]}-${key}`}>{matchScoutingData![alliance.teams[1]].auto[key as keyof ProcessedTeamData['auto']]}</div>
                        <div key={`${alliance.teams[2]}-${key}`}>{matchScoutingData![alliance.teams[2]].auto[key as keyof ProcessedTeamData['auto']]}</div>
                      </>
                    ))}
                  </div>
                </div>
                <div className="info p-3 rounded-lg m-2">
                  <h4 className="text-lg">Teleop</h4>
                  <div className="grid grid-cols-4 gap-2 mt-2 p-2 text-center">
                    {Object.keys(matchScoutingData![alliance.teams[0]].teleop).map((key) => (
                      <>
                        <div key={`label-${key}`} className="font-bold text-right">{labels[key]}</div>
                        <div key={`${alliance.teams[0]}-${key}`}>{matchScoutingData![alliance.teams[0]].teleop[key as keyof ProcessedTeamData['teleop']]}</div>
                        <div key={`${alliance.teams[1]}-${key}`}>{matchScoutingData![alliance.teams[1]].teleop[key as keyof ProcessedTeamData['teleop']]}</div>
                        <div key={`${alliance.teams[2]}-${key}`}>{matchScoutingData![alliance.teams[2]].teleop[key as keyof ProcessedTeamData['teleop']]}</div>
                      </>
                    ))}
                  </div>
                </div>
                <div className="info p-3 rounded-lg m-2">
                  <h4 className="text-lg">Endgame</h4>
                  <div className="grid grid-cols-4 gap-2 mt-2 p-4 text-center">
                    {Object.keys(matchScoutingData![alliance.teams[0]].endgame).map((key) => (
                      <>
                        <div key={`label-${key}`} className="font-bold text-right">{labels[key]}</div>
                        <div key={`${alliance.teams[0]}-${key}`}>{matchScoutingData![alliance.teams[0]].endgame[key as keyof ProcessedTeamData['endgame']]}</div>
                        <div key={`${alliance.teams[1]}-${key}`}>{matchScoutingData![alliance.teams[1]].endgame[key as keyof ProcessedTeamData['endgame']]}</div>
                        <div key={`${alliance.teams[2]}-${key}`}>{matchScoutingData![alliance.teams[2]].endgame[key as keyof ProcessedTeamData['endgame']]}</div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
      })}
      </div>
      <TeamModal isOpen={Object.keys(activeTeam).length !== 0} onCancel={() => setActiveTeam({})} onConfirm={() => {}} teamData={activeTeam} />
    </div>
  );
}
