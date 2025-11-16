import { GitFork, Heart } from "lucide-react";

import { Link } from "react-router";

import ActionButton from "./ActionButton.tsx";
import CopyProjectLinkButton from "./CopyProjectLinkButton.tsx";

type BaseProjectCardProps = {
  project: {
    id: string;
    title: string;
    thumbnail_url?: string | null;
    forkedFrom?: string | null;
    likeCount: number;
  };
  actions?: {
    onClick: () => void;
    loading: boolean;
    icon: React.ElementType;
    tooltip: string;
    className: string;
    iconFill?: string;
  }[];
  children?: React.ReactNode;
};

export default function BaseProjectCard({
  project,
  actions = [],
  children,
}: BaseProjectCardProps) {
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

        {children}

        <div className="card-actions mt-auto">
          <CopyProjectLinkButton projectId={project.id} />
          {actions.length > 0 && (
            <div className="ml-auto">
              <div className="join">
                {actions.map((props, i) => (
                  <ActionButton key={i} {...props} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
