import { doc, setDoc } from "firebase/firestore";

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
