"use client";
import React, { useState, useEffect, useEffectEvent } from "react";
import { ProcessedTeamData, MatchDataLabels, TeamEventData } from "@/app/utils/interfaceSpecs";
import { fetchMatchScoutingData } from "@/app/utils/scoutingDataFetcher";
import './teamData.css';

const labels = {
  teamID: 'Team Number',
  matches_played: 'Matches Played',
  on_field: 'On Field',
  rank_points: 'Ranking Points',
  start_position: 'Starting Position',
  teleop: {
    snowblow_neutral1: 'Pass From Neutral 1',
    snowblow_neutral2: 'Pass From Neutral 2',
    snowblow_alliance: 'Pass From Alliance',
    out_of_bounds: 'Shot Out of Bounds',
    move_shoot: 'Move & Shoot',
    bump: 'Navigate Bump',
    trench: 'Navigate Trench',
    driver_skill: 'Driver Skill',
    defense: 'Plays Defense',
    speed: 'Speed'
  },
  endgame: {
    climb_level: 'Climb Levels',
    climb_location: 'Climb Locations'
  },
  assessment: {
    died: 'Died on Field',
    tipped: 'Tipped Over',
    fuel_spill: 'Spilled Fuel',
    stuck_fuel: 'Stuck on Fuel',
    stuck_bump: 'Stuck on Bump'
  },
  auto: {
    moved: 'Moved',
    fuel_depot: 'Fuel From Depot',
    fuel_outpost: 'Fuel From Outpost',
    fuel_neutral: 'Fuel From Neutral',
    climb: 'Attempted Climb',
    climb_failed: 'Climb Failed',
    climb_location: 'Climb Location',
  }
} as MatchDataLabels;

export default function TeamMatchScoutingData({ teamID, eventStats }: { teamID: number; eventStats: TeamEventData | null }) {
  const [matchScoutingData, setMatchScoutingData] = useState<ProcessedTeamData | null>(null);
  const [matchQueryType, setMatchQueryType] = useState<string>('historical');
  const [isLoading, setIsLoading] = useState(true);

  //Init match query type on mount
  const updateQueryType = useEffectEvent((qType:string) => {
    setMatchQueryType(qType || 'historical');
  });

  useEffect(() => {
    const savedQueryType = localStorage.getItem('matchQueryType')
    updateQueryType(savedQueryType || 'historical');
  }, []);

  // Re-fetch scouting data whenever selected match changes
  useEffect(() => {
    localStorage.setItem('matchQueryType', matchQueryType);

    async function loadScoutingData() {
      const matchScoutingData = await fetchMatchScoutingData([Number(teamID)], matchQueryType)
        .then(response => {
          console.log('Fetched match scouting data:', response);
          return response[0];
        });

        setMatchScoutingData(matchScoutingData);
      setIsLoading(false);
    };

    loadScoutingData();
  }, [matchQueryType, teamID]);

  if(isLoading) {
    return (
      <div className="p-4 grid grid-row place-content-center">
        <h1 className="text-center text-2xl p-3 text-chaos animate-pulse">
          Loading Match Scouting Data...
        </h1>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 mt-2 p-4">
      <div className="justify-self-center">
        <label className="inline-flex cursor-pointer">
          <span className="select-none">Current Event</span>
          <input type="checkbox" checked={matchQueryType === 'historical'} onChange={(e) => {
            setMatchQueryType((e.target.checked === true) ? 'historical' : 'current');
          }} className="sr-only peer" />
          <div className="relative mx-2 w-9 h-5 bg-chaos peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-chaos-800 dark:peer-focus:ring-chaos-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          <span className="select-none">Historical</span>
        </label>
      </div>

      <div className="info-wrap rounded-lg">
        <div className="info p-3 rounded-lg">
          <h4 className="text-xl text-center">Important</h4>

          {(['driver_skill', 'defense', 'speed'] as const).map((key) => {
            const rowLabel = labels.teleop[key].toString();
            const team1Val = (!!matchScoutingData) ? matchScoutingData.teleop[key as keyof ProcessedTeamData['teleop']] : ['N/A'];

            return (
              <div key={`label-special-${key}`} className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
                <div className="font-bold text-right">{rowLabel}</div>
                <div>{team1Val}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="info-wrap rounded-lg">
        <div className="info p-3 rounded-lg">
          <h4 className="text-xl text-center">General</h4>

          <div className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
            <div className="font-bold text-right">Total EPA</div>
            <div>{(!!eventStats) ? eventStats.epa : 'N/A'}</div>
          </div>

          <div className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
            <div className="font-bold text-right">On Field</div>
            <div>{(!!matchScoutingData) ? matchScoutingData!.on_field : 'N/A'}</div>
          </div>

          <div className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
            <div className="font-bold text-right">Total Rank Points</div>
            <div>{(!!eventStats) ? eventStats.rps : 'N/A'}</div>
          </div>

          <div className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
            <div className="font-bold text-right">Start Position</div>
            <div>{(!!matchScoutingData) ? Object.values(matchScoutingData.start_position).map((val, idx) => (<p key={`start-${idx}-${teamID}-start_position-${val}`}>{val}</p>)) : 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="info-wrap rounded-lg">
        <div className="info p-3 rounded-lg">
          <h4 className="text-xl text-center">Auto</h4>

          <div className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
            <div className="font-bold text-right">Auto EPA</div>
            <div>{(!!eventStats) ? eventStats.autoEpa : 'N/A'}</div>
          </div>

          {Object.keys(labels.auto).map((key) => {
            const rowLabel = labels.auto[key].toString();
            const team1Val = (!!matchScoutingData) ? matchScoutingData.auto[key as keyof ProcessedTeamData['auto']] : ['N/A'];

            if(key === 'climb_location' || key === 'climb_level' || key === 'start_position') {
              return (
                <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
                  <div className="font-bold text-right">{rowLabel}</div>
                  <div>{Object.values(team1Val).map((val, idx) => (<p key={`${key}-${idx}-${teamID}-${val}`}>{val}</p>))}</div>
                </div>
              );
            }

            return (
              <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
                <div className="font-bold text-right">{rowLabel}</div>
                <div>{team1Val}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="info-wrap rounded-lg">
        <div className="info p-3 rounded-lg">
          <h4 className="text-xl text-center">Teleop</h4>

          <div className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
            <div className="font-bold text-right">Teleop EPA</div>
            <div>{(!!eventStats) ? eventStats.teleEpa : 'N/A'}</div>
          </div>

          {Object.keys(labels.teleop).map((key) => {
            const rowLabel = labels.teleop[key].toString();
            const team1Val = (!!matchScoutingData) ? matchScoutingData.teleop[key as keyof ProcessedTeamData['teleop']] : ['N/A'];

            if(key === 'climb_location' || key === 'climb_level' || key === 'start_position') {
              return (
                <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
                  <div className="font-bold text-right">{rowLabel}</div>
                  <div>{Object.values(team1Val).map((val, idx) => (<p key={`${key}-${idx}-${teamID}-${val}`}>{val}</p>))}</div>
                </div>
              );
            }

            return (
              <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
                <div className="font-bold text-right">{rowLabel}</div>
                <div>{team1Val}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="info-wrap rounded-lg">
        <div className="info p-3 rounded-lg">
          <h4 className="text-xl text-center">Endgame</h4>

          <div className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
            <div className="font-bold text-right">Endgame EPA</div>
            <div>{(!!eventStats) ? eventStats.endEpa : 'N/A'}</div>
          </div>

          {Object.keys(labels.endgame).map((key) => {
            const rowLabel = labels.endgame[key].toString();
            const team1Val = (!!matchScoutingData) ? matchScoutingData.endgame[key as keyof ProcessedTeamData['endgame']] : ['N/A'];

            if(key === 'climb_location' || key === 'climb_level' || key === 'start_position') {
              return (
                <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
                  <div className="font-bold text-right">{rowLabel}</div>
                  <div>{Object.values(team1Val).map((val, idx) => (<p key={`${key}-${idx}-${teamID}-${val}`}>{val}</p>))}</div>
                </div>
              );
            }

            return (
              <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
                <div className="font-bold text-right">{rowLabel}</div>
                <div>{team1Val}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="info-wrap rounded-lg">
        <div className="info p-3 rounded-lg">
          <h4 className="text-xl text-center">Match Assessments</h4>
          {Object.keys(labels.assessment).map((key) => {
            const rowLabel = labels.assessment[key].toString();
            const team1Val = (!!matchScoutingData) ? matchScoutingData.assessment[key as keyof ProcessedTeamData['assessment']] : ['N/A'];

            if(key === 'climb_location' || key === 'climb_level' || key === 'start_position') {
              return (
                <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
                  <div className="font-bold text-right">{rowLabel}</div>
                  <div>{Object.values(team1Val).map((val, idx) => (<p key={`${key}-${idx}-${teamID}-${val}`}>{val}</p>))}</div>
                </div>
              );
            }

            return (
              <div key={`label-auto-${key}`} className="stat grid grid-cols-2 gap-6 mt-2 p-2 items-center">
                <div className="font-bold text-right">{rowLabel}</div>
                <div>{team1Val}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};
