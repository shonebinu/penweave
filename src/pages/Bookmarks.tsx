import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PlaygroundSkeleton from "@/components/PlaygroundSkeleton.tsx";
import PublicPlaygroundCard from "@/components/PublicPlaygroundCard.tsx";
import UnavailablePlaygroundCard from "@/components/UnavailablePlaygroundCard.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import {
  getBookmarkedPlaygrounds,
  toggleBookmark,
} from "@/services/firebase/bookmarkService.ts";
import { forkPlayground } from "@/services/firebase/playgroundService.ts";
import { PlaygroundMeta } from "@/types/firestore.ts";

export default function Bookmarks() {
  const [bookmarkedPlaygrounds, setBookmarkedPlaygrounds] = useState<
    PlaygroundMeta[]
  >([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookmarkedPlaygrounds = async () => {
      try {
        if (!user) {
          toast.error("You need to be signed in");
          return;
        }

        setLoading(true);
        const bookmarkedPlaygrounds = await getBookmarkedPlaygrounds(user);
        setBookmarkedPlaygrounds(bookmarkedPlaygrounds);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load bookmarked playgrounds", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedPlaygrounds();
  }, [user]);

  const handleToggleBookmark = async (
    playgroundId: string,
    isBookmarked: boolean,
  ) => {
    if (!user) {
      toast.error("You need to sign in to bookmark playgrounds.");
      return;
    }

    try {
      await toggleBookmark(user, playgroundId, isBookmarked);

      setBookmarkedPlaygrounds((prev) =>
        prev.filter((pg) => pg.id !== playgroundId),
      );

      toast.success(`Successfully removed the bookmark.`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove bookmark.");
    }
  };

  const handleForking = async (playgroundId: string) => {
    if (!user) {
      toast.error("You need to sign in to bookmark playgrounds.");
      return;
    }

    try {
      const forkedId = await forkPlayground(user, playgroundId || "");

      setBookmarkedPlaygrounds((prev) =>
        prev.map((pg) =>
          pg.id === playgroundId ? { ...pg, forkCount: pg.forkCount + 1 } : pg,
        ),
      );

      toast.success("Playground forked successfully.", {
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
        <h1 className="text-2xl font-bold tracking-tight">Your Bookmarks</h1>
        <p className="text-sm text-muted-foreground">
          Your saved playgrounds, all in one place.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PlaygroundSkeleton key={i} />
          ))}
        </div>
      ) : bookmarkedPlaygrounds.length === 0 ? (
        <div className="flex h-80 flex-col items-center justify-center">
          <h3 className="text-lg font-medium">No bookmarks yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Save playgrounds you like to find them here later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bookmarkedPlaygrounds.map((playground) =>
            playground.isUnavailable ? (
              <UnavailablePlaygroundCard
                key={playground.id}
                playgroundId={playground.id}
                onRemoveBookmark={handleToggleBookmark}
              />
            ) : (
              <PublicPlaygroundCard
                key={playground.id}
                playground={playground}
                onToggleBookmark={handleToggleBookmark}
                onFork={handleForking}
                isOwner={user?.uid === playground.userId}
              />
            ),
          )}
        </div>
      )}
      <Toaster richColors />
    </main>
  );
}
