import type { Project } from "@/types/project.ts";

export type ViewerType = "creator" | "user" | "visitor";

export type EditorHeaderProjectInfo = {
  title: string;
  isPrivate: boolean;
  userId: string;
  userName: string;
  userPhoto: string | null;
  forkedFrom: string | null;
  likeCount: number;
};

export type ProjectWithForkAndLikeInfo = Project & {
  forkedFrom?: string | null;
  likeCount: number;
};

export type ExploreProject = ProjectWithForkAndLikeInfo & {
  authorDisplayName: string | null;
  isLikedByCurrentUser: boolean;
};
