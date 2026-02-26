import { PitScoutingData } from "@/app/utils/interfaceSpecs";
import Modal from "./modal";

export default function TeamModal({ isOpen, onCancel, onConfirm, teamData }: { isOpen: boolean; onCancel: () => void; onConfirm: () => void; teamData: PitScoutingData }) {
  if (!teamData) {
    return (
      <Modal isOpen={isOpen} onCancel={onCancel} onConfirm={onConfirm}>
        <div className="min-w-2xl">
          <h2 className="text-center text-2xl">No Team Selected</h2>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onCancel={onCancel} onConfirm={onConfirm}>
      <div className="min-w-2xl h-full overflow-hidden">
        <h2 className="text-center text-2xl">Team {teamData.teamID}</h2>
        <h3 className="ext-lg text-center">{teamData.teamName}</h3>

        <div className="mt-4">Photos</div>

        <h3 className="text-lg mt-4">Pit Scouting Data</h3>
        <div className="h-96 overflow-y-auto">
          {Object.keys(teamData).map((key) => (
            <div key={key} className="flex justify-between border-b py-2">
              <span className="font-bold">{key}</span>
              <span>{teamData[key as keyof PitScoutingData]}</span>
            </div>
        ))}
        </div>
      </div>
    </Modal>
  );
}
