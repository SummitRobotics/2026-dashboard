const TBA_KEY = 'FN7w2wiUQRTFhBXOKjdITttYSz5bXNmc40hLb0DFimSY34GkZu9KfH8DTCyfGCrI';

export interface Alliance {
  color: string;
  teams: number[];
  OPR: number;
  EPA: number;
  epaSD: number;
}

export interface Match {
  matchNumber: number;
  alliances: Alliance[];
}

export async function fetchEventMatches(eventKey: string): Promise<Match[]> {
  const year = eventKey.substring(0, 4);
  try {
    const [matchesRes, oprRes, statRes] = await Promise.all([
      fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`, {
        headers: { 'X-TBA-Auth-Key': TBA_KEY },
      }),
      fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/oprs`, {
        headers: { 'X-TBA-Auth-Key': TBA_KEY },
      }),
      fetch(`https://api.statbotics.io/v3/team_events?event=${eventKey}&year=${year}`, {
        headers: { 'accept': 'application/json' }
      })
    ]);

    const matchesRaw = await matchesRes.json();
    const oprData = await oprRes.json();
    const statData = await statRes.json();

    const oprs = oprData.oprs || {}; 
    
    const statMap = new Map<number, { epa: number, sd: number }>();
    if (Array.isArray(statData)) {
      statData.forEach((t: any) => {
        statMap.set(t.team, {
          epa: t.epa?.breakdown?.total_points || 0,
          sd: t.epa?.total_points?.sd || 0 
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

          teams.forEach(team => {
            const stats = statMap.get(team);
            if (stats) {
              totalEPA += stats.epa;
              varianceSum += (stats.sd * stats.sd);
            }
            totalOPR += (oprs[`frc${team}`] || 0);
          });

          return {
            color,
            teams,
            OPR: parseFloat(totalOPR.toFixed(1)),
            EPA: parseFloat(totalEPA.toFixed(1)),
            epaSD: parseFloat(Math.sqrt(varianceSum).toFixed(1))
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