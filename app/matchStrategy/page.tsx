"use client";
import React, { useState, useEffect, useEffectEvent } from "react";
import AllianceInfo from "./allianceInfo";
import { /*fetchEventMatches,*/ getCachedEventMatches } from "@/app/utils/matchFetcher";
import { fetchPitScoutingData, fetchMatchScoutingData } from "@/app/utils/scoutingDataFetcher";
import { Match, PitScoutingData, ProcessedTeamData } from "@/app/utils/interfaceSpecs";

export default function MatchStrategy() {
  const [matchList, setMatchList] = useState<Match[]>([]);
  const [selectedMatchNumber, setSelectedMatchNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isScoutingLoading, setIsScoutingLoading] = useState(false);
  const [pitScoutingData, setPitScoutingData] = useState<Record<string, PitScoutingData> | null>(null);
  const [matchScoutingData, setMatchScoutingData] = useState<Record<string, ProcessedTeamData> | null>(null);
  const [matchQueryType, setMatchQueryType] = useState<string>('historical');

  //Init match query type on mount
  const updateQueryType = useEffectEvent((qType:string) => {
    setMatchQueryType(qType || 'historical');
  });
  useEffect(() => {
    const savedQueryType = localStorage.getItem('matchQueryType')
    updateQueryType(savedQueryType || 'historical');
  }, []);

  // Load match list once on mount
  useEffect(() => {
    async function loadMatchList() {
      setIsLoading(true);
      // const data = await fetchEventMatches();
      const data = await getCachedEventMatches();
      setMatchList(data);
      if (data.length > 0) {
        setSelectedMatchNumber(data[0].matchNumber);
      }

      //setIsLoading(false);
    }
    loadMatchList();
  }, []);

  // Re-fetch scouting data whenever selected match changes
  useEffect(() => {
    localStorage.setItem('matchQueryType', matchQueryType);

    if (matchList.length === 0) return;

    const selectedMatch = matchList.find((m) => m.matchNumber === selectedMatchNumber);
    if (!selectedMatch) return;

    async function loadScoutingData() {
      setIsScoutingLoading(true);
      const teams = selectedMatch!.alliances.flatMap((a) => a.teams);

      const [matchScouting, pitScouting] = await Promise.all([
        fetchMatchScoutingData(teams, matchQueryType).then((response) =>
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
      setIsLoading(false);
    }

    loadScoutingData();
  }, [selectedMatchNumber, matchList, matchQueryType]);

  const selectedMatch = matchList.find((m) => m.matchNumber === selectedMatchNumber) ?? null;

  return (
    <div className="">
      {isLoading ? (
        <div className="text-center mt-4">Loading Schedule...</div>
      ) : (
        <>
          <nav className="justify-center gap-4 my-4">
            <div className="justify-self-center">
              <label className="inline-flex cursor-pointer">
                <span className="select-none">Current Event</span>
                <input type="checkbox" checked={matchQueryType === 'historical'} onChange={(e) => {
                  setMatchQueryType((e.target.checked === true) ? 'historical' : 'current');
                }} className="sr-only peer" />
                <div className="relative mx-2 w-9 h-5 bg-chaos peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-chaos-800 dark:peer-focus:ring-chaos-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                <span className="select-none">Historical</span>
              </label>
            </div>
            <div className="justify-self-center">
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
            </div>
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
