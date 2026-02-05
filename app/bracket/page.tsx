'use client';
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { db } from "../components/firebase"; 
import { collection, addDoc } from "firebase/firestore";

interface AllianceCellProps {
  coords: [number, number, number, number];
  teams: [string | null, string | null];
  winnerIdx: number | null;
  onMatchResult: (winnerIdx: number) => void;
}

async function Submit(submissionData: { user: any; bracket: any; }) {
    await addDoc(collection(db, "brackets"), {
        name: submissionData.user,
        bracket: submissionData.bracket
    });
}

const AllianceCell = ({ coords, teams, winnerIdx, onMatchResult }: AllianceCellProps) => {
  const [cs, ce, rs, re] = coords;
  const [t1, t2] = teams;

  const gridStyle = {
    gridColumn: `${cs} / ${ce}`,
    gridRow: `${rs} / ${re + 1}`,
  };

  return (
    <div style={gridStyle} className="border border-white flex flex-col justify-center items-center gap-1 p-1 bg-zinc-900">
      <button 
        type="button"
        disabled={!t1 || !t2}
        onClick={() => onMatchResult(0)}
        className={`w-full h-1/2 flex items-center justify-center border text-[10px] transition-all font-bold
          ${winnerIdx === 0 ? 'bg-green-600 border-white font-bold' : 'border-zinc-700 text-white hover:bg-zinc-800'}`}>
        {t1}
      </button>
      <button 
        type="button"
        disabled={!t1 || !t2}
        onClick={() => onMatchResult(1)}
        className={`w-full h-1/2 flex items-center justify-center border text-[10px] transition-all font-bold
          ${winnerIdx === 1 ? 'bg-green-600 border-white font-bold' : 'border-zinc-700 text-white hover:bg-zinc-800'}`}>
        {t2}
      </button>
    </div>
  );
};

export default function Bracket() {
  const [userName, setUserName] = useState("");
  const [teams, setTeams] = useState({
    m1: ["A1", "A8"], m2: ["A4", "A5"], m3: ["A2", "A7"], m4: ["A3", "A6"],
    m5: [null, null], m6: [null, null], m7: [null, null], m8: [null, null],
    m9: [null, null], m10: [null, null], m11: [null, null], m12: [null, null],
    m13: [null, null], m14: [null, null]
  });

  const [winners, setWinners] = useState<Record<string, number | null>>({
    m1: null, m2: null, m3: null, m4: null, m5: null, m6: null, m7: null,
    m8: null, m9: null, m10: null, m11: null, m12: null, m13: null, m14: null
  });

  const updateMatch = (matchId: string, winIdx: number, nextWinner?: [string, number], nextLoser?: [string, number]) => {
    const currentTeams = teams[matchId as keyof typeof teams];
    const winVal = currentTeams[winIdx]!;
    const loseVal = currentTeams[winIdx === 0 ? 1 : 0]!;

    setWinners(prev => ({ ...prev, [matchId]: winIdx }));

    if (nextWinner) {
      setTeams(prev => {
        const next = [...(prev[nextWinner[0] as keyof typeof prev] as [any, any])];
        next[nextWinner[1]] = winVal;
        return { ...prev, [nextWinner[0]]: next };
      });
    }

    if (nextLoser) {
      setTeams(prev => {
        const next = [...(prev[nextLoser[0] as keyof typeof prev] as [any, any])];
        next[nextLoser[1]] = loseVal;
        return { ...prev, [nextLoser[0]]: next };
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const submissionData = {
      user: userName,
      bracket: { teams, winners }
    };
    try {
        Submit(submissionData);
        console.log("submitted");

    } catch (e) {
        console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-screen w-screen bg-black text-white p-4 flex flex-col">
      <div className="mb-4 flex items-center gap-4">
        <label htmlFor="userName" className="text-xl font-bold">Name:</label>
        <input 
          id="userName"
          type="text" 
          required
          value={userName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
          placeholder="Enter your name..."
          className="bg-zinc-800 border border-zinc-600 px-4 py-2 rounded focus:outline-none focus:border-blue-500 w-64"
        />
      </div>

      <div className="grid grid-cols-32 grid-rows-19 flex-grow border border-zinc-800 relative bg-black">

        <div className='col-start-1 col-end-23 row-span-1 float place-items-center align-items-center bg-gray-800'>
            <p className='text-5xl sm:text-3xl'>Upper Bracket</p>
        </div>
        
        <div className='col-start-23 col-end-33 row-span-1 float place-items-center align-items-center bg-red-950'>
            <p className='text-5xl sm:text-3xl'>Lower Bracket</p>
        </div>

        <p className="col-start-1 row-start-3 self-center text-center">1</p>
        <p className="col-start-1 row-start-6 self-center text-center">2</p>
        <p className="col-start-1 row-start-9 self-center text-center">3</p>
        <p className="col-start-1 row-start-12 self-center text-center">4</p>
        <p className="col-start-1 row-start-15 self-center text-center">5</p>
        <p className="col-start-1 row-start-18 self-center text-center">F</p>

        <div className='col-start-4 row-start-4 col-end-10 row end-4 border border-t-0 '></div>
        <div className='col-start-6 col-end-6 row-start-5 row-end-5 border border-l-0 border-t-0 border-b-0'></div>

        <div className='col-start-16 row-start-4 col-end-22 row end-4 border border-t-0 '></div>
        <div className='col-start-18 col-end-18 row-start-5 row-end-5 border border-l-0 border-t-0 border-b-0'></div>

        <div className='col-start-7 row-start-7 col-end-19 row end-7 border border-t-0 '></div>
        <div className='col-start-12 col-end-12 row-start-8 row-end-12 border border-l-0 border-t-0 border-b-0'></div>

        <div className='col-start-24 row-start-7 col-end-25 row end-7 border border-t-0 border-l-0'></div>
        <div className='col-start-24 row-start-8 col-end-24 row end-8 border border-b-0 border-r-0 border-t-0'></div>

        <div className='col-start-30 row-start-7 col-end-30 row end-7 border border-t-0 border-l-0'></div>
        <div className='col-start-30 row-start-8 col-end-30 row end-8 border border-b-0 border-r-0 border-t-0'></div>

        <div className='col-start-24 row-start-10 col-end-30 row-end-10 border border-t-0 '></div>
        <div className='col-start-26 col-end-26 row-start-11 row-end-11 border border-l-0 border-t-0 border-b-0'></div>

        <div className='col-start-26 col-end-26 row-start-13 row-end-15 border border-l-0 border-t-0 border-b-0'></div>
        <div className='col-start-12 col-end-12 row-start-13 row-end-17 border border-l-0 border-t-0 border-b-0'></div>
        <div className='col-start-13 row-start-16 col-end-27 row-end-16 border border-t-0 border-l-0'></div>
        <div className='col-start-16 col-end-16 row-start-17 row-end-17 border border-l-0 border-t-0 border-b-0'></div>

        <AllianceCell coords={[2, 6, 3, 3]} teams={teams.m1 as any} winnerIdx={winners.m1} onMatchResult={(i) => updateMatch('m1', i, ['m9', 0], ['m5', 0])} />
        <AllianceCell coords={[8, 12, 3, 3]} teams={teams.m2 as any} winnerIdx={winners.m2} onMatchResult={(i) => updateMatch('m2', i, ['m9', 1], ['m5', 1])} />
        <AllianceCell coords={[14, 18, 3, 3]} teams={teams.m3 as any} winnerIdx={winners.m3} onMatchResult={(i) => updateMatch('m3', i, ['m10', 0], ['m6', 0])} />
        <AllianceCell coords={[20, 24, 3, 3]} teams={teams.m4 as any} winnerIdx={winners.m4} onMatchResult={(i) => updateMatch('m4', i, ['m10', 1], ['m6', 1])} />

        <AllianceCell coords={[23, 27, 6, 6]} teams={teams.m5 as any} winnerIdx={winners.m5} onMatchResult={(i) => updateMatch('m5', i, ['m7', 1])} />
        <AllianceCell coords={[29, 33, 6, 6]} teams={teams.m6 as any} winnerIdx={winners.m6} onMatchResult={(i) => updateMatch('m6', i, ['m8', 1])} />
        
        <AllianceCell coords={[5, 9, 6, 6]} teams={teams.m9 as any} winnerIdx={winners.m9} onMatchResult={(i) => updateMatch('m9', i, ['m11', 0], ['m8', 0])} />
        <AllianceCell coords={[17, 21, 6, 6]} teams={teams.m10 as any} winnerIdx={winners.m10} onMatchResult={(i) => updateMatch('m10', i, ['m11', 1], ['m7', 0])} />

        <AllianceCell coords={[22, 26, 9, 9]} teams={teams.m7 as any} winnerIdx={winners.m7} onMatchResult={(i) => updateMatch('m7', i, ['m12', 0])} />
        <AllianceCell coords={[28, 32, 9, 9]} teams={teams.m8 as any} winnerIdx={winners.m8} onMatchResult={(i) => updateMatch('m8', i, ['m12', 1])} />

        <AllianceCell coords={[11, 15, 12, 12]} teams={teams.m11 as any} winnerIdx={winners.m11} onMatchResult={(i) => updateMatch('m11', i, ['m14', 0], ['m13', 0])} />
        <AllianceCell coords={[25, 29, 12, 12]} teams={teams.m12 as any} winnerIdx={winners.m12} onMatchResult={(i) => updateMatch('m12', i, ['m13', 1])} />

        <AllianceCell coords={[25, 29, 15, 15]} teams={teams.m13 as any} winnerIdx={winners.m13} onMatchResult={(i) => updateMatch('m13', i, ['m14', 1])} />
        <AllianceCell coords={[15, 19, 18, 18]} teams={teams.m14 as any} winnerIdx={winners.m14} onMatchResult={(i) => updateMatch('m14', i)} />
      </div>
      <div className="mt-4 flex justify-center bg-black">
        <button type="submit" className="px-12 py-3 font-bold rounded shadow-lg transition-all text-lg uppercase tracking-wider">
          Submit Entry
        </button>
      </div>
    </form>
  );
}