'use client';
import "./allianceInfo.css";
import { Match } from "@/app/utils/matchFetcher";

export default function AllianceInfo({ data }: { data: Match | null }) {
  if (!data) {
    return (
      <div className="alliance-info">
        <h3>Alliance Information</h3>
        <p className="text-sm text-muted">No match selected.</p>
      </div>
    );
  }
  const sortedAlliances = [...data.alliances].sort((a, b) => 
    a.teams.includes(5468) ? -1 : b.teams.includes(5468) ? 1 : 0
  );

  return (
    <div className="alliance-info">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {sortedAlliances.map((alliance) => (
          <div key={alliance.color} className={`p-3 border rounded border-white`}>
            <h4 className="font-semibold">{alliance.color.toUpperCase()} Alliance</h4>
            <p>Teams: {alliance.teams.join(', ')}</p>
            <p>OPR: {alliance.OPR}</p>
            <p>EPA: {alliance.EPA} (SD: {alliance.epaSD})</p>
          </div>
        ))}
      </div>
    </div>
  );
}