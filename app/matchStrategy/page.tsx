
"use client";
import React, { useState } from "react";
import AllianceInfo from "./allianceInfo";

type Alliance = {
  color: string;
  teams: number[];
  OPR: number;
  EPA: number;
  epaSD: number;
};

type Match = {
  matchNumber: number;
  alliances: Alliance[];
};

export default function MatchStrategy() {
  const matchList: Match[] = [
    { matchNumber: 1, alliances: [ { color: "blue", teams: [5468, 1234, 5678], OPR: 12.5, EPA: 15.2, epaSD: 2.1 }, { color: "red", teams: [9101, 1121, 3141], OPR: 8.7, EPA: 10.3, epaSD: 1.8 } ] },
    { matchNumber: 2, alliances: [ { color: "blue", teams: [5468, 9876, 5432], OPR: 10.2, EPA: 12.4, epaSD: 1.9 }, { color: "red", teams: [1234, 4321, 2345], OPR: 7.8, EPA: 9.5, epaSD: 1.6 } ] },
    { matchNumber: 3, alliances: [ { color: "blue", teams: [9876, 5432, 5678], OPR: 9.8, EPA: 11.7, epaSD: 2.0 }, { color: "red", teams: [5468, 4321, 3141], OPR: 6.5, EPA: 8.2, epaSD: 1.7 } ] },
  ];

  const [selectedMatchNumber, setSelectedMatchNumber] = useState<number>(matchList[0].matchNumber);
  const selectedMatch = matchList.find((m) => m.matchNumber === selectedMatchNumber) ?? null;

  return (
    <div className="">
      <h2 className="text-center">Match Strategy</h2>

      <nav className="flex justify-center gap-4 my-4">
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
    </div>
  );
}
