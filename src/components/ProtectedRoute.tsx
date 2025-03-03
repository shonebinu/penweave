import { Navigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth.ts";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}
