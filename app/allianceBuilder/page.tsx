"use client";
import { useState, useEffect } from "react";
import getCompData from "../components/getComp";
import { COMP_ID } from "../components/constants";
import { db } from "../components/firebase";
import { collection, addDoc } from "firebase/firestore";

interface TeamData {
  teamNumber: number;
  teamName: string;
  epa: number;
  autoEpa: number;
  teleEpa: number;
  endEpa: number;
  opr: number;
  rank: number;
}

type AllianceGrid = string[][];

const ROWS = 8;
const COLS = 4;
const emptyGrid = (): AllianceGrid =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(""));

export default function AllianceBuilder() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [grid, setGrid] = useState<AllianceGrid>(emptyGrid());
  const [status, setStatus] = useState<"idle" | "pushing" | "done" | "error">("idle");

  useEffect(() => {
    getCompData().then(setTeams);
  }, []);

  function handleChange(row: number, col: number, value: string) {
    setGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = value;
      return next;
    });
  }

  async function handleSubmit() {
    setStatus("pushing");
    const alliances = grid.map((row, i) => ({
      allianceNumber: i + 1,
      teams: row.filter(Boolean),
      timestamp: new Date().toISOString(),
    }));

    try {
      await addDoc(collection(db, "alliances"), {
        compId: COMP_ID,
        alliances,
      });
      setStatus("done");
    } catch (e) {
      console.error("Error: ", e);
      setStatus("error");
    }
  }

  return (
    <div>
      <div className="grid grid-rows-8 gap-1 p-4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((rowIdx) => (
          <div key={rowIdx} className="w-3/4 h-40 border border-white content-center">
            <div className="flex justify-evenly h-10">
              {[0, 1, 2, 3].map((colIdx) => (
                <select
                  key={colIdx}
                  value={grid[rowIdx][colIdx]}
                  onChange={(e) => handleChange(rowIdx, colIdx, e.target.value)}
                  className="text-white p-1 rounded"
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team.teamNumber} value={team.teamNumber}>
                      {team.teamNumber}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={status === "pushing"}
        className="mt-2 px-4 py-2 rounded"
      >
        {status === "pushing" ? "Pushing..." : status === "done" ? "Pushed!" : "Push to Firebase"}
      </button>
      {status === "error" && <p className="text-red-500 mt-2">Error pushing to Firebase.</p>}
    </div>
  );
}