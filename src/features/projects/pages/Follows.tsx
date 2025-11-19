import { Rss, UsersRound } from "lucide-react";

import { Link, useSearchParams } from "react-router";

import LoadingScreen from "@/components/LoadingScreen.tsx";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";

import ExploreCard from "../components/ExploreCard.tsx";
import HeaderTitle from "../components/HeaderTitle.tsx";
import Pagination from "../components/Pagination.tsx";
import SearchBar from "../components/SearchBar.tsx";
import { useExploreProjects } from "../hooks/useExploreProjects.ts";

export default function Follows() {
  const { session } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 8;

  const searchQuery = searchParams.get("search") || "";

  const {
    projects,
    loading,
    totalProjectsCount,
    forkProject,
    toggleLikeId,
    forkingId,
    toggleLike,
  } = useExploreProjects(
    session?.user.id,
    page,
    pageSize,
    searchQuery,
    undefined,
    true,
  );

  const totalPages = Math.ceil(totalProjectsCount / pageSize);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <div className="mb-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <HeaderTitle
          icon={<Rss />}
          title="Follows"
          description="Creations of people you follow."
        />
        <Link to="manage">
          <button className="btn btn-primary">
            <UsersRound size="1rem" />
            Manage
          </button>
        </Link>
      </div>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={(newQuery) => {
          setSearchParams({ search: newQuery });
        }}
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {!projects || projects.length === 0 ? (
          <div className="col-span-full">
            No projects here! Follow other creators to get updates on their
            creations.
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
