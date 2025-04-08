import { Timestamp, addDoc, collection } from "firebase/firestore";

import { db } from "./firebaseConfig.ts";

type NotificationType = "follow" | "fork";

const notificationsCollection = collection(db, "notification");

export const createNotification = async ({
  userId,
  fromUserId,
  type,
  playgroundId = null,
}: {
  userId: string;
  fromUserId: string;
  type: NotificationType;
  playgroundId?: string | null;
}) => {
  await addDoc(notificationsCollection, {
    userId,
    fromUserId,
    type,
    playgroundId: playgroundId || null,
    createdAt: Timestamp.now(),
    read: false,
  });
};
