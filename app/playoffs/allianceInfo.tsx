'use client';
import { useState } from "react";
import "./allianceInfo.css";
import { Match, PitScoutingData, ProcessedTeamData, MatchDataLabels } from "@/app/utils/interfaceSpecs";
import TeamModal from "../components/teamModal";

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
    climb: 'Attempted Climb',
    climb_failed: 'Climb Failed',
    climb_location: 'Climb Location',
  }
} as MatchDataLabels;

function ms(matchScoutingData: Record<string, ProcessedTeamData> | null, team: number) {
  return matchScoutingData?.[team] ?? null;
}

function epa(alliance: { epaBreakdown: Record<number, any> }, team: number) {
  return alliance?.epaBreakdown?.[team] ?? null;
}

export default function AllianceInfo({ matchData, pitScoutingData, matchScoutingData }: {
  matchData: Match | null;
  pitScoutingData: Record<string, PitScoutingData> | null;
  matchScoutingData: Record<string, ProcessedTeamData> | null;
}) {
  const [activeTeam, setActiveTeam] = useState<PitScoutingData>({});

  if (!matchData) {
    return (
      <div className="alliance-info">
        <h3>Alliance Information</h3>
        <p className="text-sm text-muted">No match selected.</p>
      </div>
    );
  }

  const sortedAlliances = matchData.alliances;

  return (
    <div className="alliance-info">
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mt-2 p-4">
        {sortedAlliances.map((alliance) => {
          const [t1, t2, t3] = alliance.teams.slice(0, 3);

          return (
            <div key={alliance.color} className={`${alliance.color}-alliance-wrap rounded-lg`}>
              <div className="p-3 alliance rounded-lg">
                <h3 className="text-xl text-center">{alliance.color.toUpperCase()} Alliance</h3>

                <div className="alliance-stats border-b-2 p-2">
                  <p>OPR: {alliance.OPR}</p>
                  <p>EPA: {alliance.EPA} (SD: {alliance.epaSD})</p>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-2 px-6 m-2 text-center">
                  <h4 className="text-lg font-bold text-center col-start-2 col-span-3">Teams</h4>
                  <div>{/* grid alignment */}</div>
                  {alliance.teams.slice(0, 3).map((team, idx) => (
                    <div key={`team-${team}`} onClick={() => {
                      if (!pitScoutingData) return;
                      setActiveTeam(pitScoutingData?.[team] ?? {});
                    }}>
                      <strong className="font-bold capitalize">{alliance.color} {idx + 1}</strong><br />
                      <strong className="font-bold">{team}</strong><br />
                      Matches: {ms(matchScoutingData, team)?.matches_played ?? 0}
                    </div>
                  ))}
                </div>

                {/* General */}
                <div className="info p-3 rounded-lg m-2">
                  <h4 className="text-xl text-center">General</h4>

                  <div className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center">
                    <div className="font-bold text-right">Total EPA</div>
                    <div>{epa(alliance, t1)?.total_points ?? 'N/A'}</div>
                    <div>{epa(alliance, t2)?.total_points ?? 'N/A'}</div>
                    <div>{epa(alliance, t3)?.total_points ?? 'N/A'}</div>
                  </div>

                  <div className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center">
                    <div className="font-bold text-right">On Field</div>
                    <div>{ms(matchScoutingData, t1)?.on_field ?? 'N/A'}</div>
                    <div>{ms(matchScoutingData, t2)?.on_field ?? 'N/A'}</div>
                    <div>{ms(matchScoutingData, t3)?.on_field ?? 'N/A'}</div>
                  </div>

                  <div className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center">
                    <div className="font-bold text-right">Avg. RP</div>
                    <div>{ms(matchScoutingData, t1)?.rank_points ?? 'N/A'}</div>
                    <div>{ms(matchScoutingData, t2)?.rank_points ?? 'N/A'}</div>
                    <div>{ms(matchScoutingData, t3)?.rank_points ?? 'N/A'}</div>
                  </div>

                  <div className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center min-h-[72px]">
                    <div className="font-bold text-right">Start Position</div>
                    {[t1, t2, t3].map((team) => (
                      <div key={`start-${team}`}>
                        {ms(matchScoutingData, team)?.start_position?.map((val, idx) => (
                          <p key={`start-${idx}-${team}-${val}`}>{val}</p>
                        )) ?? 'N/A'}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Auto */}
                <div className="info p-3 rounded-lg m-2">
                  <h4 className="text-xl text-center">Auto</h4>

                  <div className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center">
                    <div className="font-bold text-right">Auto EPA</div>
                    <div>{epa(alliance, t1)?.auto_points ?? 'N/A'}</div>
                    <div>{epa(alliance, t2)?.auto_points ?? 'N/A'}</div>
                    <div>{epa(alliance, t3)?.auto_points ?? 'N/A'}</div>
                  </div>

                  {Object.keys(labels.auto).map((key) => {
                    const rowLabel = labels.auto[key].toString();
                    const vals = [t1, t2, t3].map((team) =>
                      ms(matchScoutingData, team)?.auto[key as keyof ProcessedTeamData['auto']] ?? 'N/A'
                    );
                    const isArray = key === 'climb_location';
                    return (
                      <div key={`auto-${key}`} className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center min-h-[72px]">
                        <div className="font-bold text-right">{rowLabel}</div>
                        {vals.map((val, i) => (
                          <div key={`auto-${key}-${alliance.teams[i]}`}>
                            {isArray && Array.isArray(val)
                              ? val.map((v, idx) => <p key={idx}>{v}</p>)
                              : val}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Teleop */}
                <div className="info p-3 rounded-lg m-2">
                  <h4 className="text-xl text-center">Teleop</h4>

                  <div className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center">
                    <div className="font-bold text-right">Teleop EPA</div>
                    <div>{epa(alliance, t1)?.teleop_points ?? 'N/A'}</div>
                    <div>{epa(alliance, t2)?.teleop_points ?? 'N/A'}</div>
                    <div>{epa(alliance, t3)?.teleop_points ?? 'N/A'}</div>
                  </div>

                  {Object.keys(labels.teleop).map((key) => {
                    const rowLabel = labels.teleop[key].toString();
                    const vals = [t1, t2, t3].map((team) =>
                      ms(matchScoutingData, team)?.teleop[key as keyof ProcessedTeamData['teleop']] ?? 'N/A'
                    );
                    return (
                      <div key={`teleop-${key}`} className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center min-h-[72px]">
                        <div className="font-bold text-right">{rowLabel}</div>
                        {vals.map((val, i) => (
                          <div key={`teleop-${key}-${alliance.teams[i]}`}>{val}</div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Endgame */}
                <div className="info p-3 rounded-lg m-2">
                  <h4 className="text-xl text-center">Endgame</h4>

                  <div className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center">
                    <div className="font-bold text-right">Endgame EPA</div>
                    <div>{epa(alliance, t1)?.endgame_points ?? 'N/A'}</div>
                    <div>{epa(alliance, t2)?.endgame_points ?? 'N/A'}</div>
                    <div>{epa(alliance, t3)?.endgame_points ?? 'N/A'}</div>
                  </div>

                  {Object.keys(labels.endgame).map((key) => {
                    const rowLabel = labels.endgame[key].toString();
                    const vals = [t1, t2, t3].map((team) =>
                      ms(matchScoutingData, team)?.endgame[key as keyof ProcessedTeamData['endgame']] ?? 'N/A'
                    );
                    const isArray = key === 'climb_location' || key === 'climb_level';
                    return (
                      <div key={`endgame-${key}`} className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center min-h-[72px]">
                        <div className="font-bold text-right">{rowLabel}</div>
                        {vals.map((val, i) => (
                          <div key={`endgame-${key}-${alliance.teams[i]}`}>
                            {isArray && Array.isArray(val)
                              ? val.map((v, idx) => <p key={idx}>{v}</p>)
                              : val}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Assessment */}
                <div className="info p-3 rounded-lg m-2">
                  <h4 className="text-xl text-center">Match Assessments</h4>

                  {Object.keys(labels.assessment).map((key) => {
                    const rowLabel = labels.assessment[key].toString();
                    const vals = [t1, t2, t3].map((team) =>
                      ms(matchScoutingData, team)?.assessment[key as keyof ProcessedTeamData['assessment']] ?? 'N/A'
                    );
                    return (
                      <div key={`assessment-${key}`} className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center min-h-[72px]">
                        <div className="font-bold text-right">{rowLabel}</div>
                        {vals.map((val, i) => (
                          <div key={`assessment-${key}-${alliance.teams[i]}`}>{val}</div>
                        ))}
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          );
        })}
      </div>
      <TeamModal
        isOpen={activeTeam && Object.keys(activeTeam).length !== 0}
        onCancel={() => setActiveTeam({})}
        onConfirm={() => {}}
        teamData={activeTeam}
      />
    </div>
  );
}