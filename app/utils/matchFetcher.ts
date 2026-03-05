import { Match, Alliance } from "@/app/utils/interfaceSpecs";
import { COMP_ID, TBA_KEY} from '@/app/components/constants';


export async function fetchEventMatches(): Promise<Match[]> {
  const year = COMP_ID.substring(0, 4);
  try {
    const [matchesRes, oprRes, statRes] = await Promise.all([
      fetch(`https://www.thebluealliance.com/api/v3/event/${COMP_ID}/matches/simple`, {
        headers: { 'X-TBA-Auth-Key': TBA_KEY },
      }),
      fetch(`https://www.thebluealliance.com/api/v3/event/${COMP_ID}/oprs`, {
        headers: { 'X-TBA-Auth-Key': TBA_KEY },
      }),
      fetch(`https://api.statbotics.io/v3/team_events?event=${COMP_ID}&year=${year}`, {
        headers: { 'accept': 'application/json' }
      })
    ]);

    const matchesRaw = await matchesRes.json();
    const oprData = await oprRes.json();
    const statData = await statRes.json();
    const oprs = oprData.oprs || {};
    const statMap = new Map<number, { epa: number, sd: number, breakdown: Alliance['epaBreakdown'] }>();

    if (Array.isArray(statData)) {
      statData.forEach((t: any) => {
        statMap.set(t.team, {
          epa: t.epa?.breakdown?.total_points || 0,
          sd: t.epa?.total_points?.sd || 0,
          breakdown: t.epa?.breakdown || {}
        });
      });
    }

    const formattedMatches: Match[] = matchesRaw
      .filter((m: any) => {
            const isQual = m.comp_level === 'qm';
            const hasTeam =
                m.alliances.blue.team_keys.includes('frc5468') ||
                m.alliances.red.team_keys.includes('frc5468');

            return isQual && hasTeam;
      })
      .map((m: any) => {
        const processAlliance = (color: 'red' | 'blue'): Alliance => {
          const teamKeys: string[] = m.alliances[color].team_keys;
          const teams = teamKeys.map(k => parseInt(k.replace('frc', '')));

          let totalEPA = 0;
          let varianceSum = 0;
          let totalOPR = 0;
          const epaBreakdown = {} as Alliance['epaBreakdown'];

          teams.forEach(team => {
            const stats = statMap.get(team);

            if (stats) {
              totalEPA += stats.epa;
              varianceSum += (stats.sd * stats.sd);
            }

            totalOPR += (oprs[`frc${team}`] || 0);

            epaBreakdown[team] = stats?.breakdown || {};
          });

          return {
            color,
            teams,
            OPR: parseFloat(totalOPR.toFixed(1)),
            EPA: parseFloat(totalEPA.toFixed(1)),
            epaSD: parseFloat(Math.sqrt(varianceSum).toFixed(1)),
            epaBreakdown
          };
        };

        return {
          matchNumber: m.match_number,
          alliances: [processAlliance('blue'), processAlliance('red')]
        };
      })
      .sort((a: any, b: any) => a.matchNumber - b.matchNumber);

    return formattedMatches;

  } catch (error) {
    console.error("Error fetching match data:", error);
    return [];
  }
}
