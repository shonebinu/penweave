import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AvatarIcon from "@/components/AvatarIcon.tsx";
import PublicPlaygroundCard from "@/components/PublicPlaygroundCard.tsx";
import PlaygroundSkeleton from "@/components/skeleton/PlaygroundSkeleton";
import { Button } from "@/components/ui/button.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import { toggleBookmark } from "@/services/firebase/bookmarkService.ts";
import { getFollowingUserPlaygrounds } from "@/services/firebase/followService.ts";
import { forkPlayground } from "@/services/firebase/playgroundService.ts";
import { PlaygroundMeta } from "@/types/firestore.ts";

// TODO: New skeleton

export default function Following() {
  const { user } = useAuth();
  const [followingPlaygrounds, setFollowingPlaygrounds] = useState<
    PlaygroundMeta[]
  >([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowingPlaygrounds = async () => {
      if (!user) {
        toast.error("You need to be signed in");
        return;
      }

      try {
        setLoading(true);
        const playgrounds = await getFollowingUserPlaygrounds(user);
        setFollowingPlaygrounds(playgrounds);
      } catch (error) {
        toast.error("Failed to load followed playgrounds", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFollowingPlaygrounds();
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

      setFollowingPlaygrounds((prev) =>
        prev.map((pg) =>
          pg.id === playgroundId
            ? {
                ...pg,
                isBookmarked: !isBookmarked,
                bookmarkCount: pg.bookmarkCount + (isBookmarked ? -1 : 1),
              }
            : pg,
        ),
      );

      toast.success(`Successfully toggled the bookmark.`);
    } catch (error) {
      toast.error("Failed to toggle the bookmark", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occured",
      });
    }
  };

  const handleForking = async (playgroundId: string) => {
    if (!user) {
      toast.error("You need to sign in to fork playgrounds.");
      return;
    }

    try {
      const forkedId = await forkPlayground(user, playgroundId || "");

      setFollowingPlaygrounds((prev) =>
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
            : "An unexpected error occurred",
      });
    }
  };

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Following</h1>
        <p className="text-sm text-muted-foreground">
          Playgrounds from creators you follow.
        </p>
        <div className="mb-2 mt-4 flex items-center justify-between">
          <div className="flex space-x-2 overflow-x-auto">
            {["A", "B", "C", "D", "E"].map((letter, i) => (
              <AvatarIcon
                className="h-12 w-12"
                key={i}
                userName={letter}
                photoURL={`https://i.pravatar.cc/150?img=${i + 10}`}
              />
            ))}
          </div>
          <Button variant={"outline"}>Manage</Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PlaygroundSkeleton key={i} />
          ))}
        </div>
      ) : followingPlaygrounds.length === 0 ? (
        <div className="flex h-80 flex-col items-center justify-center">
          <h3 className="text-lg font-medium">No followed playgrounds</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Follow other users to discover their public playgrounds.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {followingPlaygrounds.map((playground) => (
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
