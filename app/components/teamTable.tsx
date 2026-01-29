import Link from "next/link";
import { COMP_ID } from './constants';
import getCompData from './getComp';
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
export default async function EventPage({
  searchParams,
}: {
  searchParams?: { sort?: string; order?: string };
}) {
  const teams = await getCompData(COMP_ID);

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
    const newOrder = sortKey === key ? (isAsc ? 'desc' : 'asc') : (key === 'teamName' || key === 'teamNumber' || key === 'rank' ? 'asc' : 'desc');
    return `?sort=${key}&order=${newOrder}`;
  };

  return (
    <table className="w-max border-collapse border border-slate-800 text-white bg-black">
      <thead className="bg-slate-900 uppercase text-xs font-bold">
        <tr>
          <th className="p-3 border border-slate-800 text-left w-px whitespace-nowrap">
            <Link href={getSortUrl('teamNumber')} className=" flex items-center gap-1">
              Team {sortKey === 'teamNumber' ? (isAsc ? '▲' : '▼') : '↕'}
            </Link>
          </th>
          <th className="p-3 border border-slate-800 text-left w-60 whitespace-nowrap overflow-x-auto">
            <Link href={getSortUrl('teamName')} className=" flex items-center gap-1">
              Team Name {sortKey === 'teamName' ? (isAsc ? '▲' : '▼') : '↕'}
            </Link>
          </th>
          <th className="p-3 border border-slate-800 text-left w-px whitespace-nowrap">
            <Link href={getSortUrl('epa')} className="flex items-center gap-1">
              EPA {sortKey === 'epa' ? (isAsc ? '▲' : '▼') : '↕'}
            </Link>
          </th>
          <th className="p-3 border border-slate-800 text-left w-px whitespace-nowrap">
            <Link href={getSortUrl('autoEpa')} className="flex items-center gap-1">
                Auto EPA {sortKey === "autoEpa" ? (isAsc ? '▲' : '▼') : '↕'}
            </Link>
          </th>
          <th className="p-3 border border-slate-800 text-left w-px whitespace-nowrap">
            <Link href={getSortUrl('teleEpa')} className="flex items-center gap-1">
                Teleop EPA {sortKey === "teleEpa" ? (isAsc ? '▲' : '▼') : '↕'}
            </Link>
          </th>
          <th className="p-3 border border-slate-800 text-left w-px whitespace-nowrap">
            <Link href={getSortUrl('endEpa')} className="flex items-center gap-1">
                Endgame EPA {sortKey === "endEpa" ? (isAsc ? '▲' : '▼') : '↕'}
            </Link>
          </th>
          <th className="p-3 border border-slate-800 text-left w-px whitespace-nowrap">
            <Link href={getSortUrl('opr')} className="flex items-center gap-1">
              OPR {sortKey === 'opr' ? (isAsc ? '▲' : '▼') : '↕'}
            </Link>
          </th>
          <th className="p-3 border border-slate-800 text-left w-px whitespace-nowrap">
            <Link href={getSortUrl('rank')} className="flex items-center gap-1">
              Rank {sortKey === 'rank' ? (isAsc ? '▲' : '▼') : '↕'}
            </Link>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedTeams.map((team) => (
          <tr key={team.teamNumber}>
            <td className="p-3 border border-slate-800 font-bold font-mono">{team.teamNumber}</td>
            <td className="p-3 border border-slate-800 text-orange-400 font-mono">
              <div className="w-60 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {team.teamName}
              </div>
            </td>
            <td className="p-3 border border-slate-800 text-purple-400 font-mono">{team.epa.toFixed(1)}</td>
            <td className="p-3 border border-slate-800 text-green-400 font-mono">{team.autoEpa.toFixed(1)}</td>
            <td className="p-3 border border-slate-800 text-blue-400 font-mono">{team.teleEpa.toFixed(1)}</td>
            <td className="p-3 border border-slate-800 text-red-400 font-mono">{team.endEpa.toFixed(1)}</td>
            <td className="p-3 border border-slate-800 text-pink-400 font-mono">{team.opr.toFixed(1)}</td>
            <td className="p-3 border border-slate-800 text-yellow-400 font-mono">{team.rank}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}