import { GitFork, UserRound } from "lucide-react";

import { Link } from "react-router";

import type { ProjectInfo } from "../types/types.ts";

export default function EditorProjectInfo({
  projectInfo,
}: {
  projectInfo: ProjectInfo;
}) {
  return (
    <div className="flex flex-col">
      <p className="truncate font-medium">{projectInfo.title}</p>
      <div className="flex items-center gap-2">
        <div
          className="tooltip tooltip-bottom"
          data-tip="View creator's profile"
        >
          <Link
            to={"/users/" + projectInfo.userId}
            className="link label truncate text-sm"
          >
            <UserRound size=".9rem" />
            {projectInfo.userName}
          </Link>
        </div>
        {projectInfo.forkedFrom && (
          <div className="tooltip tooltip-bottom" data-tip="View fork origin">
            <Link
              to={"/projects/" + projectInfo.forkedFrom}
              className="label link truncate text-sm"
            >
              <GitFork size=".9rem" />
              Forked from
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
