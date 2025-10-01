import { createBrowserRouter } from "react-router";

import { ForgotPassword } from "@/features/auth/pages/ForgotPassword.tsx";
import { Login } from "@/features/auth/pages/Login";
import { Logout } from "@/features/auth/pages/Logout.tsx";
import { ResetPassword } from "@/features/auth/pages/ResetPassword.tsx";
import { Signup } from "@/features/auth/pages/Signup.tsx";
import { VerifyEmail } from "@/features/auth/pages/VerifyEmail.tsx";
import { Editor } from "@/features/editor/pages/Editor.tsx";
import { Projects } from "@/features/projects/pages/Projects.tsx";
import { AuthLayout } from "@/layouts/AuthLayout.tsx";
import { MainLayout } from "@/layouts/MainLayout.tsx";

import ProtectedRoute from "./ProtectedRoute.tsx";

export const router = createBrowserRouter([
  { path: "/", element: <h1>Landing Page</h1> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "projects", element: <Projects /> },
          { path: "projects/:projectId", element: <h1>Project overview</h1> },
          { path: "explore", element: <h1>Explore</h1> },
          { path: "following", element: <h1>Following</h1> },
          { path: "bookmarks", element: <h1>Bookmarks</h1> },
          { path: "notifications", element: <h1>Notifications</h1> },
          { path: "profile", element: <h1>Profile</h1> },
          { path: "settings", element: <h1>Settings</h1> },
        ],
      },
      { path: "projects/:projectId/editor", element: <Editor /> },
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
