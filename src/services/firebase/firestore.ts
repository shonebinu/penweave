import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

import { Playground, PlaygroundMeta } from "@/types/firestore";

import { auth, db } from "./firebaseConfig";

const playgroundsCollection = collection(db, "playgrounds");
const bookmarksCollection = collection(db, "bookmarks");

const getUser = () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be authenticated");
  return user;
};

export const getUserData = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return { name: "Unknown User", photoURL: null };

  return userSnap.data();
};

export const addUserToFirestore = async () => {
  const user = getUser();

  const userRef = doc(db, "users", user.uid);
  await setDoc(
    userRef,
    {
      name: user.displayName || "Anonymous",
      email: user.email,
      photoURL: user.photoURL || null,
    },
    { merge: true },
  );
};

export const getUserPlaygrounds = async (): Promise<PlaygroundMeta[]> => {
  const user = getUser();

  const q = query(playgroundsCollection, where("userId", "==", user.uid));
  const snapshot = await getDocs(q);

  return await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const playground = docSnap.data() as Omit<Playground, "id">;
      const bookmarkCount = await getBookmarkCount(docSnap.id);

      const { name, photoURL } = await getUserData(playground.userId);

      return {
        id: docSnap.id,
        ...playground,
        userName: name,
        userPhotoURL: photoURL,
        bookmarkCount,
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
    isBookmarked,
  };
};

export const createPlayground = async (title: string) => {
  const user = getUser();

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
  const user = getUser();
  const docRef = doc(db, "playgrounds", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error("Playground not found");

  const playground = docSnap.data() as Playground;
  if (playground.userId !== user.uid) throw new Error("Unauthorized update");

  return await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
};

export const deletePlayground = async (id: string) => {
  const user = getUser();
  const docRef = doc(db, "playgrounds", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error("Playground not found");

  const playground = docSnap.data() as Playground;
  if (playground.userId !== user.uid) throw new Error("Unauthorized deletion");

  return await deleteDoc(docRef);
};

export const forkPlayground = async (playgroundId: string) => {
  const user = getUser();

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

      let isBookmarked: boolean | undefined = undefined;

      if (user && playground.userId !== user.uid)
        isBookmarked = await isBookmarkedByUser(docSnap.id);

      return {
        id: docSnap.id,
        ...playground,
        userName: name,
        userPhotoURL: photoURL,
        bookmarkCount,
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

export const addBookmark = async (playgroundId: string) => {
  const user = getUser();

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

export const removeBookmark = async (playgroundId: string) => {
  const user = getUser();

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
  const user = getUser();

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
