import { createContext } from "react";

import { AuthContextType } from "@/types/firestore.ts";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
