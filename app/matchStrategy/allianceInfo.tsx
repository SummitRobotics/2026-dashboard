'use client';
import { useState, useEffect } from "react";
import "./allianceInfo.css";
import { Match, PitScoutingData, ProcessedTeamData, TeamDataLabels } from "@/app/utils/interfaceSpecs";
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
} as TeamDataLabels;

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

  console.log(matchScoutingData);
  return (
    <div className="alliance-info">
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mt-2 p-4">
        {sortedAlliances.map((alliance) => {
          return(
            <div key={alliance.color} className={`${alliance.color}-alliance-wrap rounded-lg`}>
              <div className={`p-3 alliance rounded-lg`}>
                <h3 className="text-xl text-center">{alliance.color.toUpperCase()} Alliance</h3>

                <div className="alliance-stats border-b-2 p-2">
                  <p>OPR: {alliance.OPR}</p>
                  <p>EPA: {alliance.EPA} (SD: {alliance.epaSD})</p>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2 px-6 m-2 text-center">
                  <h4 className="text-lg font-bold text-center col-start-2 col-span-3">Teams</h4>
                  <div>{/* Needed for grid alignment */}</div>
                  {alliance.teams.map((team) => (
                    <div key={`team-${team}`} onClick={() => setActiveTeam(pitScoutingData[team])}>
                      <strong className="font-bold">{team}</strong><br />
                      Matches: {matchScoutingData![team].matches_played}
                    </div>
                  ))}
                </div>

                <div className="info p-3 rounded-lg m-2">
                  <h4 className="text-xl text-center">General</h4>

                  <div className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center">
                    <div className="font-bold text-right">On Field</div>
                    <div>{matchScoutingData![alliance.teams[0]].on_field}</div>
                    <div>{matchScoutingData![alliance.teams[1]].on_field}</div>
                    <div>{matchScoutingData![alliance.teams[2]].on_field}</div>
                  </div>

                  <div className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center">
                    <div className="font-bold text-right">Avg. RP</div>
                    <div>{matchScoutingData![alliance.teams[0]].rank_points}</div>
                    <div>{matchScoutingData![alliance.teams[1]].rank_points}</div>
                    <div>{matchScoutingData![alliance.teams[2]].rank_points}</div>
                  </div>

                  <div className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center">
                    <div className="font-bold text-right">Start Position</div>
                    <div>{matchScoutingData![alliance.teams[0]].start_position}</div>
                    <div>{matchScoutingData![alliance.teams[1]].start_position}</div>
                    <div>{matchScoutingData![alliance.teams[2]].start_position}</div>
                  </div>
                </div>

                <div className="info p-3 rounded-lg m-2">
                  <h4 className="text-xl text-center">Auto</h4>
                  {Object.keys(matchScoutingData![alliance.teams[0]].auto).map((key) => {
                    const rowLabel = labels.auto[key].toString();
                    return (
                      <div key={`label-auto-${key}`} className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center">
                        <div className="font-bold text-right">{rowLabel}</div>
                        <div>{matchScoutingData![alliance.teams[0]].auto[key as keyof ProcessedTeamData['auto']]}</div>
                        <div>{matchScoutingData![alliance.teams[1]].auto[key as keyof ProcessedTeamData['auto']]}</div>
                        <div>{matchScoutingData![alliance.teams[2]].auto[key as keyof ProcessedTeamData['auto']]}</div>
                      </div>
                    )
                  })}
                </div>
                <div className="info p-3 rounded-lg m-2">
                  <h4 className="text-xl text-center">Teleop</h4>
                  {Object.keys(matchScoutingData![alliance.teams[0]].teleop).map((key) => (
                    <div key={`label-teleop-${key}`} className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center">
                      <div className="font-bold text-right">{labels.teleop[key]}</div>
                      <div>{matchScoutingData![alliance.teams[0]].teleop[key as keyof ProcessedTeamData['teleop']]}</div>
                      <div>{matchScoutingData![alliance.teams[1]].teleop[key as keyof ProcessedTeamData['teleop']]}</div>
                      <div>{matchScoutingData![alliance.teams[2]].teleop[key as keyof ProcessedTeamData['teleop']]}</div>
                    </div>
                  ))}
                </div>
                <div className="info p-3 rounded-lg m-2">
                  <h4 className="text-xl text-center">Endgame</h4>
                  {Object.keys(matchScoutingData![alliance.teams[0]].endgame).map((key) => (
                    <div key={`label-endgame-${key}`} className="stat grid grid-cols-4 gap-2 mt-2 p-4 text-center items-center">
                      <div className="font-bold text-right">{labels.endgame[key]}</div>
                      <div>{matchScoutingData![alliance.teams[0]].endgame[key as keyof ProcessedTeamData['endgame']]}</div>
                      <div>{matchScoutingData![alliance.teams[1]].endgame[key as keyof ProcessedTeamData['endgame']]}</div>
                      <div>{matchScoutingData![alliance.teams[2]].endgame[key as keyof ProcessedTeamData['endgame']]}</div>
                    </div>
                  ))}
                </div>
                <div className="info p-3 rounded-lg m-2">
                  <h4 className="text-xl text-center">Match Assessments</h4>
                  {Object.keys(matchScoutingData![alliance.teams[0]].assessment).map((key) => (
                    <div key={`label-endgame-${key}`} className="stat grid grid-cols-4 gap-2 mt-2 p-4 text-center items-center">
                      <div className="font-bold text-right">{labels.assessment[key]}</div>
                      <div>{matchScoutingData![alliance.teams[0]].assessment[key as keyof ProcessedTeamData['assessment']]}</div>
                      <div>{matchScoutingData![alliance.teams[1]].assessment[key as keyof ProcessedTeamData['assessment']]}</div>
                      <div>{matchScoutingData![alliance.teams[2]].assessment[key as keyof ProcessedTeamData['assessment']]}</div>
                    </div>
                  ))}
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
