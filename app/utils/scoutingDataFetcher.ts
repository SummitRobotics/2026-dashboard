import { db} from "../components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { DashboardScoutingData, ProcessedTeamData } from "./interfaceSpecs";

export async function fetchPitScoutingData(teams: number[]) {
  return await getDocs(query(collection(db, "teams"), where("teamID", "in", teams)));
}

function calcPct(value: number, total: number): string {
  return `${total === 0 ? 0 : Math.round((value / total) * 100)}%`;
}

function calcAvg(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 10) / 10;
}


function aggregateTeamMatches(matches: DashboardScoutingData[]): ProcessedTeamData {
  const count = matches.length;

  // For Numeric or Boolean values **NOT STRINGS**
  // Use Array.filter() for strings -- see start_position for an example
  const sum = (fn: (m: DashboardScoutingData) => number | boolean) => {
    return matches.reduce((acc, m) => {
      const v = fn(m);
      if (typeof v === "number") {
        // treat as numeric
        return acc + v;
      }
      // treat boolean as a 0/1 count
      return acc + (v ? 1 : 0);
    }, 0);
  };

  return {
    teamID: matches[0].teamID,
    matches_played: count,
    on_field: calcPct(sum(m => m.on_field), count),
    rank_points: calcAvg(sum(m => m.rank_points), count),
    start_position: [`${calcPct(matches.filter(m => m.start_position === 'left').length, count)} L`, `${calcPct(matches.filter(m => m.start_position === 'middle').length, count)} M`, `${calcPct(matches.filter(m => m.start_position === 'right').length, count)} R`],
    teleop: {
      // fuel_score:       calcAvg(sum(m => m.teleop.fuel_score),       count),
      snowblow_neutral1: calcPct(sum(m => m.teleop.snowblow_neutral1), count),
      snowblow_neutral2: calcPct(sum(m => m.teleop.snowblow_neutral2), count),
      snowblow_alliance: calcPct(sum(m => m.teleop.snowblow_alliance), count),
      out_of_bounds:    calcPct(sum(m => m.teleop.out_of_bounds),    count),
      move_shoot:       calcPct(sum(m => m.teleop.move_shoot),       count),
      bump:             calcPct(sum(m => m.teleop.bump),             count),
      trench:           calcPct(sum(m => m.teleop.trench),           count),
      driver_skill:     calcAvg(sum(m => m.teleop.driver_skill),     count),
      defense:          calcAvg(sum(m => m.teleop.defense),          count),
      speed:            calcAvg(sum(m => m.teleop.speed),            count),
    },

    endgame: {
      // fuel_score: calcAvg(sum(m => m.endgame.fuel_score), count),
      climb_level: [`${calcPct(matches.filter(m => m.endgame.climb_level === 1).length, count)} L1`, `${calcPct(matches.filter(m => m.endgame.climb_level === 2).length, count)} L2`, `${calcPct(matches.filter(m => m.endgame.climb_level === 3).length,  count)} L3`],
      climb_location: [`${calcPct(matches.filter(m => m.endgame.climb_location === 'left').length, count)} L`, `${calcPct(matches.filter(m => m.endgame.climb_location === 'middle').length, count)} M`, `${calcPct(matches.filter(m => m.endgame.climb_location === 'right').length, count)} R`],
    },

    assessment: {
      died:       calcPct(sum(m => m.assessment.died),       count),
      tipped:     calcPct(sum(m => m.assessment.tipped),     count),
      fuel_spill: calcPct(sum(m => m.assessment.fuel_spill), count),
      stuck_fuel: calcPct(sum(m => m.assessment.stuck_fuel), count),
      stuck_bump: calcPct(sum(m => m.assessment.stuck_bump), count),
    },

    auto: {
      moved:      calcPct(sum(m => m.auto.moved), count),
      fuel_depot: calcPct(sum(m => m.auto.fuel_depot), count),
      fuel_outpost: calcPct(sum(m => m.auto.fuel_outpost), count),
      fuel_neutral: calcPct(sum(m => m.auto.fuel_neutral), count),
      climb: calcPct(sum(m => m.auto.climb), count),
      climb_failed: calcPct(sum(m => m.auto.climb_failed), count),
      climb_location: [`${calcPct(matches.filter(m => m.auto.climb_location === 'left').length, count)} L`, `${calcPct(matches.filter(m => m.auto.climb_location === 'middle').length, count)} M`, `${calcPct(matches.filter(m => m.auto.climb_location === 'right').length, count)} R`],
      // fuel_score: calcAvg(sum(m => m.auto.fuel_score), count),
    },
  };
}

export async function fetchMatchScoutingData(teams: number[]): Promise<ProcessedTeamData[]> {
  const chunks: number[][] = [];
  for (let i = 0; i < teams.length; i += 30) chunks.push(teams.slice(i, i + 30));

  const snapshots = await Promise.all(
    chunks.map(chunk =>
      getDocs(query(collection(db, "matches"), where("teamID", "in", chunk)))
    )
  );

  const matches: DashboardScoutingData[] = snapshots.flatMap(
    snapshot => snapshot.docs.map(doc => doc.data() as DashboardScoutingData)
  );

  const groupedByTeam = Map.groupBy(matches, (match) => match.teamID);
  return Array.from(groupedByTeam.values()).map(aggregateTeamMatches);
}
