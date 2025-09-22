import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router";

import PenweaveLogo from "@/assets/penweave.svg";

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
    <main className="flex min-h-[calc(100svh-var(--header-height))] items-center justify-center">
      <div className="card bg-base-100 m-5 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <img
            src={PenweaveLogo}
            alt="PenWeave Logo"
            className="mb-1 h-10 w-10"
          />
          <h2 className="text-xl font-bold">Reset Your Password</h2>
          <p>Get a password reset link in your email.</p>
          <form onSubmit={handleForgotPassword}>
            <fieldset className="fieldset">
              <label htmlFor="email" className="label text-sm">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input w-full"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-neutral mt-4" disabled={loading}>
                {loading ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  ""
                )}
                Send Link
              </button>
            </fieldset>
          </form>
          <p className="text-center text-sm">
            Back to login page?{" "}
            <Link to="/login" className="link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
