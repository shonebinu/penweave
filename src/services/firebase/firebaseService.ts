import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "./firebaseConfig.ts";

export const getAuthenticatedUserOrThrow = async () => {
  await auth.authStateReady();
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
