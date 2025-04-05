import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { UserMeta, UserType } from "@/types/firestore.ts";

import { db } from "./firebaseConfig.ts";
import { getUserPublicPlaygrounds } from "./playgroundService.ts";

export const addUserToFirestore = async (user: User) => {
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

export const getUserById = async (
  user: User | null,
  userId: string,
): Promise<UserMeta> => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) throw new Error("User not found");

  const userData = userSnap.data() as Omit<UserType, "id">;

  const publicPlaygrounds = await getUserPublicPlaygrounds(user, userId);

  return {
    id: userSnap.id,
    ...userData,
    publicPlaygrounds,
  };
};
