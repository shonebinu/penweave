import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SignUpForm } from "@/components/signup/SignUpForm";
import { useAuth } from "@/hooks/useAuth.ts";
import { doSignInWithGoogle } from "@/services/firebase/auth.ts";

export default function SignUp() {
  const [name, setName] = useState("");
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
    // TODO: Setup sign up using email and pass
  };

  const handleGoogleLogin = async () => {
    try {
      await doSignInWithGoogle();
      console.log(user, loading);
      navigate("/dashboard");
    } catch (error) {
      // TODO: Setup error here
      console.error("Google signup error", error);
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
        />
      </div>
    </div>
  );
}
