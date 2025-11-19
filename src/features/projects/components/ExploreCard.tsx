import { Bookmark, GitFork, Heart, UserRound } from "lucide-react";

import { Link } from "react-router";

import type { ExploreProject } from "../types/types.ts";
import BaseProjectCard from "./BaseProjectCard.tsx";

export default function ExploreCard({
  project,
  forking,
  onForkProject,
  author,
  onToggleLike,
  togglingLike,
  togglingBookmark,
  onToggleBookmark,
}: {
  project: ExploreProject;
  forking: boolean;
  onForkProject: () => void;
  author: boolean;
  onToggleLike: () => void;
  togglingLike: boolean;
  togglingBookmark: boolean;
  onToggleBookmark: () => void;
}) {
  const exploreActions = !author
    ? [
        {
          onClick: onToggleLike,
          loading: togglingLike,
          icon: Heart,
          tooltip: !project.isLikedByCurrentUser
            ? "Like project"
            : "Remove like",
          className: "btn-square btn join-item btn-soft hover:btn-accent",
          iconFill: project.isLikedByCurrentUser ? "currentColor" : "none",
        },
        {
          onClick: onToggleBookmark,
          loading: togglingBookmark,
          icon: Bookmark,
          tooltip: !project.isBookmarkedByCurrentUser
            ? "Bookmark project"
            : "Remove bookmark",
          className: "btn-square btn join-item btn-soft hover:btn-info",
          iconFill: project.isBookmarkedByCurrentUser ? "currentColor" : "none",
        },
        {
          onClick: onForkProject,
          loading: forking,
          icon: GitFork,
          tooltip: "Fork project",
          className: "btn-square btn join-item btn-soft hover:btn-primary",
        },
      ]
    : [];

  return (
    <BaseProjectCard project={project} actions={exploreActions}>
      {project.authorDisplayName && (
        <div className="flex gap-2">
          <Link
            to={"/users/" + project.user_id}
            className="link text-base-content/80 flex items-center gap-0.5"
          >
            <UserRound size=".9rem" className="shrink-0" />
            {project.authorDisplayName}
          </Link>
          {author && <span className="badge badge-soft badge-sm">You</span>}
        </div>
      )}
    </BaseProjectCard>
  );
}
