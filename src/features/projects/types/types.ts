export type ViewerType = "creator" | "user" | "visitor";

export type ProjectInfo = {
  title: string;
  isPrivate: boolean;
  userId: string;
  userName: string;
  userPhoto: string | null;
  forkedFrom: string | null;
};
