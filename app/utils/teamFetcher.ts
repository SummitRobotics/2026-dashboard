import { db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import { COMP_ID } from '@/app/components/constants';
import { TeamEventData } from '@/app/utils/interfaceSpecs';

export async function getCachedEventStats() {
  try {
    const eventsRef = doc(db, 'events', COMP_ID);
    const eventSnapshot = await getDoc(eventsRef);

    if (!eventSnapshot.exists()) {
      return [];
    }

    const eventData = eventSnapshot.data();
    const statData = eventData.statbotics;
    const oprs = eventData.OPRs;

    const combined: TeamEventData[] = Object.keys(statData).map((team: any) => {
      return {
        teamNumber: team,
        teamName: statData[team].team_name,
        epa: statData[team].epa ?? 0,
        autoEpa: statData[team].breakdown?.auto_points ?? 0,
        teleEpa: statData[team].breakdown?.teleop_points ?? 0,
        endEpa: statData[team].breakdown?.endgame_points ?? 0,
        opr: oprs[team] ?? 0,
        rank: statData[team].rank ?? 0,
        rps: statData[team].rps ?? 0
      }
    });

    return combined;
  } catch(error) {
    console.error("Error fetching match data:", error);
    return [];
  }
}
