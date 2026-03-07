"use client";
import React, { useState, useEffect } from "react";
import AllianceInfo from "./allianceInfo";
import { fetchPitScoutingData, fetchPlayoffScoutingData } from "@/app/utils/scoutingDataFetcher";
import { PitScoutingData, ProcessedTeamData, Match } from "@/app/utils/interfaceSpecs";
import getPlayoffAlliances, { PlayoffAlliance } from "@/app/components/getPlayoffAlliances";

const OUR_TEAM = 5468;

export default function MatchStrategy() {
  const [alliances, setAlliances] = useState<PlayoffAlliance[]>([]);
  const [selectedAllianceNumber, setSelectedAllianceNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnriching, setIsEnriching] = useState(false);
  const [isScoutingLoading, setIsScoutingLoading] = useState(false);
  const [pitScoutingData, setPitScoutingData] = useState<Record<string, PitScoutingData> | null>(null);
  const [matchScoutingData, setMatchScoutingData] = useState<Record<string, ProcessedTeamData> | null>(null);

  useEffect(() => {
    async function loadAlliances() {
      setIsLoading(true);
      const data = await getPlayoffAlliances();
      setAlliances(data);
      if (data.length > 0) setSelectedAllianceNumber(data[0].allianceNumber);
      setIsLoading(false);
    }
    loadAlliances();
  }, []);

  useEffect(() => {
    if (alliances.length === 0) return;

    const selectedPlayoffAlliance = alliances.find((a) => a.allianceNumber === selectedAllianceNumber);
    const ourAlliance = alliances.find((a) => a.alliance.teams.includes(OUR_TEAM));
    if (!selectedPlayoffAlliance) return;

    // Collect teams from both alliances (deduped)
    const teamSet = new Set([
      ...selectedPlayoffAlliance.alliance.teams,
      ...(ourAlliance && ourAlliance.allianceNumber !== selectedPlayoffAlliance.allianceNumber
        ? ourAlliance.alliance.teams
        : []),
    ]);
    const teams = Array.from(teamSet);
    if (teams.length === 0) return;

    async function loadScoutingData() {
      setIsScoutingLoading(true);

      const [playoffScouting, pitScouting] = await Promise.all([
        fetchPlayoffScoutingData(teams).then((response) =>
          response.reduce((acc, data) => {
            acc[data.teamID] = data;
            return acc;
          }, {} as Record<string, ProcessedTeamData>)
        ),
        fetchPitScoutingData(teams).then((response) =>
          response.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data() as PitScoutingData;
            return acc;
          }, {} as Record<string, PitScoutingData>)
        ),
      ]);

      setMatchScoutingData(playoffScouting);
      setPitScoutingData(pitScouting);
      setIsScoutingLoading(false);
    }

    loadScoutingData();
  }, [selectedAllianceNumber, alliances]);

  const selectedPlayoffAlliance = alliances.find((a) => a.allianceNumber === selectedAllianceNumber) ?? null;
  const ourAlliance = alliances.find((a) => a.alliance.teams.includes(OUR_TEAM)) ?? null;

  const matchData: Match | null = selectedPlayoffAlliance
    ? {
        matchNumber: selectedAllianceNumber,
        alliances: [
          // Our alliance (5468) always on the left as blue
          ...(ourAlliance && ourAlliance.allianceNumber !== selectedPlayoffAlliance.allianceNumber
            ? [{ ...ourAlliance.alliance, color: "blue" }]
            : []),
          // Selected alliance on the right as red (or blue if it IS our alliance)
          {
            ...selectedPlayoffAlliance.alliance,
            color:
              ourAlliance?.allianceNumber === selectedPlayoffAlliance.allianceNumber
                ? "blue"
                : "red",
          },
        ],
      }
    : null;

  return (
    <div className="">
      {isLoading ? (
        <div className="text-center mt-4">Loading Alliances...</div>
      ) : alliances.length === 0 ? (
        <div className="text-center mt-4">No playoff alliance data found.</div>
      ) : (
        <>
          <nav className="flex justify-center gap-4 my-4">
            <label htmlFor="allianceSelector" className="self-center">
              Select Opponent Alliance:
            </label>
            <select
              id="allianceSelector"
              value={selectedAllianceNumber}
              onChange={(e) => setSelectedAllianceNumber(Number(e.target.value))}
              className="rounded-md p-2"
            >
              {alliances.map((a) => (
                <option key={a.allianceNumber} value={a.allianceNumber}>
                  Alliance {a.allianceNumber} — {a.alliance.teams.join(", ")}
                  {a.alliance.teams.includes(OUR_TEAM) ? " (Us)" : ""}
                </option>
              ))}
            </select>
            {isEnriching && (
              <span className="self-center text-sm text-gray-400">Fetching EPA/OPR...</span>
            )}
          </nav>

          <div>
            {isScoutingLoading ? (
              <div className="text-center mt-4">Loading scouting data...</div>
            ) : (
              <AllianceInfo
                matchData={matchData}
                pitScoutingData={pitScoutingData}
                matchScoutingData={matchScoutingData}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}