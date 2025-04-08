import { useContext } from "react";

import { NotificationContext } from "@/contexts/notification/notificationContext.ts";

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within an NotificationProvider",
    );
  }
  return context;
}
