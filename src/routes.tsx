import { Navigate, createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout.tsx";
import ProtectedLayout from "./components/ProtectedRoute.tsx";
import Bookmarks from "./pages/Bookmarks.tsx";
import Explore from "./pages/Explore.tsx";
import Following from "./pages/Following.tsx";
import Home from "./pages/Home.tsx";
import Landing from "./pages/Landing.tsx";
import Login from "./pages/Login.tsx";
import NewPlayground from "./pages/NewPlayground.tsx";
import Playground from "./pages/Playground.tsx";
import SignUp from "./pages/SignUp.tsx";
import User from "./pages/User.tsx";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },

  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },

  { path: "playground/:playgroundId", element: <Playground /> },

  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        path: "",
        element: <Layout />,
        children: [
          { path: "home", element: <Home /> },
          { path: "explore", element: <Explore /> },
          { path: "following", element: <Following /> },
          { path: "bookmarks", element: <Bookmarks /> },
          { path: "user/:userId", element: <User /> },
        ],
      },
      { path: "playground/new", element: <NewPlayground /> },
      { path: "*", element: <Navigate to="/home" replace /> },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;
