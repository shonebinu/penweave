import { createContext } from "react";

import { NotificationContextType } from "@/types/firestore.ts";

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
