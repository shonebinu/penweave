import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { auth } from "./firebaseConfig.ts";

export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string,
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  await sendEmailVerification(user);

  return user;
};

export const doSignInWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;

  if (!user.emailVerified)
    throw new Error("Please verify your email before signing in");

  return userCredential;
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result;
};

export const doSignOut = async () => {
  return auth.signOut();
};
