import toast from "react-hot-toast";

import { useAuth } from "./useAuth.ts";

export function useGoogleAuth(setLoading: (val: boolean) => void) {
  const { signInWithGoogle } = useAuth();

  return async function handleGoogleAuth() {
    setLoading(true);
    try {
      const response = await signInWithGoogle();
      if (response.error) toast.error("Auth failed: " + response.error.message);
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Google auth error:", err);
    } finally {
      setLoading(false);
    }
  };
}
