import { LoaderCircle } from "lucide-react";

import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth.ts";

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimeoutReached(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return timeoutReached ? (
      <Navigate to="/login" replace />
    ) : (
      <div
        className="flex h-screen items-center justify-center text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        <LoaderCircle className="animate-spin" />
        <p className="ml-2">Loading...</p>
      </div>
    );

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
