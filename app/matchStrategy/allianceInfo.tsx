'use client';
import "./allianceInfo.css";

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

export default function AllianceInfo({ data }: { data: Match | null }) {
  if (!data) {
    return (
      <div className="alliance-info">
        <h3>Alliance Information</h3>
        <p className="text-sm text-muted">No match selected.</p>
      </div>
    );
  }

  data.alliances.sort((a, b) => a.teams.includes(5468) ? -1 : b.teams.includes(5468) ? 1 : 0);

  return (
    <div className="alliance-info">
      <h3>Alliance Information — Match {data.matchNumber}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {data.alliances.map((alliance) => (
          <div key={alliance.color} className={`p-3 border rounded border-${alliance.color}-500`}>
            <h4 className="font-semibold">{alliance.color.toUpperCase()} Alliance</h4>
            <p>Teams: {alliance.teams.join(', ')}</p>
            <p>OPR: {alliance.OPR}</p>
            <p>EPA: {alliance.EPA} (±{alliance.epaSD})</p>
          </div>
        ))}
      </div>
    </div>
  );
}
