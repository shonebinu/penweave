import GoogleLogo from "@/assets/google.svg";

import { LoadingDots } from "./LoadingDots";

export function GoogleButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button className="btn" disabled={loading} onClick={onClick}>
      {loading && <LoadingDots />}
      <img src={GoogleLogo} alt="Google logo" className="h-5 w-5" />
      Continue with Google
    </button>
  );
}
