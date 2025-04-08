import { Skeleton } from "@/components/ui/skeleton";

import PlaygroundSkeleton from "./PlaygroundSkeleton.tsx";

export default function UserSkeleton() {
  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-8" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlaygroundSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
