import { createBrowserRouter } from "react-router";

import ForgotPassword from "@/features/auth/pages/ForgotPassword.tsx";
import Login from "@/features/auth/pages/Login";
import Logout from "@/features/auth/pages/Logout.tsx";
import ResetPassword from "@/features/auth/pages/ResetPassword.tsx";
import Signup from "@/features/auth/pages/Signup.tsx";
import VerifyEmail from "@/features/auth/pages/VerifyEmail.tsx";
import Editor from "@/features/projects/pages/Editor.tsx";
import Projects from "@/features/tmp/pages/Projects.tsx";
import AuthLayout from "@/layouts/AuthLayout.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";

import ProtectedRoute from "./ProtectedRoute.tsx";

const router = createBrowserRouter([
  { path: "/", element: <h1>Landing Page</h1> },
  { path: "projects/:projectId", element: <Editor /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "projects", element: <Projects /> },
          { path: "explore", element: <h1>Explore</h1> },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "logout", element: <Logout /> },
    ],
  },
  { path: "*", element: <h1>Not Found</h1> },
]);

export default router;
