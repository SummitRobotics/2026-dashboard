import { PitScoutingData, PitScoutingLabels } from "@/app/utils/interfaceSpecs";

const PitScoutingDataLabels = {
  width: 'Width',
  length:  'Length',
  height:  'Height',
  weight:  'Weight',
  photos: 'Photos',
  intake_type: 'Intake Type',
  shooter_type: 'Shooter Type',
  shooter_count:  'Shooter Count',
  auto_aim:  'Can Auto Aim',
  auto_score_count:  'Anticipated Auto Score',
  move_shoot:  'Can Move While Shooting',
  outpost_feed:  'Can Feed Outpost',
  outpost_receive:  'Can Receive From Outpost',
  climb_endgame:  'Can Climb in EndGame',
  climb_auto:  'Can Climb in Auto',
  drive_type: 'Drive Type',
  nav_bump:  'Can Navigate Bump',
  nav_trench:  'Can Navigate Trench',
  hopper_capacity:  'Hopper Capacity',
  quality: 'Overall Build Quality Rating',
  shooter_quality: 'Shooter Quality',
  intake_quality: 'Intake Quality',
  climb_quality: 'Climb Quality',
  electrical_quality: 'Electrical Quality',
  electrical_ports_taped:  'Has Taped Electrical Ports',
  electrical_battery_protected:  'Has Protected Batter',
  eletrical_loose_wiring:  'Has Loose Wiring',
  pit_condition: 'Pit Condition',
  notes: 'General Notes',
  // teamID: 'Team ID',
  // teamName: 'Team Name',
} as PitScoutingLabels;

export default function TeamPitScoutingData({ teamID, pitScoutingData }: { teamID: number, pitScoutingData: PitScoutingData }) {
  const { photos: teamPhotos } = pitScoutingData;
  const { photos: photosLabel, ...cleanedLabels } = PitScoutingDataLabels;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="p-3">
        {(!!teamPhotos && teamPhotos.length > 0) ? (
          <div className="mt-4">
            <div className="w-full overflow-x-auto">
              <ul className="whitespace-nowrap">
                {
                  teamPhotos.map((photoUrl, idx) => (
                    <li className="inline-block w-64 px-2" key={idx}><img src={`${photoUrl}`} alt={`${pitScoutingData.teamName} robot photo`} /></li>
                  ))
                }
              </ul>
            </div>
          </div>
        ) : ''}
      </div>

      {(Object.keys(pitScoutingData).filter(key => { return key !== 'photos' && key !== 'teamID' && key !== 'teamName';}).length > 0) ? (
        <div className="info-wrap rounded-lg">
          <div className="info p-3 rounded-lg">
            {Object.keys(cleanedLabels).map((key) => (
              <div key={key} className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
                <div className="font-bold text-right">{cleanedLabels[key]}</div>
                <div>{pitScoutingData[key as keyof PitScoutingData]}</div>
              </div>
            ))}
          </div>
        </div>
      ) : ''}
    </div>
  );
};
