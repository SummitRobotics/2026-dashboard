import EventPage from "@/app/components/teamTable";

export default function teams({ searchParams }: { searchParams: any }) {
  return (
    <main>
      <EventPage searchParams={searchParams} />
    </main>
  );
}