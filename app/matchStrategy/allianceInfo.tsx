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

  const allianceColorsClasses = {
    red: {
      container: 'from-red to-red-dark',
    },
    blue: {
      container: 'from-blue to-blue-dark',
    },
  };

  return (
    <div className="alliance-info">
      <div className="grid grid-cols-2 gap-4 mt-2 p-4">
        {sortedAlliances.map((alliance) => (
          <div key={alliance.color} className={`p-3 border rounded-lg bg-linear-to-t ${allianceColorsClasses[alliance.color].container}`}>
            <h3 className="text-xl">{alliance.color.toUpperCase()} Alliance</h3>

            <div className={``}>
              <p>Teams: {alliance.teams.join(', ')}</p>
              <p>OPR: {alliance.OPR}</p>
              <p>EPA: {alliance.EPA} (SD: {alliance.epaSD})</p>
            </div>

            <div className={`p-3 border rounded-lg m-2`}>
              <h4 className="text-lg">Auto</h4>
              <div className="grid grid-cols-4 gap-2 mt-2 p-4">
                <div className="font-bold">Climb</div>
                <div>Team 1</div>
                <div>Team 2</div>
                <div>Team 3</div>
              </div>
            </div>
            <div className={`p-3 border rounded-lg m-2`}>
              <h4 className="text-lg">Teleop</h4>
            </div>
            <div className={`p-3 border rounded-lg m-2`}>
              <h4 className="text-lg">Endgame</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
