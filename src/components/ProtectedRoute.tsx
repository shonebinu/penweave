import { Navigate, Outlet } from "react-router";

import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return session ? <Outlet /> : <Navigate to="/login" />;
}
