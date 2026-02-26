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
  teamID: number;
  on_field: number;
  start_position: PositionData;
  rank_points: number;
  teleop: MatchScoutingTeleopData;
  endgame: MatchScoutingEndgameData;
  assessment: MatchScoutingAssessmentData;
  auto: MatchScoutingAutoData;
}

export interface PitScoutingData {
  width?: number;
  length?: number;
  height?: number;
  weight?: number;
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

export
interface DashboardScoutingData {
  teamID: number;
  on_field: number;
  start_position: {
    middle: number;
    right: number;
    left: number;
  };
  rank_points: number;
  teleop: {
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
  };
  endgame: {
    fuel_score: number;
    climb_level: {
      one: number;
      two: number;
      three: number;
    };
    climb_location: {
      middle: number;
      right: number;
      left: number;
    };
  };
  assessment: {
    died: number;
    tipped: number;
    fuel_spill: number;
    stuck_fuel: number;
    stuck_bump: number;
  };
  auto: {
    moved: number;
    fuel_depot: number;
    fuel_outpost: number;
    fuel_neutral: number;
    climb: number;
    climb_location: {
      middle: number;
      right: number;
      left: number;
    };
    fuel_score: number;
  };
}

export interface ProcessedTeamData {
  teamID: number;
  matches_played: number;
  on_field: number; // percentage
  start_position: string; // "X% L, Y% M, Z% R"
  rank_points: number; // average
  teleop: {
    fuel_score: number; // average
    snowblow_neutral1: number;
    snowblow_neutral2: number;
    snowblow_alliance: number;
    out_of_bounds: number;
    move_shoot: number;
    bump: number;
    trench: number;
    driver_skill: number; // average
    defense: number; // average
    speed: number; // average
  };
  endgame: {
    fuel_score: number; // average
    climb_level: string; // "X% 1, Y% 2, Z% 3"
    // climb_score: number;
    climb_location: string; // "X% L, Y% M, Z% R"
  };
  assessment: {
    died: number;
    tipped: number;
    fuel_spill: number;
    stuck_fuel: number;
    stuck_bump: number;
  };
  auto: {
    moved: number;
    fuel_depot: number;
    fuel_outpost: number;
    fuel_neutral: number;
    climb_score: number;
    climb_location: string; // "X% L, Y% M, Z% R"
    fuel_score: number; // average
  };
}
