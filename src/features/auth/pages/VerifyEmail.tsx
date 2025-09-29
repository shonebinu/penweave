import { Link, Navigate, useLocation } from "react-router";

import { AuthCard } from "../components/AuthCard.tsx";
import { AuthRedirect } from "../components/AuthRedirect.tsx";
import { SubmitButton } from "../components/SubmitButton.tsx";
import { useAuth } from "../useAuth.ts";

export function VerifyEmail() {
  const { state } = useLocation();
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/projects" />;
  }

  if (!state?.email) {
    return <Navigate to="/signup" />;
  }

  return (
    <AuthCard
      title="Verification Link Sent"
      message={
        <>
          Check your inbox for <b>{state?.email}</b> and click the link to
          verify your email.
        </>
      }
    >
      <Link to="/">
        <SubmitButton loading={false} text="Skip, I'll check later" />
      </Link>

      <AuthRedirect
        link="/signup"
        linkText="Signup"
        text="Back to Signup page?"
      />
    </AuthCard>
  );
}
