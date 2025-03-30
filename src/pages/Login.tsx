import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { LoginForm } from "@/components/login/LoginForm";
import { Toaster } from "@/components/ui/sonner.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import {
  doPasswordReset,
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "@/services/firebase/auth.ts";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.emailVerified) navigate("/home", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (location.state?.error) {
      toast.error(
        location.state.error,
        location.state?.details
          ? {
              description: location.state?.details,
            }
          : {},
      );
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await doSignInWithEmailAndPassword(email.trim(), password);
      navigate("/home");
    } catch (error) {
      if (error instanceof Error) {
        const message =
          "code" in error && error.code === "auth/invalid-credential"
            ? "Invalid email or password. Please try again."
            : error.message;

        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await doSignInWithGoogle();
      navigate("/home");
    } catch (error) {
      if (error instanceof Error) {
        const message =
          "code" in error && error.code === "auth/popup-closed-by-user"
            ? "Login popup was closed before completing sign-in. Please try again."
            : error.message;

        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await doPasswordReset(resetEmail);
      toast.success("Password reset email sent!", {
        description:
          "If an account exists for the provided email, a password reset email will be arrived shortly.",
      });
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("An unexpected error occurred");
    }
  };

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          onSubmit={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          googleLoading={googleLoading}
          resetEmail={resetEmail}
          setResetEmail={setResetEmail}
          handlePasswordReset={handlePasswordReset}
        />
      </div>
      <Toaster richColors />
    </main>
  );
}
