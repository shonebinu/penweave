import { UserRoundX, UsersRound } from "lucide-react";

import { Fragment } from "react/jsx-runtime";

import LoadingScreen from "@/components/LoadingScreen.tsx";
import UserAvatar from "@/components/UserAvatar.tsx";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";

import ActionButton from "../components/ActionButton.tsx";
import HeaderTitle from "../components/HeaderTitle.tsx";
import { useManageFollows } from "../hooks/useManageFollows.ts";

export default function ManageFollows() {
  const { session } = useAuth();

  const { loading, followingProfiles, unfollowCreator, unfollowingId } =
    useManageFollows(session?.user.id);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <div className="mb-3">
        <HeaderTitle
          icon={<UsersRound />}
          title="Manage Follows"
          description="Manage the creators you follow."
        />
      </div>
      {followingProfiles && followingProfiles.length === 0 ? (
        <p>You don't follow any creators yet!</p>
      ) : (
        <div className="mt-7 flex flex-col">
          {followingProfiles?.map((profile, i) => (
            <Fragment key={profile.user_id}>
              <div className="flex items-center justify-between">
                <a
                  href={"/users/" + profile.user_id}
                  className="link link-hover flex items-center gap-3"
                >
                  <UserAvatar
                    displayName={profile.display_name}
                    avatarUrl={profile.avatar_url || undefined}
                  />
                  <p> {profile.display_name}</p>
                </a>
                <ActionButton
                  className="btn"
                  onClick={() => unfollowCreator(profile.user_id)}
                  loading={unfollowingId === profile.user_id}
                  icon={UserRoundX}
                >
                  Unfollow
                </ActionButton>
              </div>
              {followingProfiles.length - 1 !== i && (
                <div className="divider"></div>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
}
