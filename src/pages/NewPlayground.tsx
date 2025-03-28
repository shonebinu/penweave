import { LoaderCircle } from "lucide-react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createPlayground } from "@/services/firebase/playgroundService.ts";

export default function NewPlayground() {
  const navigate = useNavigate();

  useEffect(() => {
    async function createAndRedirect() {
      const docRef = await createPlayground("Untitled Playground");
      navigate(`/playground/${docRef.id}`, { replace: true });
    }

    createAndRedirect();
  }, [navigate]);

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
