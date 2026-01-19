import Link from "next/link";

interface TeamData {
  teamNumber: number;
  epa: number;
  autoEpa: number;
  teleEpa: number;
  endEpa: number;
  opr: number;
}

async function getCompData(eventKey: string): Promise<TeamData[]> {
  const tbaKey = 'FN7w2wiUQRTFhBXOKjdITttYSz5bXNmc40hLb0DFimSY34GkZu9KfH8DTCyfGCrI';
  const year = eventKey.substring(0, 4);

  try {
    const tbaRes = await fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/oprs`, {
      headers: { 'X-TBA-Auth-Key': tbaKey },
    });
    const tbaData = await tbaRes.json();
    const oprs = tbaData.oprs || {};

    const statRes = await fetch(
      `https://api.statbotics.io/v3/team_events?year=${year}&event=${eventKey}`,
      { headers: { 'accept': 'application/json' } }
    );

    if (!statRes.ok) return [];

    const statData = await statRes.json();

    const combined: TeamData[] = statData.map((entry: any) => ({
      teamNumber: entry.team,
      epa: entry.epa?.breakdown?.total_points ?? 0,
      autoEpa: entry.epa?.breakdown?.auto_points ?? 0,
      teleEpa: entry.epa?.breakdown?.teleop_points ?? 0,
      endEpa: entry.epa?.breakdown?.endgame_points ?? 0,
      opr: oprs[`frc${entry.team}`] ?? 0
    }));

    return combined;
  } catch (err) {
    return [];
  }
}

export default async function EventPage({
  searchParams,
}: {
  searchParams?: { sort?: string; order?: string };
}) {
  const teams = await getCompData('2025bcvi');

  const params = await searchParams || {};
  const sortKey = (params.sort || 'epa') as keyof TeamData;
  const isAsc = params.order === 'asc';

  const sortedTeams = [...teams].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (isAsc) return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  const getSortUrl = (key: string) => {
    const newOrder = sortKey === key && !isAsc ? 'asc' : 'desc';
    return `?sort=${key}&order=${newOrder}`;
  };

  return (
    <table className="w-full border-collapse border border-slate-800 text-white bg-black">
      <thead className="bg-slate-900 uppercase text-xs font-bold">
        <tr>
          <th className="p-3 border border-slate-800 text-left">
            <Link href={getSortUrl('teamNumber')} className=" flex items-center gap-1">
              Team {sortKey === 'teamNumber' ? (isAsc ? '▲' : '▼') : '↕'}
            </Link>
          </th>
          <th className="p-3 border border-slate-800 text-left">
            <Link href={getSortUrl('epa')} className="flex items-center gap-1">
              EPA {sortKey === 'epa' ? (isAsc ? '▲' : '▼') : '↕'}
            </Link>
          </th>
          <th className="p-3 border border-slate-800 text-left">
            <Link href={getSortUrl('autoEpa')} className="flex items-center gap-1">
                Auto EPA {sortKey === "autoEpa" ? (isAsc ? '▲' : '▼') : '↕'}
            </Link>
          </th>
          <th className="p-3 border border-slate-800 text-left">
            <Link href={getSortUrl('teleEpa')} className="flex items-center gap-1">
                Teleop EPA {sortKey === "teleEpa" ? (isAsc ? '▲' : '▼') : '↕'}
            </Link>
          </th>
          <th className="p-3 border border-slate-800 text-left">
            <Link href={getSortUrl('endEpa')} className="flex items-center gap-1">
                Endgame EPA {sortKey === "endEpa" ? (isAsc ? '▲' : '▼') : '↕'}
            </Link>
          </th>
          <th className="p-3 border border-slate-800 text-left">
            <Link href={getSortUrl('opr')} className="flex items-center gap-1">
              OPR {sortKey === 'opr' ? (isAsc ? '▲' : '▼') : '↕'}
            </Link>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedTeams.map((team) => (
          <tr key={team.teamNumber}>
            <td className="p-3 border border-slate-800 font-bold">{team.teamNumber}</td>
            <td className="p-3 border border-slate-800 text-purple-400 font-mono">{team.epa.toFixed(1)}</td>
            <td className="p-3 border border-slate-800 text-green-400 font-mono">{team.autoEpa.toFixed(1)}</td>
            <td className="p-3 border border-slate-800 text-blue-400 font-mono">{team.teleEpa.toFixed(1)}</td>
            <td className="p-3 border border-slate-800 text-red-400 font-mono">{team.endEpa.toFixed(1)}</td>
            <td className="p-3 border border-slate-800 text-yellow-400 font-mono">{team.opr.toFixed(1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}