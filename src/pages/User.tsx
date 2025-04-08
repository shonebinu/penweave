import { Loader2, UserMinus, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AvatarIcon from "@/components/AvatarIcon.tsx";
import PublicPlaygroundCard from "@/components/PublicPlaygroundCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import { toggleBookmark } from "@/services/firebase/bookmarkService.ts";
import { toggleFollow } from "@/services/firebase/followsService.ts";
import { forkPlayground } from "@/services/firebase/playgroundService.ts";
import { getFulluserProfile } from "@/services/firebase/userService.ts";
import { UserMeta } from "@/types/firestore.ts";

// TODO: Add loading skeleton

export default function User() {
  const { userId } = useParams();
  const [user, setUser] = useState<UserMeta | null>(null);
  const { user: authenticatedUser } = useAuth();
  const navigate = useNavigate();
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!authenticatedUser) {
        toast.error("User should be signed in.");
        return;
      }

      try {
        const fetchedUser = await getFulluserProfile(
          authenticatedUser,
          userId || "",
        );
        setUser(fetchedUser);
      } catch (error) {
        toast.error("Failed to fetch the user", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      }
    };

    fetchUser();
  }, [userId, authenticatedUser]);

  const handleForking = async (playgroundId: string) => {
    if (!authenticatedUser) {
      toast.error("You need to sign in to bookmark playgrounds.");
      return;
    }

    try {
      const forkedId = await forkPlayground(authenticatedUser, playgroundId);

      setUser((curr) => {
        if (!curr || !curr.publicPlaygrounds) return curr;

        const newPlaygrounds = curr.publicPlaygrounds.map((pg) =>
          pg.id === playgroundId ? { ...pg, forkCount: pg.forkCount + 1 } : pg,
        );
        return { ...curr, publicPlaygrounds: newPlaygrounds };
      });

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

  const handleToggleBookmark = async (
    playgroundId: string,
    isBookmarked: boolean,
  ) => {
    if (!authenticatedUser) {
      toast.error("You need to sign in to bookmark playgrounds.");
      return;
    }

    try {
      const newState = await toggleBookmark(
        authenticatedUser,
        playgroundId,
        isBookmarked,
      );

      setUser((curr) => {
        if (!curr || !curr.publicPlaygrounds) return curr;

        const newPlaygrounds = curr.publicPlaygrounds.map((pg) =>
          pg.id === playgroundId
            ? {
                ...pg,
                isBookmarked: newState,
                bookmarkCount: newState
                  ? pg.bookmarkCount + 1
                  : pg.bookmarkCount - 1,
              }
            : pg,
        );

        return { ...curr, publicPlaygrounds: newPlaygrounds };
      });

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

  const handleToggleFollow = async () => {
    if (!authenticatedUser) {
      toast.error("You need to sign in to follow and unfollow.");
      return;
    }

    if (!user) {
      toast.error("User to follow isn't recognizable");
      return;
    }

    setIsFollowLoading(true);

    try {
      const newState = await toggleFollow(
        authenticatedUser,
        user.id,
        user.currentUserFollowing,
      );

      setUser((curr) => {
        if (!curr) return curr;
        return {
          ...curr,
          currentUserFollowing: newState,
          followerCount: curr.followerCount + (newState ? 1 : -1),
        };
      });

      toast.success(`Succesfully ${newState ? "followed" : "unfollowed"}`);
    } catch (error) {
      toast.error(
        `Failed to ${user.currentUserFollowing ? "unfollow" : "follow"}`,
        {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occured",
        },
      );
    } finally {
      setIsFollowLoading(false);
    }
  };

  return (
    <main className="space-y-6 p-6">
      {user && authenticatedUser && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <AvatarIcon
              photoURL={user.photoURL}
              userName={user.name}
              className="h-24 w-24"
            />
            <p className="text-lg font-medium">
              <span className="text-muted-foreground">@</span>
              {user.name}
            </p>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <p>{user.followerCount} followers</p>
              <p>{user.followingCount} following</p>
            </div>
            {authenticatedUser.uid !== user.id && (
              <Button
                className={user.currentUserFollowing ? "" : "pw-button"}
                variant={user.currentUserFollowing ? "outline" : "default"}
                onClick={handleToggleFollow}
                disabled={isFollowLoading}
              >
                {isFollowLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {user.currentUserFollowing ? "Unfollowing" : "Following"}
                  </>
                ) : user.currentUserFollowing ? (
                  <>
                    <UserMinus />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus />
                    Follow
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 font-bold">
              <span className="text-xl tracking-tight">
                Public Playgrounds{" "}
              </span>
              <span className="text-base text-muted-foreground">
                ( {user.publicPlaygrounds.length} )
              </span>
            </h2>
            {user.publicPlaygrounds ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {user.publicPlaygrounds.map((playground) => (
                  <PublicPlaygroundCard
                    key={playground.id}
                    playground={playground}
                    onToggleBookmark={handleToggleBookmark}
                    onFork={handleForking}
                    isOwner={authenticatedUser?.uid === playground.userId}
                  />
                ))}
              </div>
            ) : (
              <p>User doesn't have any public playgrounds</p>
            )}
          </div>
        </div>
      )}
      <Toaster richColors />
    </main>
  );
}
