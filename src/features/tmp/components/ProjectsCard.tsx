import { formatDistanceToNowStrict } from "date-fns";
import { Lock, Trash2 } from "lucide-react";

import { Link } from "react-router";

import type { Project } from "@/features/projects/types/project";

export default function ProjectsCard({ project }: { project: Project }) {
  return (
    <div className="card bg-base-100 shadow-sm" key={project.title}>
      <figure className="bg-base-300 flex h-48 w-full items-center justify-center overflow-hidden">
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

      <div className="card-body pt-3">
        <div className="flex items-center justify-between">
          <Link to={"/projects/" + project.id}>
            <h2 className="card-title truncate">{project.title}</h2>
          </Link>
          <span className="badge badge-soft">
            {!project.is_private ? "Public" : "Private"}
          </span>
        </div>
        <span className="label">
          Updated{" "}
          {formatDistanceToNowStrict(new Date(project.updated_at), {
            addSuffix: true,
          })}
        </span>
        <div className="card-actions mt-1 justify-end">
          <button className="btn btn-square">
            <Lock size="1rem" />
          </button>
          <button className="btn btn-square">
            <Trash2 size="1rem" />
          </button>
        </div>
      </div>
    </div>
  );
}
