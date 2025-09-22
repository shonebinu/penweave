import { supabase } from "@/supabaseClient.ts";

const emailVerificationRedirectUrl = `${import.meta.env.VITE_PUBLIC_SITE_URL}/projects`;
const forgotPassRedirectUrl = `${import.meta.env.VITE_PUBLIC_SITE_URL}/reset-password`;
const googleSignInRedirectUrl = emailVerificationRedirectUrl;

const signUpUser = async (email: string, password: string, name: string) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: name },
      emailRedirectTo: emailVerificationRedirectUrl,
    },
  });
};

const signInUser = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

const signOutUser = async () => {
  return await supabase.auth.signOut();
};

const sendResetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: forgotPassRedirectUrl,
  });
};

const updatePassword = async (newPassword: string) => {
  return await supabase.auth.updateUser({
    password: newPassword,
  });
};

const signInWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: googleSignInRedirectUrl,
    },
  });
};

export {
  signInUser,
  signOutUser,
  signUpUser,
  sendResetPassword,
  updatePassword,
  signInWithGoogle,
};
