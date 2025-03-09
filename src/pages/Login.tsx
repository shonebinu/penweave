import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoginForm } from "@/components/login/LoginForm";
import { useAuth } from "@/hooks/useAuth.ts";
import { doSignInWithGoogle } from "@/services/firebase/auth.ts";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email: ", email, "Password: ", password);
    // TODO: Setup login using email and pass
    // TODO: What to do if tried to log in using email from different provider
    // TODO: Forgot password of OAuth email - what to do here
  };

  const handleGoogleLogin = async () => {
    try {
      await doSignInWithGoogle();
      console.log(user, loading);
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
          onSubmit={handleSubmit}
          onGoogleLogin={handleGoogleLogin}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
      </div>
    </div>
  );
}
