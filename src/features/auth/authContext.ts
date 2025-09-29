import { createContext } from "react";

import type { Session } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  isPasswordRecovery: boolean;
  loading: boolean;
  signUpUser: (email: string, password: string, name: string) => Promise<void>;
  signInUser: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  sendResetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
