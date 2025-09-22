import { createBrowserRouter } from "react-router";

import { AuthLayout } from "@/features/auth/AuthLayout.tsx";
import { ForgotPassword } from "@/features/auth/pages/ForgotPassword.tsx";
import { Login } from "@/features/auth/pages/Login";
import { ResetPassword } from "@/features/auth/pages/ResetPassword.tsx";
import { Signup } from "@/features/auth/pages/Signup.tsx";
import { VerifyEmail } from "@/features/auth/pages/VerifyEmail.tsx";

import ProtectedRoute from "./ProtectedRoute.tsx";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <ProtectedRoute />,
    children: [{ path: "projects", element: <h1>Protected</h1> }],
  },
  {
    path: "*",
    element: <AuthLayout />,
    children: [
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);
