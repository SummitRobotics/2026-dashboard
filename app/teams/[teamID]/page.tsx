import { fetchPitScoutingData, fetchMatchScoutingData } from "@/app/utils/scoutingDataFetcher";
import { getCachedEventStats } from "@/app/utils/teamFetcher";
import { Match, PitScoutingData, ProcessedTeamData } from "@/app/utils/interfaceSpecs";
import TeamMatchScouting from "./teamMatchScouting";
import TeamPitScouting from "./teamPitScouting";

export default async function Page({ params }: {
  params: Promise<{ teamID: string }>
}) {
  const { teamID } = await params;

  const teamPitScoutingData = await fetchPitScoutingData([Number(teamID)])
  .then(response => {
    return response.docs[0].data();
  })
  .catch(error => {
    console.log('fetchPitScoutingData failed');
  }) as PitScoutingData;

  const eventStats = await getCachedEventStats()
  .then(response => {
    return response.filter(teamData => {
      return teamData.teamNumber == Number(teamID);
    })[0];
  });

  return (
    <div className="p-4 grid grid-row place-content-center">
      <h1 className="text-center text-3xl p-3 text-chaos">
        {teamID}<br />
        {eventStats.teamName}
      </h1>

      {(Object.keys(teamPitScoutingData).filter(key => { return key !== 'teamID' && key !== 'teamName';}).length > 0) ? (
        <>
          <h2 className="text-center text-2xl p-3">Pit Scouting</h2>
          <TeamPitScouting pitScoutingData={teamPitScoutingData} teamID={Number(teamID)} />
        </>
      ) : ''}


      <h2 className="text-center text-2xl p-3 mt-6">Aggregate Match Scouting</h2>
      <TeamMatchScouting teamID={Number(teamID)} eventStats={eventStats} />
    </div>
  );
}
