import GoogleLogo from "@/assets/google.svg";
import { handleError } from "@/utils/error.ts";

import { LoadingDots } from "../../../shared/components/LoadingDots.tsx";
import { useAuth } from "../useAuth.ts";

export function GoogleButton({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: (val: boolean) => void;
}) {
  const { signInWithGoogle } = useAuth();

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      handleError(err, "Google auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="btn" disabled={loading} onClick={handleGoogleAuth}>
      {loading && <LoadingDots />}
      <img src={GoogleLogo} alt="Google logo" className="h-5 w-5" />
      Continue with Google
    </button>
  );
}
