"use client";
import React, { useState, useEffect } from "react";
import AllianceInfo from "./allianceInfo";
import { fetchEventMatches } from "@/app/utils/matchFetcher";
import { fetchScoutingData } from "@/app/utils/scoutingDataFetcher";
import { Match } from "@/app/utils/interfaceSpecs";
import { COMP_ID } from '@/app/components/constants';

export default function MatchStrategy() {
  const [matchList, setMatchList] = useState<Match[]>([]);
  const [selectedMatchNumber, setSelectedMatchNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  const EVENT_KEY = COMP_ID;

  useEffect(() => {
    async function loadMatchData() {
      setIsLoading(true);
      const data = await fetchEventMatches(EVENT_KEY);
      setMatchList(data);
      if (data.length > 0) {
        setSelectedMatchNumber(data[0].matchNumber);
        const teams = data[0].alliances.flatMap((a) => a.teams);
        await fetchScoutingData(teams)
        .then(response => {
          response.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
          });
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
            <AllianceInfo data={selectedMatch} />
          </div>
        </>
      )}
    </div>
  );
}
