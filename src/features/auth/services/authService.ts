import { supabase } from "@/supabaseClient.ts";

const emailVerificationRedirectUrl = `${import.meta.env.VITE_PUBLIC_SITE_URL}/projects`;
const forgotPassRedirectUrl = `${import.meta.env.VITE_PUBLIC_SITE_URL}/reset-password`;
const googleSignInRedirectUrl = emailVerificationRedirectUrl;

const signUpUser = async (email: string, password: string, name: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: emailVerificationRedirectUrl,
      data: {
        display_name: name,
      },
    },
  });

  if (error) throw new Error(error.message);
};

const signInUser = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
};

const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

const sendResetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: forgotPassRedirectUrl,
  });
  if (error) throw new Error(error.message);
};

const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw new Error(error.message);
};

const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: googleSignInRedirectUrl,
    },
  });
  if (error) throw new Error(error.message);
};

export {
  signInUser,
  signOutUser,
  signUpUser,
  sendResetPassword,
  updatePassword,
  signInWithGoogle,
};
