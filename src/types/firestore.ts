import { Timestamp } from "firebase/firestore";

export interface Playground {
  id: string;
  userId: string;
  title: string;
  html: string;
  css: string;
  js: string;
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PlaygroundWithUser extends Playground {
  userName: string;
  userPhotoURL: string | null;
}
