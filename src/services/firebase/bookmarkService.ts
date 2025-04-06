import { User } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

import { Playground, PlaygroundMeta } from "@/types/firestore.ts";

import { db } from "./firebaseConfig";
import { getForkCount } from "./playgroundService.ts";
import { getBasicUserInfo } from "./userService.ts";

const bookmarksCollection = collection(db, "bookmarks");
const playgroundsCollection = collection(db, "playgrounds");

const addBookmark = async (user: User, playgroundId: string) => {
  const playgroundRef = doc(db, "playgrounds", playgroundId);
  const playgroundSnap = await getDoc(playgroundRef);
  if (!playgroundSnap.exists()) throw new Error("Playground not found");

  const playground = playgroundSnap.data() as Playground;
  if (playground.userId == user.uid) {
    throw new Error("You can't bookmark your own playground");
  }

  const q = query(
    bookmarksCollection,
    where("userId", "==", user.uid),
    where("playgroundId", "==", playgroundId),
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) throw new Error("Playground already bookmarked");

  await addDoc(bookmarksCollection, {
    userId: user.uid,
    playgroundId,
    createdAt: Timestamp.now(),
  });
};

const removeBookmark = async (user: User, playgroundId: string) => {
  const q = query(
    bookmarksCollection,
    where("userId", "==", user.uid),
    where("playgroundId", "==", playgroundId),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("Bookmark not found");

  await deleteDoc(snapshot.docs[0].ref);
};

export const getBookmarkCount = async (
  playgroundId: string,
): Promise<number> => {
  const q = query(
    bookmarksCollection,
    where("playgroundId", "==", playgroundId),
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
};

export const isBookmarkedByUser = async (
  user: User,
  playgroundId: string,
): Promise<boolean> => {
  const q = query(
    bookmarksCollection,
    where("userId", "==", user.uid),
    where("playgroundId", "==", playgroundId),
    limit(1),
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const toggleBookmark = async (
  user: User,
  playgroundId: string,
  isBookmarked: boolean,
) => {
  if (isBookmarked) {
    await removeBookmark(user, playgroundId);
    return false;
  } else {
    await addBookmark(user, playgroundId);
    return true;
  }
};

export const getBookmarkedPlaygrounds = async (
  user: User,
): Promise<PlaygroundMeta[]> => {
  const q = query(bookmarksCollection, where("userId", "==", user.uid));
  const bookmarksSnap = await getDocs(q);

  const playgroundMetas: PlaygroundMeta[] = [];

  for (const bookmarkDoc of bookmarksSnap.docs) {
    const { playgroundId } = bookmarkDoc.data();

    const docRef = doc(playgroundsCollection, playgroundId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      playgroundMetas.push(createUnavailablePlayground(playgroundId));
      continue;
    }

    const playground = docSnap.data() as Playground;

    if (!playground.isPublic) {
      playgroundMetas.push(createUnavailablePlayground(playgroundId));
      continue;
    }

    const [bookmarkCount, forkCount] = await Promise.all([
      getBookmarkCount(playgroundId),
      getForkCount(playgroundId),
    ]);

    const { name, photoURL } = await getBasicUserInfo(playground.userId);

    playgroundMetas.push({
      id: docSnap.id,
      ...(playground as Omit<Playground, "id">),
      userName: name,
      userPhotoURL: photoURL,
      bookmarkCount,
      forkCount,
      isBookmarked: true,
    });
  }

  return playgroundMetas;
};

const createUnavailablePlayground = (id: string): PlaygroundMeta => ({
  id,
  userId: "",
  title: "Unavailable",
  html: "",
  css: "",
  js: "",
  isPublic: false,
  isForked: false,
  forkedFrom: null,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  userName: "Unknown",
  userPhotoURL: "",
  bookmarkCount: 0,
  forkCount: 0,
  isBookmarked: true,
  isUnavailable: true,
});
