import { createBrowserRouter } from "react-router-dom";

import CodePlayground from "./pages/CodePlayground.tsx";

const router = createBrowserRouter([
  { path: "/login", element: <h1>Login</h1> },
  { path: "/playground", element: <CodePlayground /> },
]);

export default router;
