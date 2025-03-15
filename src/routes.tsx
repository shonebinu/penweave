import { Navigate, createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout.tsx";
import ProtectedLayout from "./components/ProtectedRoute.tsx";
import Home from "./pages/Home.tsx";
import Landing from "./pages/Landing.tsx";
import Login from "./pages/Login.tsx";
import NewPlayground from "./pages/NewPlayground.tsx";
import Playground from "./pages/Playground.tsx";
import SignUp from "./pages/SignUp.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        path: "",
        element: <Layout />,
        children: [
          { path: "home", element: <Home /> },
          { path: "explore", element: <h1>Explore</h1> },
          { path: "following", element: <h1>Following</h1> },
          { path: "bookmarks", element: <h1>Bookmarks</h1> },
        ],
      },
      { path: "playground/new", element: <NewPlayground /> },
      { path: "playground/:playgroundId", element: <Playground /> },
      { path: "*", element: <Navigate to="/home" replace /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;

// TODO: Assets route ? to manage assets? r2? firebase storage?
