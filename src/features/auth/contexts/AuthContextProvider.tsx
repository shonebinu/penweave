import { type ReactNode, useEffect, useState } from "react";

import type { Session } from "@supabase/supabase-js";

import { upsertProfile } from "@/features/users/services/usersService.ts";
import { supabase } from "@/supabaseClient.ts";

import {
  sendResetPassword as supabaseSendResetPassword,
  signInUser as supabaseSignIn,
  signInWithGoogle as supabaseSignInWithGoogle,
  signOutUser as supabaseSignOut,
  signUpUser as supabaseSignUp,
  updatePassword as supabaseUpdatePassword,
} from "../services/authService.ts";
import { AuthContext } from "./authContext.ts";

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const signUpUser = (email: string, password: string, name: string) =>
    supabaseSignUp(email, password, name);

  const signInUser = (email: string, password: string) =>
    supabaseSignIn(email, password);

  const signOutUser = async () => {
    await supabaseSignOut();
    setSession(null);
  };

  const sendResetPassword = (email: string) => supabaseSendResetPassword(email);

  const updatePassword = (newPassword: string) =>
    supabaseUpdatePassword(newPassword);

  const signInWithGoogle = () => supabaseSignInWithGoogle();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (_event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
      }

      if (_event === "SIGNED_IN" && session?.user) {
        const { id, user_metadata } = session.user;
        // Google auth saves name in full_name and has an avatar_url
        // Email sign up saves to display_name and has no avatar_url
        const name = user_metadata.display_name || user_metadata.full_name;
        upsertProfile(id, name, user_metadata.avatar_url);
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

export default AuthContextProvider;
