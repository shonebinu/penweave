import { Link, Navigate, useLocation } from "react-router";

import PenweaveLogo from "@/assets/penweave.svg";

import { useAuth } from "../useAuth.ts";

export function VerifyEmail() {
  const { state } = useLocation();
  const { session } = useAuth();

  if (!state?.email || session) {
    return <Navigate to="/signup" />;
  }

  return (
    <main className="flex h-[calc(100svh-var(--header-height))] items-center justify-center">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <img
            src={PenweaveLogo}
            alt="PenWeave Logo"
            className="mb-1 h-10 w-10"
          />
          <h2 className="text-xl font-bold">Verification Link Sent</h2>
          <p>
            Check your inbox for <b>{state?.email}</b> and click the link to
            verify your email.
          </p>
          <Link to="/" className="mt-4">
            <button className="btn btn-neutral w-full">
              Skip, I'll check later
            </button>
          </Link>

          <p className="text-center text-sm">
            Back to Signup page?{" "}
            <Link to="/signup" className="link">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
