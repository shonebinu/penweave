import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function SignUpForm({
  className,
  onSubmit,
  onGoogleSignUp,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  onSubmit: (e: React.FormEvent) => void;
  onGoogleSignUp: () => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}) {
  const [strength, setStrength] = useState([0, 0, 0]);
  const [message, setMessage] = useState(
    "Password must be at least 8 characters.",
  );

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const checks = [
      newPassword.length >= 8,
      /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword),
      /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    ];

    // Apply sequential checks
    const progress = checks.reduce<number[]>((acc, passed, index) => {
      if (acc[index - 1] === 100 || index === 0) acc.push(passed ? 100 : 0);
      else acc.push(0);
      return acc;
    }, []);

    setStrength(progress);

    // Set message based on progress
    const messages = [
      "Password must be at least 8 characters.",
      "Add an uppercase letter and a number.",
      "Include a special character.",
      "Strong password!",
    ];

    setMessage(messages[progress.filter((val) => val === 100).length]);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Welcome! Please fill in the details to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <div className="flex gap-2">
                  <Progress
                    value={strength[0]}
                    className="w-1/3 [&>div]:bg-red-500"
                  />
                  <Progress
                    value={strength[1]}
                    className="w-1/3 [&>div]:bg-yellow-500"
                  />
                  <Progress
                    value={strength[2]}
                    className="w-1/3 [&>div]:bg-green-500"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{message}</p>
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                or
              </p>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={onGoogleSignUp}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
