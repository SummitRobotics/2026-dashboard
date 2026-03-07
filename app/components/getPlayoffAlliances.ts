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

export default async function getPlayoffAlliances(): Promise<PlayoffAlliance[]> {
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

  const allTeams = [...new Set(raw.flatMap((a) => a.teams))];

  const [tbaOprs, statData] = await Promise.all([
    fetch(`https://www.thebluealliance.com/api/v3/event/${COMP_ID}/oprs`, {
      headers: { "X-TBA-Auth-Key": TBA_KEY },
    }).then((r) => r.json()),

    fetch(`/api/compData`).then((r) => r.json()),
  ]);

  const oprs: Record<string, number> = tbaOprs.oprs ?? {};
  const statMap: Record<number, any> = {};
  for (const entry of statData) statMap[entry.teamNumber] = entry;

  return raw.map(({ allianceNumber, teams }) => {
    const top3 = teams.slice(0, 3);

    const allianceOPR = top3.reduce((sum, t) => sum + (oprs[`frc${t}`] ?? 0), 0);

    const epas = top3.map((t) => statMap[t]?.epa ?? 0);
    const allianceEPA = epas.reduce((s, v) => s + v, 0);
    const mean = allianceEPA / 3;
    const allianceEpaSD = Math.sqrt(
      epas.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / 3
    );

    const epaBreakdown: Alliance["epaBreakdown"] = {};
    for (const t of teams) {
      const stat = statMap[t];
      epaBreakdown[t] = {
        total_points:   stat?.epa      ?? 0,
        auto_points:    stat?.autoEpa  ?? 0,
        teleop_points:  stat?.teleEpa  ?? 0,
        endgame_points: stat?.endEpa   ?? 0,
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