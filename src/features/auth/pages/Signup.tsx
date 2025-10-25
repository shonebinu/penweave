import { type FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router";

import { handleError } from "@/utils/error.ts";

import AuthCard from "../components/AuthCard.tsx";
import AuthRedirect from "../components/AuthRedirect.tsx";
import GoogleButton from "../components/GoogleButton.tsx";
import InputField from "../components/InputField.tsx";
import SubmitButton from "../components/SubmitButton.tsx";
import { useAuth } from "../useAuth.ts";

export default function Signup() {
  const { session, signUpUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  if (session) return <Navigate to="/projects" />;

  const handleEmailSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUpUser(email, password, name);
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      handleError(err, "Signup failed");
    } finally {
      setName("");
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome to PenWeave"
      message="Create a free account to inspire others with your creations."
    >
      <GoogleButton loading={loading} setLoading={setLoading} />

      <form onSubmit={handleEmailSignUp}>
        <fieldset className="fieldset">
          <div className="divider m-0">or</div>

          <InputField
            id="name"
            label="Name"
            type="text"
            placeholder="Full Name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            placeholder="Atleast 6 characters"
            autoComplete="new-password"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <SubmitButton loading={loading} text="Sign up" />
        </fieldset>
      </form>

      <AuthRedirect
        link="/login"
        linkText="Login"
        text="Already have an account?"
      />
    </AuthCard>
  );
}
