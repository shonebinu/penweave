import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PlaygroundCard from "@/components/home/PlaygroundCard";
import PlaygroundSkeleton from "@/components/home/PlaygroundSkeleton";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner.tsx";
import {
  deletePlayground,
  getUserPlaygrounds,
  updatePlayground,
} from "@/services/firebase/firestore";
import { Playground } from "@/types/firestore";

export default function Home() {
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getPlaygrounds = async () => {
      try {
        const userPlaygrounds = await getUserPlaygrounds();
        setPlaygrounds(userPlaygrounds);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load your playgrounds");
      } finally {
        setLoading(false);
      }
    };
    getPlaygrounds();
  }, []);

  const handleRename = async (id: string, newTitle: string) => {
    try {
      await updatePlayground(id, { title: newTitle });
      setPlaygrounds((prev) =>
        prev.map((p) => (p.id !== id ? { ...p, title: newTitle } : p)),
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
      await deletePlayground(id);
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

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Playgrounds</h1>
        <p className="text-sm text-muted-foreground">
          Create, manage and run your code playgrounds
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {playgrounds.map((playground) => (
            <PlaygroundCard
              key={playground.id}
              playground={playground}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      <Toaster richColors />
    </main>
  );
}
