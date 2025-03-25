import { Navigate, createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout.tsx";
import ProtectedLayout from "./components/ProtectedRoute.tsx";
import Bookmarks from "./pages/Bookmarks.tsx";
import Explore from "./pages/Explore.tsx";
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
  { path: "/user/:userId", element: <h1>User route</h1> },
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
          { path: "following", element: <h1>Following</h1> },
          { path: "bookmarks", element: <Bookmarks /> },
        ],
      },
      { path: "playground/new", element: <NewPlayground /> },
      { path: "*", element: <Navigate to="/home" replace /> },
    ],
  },
  { path: "playground/:playgroundId", element: <Playground /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;
