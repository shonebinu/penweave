import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router";

import GoogleLogo from "@/assets/google.svg";
import PenweaveLogo from "@/assets/penweave.svg";

import { signInWithGoogle } from "../authService.ts";
import { useAuth } from "../useAuth.ts";

export function Login() {
  const { session, signInUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  if (session) return <Navigate to="/projects" />;

  const handleSignInWithGoogle = async () => {
    setLoading(true);

    try {
      const response = await signInWithGoogle();

      if (response.error) {
        toast.error("Login failed: " + response.error.message);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Unexpected error during signup:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signInUser(email, password);

      if (response.error) {
        toast.error("Login failed: " + response.error.message);
      } else {
        return navigate("/projects");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Unexpected error during signup:", err);
    } finally {
      setEmail("");
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
          <h2 className="text-xl font-bold">Login to PenWeave</h2>
          <p>Let’s pick up where you left off.</p>

          <button
            className="btn"
            disabled={loading}
            onClick={handleSignInWithGoogle}
          >
            {loading ? (
              <span className="loading loading-dots loading-md"></span>
            ) : (
              ""
            )}
            <img src={GoogleLogo} alt="Google logo" className="h-5 w-5" />
            Continue with Google
          </button>

          <form onSubmit={handleEmailLogIn}>
            <fieldset className="fieldset">
              <div className="divider m-0">or</div>
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

              <label htmlFor="password" className="label text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input w-full"
                placeholder="Your Password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div>
                <Link to="/forgot-password" className="link text-sm">
                  Forgot password?
                </Link>
              </div>
              <button className="btn btn-neutral mt-4" disabled={loading}>
                {loading ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  ""
                )}
                Log in
              </button>
            </fieldset>
          </form>

          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
