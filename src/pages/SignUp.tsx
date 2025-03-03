import React, { useState } from "react";

import { SignUpForm } from "@/components/signup/SignUpForm";
import { doSignInWithGoogle } from "@/services/firebase/auth.ts";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email: ", email, "Password: ", password);
  };

  const handleGoogleLogin = async () => {
    await doSignInWithGoogle();
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
