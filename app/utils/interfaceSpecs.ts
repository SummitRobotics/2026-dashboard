interface EPAbreakdown {
  total_points?: number;
  auto_points?: number;
  teleop_points?: number;
  endgame_points?: number;
  energized_rp?: number;
  supercharged_rp?: number;
  traversal_rp?: number;
  tiebreaker_points?: number;
  auto_fuel?: number;
  auto_tower?: number;
  transition_fuel?: number;
  first_shift_fuel?: number;
  second_shift_fuel?: number;
  teleop_fuel?: number;
  endgame_fuel?: number;
  endgame_tower?: number;
  total_fuel?: number;
  total_tower?: number;
  rp_1?: number;
  rp_2?: number;
  rp_3?: number;
}

export interface Alliance {
  color: string;
  teams: number[];
  OPR: number;
  EPA: number;
  epaSD: number;
  epaBreakdown: {
    [key:number]: EPAbreakdown
  }
}

export interface Match {
  matchNumber: number;
  alliances: Alliance[];
}

interface MatchScoutingTeleopData {
  fuel_score: number;
    snowblow_neutral1: number;
    snowblow_neutral2: number;
    snowblow_alliance: number;
    out_of_bounds: number;
    move_shoot: number;
    bump: number;
    trench: number;
    driver_skill: number;
    defense: number;
    speed: number;
}

interface MatchScoutingAutoData {
  moved: number;
  fuel_depot: number;
  fuel_outpost: number;
  fuel_neutral: number;
  climb: number;
  climb_location: PositionData;
  fuel_score: number;
}

interface MatchScoutingEndgameData {
  fuel_score: number;
  climb_level: LevelData;
  climb_location: PositionData;
}

interface MatchScoutingAssessmentData {
  died: number;
  tipped: number;
  fuel_spill: number;
  stuck_fuel: number;
  stuck_bump: number;
}

interface PositionData {
  middle: number;
  right: number;
  left: number;
}

interface LevelData {
  1: number;
  2: number;
  3: number;
}

export interface MatchScoutingData {
  teamID?: number;
  on_field?: number;
  start_position?: PositionData;
  rank_points?: number;
  teleop?: MatchScoutingTeleopData;
  endgame?: MatchScoutingEndgameData;
  assessment?: MatchScoutingAssessmentData;
  auto?: MatchScoutingAutoData;
}

export interface PitScoutingData {
  width?: number;
  length?: number;
  height?: number;
  weight?: number;
  photos?: string[];
  intake_type?: string;
  shooter_type?: string;
  shooter_count?: number;
  auto_aim?: boolean;
  auto_score_count?: number;
  move_shoot?: boolean;
  outpost_feed?: boolean;
  outpost_receive?: boolean;
  climb_endgame?: boolean;
  climb_auto?: boolean;
  drive_type?: string;
  nav_bump?: boolean;
  nav_trench?: boolean;
  hopper_capacity?: number;
  quality?: string;
  electrical_quality?: string;
  electrical_ports_taped?: boolean;
  electrical_battery_protected?: boolean;
  eletrical_loose_wiring?: boolean;
  pit_condition?: string;
  notes?: string;
  teamID?: number | string;
  teamName?: string;
  error?: string;
}

export interface DashboardScoutingData {
  teamID: number;
  on_field: boolean;
  start_position: string;
  rank_points: number;
  teleop: {
    fuel_score: number;
    snowblow_neutral1: boolean;
    snowblow_neutral2: boolean;
    snowblow_alliance: boolean;
    out_of_bounds: boolean;
    move_shoot: boolean;
    bump: boolean;
    trench: boolean;
    driver_skill: boolean;
    defense: boolean;
    speed: number;
  };
  endgame: {
    fuel_score: number;
    climb_level: number;
    climb_location: string;
  };
  assessment: {
    died: boolean;
    tipped: boolean;
    fuel_spill: boolean;
    stuck_fuel: boolean;
    stuck_bump: boolean;
  };
  auto: {
    moved: boolean;
    fuel_depot: boolean;
    fuel_outpost: boolean;
    fuel_neutral: boolean;
    climb: boolean;
    climb_failed: boolean;
    climb_location: string;
    fuel_score: number;
  };
}

export interface ProcessedTeamData {
  teamID: number;
  matches_played: number;
  on_field: string; // percentage
  start_position: string[];
  rank_points: number; // average
  teleop: {
    // fuel_score: number; // average
    snowblow_neutral1: string;
    snowblow_neutral2: string;
    snowblow_alliance: string;
    out_of_bounds: string;
    move_shoot: string;
    bump: string;
    trench: string;
    driver_skill: number; // average
    defense: number; // average
    speed: number; // average
  };
  endgame: {
    // fuel_score: number; // average
    climb_level: string[];
    // climb_score: number;
    climb_location: string[];
  };
  assessment: {
    died: string;
    tipped: string;
    fuel_spill: string;
    stuck_fuel: string;
    stuck_bump: string;
  };
  auto: {
    moved: string;
    fuel_depot: string;
    fuel_outpost: string;
    fuel_neutral: string;
    climb: string;
    climb_location: string[];
    climb_failed: string;
    // fuel_score: number; // average
  };
  [key: string]: string | number | string[] | Record<string, string | number | boolean | string[] | number[]>;
}

export interface MatchDataLabels {
  teamID: string;
  matches_played: string;
  on_field: string;
  rank_points: string;
  start_position: string;
  teleop: {
    snowblow_neutral1: string;
    snowblow_neutral2: string;
    snowblow_alliance: string;
    out_of_bounds: string;
    move_shoot: string;
    bump: string;
    trench: string;
    driver_skill: string;
    defense: string;
    speed: string;
    [key: string]: string | number;
  },
  endgame: {
    climb_level: string;
    climb_location: string;
    [key: string]: string | number;
  },
  assessment: {
    died: string;
    tipped: string;
    fuel_spill: string;
    stuck_fuel: string;
    stuck_bump: string;
    [key: string]: string | number;
  },
  auto: {
    moved: string;
    fuel_depot: string;
    fuel_outpost: string;
    fuel_neutral: string;
    climb: string;
    climb_location: string;
    [key: string]: string | number;
  },
  [key: string]: string | number | Record<string, string | number | boolean | string[]>;
}

export interface PitScoutingLabels {
  width: string;
  length:  string;
  height:  string;
  weight:  string;
  intake_type: string;
  shooter_type: string;
  shooter_count:  string;
  auto_aim:  string;
  auto_score_count:  string;
  move_shoot:  string;
  outpost_feed:  string;
  outpost_receive:  string;
  climb_endgame:  string;
  climb_auto:  string;
  drive_type: string;
  nav_bump:  string;
  nav_trench:  string;
  hopper_capacity:  string;
  quality: string;
  electrical_quality: string;
  electrical_ports_taped:  string;
  electrical_battery_protected:  string;
  eletrical_loose_wiring:  string;
  pit_condition: string;
  notes: string;
  // teamID: number | string;
  // teamName: string;
  [key: string]: string | number;
}

export interface CachedEventData {
  matches?: Match[];
  OPRs?: {
    [key: number]: number
  },
  lastUpdated?: number,
  statbotics?: {
    [key: number]: Record<string, string | number | boolean | string[]>;
  };
}

export interface TeamEventData {
  teamNumber: number;
  teamName: string;
  epa: number;
  autoEpa: number;
  teleEpa: number;
  endEpa: number;
  opr: number;
  rank: number;
  rps: number;
}
