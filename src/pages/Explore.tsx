import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import PublicPlaygroundCard from "@/components/PublicPlaygroundCard";
import PlaygroundSkeleton from "@/components/skeleton/PlaygroundSkeleton";
import { Input } from "@/components/ui/input.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import { toggleBookmark } from "@/services/firebase/bookmarkService.ts";
import {
  forkPlayground,
  getPublicPlaygrounds,
} from "@/services/firebase/playgroundService.ts";
import { PlaygroundMeta } from "@/types/firestore";

export default function Explore() {
  const [playgrounds, setPlaygrounds] = useState<PlaygroundMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const searchQuery = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(searchQuery, 500); // 500ms delay
  useEffect(() => {
    const fetchPublicPlaygrounds = async () => {
      try {
        setLoading(true);
        const publicPlaygrounds = await getPublicPlaygrounds(
          user,
          debouncedSearch,
        );
        setPlaygrounds(publicPlaygrounds);
      } catch (error) {
        toast.error("Failed to load public playgrounds", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPlaygrounds();
  }, [debouncedSearch, user]);

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

  const handleToggleBookmark = async (
    playgroundId: string,
    isBookmarked: boolean,
  ) => {
    if (!user) {
      toast.error("You need to sign in to bookmark playgrounds.");
      return;
    }

    try {
      const newState = await toggleBookmark(user, playgroundId, isBookmarked);

      setPlaygrounds((prev) =>
        prev.map((pg) =>
          pg.id === playgroundId
            ? {
                ...pg,
                isBookmarked: newState,
                bookmarkCount: newState
                  ? pg.bookmarkCount + 1
                  : pg.bookmarkCount - 1,
              }
            : pg,
        ),
      );

      toast.success(
        `Successfully ${newState ? "added" : "removed"} the bookmark!`,
      );
    } catch (error) {
      toast.error("Failed to toggle bookmark", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occured",
      });
    }
  };

  const handleForking = async (playgroundId: string) => {
    if (!user) {
      toast.error("You need to sign in to bookmark playgrounds.");
      return;
    }

    try {
      const forkedId = await forkPlayground(user, playgroundId);

      setPlaygrounds((prev) =>
        prev.map((pg) =>
          pg.id === playgroundId ? { ...pg, forkCount: pg.forkCount + 1 } : pg,
        ),
      );

      toast.success("Playground forked successfully!", {
        action: {
          label: "Open Fork",
          onClick: () => navigate(`/playground/${forkedId}`),
        },
      });
    } catch (error) {
      toast.error("Failed to fork playground", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occured",
      });
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <PublicPlaygroundCard
              key={playground.id}
              playground={playground}
              onToggleBookmark={handleToggleBookmark}
              onFork={handleForking}
              isOwner={user?.uid === playground.userId}
            />
          ))}
        </div>
      )}

      <Toaster richColors />
    </main>
  );
}
