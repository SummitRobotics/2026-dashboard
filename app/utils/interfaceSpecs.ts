// export interface AutoStats{
//   depot: boolean,
//   outpost: boolean,
// }

// export interface TeleopStats{

// }

// export interface EndgameStats{

// }

// export interface TeamStats {
//   auto: AutoStats[];
//   teleop: TeleopStats[];
//   endgame: EndgameStats[];
// }


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
