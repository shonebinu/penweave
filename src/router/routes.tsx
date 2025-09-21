import { createBrowserRouter } from "react-router";

import { ForgotPassword } from "@/features/auth/pages/ForgotPassword.tsx";
import { Login } from "@/features/auth/pages/Login";
import { Signup } from "@/features/auth/pages/Signup.tsx";

export const router = createBrowserRouter([
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
]);
