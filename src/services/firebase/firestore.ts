import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

import { Playground, PlaygroundWithUser } from "@/types/firestore";

import { auth, db } from "./firebaseConfig";

const playgroundsCollection = collection(db, "playgrounds");

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

export const getUserPlaygrounds = async (): Promise<PlaygroundWithUser[]> => {
  const user = getUser();

  const q = query(playgroundsCollection, where("userId", "==", user.uid));
  const snapshot = await getDocs(q);

  return await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const playground = docSnap.data() as Omit<Playground, "id">;

      const { name, photoURL } = await getUserData(playground.userId);

      return {
        id: docSnap.id,
        ...playground,
        userName: name,
        userPhotoURL: photoURL,
      };
    }),
  );
};

export const getPlayground = async (
  id: string,
): Promise<PlaygroundWithUser> => {
  const user = getUser();

  const docRef = doc(db, "playgrounds", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error("Playground not found");

  const playground = docSnap.data() as Playground;

  if (!playground.isPublic && (!user || playground.userId !== user.uid))
    throw new Error("Unauthorized access");

  const { name, photoURL } = await getUserData(playground.userId);

  return {
    id: docSnap.id,
    ...(playground as Omit<Playground, "id">),
    userName: name,
    userPhotoURL: photoURL,
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
