import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router";

import PenweaveLogo from "@/assets/penweave.svg";

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
    <main className="flex min-h-[calc(100svh-var(--header-height))] items-center justify-center">
      <div className="card bg-base-100 m-5 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <img
            src={PenweaveLogo}
            alt="PenWeave Logo"
            className="mb-1 h-10 w-10"
          />
          <h2 className="text-xl font-bold">Reset Password</h2>
          <p>Type in your new super secure password.</p>
          <form onSubmit={handleResetPassword}>
            <fieldset>
              <label htmlFor="password" className="label text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input w-full"
                placeholder="Atleast 6 characters"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="btn btn-neutral mt-4 w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  ""
                )}
                Reset Password
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </main>
  );
}
