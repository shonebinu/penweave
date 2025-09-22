import { useState } from "react";
import { Link } from "react-router";

import PenweaveLogo from "@/assets/penweave.svg";

export function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = () => {};

  return (
    <main className="flex h-[calc(100svh-var(--header-height))] items-center justify-center">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
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
              <button className="btn btn-neutral mt-4">Reset Password</button>
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
