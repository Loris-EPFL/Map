import { Suspense } from "react";
import BrowseView from "@/components/browse/BrowseView";
import { trips } from "@/lib/mock/trips";

export default function Browse() {
  return (
    <Suspense fallback={<div className="flex flex-1 bg-black" />}>
      <BrowseView trips={trips} />
    </Suspense>
  );
}
