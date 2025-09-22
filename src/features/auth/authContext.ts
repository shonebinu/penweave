import { createContext } from "react";

import type { Session } from "@supabase/supabase-js";
import type { AuthResponse } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signUpUser: (
    email: string,
    password: string,
    name: string,
  ) => Promise<AuthResponse>;
  signInUser: (email: string, password: string) => Promise<AuthResponse>;
  signOutUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
