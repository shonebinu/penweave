import { formatDistanceToNowStrict } from "date-fns";
import { GitFork, Lock, LockOpen, Pencil, Trash2 } from "lucide-react";

import { Link } from "react-router";

import type { ProjectWithForkInfo } from "../types/types.ts";
import ActionButton from "./ActionButton.tsx";

export default function ProjectCard({
  project,
  onEditTitle,
  onDeleteProject,
  toggleVisibility,
  togglingVisibility,
  titleEditing,
  deleting,
}: {
  project: ProjectWithForkInfo;
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
      className: "btn-square btn join-item btn-soft hover:btn-warning",
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
    <div className="card bg-base-100 shadow" key={project.id}>
      <Link to={"/projects/" + project.id}>
        <figure className="bg-base-200 flex h-48 w-full items-center justify-center overflow-hidden">
          {project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt="Project thumbnail"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm">No Thumbnail</span>
          )}
        </figure>
      </Link>
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
              className="link text-base-content/60 flex items-center gap-1"
            >
              <GitFork size=".9rem" className="shrink-0" />
              Forked from
            </Link>
          )}
        </div>
        <div>
          Updated{" "}
          {formatDistanceToNowStrict(new Date(project.updated_at), {
            addSuffix: true,
          })}
        </div>
        <div className="card-actions mt-auto justify-end">
          <div className="join">
            {projectActions.map((props, i) => (
              <ActionButton key={i} {...props} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
