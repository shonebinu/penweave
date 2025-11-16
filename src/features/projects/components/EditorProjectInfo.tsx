import { GitFork, Heart, UserRound } from "lucide-react";

import { Link } from "react-router";

import type { EditorHeaderProjectInfo } from "../types/types.ts";

export default function EditorProjectInfo({
  projectInfo,
}: {
  projectInfo: EditorHeaderProjectInfo;
}) {
  return (
    <div className="mr-2 flex flex-col">
      <div className="flex items-center gap-1.5">
        <p className="line-clamp-1 font-medium">{projectInfo.title}</p>{" "}
        <span
          className="badge badge-sm badge-accent badge-soft ml-auto"
          title="Number of likes"
        >
          <Heart size=".9rem" className="shrink-0" />
          {projectInfo.likeCount}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to={"/users/" + projectInfo.userId}
          className="link text-base-content/80 flex items-center gap-0.5 text-sm"
          title="View creator's profile"
        >
          <UserRound size=".9rem" className="shrink-0" />
          <p className="line-clamp-1">{projectInfo.userName}</p>
        </Link>

        {projectInfo.forkedFrom && (
          <Link
            to={"/projects/" + projectInfo.forkedFrom}
            className="link text-base-content/80 flex items-center gap-0.5 text-sm"
            title="View fork origin"
          >
            <GitFork size=".9rem" className="shrink-0" />
            <p className="whitespace-nowrap">Forked from</p>
          </Link>
        )}
      </div>
    </div>
  );
}
