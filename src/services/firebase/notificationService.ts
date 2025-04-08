import { User } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { NotificationMeta } from "@/types/firestore.ts";
import { Notification } from "@/types/firestore.ts";

import { db } from "./firebaseConfig.ts";

type NotificationType = "follow" | "fork";

const notificationsCollection = collection(db, "notifications");

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
  } as Notification);
};

export const subscribeToUserNotifications = (
  user: User,
  onUpdate: (notifications: NotificationMeta[]) => void,
) => {
  const q = query(
    notificationsCollection,
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc"),
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const docs = snapshot.docs;

    const enrichedNotifs = await Promise.all(
      docs.map(async (docSnap) => {
        const notif = {
          id: docSnap.id,
          ...docSnap.data(),
        } as Notification;

        let fromUserName = "";
        let fromUserPhotoURL = "";

        const fromUserDoc = await getDoc(doc(db, "users", notif.fromUserId));
        if (fromUserDoc.exists()) {
          const data = fromUserDoc.data();
          fromUserName = data.name;
          fromUserPhotoURL = data.photoURL;
        }

        return {
          ...notif,
          fromUserName,
          fromUserPhotoURL,
        } as NotificationMeta;
      }),
    );

    onUpdate(enrichedNotifs);
  });

  return unsubscribe;
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const q = query(
    notificationsCollection,
    where("userId", "==", userId),
    where("read", "==", false),
  );

  const snapshot = await getDocs(q);

  const updates = snapshot.docs.map((docSnap) =>
    updateDoc(docSnap.ref, { read: true, viewedAt: Timestamp.now() }),
  );

  await Promise.all(updates);
};
