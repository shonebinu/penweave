import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoginForm } from "@/components/login/LoginForm";
import { Toaster } from "@/components/ui/sonner.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "@/services/firebase/auth.ts";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.emailVerified) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await doSignInWithEmailAndPassword(email.trim(), password);
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("An unexpected error occured");
    }
    // TODO: Setup login using email and pass
    // TODO: What to do if tried to log in using email from different provider
    // TODO: Forgot password of OAuth email - what to do here
    // TODO: Forgot password
    // TODO: Give some feedback in signing up like button rotating
    // TODO: Invalid credential error
  };

  const handleGoogleLogin = async () => {
    try {
      await doSignInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      // TODO: Setup error here
      console.error("Google login error", error);
    }
  };

  // TODO: Setup forgot password

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          onSubmit={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
      </div>
      <Toaster richColors />
    </div>
  );
}
