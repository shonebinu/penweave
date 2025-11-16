import { format } from "date-fns";
import { UserRoundPlus, UserRoundX } from "lucide-react";

import { useParams, useSearchParams } from "react-router";

import LoadingScreen from "@/components/LoadingScreen.tsx";
import UserAvatar from "@/components/UserAvatar.tsx";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import ExploreCard from "@/features/projects/components/ExploreCard.tsx";
import Pagination from "@/features/projects/components/Pagination.tsx";

import ActionButton from "../components/ActionButton.tsx";
import { useExploreProjects } from "../hooks/useExploreProjects.ts";

export default function Users() {
  const { userId: exploreUserId } = useParams();
  const { session } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 8;

  const {
    profile,
    loading,
    projects,
    totalProjectsCount,
    forkingId,
    forkProject,
    followInfo,
    toggleLikeId,
    toggleFollow,
    togglingFollow,
    toggleLike,
  } = useExploreProjects(session?.user.id, page, pageSize, "", exploreUserId);

  const totalPages = Math.ceil(totalProjectsCount / pageSize);

  if (loading || !profile) return <LoadingScreen />;

  return (
    <>
      <div className="mt-5 flex justify-center">
        <UserAvatar
          displayName={profile.display_name}
          avatarUrl={profile.avatar_url || undefined}
        />
      </div>
      <div className="mt-3 flex flex-col items-center justify-center">
        <div className="flex items-center gap-1">
          <h2 className="text-xl font-bold">{profile.display_name}</h2>
          {profile.user_id === session?.user.id && (
            <span className="badge badge-soft">You</span>
          )}
        </div>
        <p className="text-base-content/80 text-sm">
          Joined on: {format(new Date(profile.created_at), "dd MMM yyyy")}
        </p>
        {profile.user_id !== session?.user.id && followInfo && (
          <ActionButton
            onClick={toggleFollow}
            className={`btn mt-2 ${!followInfo.userFollows && "btn-primary"}`}
            loading={togglingFollow}
            icon={!followInfo.userFollows ? UserRoundPlus : UserRoundX}
          >
            {followInfo.userFollows ? "Unfollow" : "Follow"}
          </ActionButton>
        )}
      </div>
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {!projects || projects.length === 0 ? (
          <div className="col-span-full">
            User doesn't have any public projects.
          </div>
        ) : (
          projects.map((project) => (
            <ExploreCard
              key={project.id}
              project={project}
              forking={forkingId === project.id}
              togglingLike={toggleLikeId === project.id}
              onForkProject={() => forkProject(project.id)}
              onToggleLike={() => toggleLike(project.id)}
              author={session?.user.id === project.user_id}
            />
          ))
        )}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={(newPage) => {
          setSearchParams({ page: String(newPage) });
        }}
      />
    </>
  );
}
