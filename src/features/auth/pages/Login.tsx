import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router";

import { AuthCard } from "../components/AuthCard.tsx";
import { AuthRedirect } from "../components/AuthRedirect.tsx";
import { GoogleButton } from "../components/GoogleButton.tsx";
import { InputField } from "../components/InputField.tsx";
import { SubmitButton } from "../components/SubmitButton.tsx";
import { useAuth } from "../useAuth.ts";
import { useGoogleAuth } from "../useGoogleAuth.ts";

export function Login() {
  const { session, signInUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignInWithGoogle = useGoogleAuth(setLoading);

  const navigate = useNavigate();

  if (session) return <Navigate to="/projects" />;

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
    <AuthCard
      title="Login to PenWeave"
      message="Let’s pick up where you left off."
    >
      <GoogleButton loading={loading} onClick={handleSignInWithGoogle} />

      <form onSubmit={handleEmailLogIn}>
        <fieldset className="fieldset">
          <div className="divider m-0">or</div>

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

          <InputField
            id="password"
            label="Password"
            type="password"
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
          <SubmitButton loading={loading} text="Log in" />
        </fieldset>
      </form>

      <AuthRedirect
        link="/signup"
        linkText="Register"
        text="Don't have an account?"
      />
    </AuthCard>
  );
}
