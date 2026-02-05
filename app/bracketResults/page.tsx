'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { db } from "../components/firebase";
import { collection, query, getDocs } from "firebase/firestore";

interface BracketData {
  name: string;
  bracket: {
    teams: Record<string, [string | null, string | null]>;
    winners: Record<string, number | null>;
  };
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<BracketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = collection(db, "brackets");
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => doc.data() as BracketData);
        setEntries(data);
        setLoading(false);
        console.log(data)
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const { stats, keyFound } = useMemo(() => {
    const keyBracket = entries.find(e => e.name?.toLowerCase() === "key");
    
    if (!keyBracket) return { stats: [], keyFound: false };

    const computedStats = entries
      .filter(e => e.name?.toLowerCase() !== "key")
      .map(entry => {
        let matchesCorrect = 0;
        let totalMatches = 0;

        Object.entries(keyBracket.bracket.winners).forEach(([matchId, keyWinner]) => {
          if (keyWinner !== null && keyWinner !== undefined) {
            totalMatches++;
            if (entry.bracket.winners[matchId] === keyWinner) {
              matchesCorrect++;
            }
          }
        });

        return {
          name: entry.name || "Anonymous",
          score: matchesCorrect,
          total: totalMatches,
          accuracy: totalMatches > 0 ? (matchesCorrect / totalMatches) * 100 : 0
        };
      })
      .sort((a, b) => b.accuracy - a.accuracy);

    return { stats: computedStats, keyFound: true };
  }, [entries]);

  if (loading) return <div className="text-white p-10 font-mono">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {!keyFound && (
        <div className="bg-orange-900/30 border border-orange-500 p-4 mb-6 rounded text-orange-200">
          No "key" bracket found. Rankings are currently unavailable.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-center">
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <p className="text-zinc-500 text-sm uppercase tracking-tighter">Total Entries</p>
          <p className="text-3xl font-bold">{stats.length}</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <p className="text-zinc-500 text-sm uppercase tracking-tighter">Avg Accuracy</p>
          <p className="text-3xl font-bold">
            {(stats.reduce((acc, curr) => acc + curr.accuracy, 0) / (stats.length || 1)).toFixed(1)}%
          </p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <p className="text-zinc-500 text-sm uppercase tracking-tighter">Leader</p>
          <p className="text-3xl font-bold text-green-500 truncate">{stats[0]?.name || "N/A"}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left bg-zinc-900">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-[10px] tracking-widest">
              <th className="py-4 px-4">Rank</th>
              <th className="py-4 px-4">Person</th>
              <th className="py-4 px-4">Score</th>
              <th className="py-4 px-4">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((user, index) => (
              <tr key={index} className="border-b border-zinc-900 group hover:bg-zinc-900/30">
                <td className="py-4 px-4 font-mono text-zinc-600">#{index + 1}</td>
                <td className="py-4 px-4 font-semibold">{user.name}</td>
                <td className="py-4 px-4 font-mono text-sm">{user.score}/{user.total}</td>
                <td className="py-4 px-4">
                  <span className="font-mono text-blue-400">{user.accuracy.toFixed(1)}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}