import { Navigate, createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout.tsx";
import ProtectedLayout from "./components/ProtectedRoute.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Playground from "./pages/Playground.tsx";
import SignUp from "./pages/SignUp.tsx";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  {
    path: "/dashboard",
    element: <ProtectedLayout />,
    children: [
      {
        path: "",
        element: <Layout />,
        children: [
          { path: "", element: <Dashboard /> },
          { path: "playground/:playgroundId", element: <Playground /> },
        ],
      },
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;

// TODO: Change /dashboard/playground to /playground
