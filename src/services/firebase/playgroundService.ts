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
import { auth, db } from "./firebaseConfig.ts";
import { getAuthenticatedUserOrThrow, getUserData } from "./firebaseService.ts";

const playgroundsCollection = collection(db, "playgrounds");

export const createPlayground = async (title: string) => {
  const user = getAuthenticatedUserOrThrow();

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
  id: string,
  updates: Partial<Omit<Playground, "id" | "userId" | "createdAt">>,
) => {
  const user = getAuthenticatedUserOrThrow();
  const docRef = doc(db, "playgrounds", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error("Playground not found");

  const playground = docSnap.data() as Playground;
  if (playground.userId !== user.uid) throw new Error("Unauthorized update");

  return await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
};

export const deletePlayground = async (id: string) => {
  const user = getAuthenticatedUserOrThrow();
  const docRef = doc(db, "playgrounds", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error("Playground not found");

  const playground = docSnap.data() as Playground;
  if (playground.userId !== user.uid) throw new Error("Unauthorized deletion");

  return await deleteDoc(docRef);
};

export const forkPlayground = async (playgroundId: string) => {
  const user = getAuthenticatedUserOrThrow();

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
    title: `${originalPlayground.title} fork`,
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
  searchString: string = "",
): Promise<PlaygroundMeta[]> => {
  const user = auth.currentUser;

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
        isBookmarked = await isBookmarkedByUser(docSnap.id);

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

export const getUserPlaygrounds = async (): Promise<PlaygroundMeta[]> => {
  const user = getAuthenticatedUserOrThrow();

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

export const getPlayground = async (id: string): Promise<PlaygroundMeta> => {
  const user = auth.currentUser;

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
    isBookmarked = await isBookmarkedByUser(id);
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
