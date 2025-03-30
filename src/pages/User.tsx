/*
Profile Picture

User Name

Follower Count / Following Count / Playground Count

Follow / Unfollow Button (if the user is not the current user)

skeleton loading

if no playgrounds. show empty text
*/
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AvatarIcon from "@/components/AvatarIcon.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { getUserById } from "@/services/firebase/userService.ts";
import { UserType } from "@/types/firestore.ts";

export default function User() {
  const { userId } = useParams();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUserById(userId || "");
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
  }, [userId]);

  return (
    <main className="space-y-6 p-6">
      {user && (
        <div>
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
          </div>
        </div>
      )}
      <Toaster richColors />
    </main>
  );
}
