import { db} from "../components/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { DashboardScoutingData, ProcessedTeamData } from "./interfaceSpecs";

export async function fetchPitScoutingData(teams: number[]) {
  return await getDocs(query(collection(db, "teams"), where("teamID", "in", teams)));
};

function calcPct(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}

function calcAvg(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 10) / 10;
}

function aggregateTeamMatches(matches: DashboardScoutingData[]): ProcessedTeamData {
  const count = matches.length;
  const sum = (fn: (m: DashboardScoutingData) => number) =>
    matches.reduce((acc, m) => acc + fn(m), 0);
  return {
    teamID: matches[0].teamID,
    matches_played: count,
    on_field: calcPct(sum(m => m.on_field), count),
    rank_points: calcAvg(sum(m => m.rank_points), count),

    start_position: `${calcPct(sum(m => m.start_position.left),   count)}% L ${calcPct(sum(m => m.start_position.middle), count)}% M ${calcPct(sum(m => m.start_position.right),  count)}% R`,
    // {
    //   middle: calcPct(sum(m => m.start_position.middle), count),
    //   right:  calcPct(sum(m => m.start_position.right),  count),
    //   left:   calcPct(sum(m => m.start_position.left),   count),
    // },

    teleop: {
      fuel_score:       calcAvg(sum(m => m.teleop.fuel_score),       count),
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
      fuel_score: calcAvg(sum(m => m.endgame.fuel_score), count),
      climb_level: `${calcPct(sum(m => m.endgame.climb_level.one),   count)}% 1 ${calcPct(sum(m => m.endgame.climb_level.two),   count)}% 2 ${calcPct(sum(m => m.endgame.climb_level.three), count)}% 3`,

      // {
      //   one:   calcPct(sum(m => m.endgame.climb_level.one),   count),
      //   two:   calcPct(sum(m => m.endgame.climb_level.two),   count),
      //   three: calcPct(sum(m => m.endgame.climb_level.three), count),
      // },
      climb_location: `${calcPct(sum(m => m.endgame.climb_location.left),   count)}% L ${calcPct(sum(m => m.endgame.climb_location.middle), count)}% M ${calcPct(sum(m => m.endgame.climb_location.right),  count)}% R`,
      // {
      //   middle: calcPct(sum(m => m.endgame.climb_location.middle), count),
      //   right:  calcPct(sum(m => m.endgame.climb_location.right),  count),
      //   left:   calcPct(sum(m => m.endgame.climb_location.left),   count),
      // },
    },

    assessment: {
      died:       calcPct(sum(m => m.assessment.died),       count),
      tipped:     calcPct(sum(m => m.assessment.tipped),     count),
      fuel_spill: calcPct(sum(m => m.assessment.fuel_spill), count),
      stuck_fuel: calcPct(sum(m => m.assessment.stuck_fuel), count),
      stuck_bump: calcPct(sum(m => m.assessment.stuck_bump), count),
    },

    auto: {
      moved:      calcPct(sum(m => m.auto.moved),      count),
      fuel_depot: calcPct(sum(m => m.auto.fuel_depot), count),
      fuel_outpost: calcPct(sum(m => m.auto.fuel_outpost), count),
      fuel_neutral: calcPct(sum(m => m.auto.fuel_neutral), count),
      climb_score: calcAvg(sum(m => m.auto.climb*10),      count),
      climb_location: `${calcPct(sum(m => m.auto.climb_location.left),   count)}% L ${calcPct(sum(m => m.auto.climb_location.middle), count)}% M ${calcPct(sum(m => m.auto.climb_location.right),  count)}% R`,

      // {
      //   middle: calcPct(sum(m => m.auto.climb_location.middle), count),
      //   right:  calcPct(sum(m => m.auto.climb_location.right),  count),
      //   left:   calcPct(sum(m => m.auto.climb_location.left),   count),
      // },
      fuel_score: calcAvg(sum(m => m.auto.fuel_score), count),
    },
  };
}

export async function fetchMatchScoutingData(teams: number[]): Promise<ProcessedTeamData[]> {
  const snapshot = await getDocs(query(collection(db, "matches"), where("teamID", "in", teams)));
  const matches: DashboardScoutingData[] = snapshot.docs.map(doc => doc.data() as DashboardScoutingData);

  const groupedByTeam = Map.groupBy(matches, (match) => match.teamID);

  return Array.from(groupedByTeam.values()).map(aggregateTeamMatches);
}
