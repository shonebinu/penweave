import { type ReactNode, useEffect, useState } from "react";

import type { Session } from "@supabase/supabase-js";

import { upsertProfile } from "@/features/users/usersService.ts";
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

      if (
        _event === "SIGNED_IN" &&
        session?.user &&
        session.user.app_metadata?.provider === "google"
      ) {
        const { full_name, avatar_url } = session.user.user_metadata;
        await upsertProfile(session.user.id, full_name, avatar_url);
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
