"use client";
import React, { useState, useEffect } from "react";
import AllianceInfo from "./allianceInfo";
import { fetchEventMatches } from "@/app/utils/matchFetcher";
import { fetchPitScoutingData, fetchMatchScoutingData } from "@/app/utils/scoutingDataFetcher";
import getCompData from '@/app/components/getComp';
import { Match, PitScoutingData, ProcessedTeamData } from "@/app/utils/interfaceSpecs";

export default function MatchStrategy() {
  const [matchList, setMatchList] = useState<Match[]>([]);
  const [selectedMatchNumber, setSelectedMatchNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isScoutingLoading, setIsScoutingLoading] = useState(false);
  const [pitScoutingData, setPitScoutingData] = useState<Record<string, PitScoutingData> | null>(null);
  const [matchScoutingData, setMatchScoutingData] = useState<Record<string, ProcessedTeamData> | null>(null);

  // Load match list once on mount
  useEffect(() => {
    async function loadMatchList() {
      setIsLoading(true);
      const data = await fetchEventMatches();
      setMatchList(data);
      if (data.length > 0) {
        setSelectedMatchNumber(data[0].matchNumber);
      }
      await getCompData();
      setIsLoading(false);
    }
    loadMatchList();
  }, []);

  // Re-fetch scouting data whenever selected match changes
  useEffect(() => {
    if (matchList.length === 0) return;

    const selectedMatch = matchList.find((m) => m.matchNumber === selectedMatchNumber);
    if (!selectedMatch) return;

    async function loadScoutingData() {
      setIsScoutingLoading(true);
      const teams = selectedMatch!.alliances.flatMap((a) => a.teams);

      const [matchScouting, pitScouting] = await Promise.all([
        fetchMatchScoutingData(teams).then((response) =>
          response.reduce((acc, data) => {
            acc[data.teamID] = data;
            return acc;
          }, {} as Record<string, ProcessedTeamData>)
        ),
        fetchPitScoutingData(teams).then((response) =>
          response.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
          }, {} as Record<string, PitScoutingData>)
        ),
      ]);

      setMatchScoutingData(matchScouting);
      setPitScoutingData(pitScouting);
      setIsScoutingLoading(false);
    }

    loadScoutingData();
  }, [selectedMatchNumber, matchList]);

  const selectedMatch = matchList.find((m) => m.matchNumber === selectedMatchNumber) ?? null;

  return (
    <div className="">
      {isLoading ? (
        <div className="text-center mt-4">Loading Schedule...</div>
      ) : (
        <>
          <nav className="flex justify-center gap-4 my-4">
            <label htmlFor="matchSelector" className="self-center">Select Match:</label>
            <select
              id="matchSelector"
              value={selectedMatchNumber}
              onChange={(e) => setSelectedMatchNumber(Number(e.target.value))}
              className="rounded-md p-2"
            >
              {matchList.map((match) => (
                <option key={match.matchNumber} value={match.matchNumber}>
                  Match {match.matchNumber}
                </option>
              ))}
            </select>
          </nav>

          <div>
            {isScoutingLoading ? (
              <div className="text-center mt-4">Loading scouting data...</div>
            ) : (
              <AllianceInfo matchData={selectedMatch} pitScoutingData={pitScoutingData} matchScoutingData={matchScoutingData} />
            )}
          </div>
        </>
      )}
    </div>
  );
}