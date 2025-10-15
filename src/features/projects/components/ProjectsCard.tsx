import { formatDistanceToNowStrict } from "date-fns";
import { Ellipsis, GitFork, MessageSquare, ThumbsUp } from "lucide-react";

import { Link } from "react-router";

import type { Project } from "@/shared/types/project.ts";

export function ProjectsCard({ project }: { project: Project }) {
  return (
    <div className="card bg-base-100 shadow-sm" key={project.title}>
      <figure className="bg-base-300 flex h-48 w-full items-center justify-center overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt="Project thumbnail"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm">No Thumbnail</span>
        )}
      </figure>

      <div className="card-body pt-3">
        <div className="flex items-center justify-between">
          <h2 className="card-title truncate">{project.title}</h2>
          <span
            className={`badge badge-soft ${project.is_public ? "badge-primary" : "badge-secondary"}`}
          >
            {project.is_public ? "Public" : "Private"}
          </span>
        </div>
        <p className="truncate">{project.description}</p>
        <span className="label">
          Updated{" "}
          {formatDistanceToNowStrict(new Date(project.updated_at), {
            addSuffix: true,
          })}
        </span>
        <div className="flex justify-between text-sm">
          <div className="badge badge-sm badge-soft p-3">
            <ThumbsUp size="1rem" />
            123
          </div>
          <div className="badge badge-sm badge-soft p-3">
            <MessageSquare size="1rem" />
            123
          </div>
          <div className="badge badge-sm badge-soft p-3">
            <GitFork size="1rem" />
            123
          </div>
        </div>
        <div className="card-actions mt-1 justify-end">
          <Link to={`/projects/${project.id}`}>
            <button className="btn">View</button>
          </Link>
          <Link to={`/projects/${project.id}/editor`}>
            <button className="btn">Open Editor</button>
          </Link>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-square">
              <Ellipsis />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <a>Edit Details</a>
              </li>
              <li>
                <a>Duplicate</a>
              </li>
              <li>
                <a>Delete</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
