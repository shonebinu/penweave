import { type ReactNode, useEffect, useState } from "react";

import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/supabaseClient.ts";

import { AuthContext } from "./authContext.ts";
import {
  signInUser as supabaseSignIn,
  signOutUser as supabaseSignOut,
  signUpUser as supabaseSignUp,
} from "./authService.ts";

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const signUpUser = async (email: string, password: string, name: string) =>
    await supabaseSignUp(email, password, name);

  const signInUser = async (email: string, password: string) =>
    await supabaseSignIn(email, password);

  const signOutUser = async () => {
    await supabaseSignOut();
    setSession(null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, loading, signUpUser, signInUser, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
