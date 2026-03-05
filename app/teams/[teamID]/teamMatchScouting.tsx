import { Match, PitScoutingData, ProcessedTeamData, MatchDataLabels } from "@/app/utils/interfaceSpecs";
import './teamData.css';

const labels = {
  teamID: 'Team Number',
  matches_played: 'Matches Played',
  on_field: 'On Field',
  rank_points: 'Ranking Points',
  start_position: 'Starting Position',
  teleop: {
    snowblow_neutral1: 'Pass From Neutral 1',
    snowblow_neutral2: 'Pass From Neutral 2',
    snowblow_alliance: 'Pass From Alliance',
    out_of_bounds: 'Shot Out of Bounds',
    move_shoot: 'Move & Shoot',
    bump: 'Navigate Bump',
    trench: 'Navigate Trench',
    driver_skill: 'Driver Skill',
    defense: 'Plays Defense',
    speed: 'Speed'
  },
  endgame: {
    climb_level: 'Climb Levels',
    climb_location: 'Climb Locations'
  },
  assessment: {
    died: 'Died on Field',
    tipped: 'Tipped Over',
    fuel_spill: 'Spilled Fuel',
    stuck_fuel: 'Stuck on Fuel',
    stuck_bump: 'Stuck on Bump'
  },
  auto: {
    moved: 'Moved',
    fuel_depot: 'Fuel From Depot',
    fuel_outpost: 'Fuel From Outpost',
    fuel_neutral: 'Fuel From Neutral',
    climb: 'Attempted Climb',
    climb_failed: 'Climb Failed',
    climb_location: 'Climb Location',
  }
} as MatchDataLabels;

export default function TeamMatchScoutingData({ teamID, matchScoutingData }: { teamID: number, matchScoutingData: Record<string, ProcessedTeamData>}) {
  const teamMatchData = matchScoutingData![teamID];

  return (
    <div className="grid grid-cols-1 gap-4 mt-2 p-4">
      <div className="info-wrap rounded-lg">
        <div className="info p-3 rounded-lg">
          <h4 className="text-xl text-center">General</h4>

          {/* <div className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
            <div className="font-bold text-right">Total EPA</div>
            <div>{(!!alliance!.epaBreakdown![alliance.teams[0]]) ? alliance!.epaBreakdown![alliance.teams[0]].total_points : 'N/A'}</div>
          </div> */}

          <div className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
            <div className="font-bold text-right">On Field</div>
            <div>{(!!teamMatchData) ? teamMatchData!.on_field : 'N/A'}</div>
          </div>

          <div className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
            <div className="font-bold text-right">Avg. RP</div>
            <div>{(!!teamMatchData) ? teamMatchData.rank_points : 'N/A'}</div>
          </div>

          <div className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
            <div className="font-bold text-right">Start Position</div>
            <div>{(!!teamMatchData) ? Object.values(teamMatchData.start_position).map((val, idx) => (<p key={`start-${idx}-${teamID}-start_position-${val}`}>{val}</p>)) : 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="info-wrap rounded-lg">
        <div className="info p-3 rounded-lg">
          <h4 className="text-xl text-center">Auto</h4>

          <div className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
            <div className="font-bold text-right">Auto EPA</div>
            {/* <div>{(!!teamMatchData) ? teamMatchData.auto_points : 'N/A'}</div> */}
          </div>

          {Object.keys(labels.auto).map((key) => {
            const rowLabel = labels.auto[key].toString();
            const team1Val = (!!teamMatchData) ? teamMatchData.auto[key as keyof ProcessedTeamData['auto']] : ['N/A'];

            if(key === 'climb_location' || key === 'climb_level' || key === 'start_position') {
              return (
                <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
                  <div className="font-bold text-right">{rowLabel}</div>
                  <div>{Object.values(team1Val).map((val, idx) => (<p key={`${key}-${idx}-${teamID}-${val}`}>{val}</p>))}</div>
                </div>
              );
            }

            return (
              <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
                <div className="font-bold text-right">{rowLabel}</div>
                <div>{team1Val}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="info-wrap rounded-lg">
        <div className="info p-3 rounded-lg">
          <h4 className="text-xl text-center">Teleop</h4>

          <div className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
            <div className="font-bold text-right">Teleop EPA</div>
            {/* <div>{(!!alliance!.epaBreakdown![alliance.teams[0]]) ? alliance!.epaBreakdown![alliance.teams[0]].teleop_points : 'N/A'}</div> */}
          </div>

          {Object.keys(labels.teleop).map((key) => {
            const rowLabel = labels.teleop[key].toString();
            const team1Val = (!!teamMatchData) ? teamMatchData.teleop[key as keyof ProcessedTeamData['teleop']] : ['N/A'];

            if(key === 'climb_location' || key === 'climb_level' || key === 'start_position') {
              return (
                <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
                  <div className="font-bold text-right">{rowLabel}</div>
                  <div>{Object.values(team1Val).map((val, idx) => (<p key={`${key}-${idx}-${teamID}-${val}`}>{val}</p>))}</div>
                </div>
              );
            }

            return (
              <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
                <div className="font-bold text-right">{rowLabel}</div>
                <div>{team1Val}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="info-wrap rounded-lg">
        <div className="info p-3 rounded-lg">
          <h4 className="text-xl text-center">Endgame</h4>

          <div className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
            <div className="font-bold text-right">Endgame EPA</div>
            {/* <div>{(!!alliance!.epaBreakdown![alliance.teams[0]]) ? alliance!.epaBreakdown![alliance.teams[0]].endgame_points : 'N/A'}</div> */}
          </div>

          {Object.keys(labels.endgame).map((key) => {
            const rowLabel = labels.endgame[key].toString();
            const team1Val = (!!teamMatchData) ? teamMatchData.endgame[key as keyof ProcessedTeamData['endgame']] : ['N/A'];

            if(key === 'climb_location' || key === 'climb_level' || key === 'start_position') {
              return (
                <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
                  <div className="font-bold text-right">{rowLabel}</div>
                  <div>{Object.values(team1Val).map((val, idx) => (<p key={`${key}-${idx}-${teamID}-${val}`}>{val}</p>))}</div>
                </div>
              );
            }

            return (
              <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
                <div className="font-bold text-right">{rowLabel}</div>
                <div>{team1Val}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="info-wrap rounded-lg">
        <div className="info p-3 rounded-lg">
          <h4 className="text-xl text-center">Match Assessments</h4>
          {Object.keys(labels.assessment).map((key) => {
            const rowLabel = labels.assessment[key].toString();
            const team1Val = (!!teamMatchData) ? teamMatchData.assessment[key as keyof ProcessedTeamData['assessment']] : ['N/A'];

            if(key === 'climb_location' || key === 'climb_level' || key === 'start_position') {
              return (
                <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
                  <div className="font-bold text-right">{rowLabel}</div>
                  <div>{Object.values(team1Val).map((val, idx) => (<p key={`${key}-${idx}-${teamID}-${val}`}>{val}</p>))}</div>
                </div>
              );
            }

            return (
              <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-2 mt-2 p-2 text-center items-center">
                <div className="font-bold text-right">{rowLabel}</div>
                <div>{team1Val}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};
