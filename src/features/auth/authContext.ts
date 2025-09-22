import { createContext } from "react";

import type {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  OAuthResponse,
  Session,
  UserResponse,
} from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  isPasswordRecovery: boolean;
  loading: boolean;
  signUpUser: (
    email: string,
    password: string,
    name: string,
  ) => Promise<AuthResponse>;
  signInUser: (
    email: string,
    password: string,
  ) => Promise<AuthTokenResponsePassword>;
  signOutUser: () => Promise<{ error: AuthError | null } | undefined>;
  sendResetPassword: (
    email: string,
  ) => Promise<
    { data: object; error: null } | { data: null; error: AuthError }
  >;
  updatePassword: (newPassword: string) => Promise<UserResponse>;
  signInWithGoogle: () => Promise<OAuthResponse>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
