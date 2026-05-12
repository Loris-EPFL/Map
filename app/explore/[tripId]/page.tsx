import { notFound } from "next/navigation";
import TripView from "@/components/trip/TripView";
import { getTripById } from "@/lib/mock/trips";

export default async function TripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = getTripById(tripId);
  if (!trip) notFound();

  return <TripView trip={trip} />;
}
