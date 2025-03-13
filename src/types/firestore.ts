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
