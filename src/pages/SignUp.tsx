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
    if (user && user.emailVerified) navigate("/home", { replace: true });
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (name.trim().length === 0) throw new Error("Name shouldn't be empty");

      await doCreateUserWithEmailAndPassword(
        email.trim(),
        password,
        name.trim(),
      );

      setName("");
      setEmail("");
      setPassword("");
      toast.info("Verification email sent", {
        description: "Please verify before logging in.",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if ("code" in error && error.code === "auth/email-already-in-use")
          toast.error("Email Already in Use", {
            description: "This email is already registered. Try logging in.",
          });
        else toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await doSignInWithGoogle();
      navigate("/home");
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message =
          "code" in error && error.code === "auth/popup-closed-by-user"
            ? "Signup popup was closed before completing sign-up. Please try again."
            : error.message;

        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm
          onSubmit={handleSignUp}
          onGoogleSignUp={handleGoogleSignUp}
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
      <Toaster richColors />
    </main>
  );
}
