import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AvatarIcon from "@/components/AvatarIcon.tsx";
import PublicPlaygroundCard from "@/components/PublicPlaygroundCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import { getFulluserProfile } from "@/services/firebase/userService.ts";
import { UserMeta } from "@/types/firestore.ts";

export default function User() {
  const { userId } = useParams();
  const [user, setUser] = useState<UserMeta | null>(null);
  const { user: authenticatedUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
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

  return (
    <main className="space-y-6 p-6">
      {user && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <AvatarIcon
              photoURL={user?.photoURL}
              userName={user?.name}
              className="h-24 w-24"
            />
            <p className="text-lg font-medium">
              <span className="text-muted-foreground">@</span>
              {user?.name}
            </p>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <p>50 followers</p>
              <p>0 following</p>
            </div>
            <Button className="pw-button">
              <UserPlus />
              Follow
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Public Playgrounds{" "}
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
                    onToggleBookmark={() => true}
                    onFork={() => true}
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
