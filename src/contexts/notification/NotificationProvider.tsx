import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth.ts";
import { subscribeToUserNotifications } from "@/services/firebase/notificationService.ts";
import { NotificationMeta } from "@/types/firestore.ts";

import { NotificationContext } from "./notificationContext.ts";

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserNotifications(user, (notifs) => {
      setNotifications(notifs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <NotificationContext.Provider value={{ notifications, isLoading }}>
      {children}
    </NotificationContext.Provider>
  );
};
