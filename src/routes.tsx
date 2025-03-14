import { createBrowserRouter } from "react-router-dom";

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
  { path: "/playground", element: <Playground /> },
  {
    path: "/dashboard",
    element: <ProtectedLayout />,
    children: [{ path: "", element: <Dashboard /> }],
  },
]);

export default router;
