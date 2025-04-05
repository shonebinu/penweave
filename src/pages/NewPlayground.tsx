import { LoaderCircle } from "lucide-react";

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth.ts";
import { createPlayground } from "@/services/firebase/playgroundService.ts";

export default function NewPlayground() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const hasCreated = useRef(false);

  useEffect(() => {
    if (hasCreated.current) return;
    hasCreated.current = true;

    async function createAndRedirect() {
      if (!user) {
        navigate("/login");
        return;
      }
      const docRef = await createPlayground(user, "Untitled Playground");
      navigate(`/playground/${docRef.id}`, { replace: true });
    }

    createAndRedirect();
  }, [navigate, user]);

  return (
    <div
      className="flex h-screen items-center justify-center text-sm text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="animate-spin" />
      <p className="ml-2">Creating your playground...</p>
    </div>
  );
}
