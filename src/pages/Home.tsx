import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import HomePlaygroundCard from "@/components/home/HomePlaygroundCard";
import PlaygroundSkeleton from "@/components/skeleton/PlaygroundSkeleton";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import {
  deletePlayground,
  getUserPlaygrounds,
  updatePlayground,
} from "@/services/firebase/playgroundService.ts";
import { PlaygroundMeta } from "@/types/firestore";

export default function Home() {
  const [playgrounds, setPlaygrounds] = useState<PlaygroundMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getPlaygrounds = async () => {
      try {
        if (!user) throw new Error("User should be signed in.");
        const userPlaygrounds = await getUserPlaygrounds(user);
        setPlaygrounds(userPlaygrounds);
      } catch (error) {
        toast.error("Failed to load your playgrounds", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      } finally {
        setLoading(false);
      }
    };
    getPlaygrounds();
  }, [user]);

  useEffect(() => {
    if (location.state?.error) {
      toast.error(
        location.state.error,
        location.state?.details
          ? {
              description: location.state?.details,
            }
          : {},
      );
    }
  }, [location.state]);

  const handleRename = async (id: string, newTitle: string) => {
    try {
      if (newTitle.length === 0) throw new Error("Title shouldn't be empty.");
      if (!user) throw new Error("User should be signed in.");
      await updatePlayground(user, id, { title: newTitle });
      setPlaygrounds((prev) =>
        prev.map((p) => (p.id === id ? { ...p, title: newTitle } : p)),
      );
      toast.success("Playground renamed successfully");
    } catch (error) {
      toast.error("Failed to rename playground", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!user) throw new Error("User should be signed in.");
      await deletePlayground(user, id);
      setPlaygrounds((prev) => prev.filter((p) => p.id !== id));
      toast.success("Playground deleted successfully");
    } catch (error) {
      toast.error("Failed to delete playground", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  const handlePublicStatus = async (id: string, isPublic: boolean) => {
    try {
      if (!user) throw new Error("User should be signed in.");
      await updatePlayground(user, id, { isPublic });
      setPlaygrounds((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPublic } : p)),
      );
      toast.success(`Playground is now ${isPublic ? "public" : "private"}`);
    } catch (error) {
      toast.error("Failed to update playground visibility", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Playgrounds</h1>
        <p className="text-sm text-muted-foreground">
          Create, manage and run your code playgrounds.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PlaygroundSkeleton key={i} />
          ))}
        </div>
      ) : playgrounds.length === 0 ? (
        <div className="flex h-80 flex-col items-center justify-center">
          <h3 className="text-lg font-medium">No playgrounds yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first playground to get started
          </p>
          <Button className="mt-4" onClick={() => navigate("/playground/new")}>
            <Plus /> Create Playground
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playgrounds.map((playground) => (
            <HomePlaygroundCard
              key={playground.id}
              playground={playground}
              onRename={handleRename}
              onDelete={handleDelete}
              onTogglePublic={handlePublicStatus}
            />
          ))}
        </div>
      )}
      <Toaster richColors />
    </main>
  );
}
