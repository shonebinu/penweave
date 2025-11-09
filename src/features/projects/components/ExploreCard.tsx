import { GitFork, UserRound } from "lucide-react";

import { Link } from "react-router";

import type { ExploreProject } from "../types/types.ts";
import ActionButton from "./ActionButton.tsx";
import CopyProjectLinkButton from "./CopyProjectLinkButton.tsx";

export default function ExploreCard({
  project,
  forking,
  onForkProject,
  author,
}: {
  project: ExploreProject;
  forking: boolean;
  onForkProject: () => void;
  author: boolean;
}) {
  const exploreActions = [
    {
      onClick: onForkProject,
      loading: forking,
      icon: GitFork,
      tooltip: "Fork project",
      className: "btn-square btn join-item btn-soft",
    },
  ];

  return (
    <div className="card bg-base-100 shadow">
      <figure className="bg-base-200 h-48 overflow-hidden">
        <Link
          to={"/projects/" + project.id}
          className="flex h-full w-full items-center justify-center"
        >
          {project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt="Project thumbnail"
              className="h-full w-full object-cover object-left-top"
            />
          ) : (
            <span className="text-sm">No Thumbnail</span>
          )}
        </Link>
      </figure>

      <div className="card-body">
        <div>
          <Link to={"/projects/" + project.id}>
            <h2 className="card-title line-clamp-1" title={project.title}>
              {project.title}
            </h2>
          </Link>
          {project.forkedFrom && (
            <Link
              to={project.forkedFrom}
              className="link text-base-content/80 flex items-center gap-1"
            >
              <GitFork size=".9rem" className="shrink-0" />
              Forked from
            </Link>
          )}
        </div>
        {project.authorDisplayName && (
          <div className="flex justify-between">
            <Link
              to={"/users/" + project.user_id}
              className="link text-base-content/80 flex items-center gap-0.5"
            >
              <UserRound size=".9rem" className="shrink-0" />
              {project.authorDisplayName}
            </Link>
            <div>
              {author && <span className="badge badge-soft badge-sm">You</span>}
            </div>
          </div>
        )}
        <div className="card-actions mt-auto">
          <CopyProjectLinkButton projectId={project.id} />

          <div className="ml-auto">
            {!author && (
              <div className="join">
                {exploreActions.map((props, i) => (
                  <ActionButton key={i} {...props} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
