import { supabase } from "@/supabaseClient.ts";

const emailVerificationRedirectUrl = `${import.meta.env.VITE_PUBLIC_SITE_URL}/dashboard`;
// const forgotPassRedirectUrl = `${import.meta.env.VITE_PUBLIC_SITE_URL}/reset-password`;

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

// const sendResetPassword = async (email: string) => {
//   return await supabase.auth.resetPasswordForEmail(email, {
//     redirectTo: forgotPassRedirectUrl,
//   });
// };

export { signInUser, signOutUser, signUpUser };
