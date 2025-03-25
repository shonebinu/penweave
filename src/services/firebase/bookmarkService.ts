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

import { Playground } from "@/types/firestore.ts";

import { db } from "./firebaseConfig";
import { getAuthenticatedUserOrThrow } from "./firebaseService";

const bookmarksCollection = collection(db, "bookmarks");

const addBookmark = async (playgroundId: string) => {
  const user = getAuthenticatedUserOrThrow();

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

const removeBookmark = async (playgroundId: string) => {
  const user = getAuthenticatedUserOrThrow();

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
  playgroundId: string,
): Promise<boolean> => {
  const user = getAuthenticatedUserOrThrow();

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
  playgroundId: string,
  isBookmarked: boolean,
) => {
  if (isBookmarked) {
    await removeBookmark(playgroundId);
    return false;
  } else {
    await addBookmark(playgroundId);
    return true;
  }
};
