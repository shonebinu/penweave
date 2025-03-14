import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./contexts/auth/AuthProvider.tsx";
import { ThemeProvider } from "./contexts/theme/themeProvider.tsx";
import "./index.css";
import router from "./routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
