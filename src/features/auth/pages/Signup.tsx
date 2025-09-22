import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router";

import GoogleLogo from "@/assets/google.svg";
import PenweaveLogo from "@/assets/penweave.svg";

import { useAuth } from "../useAuth.ts";

export function Signup() {
  const { session, signUpUser, signInWithGoogle } = useAuth();

  const [name, setName] = useState("");
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
        toast.error("Signup failed: " + response.error.message);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Unexpected error during signup:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signUpUser(email, password, name);

      if (response.error) {
        toast.error("Signup failed: " + response.error.message);
      } else {
        return navigate("/verify-email", { state: { email } });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Unexpected error during signup:", err);
    } finally {
      setName("");
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
          <h2 className="text-xl font-bold">Welcome to PenWeave</h2>
          <p>Create a free account to inspire others with your creations.</p>

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

          <form onSubmit={handleEmailSignUp}>
            <fieldset className="fieldset">
              <div className="divider m-0">or</div>
              <label htmlFor="name" className="label text-sm">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="input w-full"
                placeholder="Display Name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
                placeholder="Atleast 6 characters"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn btn-neutral mt-4" disabled={loading}>
                {loading ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  ""
                )}
                Sign up
              </button>
            </fieldset>
          </form>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
