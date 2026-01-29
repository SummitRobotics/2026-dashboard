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

export default async function getCompData(eventKey: string): Promise<TeamData[]> {
  const tbaKey = 'FN7w2wiUQRTFhBXOKjdITttYSz5bXNmc40hLb0DFimSY34GkZu9KfH8DTCyfGCrI';
  const year = eventKey.substring(0, 4);

  try {
    const tbaRes = await fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/oprs`, {
      headers: { 'X-TBA-Auth-Key': tbaKey },
    });
    const tbaData = await tbaRes.json();
    const oprs = tbaData.oprs || {};

    const statRes = await fetch(
      `https://api.statbotics.io/v3/team_events?year=${year}&event=${eventKey}`,
      { headers: { 'accept': 'application/json' } }
    );

    if (!statRes.ok) return [];

    const statData = await statRes.json();

    const combined: TeamData[] = statData.map((entry: any) => ({
      teamNumber: entry.team,
      teamName: entry.team_name,
      epa: entry.epa?.breakdown?.total_points ?? 0,
      autoEpa: entry.epa?.breakdown?.auto_points ?? 0,
      teleEpa: entry.epa?.breakdown?.teleop_points ?? 0,
      endEpa: entry.epa?.breakdown?.endgame_points ?? 0,
      opr: oprs[`frc${entry.team}`] ?? 0,
      rank: entry.record?.qual?.rank ?? 0
    }));

    return combined;
  } catch (err) {
    console.log(err)
    return [];
  }
}