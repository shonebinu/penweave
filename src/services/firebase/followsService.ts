import { User } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebaseConfig.ts";
import { createNotification } from "./notification.ts";

const followsCollection = collection(db, "follows");

export const followUser = async (followerId: string, followingId: string) => {
  if (followerId === followingId) throw new Error("You can't follow yourself");

  const q = query(
    followsCollection,
    where("followerId", "==", followerId),
    where("followingId", "==", followingId),
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) throw new Error("Already following");

  await addDoc(followsCollection, {
    followerId,
    followingId,
    createdAt: Timestamp.now(),
  });

  await createNotification({
    userId: followingId,
    fromUserId: followerId,
    type: "follow",
  });
};

export const isFollowing = async (currentUser: User, userId: string) => {
  if (currentUser.uid === userId) return false;

  const q = query(
    followsCollection,
    where("followerId", "==", currentUser.uid),
    where("followingId", "==", userId),
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  if (followerId === followingId)
    throw new Error("You can't unfollow yourself");

  const q = query(
    followsCollection,
    where("followerId", "==", followerId),
    where("followingId", "==", followingId),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("Follow relationship not found");

  await deleteDoc(snapshot.docs[0].ref);
};

export const toggleFollow = async (
  currentUser: User,
  userIdToFollow: string,
  isCurrentlyFollowing: boolean,
): Promise<boolean> => {
  if (currentUser.uid === userIdToFollow)
    throw new Error("You can't follow yourself");

  if (isCurrentlyFollowing) {
    await unfollowUser(currentUser.uid, userIdToFollow);
    return false;
  } else {
    await followUser(currentUser.uid, userIdToFollow);
    return true;
  }
};

export const getFollowerCount = async (userId: string): Promise<number> => {
  const q = query(followsCollection, where("followingId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.size;
};

export const getFollowingCount = async (userId: string): Promise<number> => {
  const q = query(followsCollection, where("followerId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.size;
};
