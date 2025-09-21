import { Link } from "react-router";

import PenweaveLogo from "@/assets/penweave.svg";

export function ForgotPassword() {
  return (
    <section className="flex h-svh justify-center items-center">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <img
            src={PenweaveLogo}
            alt="PenWeave Logo"
            className="h-10 w-10 mb-1"
          />
          <h2 className="font-bold text-xl">Reset Your Password</h2>
          <p>Get a password reset link in your email.</p>
          <fieldset className="fieldset">
            <label className="label text-sm">Email</label>
            <input
              type="email"
              className="input w-full"
              placeholder="you@example.com"
            />

            <button className="btn btn-neutral mt-4">Reset Password</button>
          </fieldset>
          <p className="text-sm text-center">
            Back to login page?{" "}
            <Link to="/login" className="link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
