import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "@/features/auth/useAuth.ts";
import { handleError } from "@/utils/error.ts";

export function Logout() {
  const [logoutFailed, setLogoutFailed] = useState(false);
  const { signOutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogOut = async () => {
      try {
        await signOutUser();
        navigate("/", { replace: true });
      } catch (err) {
        handleError(err, "Logout failed");
        setLogoutFailed(true);
      }
    };

    doLogOut();
  }, [navigate, signOutUser]);

  return (
    <div className="flex min-h-[calc(100svh-var(--header-height))] flex-col items-center justify-center">
      <div>
        {!logoutFailed ? (
          <p>
            <span className="loading loading-dots loading-xl mr-2"></span>
            Logging you out...
          </p>
        ) : (
          <p className="text-error text-center">Logout failed.</p>
        )}
        {logoutFailed && (
          <p className="mt-2 text-center">
            <Link to="/" className="link">
              Back to Landing Page
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
