import { notFound } from "next/navigation";
import { getTripById } from "@/lib/mock/trips";
import BookingView from "@/components/trip/BookingView";

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<{ steps?: string }>;
}) {
  const { tripId } = await params;
  const { steps } = await searchParams;

  const trip = getTripById(tripId);
  if (!trip) notFound();

  const stepIds = steps ? steps.split(",").filter(Boolean) : [];
  const allSteps = trip.days.flatMap((d) => d.steps);
  const selectedSteps = stepIds.length > 0
    ? stepIds.flatMap((id) => allSteps.filter((s) => s.id === id))
    : allSteps;

  if (selectedSteps.length === 0) notFound();

  return <BookingView trip={trip} steps={selectedSteps} />;
}
