import { Navigate, Outlet } from "react-router";

import { useAuth } from "@/features/auth/useAuth";
import LoadingScreen from "@/shared/pages/LoadingScreen.tsx";

export default function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return session ? <Outlet /> : <Navigate to="/login" />;
}
