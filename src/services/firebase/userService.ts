import { doc, getDoc, setDoc } from "firebase/firestore";

import { UserType } from "@/types/firestore.ts";

import { db } from "./firebaseConfig.ts";
import { getAuthenticatedUserOrThrow } from "./firebaseService.ts";

export const addUserToFirestore = async () => {
  const user = await getAuthenticatedUserOrThrow();

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

export const getUserById = async (userId: string): Promise<UserType> => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) throw new Error("User not found");

  const userData = userSnap.data() as Omit<UserType, "id">;

  return { id: userSnap.id, ...userData };
};
