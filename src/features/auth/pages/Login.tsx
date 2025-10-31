import { type FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";

import { handleError } from "@/utils/error.ts";

import AuthCard from "../components/AuthCard.tsx";
import AuthRedirect from "../components/AuthRedirect.tsx";
import GoogleButton from "../components/GoogleButton.tsx";
import InputField from "../components/InputField.tsx";
import SubmitButton from "../components/SubmitButton.tsx";
import { useAuth } from "../hooks/useAuth.ts";

export default function Login() {
  const { session, signInUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  if (session) return <Navigate to="/projects" />;

  const handleEmailLogIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInUser(email, password);
      navigate("/projects");
    } catch (err) {
      handleError(err, "Login failed");
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
      <GoogleButton loading={loading} setLoading={setLoading} />

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
