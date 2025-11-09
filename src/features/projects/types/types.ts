import type { Project } from "@/types/project.ts";

export type ViewerType = "creator" | "user" | "visitor";

export type EditorHeaderProjectInfo = {
  title: string;
  isPrivate: boolean;
  userId: string;
  userName: string;
  userPhoto: string | null;
  forkedFrom: string | null;
};

export type ProjectWithForkInfo = Project & { forkedFrom?: string | null };

export type ExploreProject = ProjectWithForkInfo & {
  authorDisplayName?: string | null;
};
