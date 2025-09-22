import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router";

import { AuthCard } from "../components/AuthCard.tsx";
import { AuthRedirect } from "../components/AuthRedirect.tsx";
import { InputField } from "../components/InputField.tsx";
import { SubmitButton } from "../components/SubmitButton.tsx";
import { useAuth } from "../useAuth.ts";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { session, sendResetPassword } = useAuth();

  if (session) {
    return <Navigate to="/projects" />;
  }

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await sendResetPassword(email);

      if (response.error) {
        toast.error("Operation failed: " + response.error.message);
      } else {
        toast.success("Password reset link has been sent to your email.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Unexpected error during signup:", err);
    } finally {
      setEmail("");
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset Your Password"
      message="Get a password reset link in your email."
    >
      <form onSubmit={handleForgotPassword}>
        <fieldset className="fieldset">
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <SubmitButton loading={loading} text="Send Link" />
        </fieldset>
      </form>

      <AuthRedirect link="/login" linkText="Login" text="Back to login page?" />
    </AuthCard>
  );
}
