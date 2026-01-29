import getCompData from "../components/getComp";
import { COMP_ID } from "../components/constants";
import { db } from "../components/firebase"; 
import { collection, addDoc } from "firebase/firestore";

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

const teams: TeamData[] = await getCompData(COMP_ID);

function SelectGenerator({
    location,
}: {
    location: { row: number; column: number }
}) {
    const sName = `row-${location.row}-col-${location.column}`;
    return (
        <select name={sName} id={sName} className="text-white p-1 rounded">
            <option value="">Select Team</option>
            {teams.map((team) => (
                <option key={team.teamNumber} value={team.teamNumber}>
                    {team.teamNumber}
                </option>
            ))}
        </select>
    );
}

export default function AllianceBuilder() {
    async function handleSubmit(formData: FormData) {
        "use server";

        const alliances = [];

        for (let r = 1; r <= 8; r++) {
            const alliance = [
                formData.get(`row-${r}-col-1`),
                formData.get(`row-${r}-col-2`),
                formData.get(`row-${r}-col-3`),
                formData.get(`row-${r}-col-4`),
            ];
            alliances.push({
                allianceNumber: r,
                teams: alliance.filter(Boolean),
                timestamp: new Date().toISOString()
            });
        }

        try {
            await addDoc(collection(db, "alliances"), {
                compId: COMP_ID,
                alliances: alliances,
            });
            console.log("pushed");
        } catch (e) {
            console.error("Error: ", e);
        }
    }

    return (
        <form action={handleSubmit}>
            <div className="grid grid-rows-8 gap-1 p-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((rowNum) => (
                    <div key={rowNum} className="w-3/4 h-40 border border-white content-center">
                        <div className="flex justify-evenly h-10">
                            {[1, 2, 3, 4].map((colNum) => (
                                <SelectGenerator 
                                    key={`${rowNum}-${colNum}`} 
                                    location={{ row: rowNum, column: colNum }} 
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <button type="submit">
                Push to Firebase
            </button>
        </form>
    );
}