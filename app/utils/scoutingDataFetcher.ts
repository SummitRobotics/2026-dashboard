import { db} from "../components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function fetchScoutingData(teams: number[]) {
  return await getDocs(query(collection(db, "teams"), where("teamID", "in", teams)));


    // .then((snapshot: Record<string, any>) => {
    //   if (snapshot.exists()) {
    //     console.log(snapshot.val());
    //   } else {
    //     console.log("No data available");
    //   }
    // }).catch((error) => {
    //   console.error(error);
    // });
};
