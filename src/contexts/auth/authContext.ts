import { User } from "firebase/auth";

import { createContext } from "react";

type AuthContextType = {
  currentUser: User | null;
  userLoggedIn: boolean;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
