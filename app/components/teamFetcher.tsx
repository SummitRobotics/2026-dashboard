interface MatchData {
  alliances: {
    red: { team_keys: string[]; score: number };
    blue: { team_keys: string[]; score: number };
  };
  comp_level: string;
  match_number: number;
  time: number;
}

async function getNextMatch(teamNumber: string): Promise<MatchData | null> {
  const apiKey = 'FN7w2wiUQRTFhBXOKjdITttYSz5bXNmc40hLb0DFimSY34GkZu9KfH8DTCyfGCrI';
  const year = 2025; 
  
  const res = await fetch(
    `https://www.thebluealliance.com/api/v3/team/frc${teamNumber}/matches/${year}/simple`, 
    {
      headers: { 'X-TBA-Auth-Key': apiKey },
      next: { revalidate: 60 }
    }
  );

  if (!res.ok) return null;
  const matches: MatchData[] = await res.json();

  const upcoming = matches

  return upcoming[0] || null;
}

export default async function Teamtable() {
  const targetTeam = '5468';
  const match = await getNextMatch(targetTeam);

  if (!match) return <div className="m-5 text-white">No upcoming matches found.</div>;

  const matchType = match.comp_level === 'qm' ? 'Qual' : match.comp_level.toUpperCase();

  return (
    <div className="m-5 float-center w-[520px]">
      <div className="mb-2 px-1">
        <span className="text-white font-mono text-sm bg-slate-800 px-3 py-1 rounded-full border border-slate-600 justify-self-center">
          Next: {matchType} {match.match_number}
        </span>
      </div>

      <div className="flex gap-[4px]">
        <div className="bg-red-800 h-48 w-64 border border-red-800 rounded-lg flex flex-col justify-around p-2">
          {match.alliances.red.team_keys.map((teamKey) => (
            <TeamRow key={teamKey} teamKey={teamKey} target={targetTeam} alliance="red" />
          ))}
        </div>

        <div className="bg-blue-900 h-48 w-64 border border-blue-900 rounded-lg flex flex-col justify-around p-2">
          {match.alliances.blue.team_keys.map((teamKey) => (
            <TeamRow key={teamKey} teamKey={teamKey} target={targetTeam} alliance="blue" />
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamRow({ teamKey, target, alliance }: { teamKey: string; target: string; alliance: 'red' | 'blue' }) {
  const num = teamKey.replace('frc', '');
  const isTarget = num === target;

  return (
    <div className={`text-center py-2 px-4 rounded-md font-black text-xl transition-all ${
      isTarget 
        ? 'bg-black/40 text-white/90' 
        : 'bg-black/20 text-white/90 border border-white/10'
    }`}>
      {num}
    </div>
  );
}

