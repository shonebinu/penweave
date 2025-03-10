import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SignUpForm } from "@/components/signup/SignUpForm";
import { Toaster } from "@/components/ui/sonner.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
} from "@/services/firebase/auth.ts";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await doCreateUserWithEmailAndPassword(
        email.trim(),
        password,
        name.trim(),
      );
      navigate("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if ("code" in error && error?.code === "auth/email-already-in-use")
          toast("Email Already in Use", {
            description: "This email is already registered. Try logging in.",
          });
        else if ("message" in error) toast(error.message);
        else toast("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
    // TODO: Setup email verification. If user signed up with email/pass, redirect to login page and only login if verified
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await doSignInWithGoogle();
      navigate("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error && "message" in error) toast(error.message);
      else toast("An unexpected error occurred.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm
          onSubmit={handleSubmit}
          onGoogleSignUp={handleGoogleLogin}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          googleLoading={googleLoading}
        />
      </div>
      <Toaster />
    </div>
  );
}
