import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router";

import { AuthCard } from "../components/AuthCard.tsx";
import { InputField } from "../components/InputField.tsx";
import { SubmitButton } from "../components/SubmitButton.tsx";
import { useAuth } from "../useAuth.ts";

export function ResetPassword() {
  const {
    isPasswordRecovery,
    updatePassword,
    loading: authLoading,
  } = useAuth();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  if (!isPasswordRecovery && !authLoading) {
    return <Navigate to="/login" />;
  }

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updatePassword(password);

      if (response.error) {
        toast.error("Password reset failed: " + response.error.message);
      } else {
        toast.success("Password updated! Redirecting...");
        setTimeout(() => {
          navigate("/projects", { replace: true });
        }, 2000);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Unexpected error during signup:", err);
    } finally {
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      message="Type in your new super secure password."
    >
      <form onSubmit={handleResetPassword}>
        <fieldset className="fieldset">
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Atleast 6 characters"
            autoComplete="new-password"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <SubmitButton loading={loading} text="Reset Password" />
        </fieldset>
      </form>
    </AuthCard>
  );
}
