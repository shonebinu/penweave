import { doc, getDoc } from "firebase/firestore";

import { db } from "./firebaseConfig.ts";

export const getUserData = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return { name: "Unknown User", photoURL: null };

  return userSnap.data();
};
