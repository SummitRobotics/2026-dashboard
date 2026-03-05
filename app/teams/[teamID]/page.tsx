import { fetchPitScoutingData, fetchMatchScoutingData } from "@/app/utils/scoutingDataFetcher";
import { Match, PitScoutingData, ProcessedTeamData } from "@/app/utils/interfaceSpecs";
import TeamMatchScouting from "./teamMatchScouting";

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

  const teamMatchScoutingData = await fetchMatchScoutingData([Number(teamID)])
  .then(response => {
    console.log(response);
    return response.reduce((acc, data) => {
      acc[data.teamID] = data;
      return acc;
    }, {} as Record<string, ProcessedTeamData>);
  });

  return (
    <div className="p-4 grid grid-row place-content-center">
      <h1 className="text-center text-3xl p-3">{teamID}</h1>

      <h2 className="text-center text-xl p-3">Aggregate Match Scouting</h2>
      <TeamMatchScouting matchScoutingData={teamMatchScoutingData} teamID={Number(teamID)}/>
    </div>
  );
}
