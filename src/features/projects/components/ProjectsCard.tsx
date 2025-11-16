import { formatDistanceToNowStrict } from "date-fns";
import { Lock, LockOpen, Pencil, Trash2 } from "lucide-react";

import type { ProjectWithForkAndLikeInfo } from "../types/types.ts";
import BaseProjectCard from "./BaseProjectCard.tsx";

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
    <BaseProjectCard project={project} actions={projectActions}>
      <div className="text-base-content/80 text-xs">
        Updated{" "}
        {formatDistanceToNowStrict(new Date(project.updated_at), {
          addSuffix: true,
        })}
      </div>
    </BaseProjectCard>
  );
}
