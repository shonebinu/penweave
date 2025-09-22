import { type ReactNode, useEffect, useState } from "react";

import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/supabaseClient.ts";

import { AuthContext } from "./authContext.ts";
import {
  sendResetPassword as supabaseSendResetPassword,
  signInUser as supabaseSignIn,
  signInWithGoogle as supabaseSignInWithGoogle,
  signOutUser as supabaseSignOut,
  signUpUser as supabaseSignUp,
  updatePassword as supabaseUpdatePassword,
} from "./authService.ts";

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const signUpUser = async (email: string, password: string, name: string) =>
    await supabaseSignUp(email, password, name);

  const signInUser = async (email: string, password: string) =>
    await supabaseSignIn(email, password);

  const signOutUser = async () => {
    const result = await supabaseSignOut();
    if (result.error) {
      return result;
    }
    setSession(null);
  };

  const sendResetPassword = async (email: string) =>
    await supabaseSendResetPassword(email);

  const updatePassword = async (newPassword: string) =>
    await supabaseUpdatePassword(newPassword);

  const signInWithGoogle = async () => await supabaseSignInWithGoogle();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
      }
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        signUpUser,
        signInUser,
        signOutUser,
        sendResetPassword,
        isPasswordRecovery,
        updatePassword,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
