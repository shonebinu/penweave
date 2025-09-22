import { Navigate, Outlet } from "react-router";

import { useAuth } from "@/features/auth/useAuth";

export default function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-dots loading-xl"></span>
        <p className="ml-2">Loading...</p>
      </div>
    );

  return session ? <Outlet /> : <Navigate to="/login" />;
}
