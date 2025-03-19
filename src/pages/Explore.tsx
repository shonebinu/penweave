import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import PlaygroundSkeleton from "@/components/PlaygroundSkeleton";
import ExplorePlayground from "@/components/explore/ExplorePlaygroundCard.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { getPublicPlaygrounds } from "@/services/firebase/firestore";
import { PlaygroundWithUser } from "@/types/firestore";

export default function Explore() {
  const [playgrounds, setPlaygrounds] = useState<PlaygroundWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const searchQuery = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(searchQuery, 500); // 500ms delay

  useEffect(() => {
    const fetchPublicPlaygrounds = async () => {
      try {
        setLoading(true);
        const publicPlaygrounds = await getPublicPlaygrounds(debouncedSearch);
        setPlaygrounds(publicPlaygrounds);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load public playgrounds");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPlaygrounds();
  }, [debouncedSearch]);

  useEffect(() => {
    if (location.state?.error) {
      toast.error(
        location.state.error,
        location.state?.details ? { description: location.state?.details } : {},
      );
    }
  }, [location.state]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Explore Playgrounds
        </h1>
        <p className="text-sm text-muted-foreground">
          Discover public playgrounds created by other users
        </p>
      </div>

      <div className="w-full max-w-xs">
        <Input
          placeholder="Search playgrounds..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PlaygroundSkeleton key={i} />
          ))}
        </div>
      ) : playgrounds.length === 0 ? (
        <div className="flex h-80 flex-col items-center justify-center">
          <h3 className="text-lg font-medium">No public playgrounds found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or explore other playgrounds.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playgrounds.map((playground) => (
            <ExplorePlayground key={playground.id} playground={playground} />
          ))}
        </div>
      )}

      <Toaster richColors />
    </main>
  );
}
