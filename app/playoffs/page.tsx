"use client";
import React, { useState, useEffect } from "react";
import "./allianceInfo.css";
import { db } from "@/app/components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { fetchPitScoutingData, fetchMatchScoutingData } from "@/app/utils/scoutingDataFetcher";
import { Alliance, PitScoutingData, ProcessedTeamData, TeamDataLabels } from "@/app/utils/interfaceSpecs";
import { COMP_ID } from "@/app/components/constants";
import TeamModal from "../components/teamModal";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SavedAllianceEntry {
  allianceNumber: number;
  teams: number[];
}

interface SavedAlliance {
  id: string;
  compId: string;
  alliances: SavedAllianceEntry[];
}

// ── Firebase Fetch ────────────────────────────────────────────────────────────

async function fetchSavedAlliances(): Promise<SavedAlliance[]> {
  try {
    const snapshot = await getDocs(
      query(collection(db, "alliances"), where("compId", "==", COMP_ID))
    );
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<SavedAlliance, "id">),
    }));
  } catch (err) {
    console.error("fetchSavedAlliances error:", err);
    return [];
  }
}

// ── Labels ────────────────────────────────────────────────────────────────────

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
    climb_failed: 'Climb Failed',
    climb_location: 'Climb Location',
  }
} as TeamDataLabels;

// ── Alliance Panel ────────────────────────────────────────────────────────────

function AlliancePanel({
  alliance,
  isOurs,
  matchScoutingData,
  pitScoutingData,
  onTeamClick,
}: {
  alliance: Alliance;
  isOurs: boolean;
  matchScoutingData: Record<string, ProcessedTeamData> | null;
  pitScoutingData: Record<string, PitScoutingData> | null;
  onTeamClick: (data: PitScoutingData) => void;
}) {
  const wrapClass = isOurs ? 'green-alliance-wrap rounded-lg' : 'red-alliance-wrap rounded-lg';

  return (
    <div className={wrapClass}>
      <div className="p-3 alliance rounded-lg">
        <h3 className="text-xl text-center">
          {isOurs ? 'OUR ALLIANCE' : 'OPPONENT'}
        </h3>

        <div className="alliance-stats border-b-2 p-2">
          <p>OPR: {alliance.OPR}</p>
          <p>EPA: {alliance.EPA} (SD: {alliance.epaSD})</p>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-2 px-6 m-2 text-center">
          <h4 className="text-lg font-bold text-center col-start-2 col-span-3">Teams</h4>
          <div />
          {alliance.teams.map((team) => (
            <div key={`team-${team}`} onClick={() => {
              if (!pitScoutingData) return;
              onTeamClick(pitScoutingData[team]);
            }}>
              <strong className="font-bold">{team}</strong><br />
              Matches: {matchScoutingData?.[team]?.matches_played ?? 0}
            </div>
          ))}
        </div>

        {/* General */}
        <div className="info p-3 rounded-lg m-2">
          <h4 className="text-xl text-center">General</h4>
          <div className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center">
            <div className="font-bold text-right">On Field</div>
            {alliance.teams.map(team => (
              <div key={`on_field-${team}`}>{matchScoutingData?.[team]?.on_field ?? 'N/A'}</div>
            ))}
          </div>
          <div className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center">
            <div className="font-bold text-right">Avg. RP</div>
            {alliance.teams.map(team => (
              <div key={`rank_points-${team}`}>{matchScoutingData?.[team]?.rank_points ?? 'N/A'}</div>
            ))}
          </div>
          <div className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center min-h-[72px]">
            <div className="font-bold text-right">Start Position</div>
            {alliance.teams.map(team => (
              <div key={`start_position-${team}`}>
                {matchScoutingData?.[team]
                  ? Object.values(matchScoutingData[team].start_position).map((v, i) => (
                      <p key={`start-${i}-${team}-${v}`}>{v}</p>
                    ))
                  : 'N/A'}
              </div>
            ))}
          </div>
        </div>

        {/* Auto */}
        <div className="info p-3 rounded-lg m-2">
          <h4 className="text-xl text-center">Auto</h4>
          {Object.keys(labels.auto).map((key) => {
            const isArrayKey = key === 'climb_location' || key === 'climb_level' || key === 'start_position';
            return (
              <div key={`auto-${key}`} className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center min-h-[72px]">
                <div className="font-bold text-right">{String(labels.auto[key])}</div>
                {alliance.teams.map(team => {
                  const teamVal = matchScoutingData?.[team]
                    ? matchScoutingData[team].auto[key as keyof ProcessedTeamData['auto']]
                    : ['N/A'];
                  return (
                    <div key={`auto-${key}-${team}`}>
                      {isArrayKey
                        ? Object.values(teamVal).map((v, i) => <p key={`auto-${key}-${i}-${team}-${v}`}>{v}</p>)
                        : teamVal}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Teleop */}
        <div className="info p-3 rounded-lg m-2">
          <h4 className="text-xl text-center">Teleop</h4>
          {Object.keys(labels.teleop).map((key) => {
            const isArrayKey = key === 'climb_location' || key === 'climb_level' || key === 'start_position';
            return (
              <div key={`teleop-${key}`} className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center min-h-[72px]">
                <div className="font-bold text-right">{String(labels.teleop[key])}</div>
                {alliance.teams.map(team => {
                  const teamVal = matchScoutingData?.[team]
                    ? matchScoutingData[team].teleop[key as keyof ProcessedTeamData['teleop']]
                    : ['N/A'];
                  return (
                    <div key={`teleop-${key}-${team}`}>
                      {isArrayKey
                        ? Object.values(teamVal).map((v, i) => <p key={`teleop-${key}-${i}-${team}-${v}`}>{v}</p>)
                        : teamVal}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Endgame */}
        <div className="info p-3 rounded-lg m-2">
          <h4 className="text-xl text-center">Endgame</h4>
          {Object.keys(labels.endgame).map((key) => {
            const isArrayKey = key === 'climb_location' || key === 'climb_level';
            return (
              <div key={`endgame-${key}`} className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center min-h-[72px]">
                <div className="font-bold text-right">{String(labels.endgame[key])}</div>
                {alliance.teams.map(team => {
                  const teamVal = matchScoutingData?.[team]
                    ? matchScoutingData[team].endgame[key as keyof ProcessedTeamData['endgame']]
                    : ['N/A'];
                  return (
                    <div key={`endgame-${key}-${team}`}>
                      {isArrayKey
                        ? Object.values(teamVal).map((v, i) => <p key={`endgame-${key}-${i}-${team}-${v}`}>{v}</p>)
                        : teamVal}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Assessment */}
        <div className="info p-3 rounded-lg m-2">
          <h4 className="text-xl text-center">Match Assessments</h4>
          {Object.keys(labels.assessment).map((key) => (
            <div key={`assessment-${key}`} className="stat grid grid-cols-4 gap-2 mt-2 p-2 text-center items-center min-h-[72px]">
              <div className="font-bold text-right">{String(labels.assessment[key])}</div>
              {alliance.teams.map(team => (
                <div key={`assessment-${key}-${team}`}>
                  {matchScoutingData?.[team]
                    ? matchScoutingData[team].assessment[key as keyof ProcessedTeamData['assessment']]
                    : 'N/A'}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AllianceStrategy() {
  const [savedAlliances, setSavedAlliances] = useState<SavedAlliance[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pitScoutingData, setPitScoutingData] = useState<Record<string, PitScoutingData> | null>(null);
  const [matchScoutingData, setMatchScoutingData] = useState<Record<string, ProcessedTeamData> | null>(null);
  const [activeTeam, setActiveTeam] = useState<PitScoutingData>({});

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const alliances = await fetchSavedAlliances();
      setSavedAlliances(alliances);
      if (alliances.length > 0) setSelectedId(alliances[0].id);
      setIsLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setMatchScoutingData(null);

    async function loadScoutingData() {
      const saved = savedAlliances.find(a => a.id === selectedId);
      if (!saved) return;

      const teams = saved.alliances.flatMap(a => a.teams);

      const [matchScouting, pitScouting] = await Promise.all([
        fetchMatchScoutingData(teams).then(response =>
          response.reduce((acc, data) => {
            acc[data.teamID] = data;
            return acc;
          }, {} as Record<string, ProcessedTeamData>)
        ),
        fetchPitScoutingData(teams).then(snapshot =>
          snapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data() as PitScoutingData;
            return acc;
          }, {} as Record<string, PitScoutingData>)
        ),
      ]);

      setMatchScoutingData(matchScouting);
      setPitScoutingData(pitScouting);
    }

    loadScoutingData();
  }, [selectedId, savedAlliances]);

  const selected = savedAlliances.find(a => a.id === selectedId);

  // Each saved alliance doc has multiple alliance entries (1–8).
  // Find 5468's alliance and show the rest as opponents selectable per alliance number.
  const ourEntry = selected?.alliances.find(a => a.teams.includes(5468));
  const ourAlliance: Alliance | null = ourEntry
    ? { color: 'green', teams: ourEntry.teams.filter(t => t !== 0), OPR: 0, EPA: 0, epaSD: 0 }
    : null;

  // Opponent alliances are all entries that don't include 5468, shown one at a time via a second selector
  const [selectedOppNumber, setSelectedOppNumber] = useState<number | null>(null);

  const oppEntries = selected?.alliances.filter(a => !a.teams.includes(5468) && a.teams.some(t => t !== 0)) ?? [];

  useEffect(() => {
    if (oppEntries.length > 0) setSelectedOppNumber(oppEntries[0].allianceNumber);
  }, [selectedId]);

  const oppEntry = oppEntries.find(a => a.allianceNumber === selectedOppNumber);
  const oppAlliance: Alliance | null = oppEntry
    ? { color: 'red', teams: oppEntry.teams.filter(t => t !== 0), OPR: 0, EPA: 0, epaSD: 0 }
    : null;

  return (
    <div>
      {isLoading ? (
        <div className="text-center mt-4">Loading...</div>
      ) : savedAlliances.length === 0 ? (
        <div className="text-center mt-4">No alliance picks submitted yet.</div>
      ) : (
        <>
          <nav className="flex justify-center gap-4 my-4 flex-wrap">
            <label htmlFor="allianceSelector" className="self-center">Alliance Pick:</label>
            <select
              id="allianceSelector"
              value={selectedId ?? ''}
              onChange={(e) => setSelectedId(e.target.value)}
              className="rounded-md p-2"
            >
              {savedAlliances.map((a, i) => (
                <option key={a.id} value={a.id}>Alliance Pick {i + 1}</option>
              ))}
            </select>

            {oppEntries.length > 0 && (
              <>
                <label htmlFor="oppSelector" className="self-center">Opponent:</label>
                <select
                  id="oppSelector"
                  value={selectedOppNumber ?? ''}
                  onChange={(e) => setSelectedOppNumber(Number(e.target.value))}
                  className="rounded-md p-2"
                >
                  {oppEntries.map(a => (
                    <option key={a.allianceNumber} value={a.allianceNumber}>
                      Alliance {a.allianceNumber}
                    </option>
                  ))}
                </select>
              </>
            )}
          </nav>

          {!matchScoutingData ? (
            <div className="text-center mt-4">Loading scouting data...</div>
          ) : (
            <div className="alliance-info">
              <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mt-2 p-4">
                {ourAlliance && (
                  <AlliancePanel
                    alliance={ourAlliance}
                    isOurs={true}
                    matchScoutingData={matchScoutingData}
                    pitScoutingData={pitScoutingData}
                    onTeamClick={setActiveTeam}
                  />
                )}
                {oppAlliance && (
                  <AlliancePanel
                    alliance={oppAlliance}
                    isOurs={false}
                    matchScoutingData={matchScoutingData}
                    pitScoutingData={pitScoutingData}
                    onTeamClick={setActiveTeam}
                  />
                )}
              </div>
            </div>
          )}

          <TeamModal
            isOpen={activeTeam && Object.keys(activeTeam).length !== 0}
            onCancel={() => setActiveTeam({})}
            onConfirm={() => {}}
            teamData={activeTeam}
          />
        </>
      )}
    </div>
  );
}