import { User } from "firebase/auth";

import { createContext } from "react";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
