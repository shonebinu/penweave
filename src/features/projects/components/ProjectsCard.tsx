import { formatDistanceToNowStrict } from "date-fns";
import { GitFork, Heart, Lock, LockOpen, Pencil, Trash2 } from "lucide-react";

import { Link } from "react-router";

import type { ProjectWithForkAndLikeInfo } from "../types/types.ts";
import ActionButton from "./ActionButton.tsx";
import CopyProjectLinkButton from "./CopyProjectLinkButton.tsx";

export default function ProjectsCard({
  project,
  onEditTitle,
  onDeleteProject,
  toggleVisibility,
  togglingVisibility,
  titleEditing,
  deleting,
}: {
  project: ProjectWithForkAndLikeInfo;
  onEditTitle: () => void;
  onDeleteProject: () => void;
  toggleVisibility: () => void;
  togglingVisibility: boolean;
  titleEditing: boolean;
  deleting: boolean;
}) {
  const projectActions = [
    {
      onClick: onEditTitle,
      loading: titleEditing,
      icon: Pencil,
      tooltip: "Edit title",
      className: "btn-square btn join-item btn-soft hover:btn-success",
    },
    {
      onClick: toggleVisibility,
      loading: togglingVisibility,
      icon: project.is_private ? Lock : LockOpen,
      tooltip: `Make ${project.is_private ? "public" : "private"}`,
      className:
        "btn-square btn join-item btn-soft hover:btn-warning hover:text-warning-content",
    },
    {
      onClick: onDeleteProject,
      loading: deleting,
      icon: Trash2,
      tooltip: "Delete project",
      className: "btn-square btn join-item btn-soft hover:btn-error",
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
          <div className="flex">
            {project.forkedFrom && (
              <Link
                to={project.forkedFrom}
                className="link text-base-content/80 flex items-center gap-1"
              >
                <GitFork size=".9rem" className="shrink-0" />
                Forked from
              </Link>
            )}
            <span className="badge badge-sm badge-accent badge-soft ml-auto">
              <Heart size=".9rem" className="shrink-0" />
              {project.likeCount}
            </span>
          </div>
        </div>
        <div className="text-base-content/80 text-xs">
          Updated{" "}
          {formatDistanceToNowStrict(new Date(project.updated_at), {
            addSuffix: true,
          })}
        </div>
        <div className="card-actions mt-auto">
          <CopyProjectLinkButton projectId={project.id} />

          <div className="ml-auto">
            <div className="join">
              {projectActions.map((props, i) => (
                <ActionButton key={i} {...props} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
