export default async function Page({ params }: {
  params: Promise<{ teamID: string }>
}) {
  const { teamID } = await params;

  return (
    <div className="p-4 grid grid-row place-content-center">
      <h1 className="text-center text-3xl p-3">{teamID}</h1>

    </div>
  );
}
