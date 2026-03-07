import { NextResponse } from "next/server";
import { COMP_ID } from "@/app/components/constants";

const TBA_KEY = "FN7w2wiUQRTFhBXOKjdITttYSz5bXNmc40hLb0DFimSY34GkZu9KfH8DTCyfGCrI";
const year = COMP_ID.substring(0, 4);

export async function GET() {
  try {
    const [tbaRes, statRes] = await Promise.all([
      fetch(`https://www.thebluealliance.com/api/v3/event/${COMP_ID}/oprs`, {
        headers: { "X-TBA-Auth-Key": TBA_KEY },
      }),
      fetch(`https://api.statbotics.io/v3/team_events?year=${year}&event=${COMP_ID}`, {
        headers: { accept: "application/json" },
      }),
    ]);

    const tbaData = await tbaRes.json();
    const statData = await statRes.json();
    const oprs = tbaData.oprs || {};

    const teams = statData.map((entry: any) => ({
      teamNumber: entry.team,
      teamName: entry.team_name,
      epa: entry.epa?.breakdown?.total_points ?? 0,
      autoEpa: entry.epa?.breakdown?.auto_points ?? 0,
      teleEpa: entry.epa?.breakdown?.teleop_points ?? 0,
      endEpa: entry.epa?.breakdown?.endgame_points ?? 0,
      opr: oprs[`frc${entry.team}`] ?? 0,
      rank: entry.record?.qual?.rank ?? 0,
    }));

    return NextResponse.json(teams);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}