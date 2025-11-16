import { type ReactNode, useEffect, useState } from "react";

import type { Session } from "@supabase/supabase-js";

import {
  fetchProfile,
  upsertProfile,
} from "@/features/settings/services/settingsService.ts";
import { supabase } from "@/supabaseClient.ts";
import type { Profile } from "@/types/profile.ts";

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
        // calling await here is leading to infinite loading in chromium browsers somehow
        syncProfile(session.user).catch((err) =>
          console.error("Profile sync failed", err),
        );
      }

      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function syncProfile(user: Session["user"]) {
    const { id, user_metadata } = user;
    const { avatar_url, display_name, full_name } = user_metadata;

    let existingProfile: Profile | null;
    // fetchProfile throws error if no data
    try {
      existingProfile = await fetchProfile(id);
    } catch {
      existingProfile = null;
    }

    if (!existingProfile) {
      // avatar_url and full_name is populated by google auth
      // display_name is populated on email sign up
      const name = display_name ?? full_name ?? "Anonymous";
      await upsertProfile(id, name, avatar_url);
    } else if (avatar_url) {
      await upsertProfile(id, existingProfile.display_name, avatar_url);
    }
  }

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
