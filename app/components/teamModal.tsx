import { PitScoutingData, PitScoutingLabels } from "@/app/utils/interfaceSpecs";
import Modal from "./modal";

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


export default function TeamModal({ isOpen, onCancel, onConfirm, teamData }: { isOpen: boolean; onCancel: () => void; onConfirm: () => void; teamData: PitScoutingData }) {
  if (!teamData || Object.keys(teamData).length === 1 && teamData.teamID) {
    return (
      <Modal isOpen={isOpen} onCancel={onCancel} onConfirm={onConfirm}>
        <div>
          <h2 className="text-center text-2xl">No Pit Scouting Data for Selected Team</h2>
        </div>
      </Modal>
    );
  }

  const { photos: teamPhotos } = teamData;
  const { photos: photosLabel, ...cleanedLabels } = PitScoutingDataLabels;

  return (
    <Modal isOpen={isOpen} onCancel={onCancel} onConfirm={onConfirm} classes="w-1/2">
      <div className="h-full overflow-hidden">
        <h2 className="text-center text-2xl">Pit Scouting Data</h2>
        <h3 className="text-lg text-center">{teamData.teamID} {teamData.teamName}</h3>

        <div className="w-full h-96 overflow-y-auto justify-self-center">
          {(!!teamPhotos && teamPhotos.length > 0) ? (
            <div className="mt-4">
              <h3 className="capitalize">{photosLabel}</h3>
              <div className="w-full overflow-x-auto">
                <ul className="whitespace-nowrap">
                  {
                    teamPhotos.map((photoUrl, idx) => (
                      <li className="inline-block w-64 px-2" key={idx}><img src={`${photoUrl}`} alt={`${teamData!.teamName} robot photo`} /></li>
                    ))
                  }
                </ul>
              </div>
            </div>
          ) : ''}

          <h3 className="text-xl mt-6"></h3>
          {Object.keys(cleanedLabels).map((key) => (
            <div key={key} className="flex justify-between border-b border-chaos-950 py-3">
              <span className="">{cleanedLabels[key]}</span>
              <span>{teamData[key as keyof PitScoutingData]}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
