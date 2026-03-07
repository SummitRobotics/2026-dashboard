import { COMP_ID } from "./constants";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Alliance } from "../utils/interfaceSpecs";

const TBA_KEY = "FN7w2wiUQRTFhBXOKjdITttYSz5bXNmc40hLb0DFimSY34GkZu9KfH8DTCyfGCrI";
const year = COMP_ID.substring(0, 4);

export interface PlayoffAlliance {
  allianceNumber: number;
  alliance: Alliance;
}

function buildAlliances(
  firestoreAlliances: { allianceNumber: number; teams: number[] }[],
  oprs: Record<string, number>,
  statMap: Record<number, any>
): PlayoffAlliance[] {
  return firestoreAlliances.map(({ allianceNumber, teams }) => {
    const allianceOPR = teams.slice(0, 3).reduce((sum, t) => sum + (oprs[`frc${t}`] ?? 0), 0);

    const epas = teams.slice(0, 3).map((t) => statMap[t]?.epa?.breakdown?.total_points ?? 0);
    const allianceEPA = epas.reduce((s, v) => s + v, 0); // sum, not average
    const allianceEpaSD = Math.sqrt(
    epas.reduce((s, v) => s + Math.pow(v - allianceEPA / 3, 2), 0) / 3
    );

    const epaBreakdown: Alliance["epaBreakdown"] = {};
    for (const t of teams) {
      const stat = statMap[t];
      epaBreakdown[t] = {
        total_points:   stat?.epa?.breakdown?.total_points   ?? 0,
        auto_points:    stat?.epa?.breakdown?.auto_points    ?? 0,
        teleop_points:  stat?.epa?.breakdown?.teleop_points  ?? 0,
        endgame_points: stat?.epa?.breakdown?.endgame_points ?? 0,
      };
    }

    return {
      allianceNumber,
      alliance: {
        color: `Alliance ${allianceNumber}`,
        teams,
        OPR:   Math.round(allianceOPR   * 10) / 10,
        EPA:   Math.round(allianceEPA   * 10) / 10,
        epaSD: Math.round(allianceEpaSD * 10) / 10,
        epaBreakdown,
      },
    };
  });
}

export default async function getPlayoffAlliances(
  onEnriched?: (alliances: PlayoffAlliance[]) => void
): Promise<PlayoffAlliance[]> {
  // --- Step 1: Firestore (fast) ---
  const snapshot = await getDocs(
    query(collection(db, "alliances"), where("compId", "==", COMP_ID))
  );

  if (snapshot.empty) return [];

  const doc = snapshot.docs[snapshot.docs.length - 1];
  const raw: { allianceNumber: number; teams: number[] }[] = (
    doc.data().alliances as any[]
  ).map((a) => ({
    allianceNumber: a.allianceNumber,
    teams: (a.teams as string[]).map(Number).filter(Boolean),
  }));

  // Return immediately with zeroed-out stats
  const initial = buildAlliances(raw, {}, {});

  // --- Step 2: TBA + Statbotics (slow, in background) ---
  if (onEnriched) {
    Promise.all([
      fetch(`https://www.thebluealliance.com/api/v3/event/${COMP_ID}/oprs`, {
        headers: { "X-TBA-Auth-Key": TBA_KEY },
      }).then((r) => r.json()),

      fetch(`https://api.statbotics.io/v3/team_events?year=${year}&event=${COMP_ID}`, {
        headers: { accept: "application/json"},
      }).then((r) => r.json()),
    ])
      .then(([tbaOprs, statData]) => {
        const oprs: Record<string, number> = tbaOprs.oprs ?? {};
        const statMap: Record<number, any> = {};
        for (const entry of statData) statMap[entry.team] = entry;
        onEnriched(buildAlliances(raw, oprs, statMap));
      })
      .catch((err) => console.error("getPlayoffAlliances enrichment error:", err));
  }

  return initial;
}