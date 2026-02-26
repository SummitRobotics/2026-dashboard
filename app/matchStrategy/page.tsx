"use client";
import React, { useState, useEffect } from "react";
import AllianceInfo from "./allianceInfo";
import { fetchEventMatches } from "@/app/utils/matchFetcher";
import { fetchPitScoutingData, fetchMatchScoutingData } from "@/app/utils/scoutingDataFetcher";
import { Match, PitScoutingData, ProcessedTeamData } from "@/app/utils/interfaceSpecs";
import { COMP_ID } from '@/app/components/constants';

export default function MatchStrategy() {
  const [matchList, setMatchList] = useState<Match[]>([]);
  const [selectedMatchNumber, setSelectedMatchNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pitScoutingData, setPitScoutingData] = useState<Record<string, PitScoutingData> | null>(null);
  const [matchScoutingData, setMatchScoutingData] = useState<Record<string, ProcessedTeamData> | null>(null);

  useEffect(() => {
    async function loadMatchData() {
      setIsLoading(true);
      const data = await fetchEventMatches(COMP_ID);
      setMatchList(data);
      if (data.length > 0) {
        setSelectedMatchNumber(data[0].matchNumber);
        const teams = data[0].alliances.flatMap((a) => a.teams);

        await fetchMatchScoutingData(teams)
        .then(response => {
          return response.reduce((acc, data) => {
            acc[data.teamID] = data;
            return acc;
          }, {} as Record<string, ProcessedTeamData>);
        })
        .then(data => {
          setMatchScoutingData(data);
        });

        await fetchPitScoutingData(teams)
        .then(response => {
          return response.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
          }, {} as Record<string, PitScoutingData>);
        })
        .then(data => {
          setPitScoutingData(data);
        });
      }
      setIsLoading(false);
    }

    loadMatchData();
  }, []);

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
            <AllianceInfo matchData={selectedMatch} pitScoutingData={pitScoutingData} matchScoutingData={matchScoutingData} />
          </div>
        </>
      )}
    </div>
  );
}
