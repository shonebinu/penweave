import { Link } from "react-router";

import GoogleLogo from "@/assets/google.svg";
import PenweaveLogo from "@/assets/penweave.svg";

export function Signup() {
  return (
    <section className="flex h-svh justify-center items-center">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <img
            src={PenweaveLogo}
            alt="PenWeave Logo"
            className="h-10 w-10 mb-1"
          />
          <h2 className="font-bold text-xl">Welcome to PenWeave</h2>
          <p>Create a free account to inspire others with your creations.</p>
          <fieldset className="fieldset">
            <button className="btn">
              <img src={GoogleLogo} alt="Google logo" className="h-5 w-5" />
              Continue with Google
            </button>

            <div className="divider m-0 mt-1">or</div>

            <label className="label text-sm">Name</label>
            <input
              type="text"
              className="input w-full"
              placeholder="Full Name"
            />
            <label className="label text-sm">Email</label>
            <input
              type="email"
              className="input w-full"
              placeholder="you@example.com"
            />
            <label className="label text-sm">Password</label>
            <input
              type="password"
              className="input w-full"
              placeholder="Atleast 6 characters"
            />
            <button className="btn btn-neutral mt-4">Sign up</button>
          </fieldset>
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
