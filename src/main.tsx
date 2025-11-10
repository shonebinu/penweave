import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router";

import AuthContextProvider from "@/features/auth/contexts/AuthContextProvider.tsx";
import router from "@/routes";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </AuthContextProvider>
  </StrictMode>,
);
