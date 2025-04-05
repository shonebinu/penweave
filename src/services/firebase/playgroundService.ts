import { User } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { Playground, PlaygroundMeta } from "@/types/firestore.ts";

import { getBookmarkCount, isBookmarkedByUser } from "./bookmarkService.ts";
import { db } from "./firebaseConfig.ts";
import { getUserData } from "./firebaseService.ts";

const playgroundsCollection = collection(db, "playgrounds");

export const createPlayground = async (user: User, title: string) => {
  const newPlayground: Omit<Playground, "id"> = {
    userId: user.uid,
    title,
    html: "<!-- Everything inside <body> tag goes here -->",
    css: "",
    js: "",
    isPublic: false,
    isForked: false,
    forkedFrom: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  return await addDoc(playgroundsCollection, newPlayground);
};

export const updatePlayground = async (
  user: User,
  id: string,
  updates: Partial<Omit<Playground, "id" | "userId" | "createdAt">>,
) => {
  const docRef = doc(db, "playgrounds", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error("Playground not found");

  const playground = docSnap.data() as Playground;
  if (playground.userId !== user.uid) throw new Error("Unauthorized update");

  return await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
};

export const deletePlayground = async (user: User, id: string) => {
  const docRef = doc(db, "playgrounds", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error("Playground not found");

  const playground = docSnap.data() as Playground;
  if (playground.userId !== user.uid) throw new Error("Unauthorized deletion");

  return await deleteDoc(docRef);
};

export const forkPlayground = async (user: User, playgroundId: string) => {
  const originalPlaygroundRef = doc(db, "playgrounds", playgroundId);
  const originalPlaygroundSnap = await getDoc(originalPlaygroundRef);

  if (!originalPlaygroundSnap.exists()) {
    throw new Error("Original playground not found.");
  }

  const originalPlayground = originalPlaygroundSnap.data();

  if (!originalPlayground.isPublic) {
    throw new Error("Cannot fork a private playground.");
  }

  const newPlaygroundData = {
    ...originalPlayground,
    title: originalPlayground.title,
    userId: user.uid,
    userName: user.displayName,
    isPublic: false,
    isForked: true,
    forkedFrom: playgroundId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(playgroundsCollection, newPlaygroundData);
  return docRef.id;
};

export const getForkCount = async (playgroundId: string): Promise<number> => {
  const q = query(
    playgroundsCollection,
    where("forkedFrom", "==", playgroundId),
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
};

export const getPublicPlaygrounds = async (
  user: User | null,
  searchString: string = "",
): Promise<PlaygroundMeta[]> => {
  const q = query(playgroundsCollection, where("isPublic", "==", true));
  const snapshot = await getDocs(q);

  const playgrounds = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const playground = docSnap.data() as Omit<Playground, "id">;
      const { name, photoURL } = await getUserData(playground.userId);
      const bookmarkCount = await getBookmarkCount(docSnap.id);
      const forkCount = await getForkCount(docSnap.id);

      let isBookmarked: boolean | undefined = undefined;

      if (user && playground.userId !== user.uid)
        isBookmarked = await isBookmarkedByUser(user, docSnap.id);

      return {
        id: docSnap.id,
        ...playground,
        userName: name,
        userPhotoURL: photoURL,
        bookmarkCount,
        forkCount,
        isBookmarked,
      };
    }),
  );

  if (searchString.trim()) {
    const lowerSearch = searchString.toLowerCase();
    return playgrounds.filter((pg) =>
      pg.title.toLowerCase().includes(lowerSearch),
    );
  }

  return playgrounds;
};

export const getUserPlaygrounds = async (
  user: User,
): Promise<PlaygroundMeta[]> => {
  const q = query(playgroundsCollection, where("userId", "==", user.uid));
  const snapshot = await getDocs(q);

  return await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const playground = docSnap.data() as Omit<Playground, "id">;
      const bookmarkCount = await getBookmarkCount(docSnap.id);
      const forkCount = await getForkCount(docSnap.id);

      const { name, photoURL } = await getUserData(playground.userId);

      return {
        id: docSnap.id,
        ...playground,
        userName: name,
        userPhotoURL: photoURL,
        bookmarkCount,
        forkCount,
      };
    }),
  );
};

export const getPlayground = async (
  user: User,
  id: string,
): Promise<PlaygroundMeta> => {
  const docRef = doc(db, "playgrounds", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error("Playground not found");

  const playground = docSnap.data() as Playground;

  if (!playground.isPublic) {
    if (!user || playground.userId !== user.uid)
      throw new Error("Unauthorized access");
  }

  const { name, photoURL } = await getUserData(playground.userId);
  const bookmarkCount = await getBookmarkCount(id);
  const forkCount = await getForkCount(id);

  let isBookmarked: boolean | undefined = undefined;

  if (user) {
    isBookmarked = await isBookmarkedByUser(user, id);
  }

  return {
    id: docSnap.id,
    ...(playground as Omit<Playground, "id">),
    userName: name,
    userPhotoURL: photoURL,
    bookmarkCount,
    forkCount,
    isBookmarked,
  };
};

export const getUserPublicPlaygrounds = async (
  currentUser: User | null,
  userId: string,
): Promise<PlaygroundMeta[]> => {
  const q = query(
    playgroundsCollection,
    where("isPublic", "==", true),
    where("userId", "==", userId),
  );

  const snapshot = await getDocs(q);

  const playgrounds = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const playground = docSnap.data() as Omit<Playground, "id">;
      const { name, photoURL } = await getUserData(playground.userId);
      const bookmarkCount = await getBookmarkCount(docSnap.id);
      const forkCount = await getForkCount(docSnap.id);

      let isBookmarked: boolean | undefined = undefined;

      if (currentUser && playground.userId !== currentUser.uid)
        isBookmarked = await isBookmarkedByUser(currentUser, docSnap.id);

      return {
        id: docSnap.id,
        ...playground,
        userName: name,
        userPhotoURL: photoURL,
        bookmarkCount,
        forkCount,
        isBookmarked,
      };
    }),
  );

  return playgrounds;
};
