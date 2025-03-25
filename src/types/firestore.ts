import { Timestamp } from "firebase/firestore";

export interface Playground {
  id: string;
  userId: string;
  title: string;
  html: string;
  css: string;
  js: string;
  isPublic: boolean;
  isForked: boolean;
  forkedFrom: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PlaygroundMeta extends Playground {
  userName: string;
  userPhotoURL: string | null;
  bookmarkCount: number;
  forkCount: number;
  isBookmarked?: boolean;
  isUnavailable?: boolean;
}
