import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import RoadmapBuilder from "./roadmap-builder";

export default function NewRoadmapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading roadmap builder...
        </div>
      }
    >
      <RoadmapBuilder />
    </Suspense>
  );
}
