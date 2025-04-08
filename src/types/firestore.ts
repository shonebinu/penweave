import { User } from "firebase/auth";
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

export interface UserType {
  id: string;
  name: string;
  email: string;
  photoURL: string;
}

export interface UserMeta extends UserType {
  publicPlaygrounds: PlaygroundMeta[];
  followerCount: number;
  followingCount: number;
  currentUserFollowing: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  fromUserId: string;
  type: "follow" | "fork";
  playgroundId: string | null;
  createdAt: Timestamp;
  read: boolean;
  viewedAt: Timestamp;
}

export interface NotificationMeta extends Notification {
  fromUserName: string;
  fromUserPhotoURL: string | null;
}

export interface NotificationContextType {
  notifications: NotificationMeta[];
  isLoading: boolean;
}

export interface CodeStateType {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  setHtmlCode: (code: string) => void;
  setCssCode: (code: string) => void;
  setJsCode: (code: string) => void;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}
