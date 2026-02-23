import { db} from "../components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function fetchPitScoutingData(teams: number[]) {
  return await getDocs(query(collection(db, "teams"), where("teamID", "in", teams)));
};

export async function fetchMatchScoutingData(teams: number[]) {
  return await getDocs(query(collection(db, "matches"), where("teamID", "in", teams)));
};
