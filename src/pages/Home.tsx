import { MoreVertical, Pencil, Play, Trash } from "lucide-react";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// For notifications
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserPlaygrounds } from "@/services/firebase/firestore";
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
      } finally {
        setLoading(false);
      }
    };

    getPlaygrounds();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deletePlayground(id);
      setPlaygrounds(playgrounds.filter((p) => p.id !== id));
      toast.success("Playground deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete playground");
    }
  };

  const handleRename = async (id: string) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;

    try {
      await renamePlayground(id, newName);
      setPlaygrounds(
        playgrounds.map((p) => (p.id === id ? { ...p, title: newName } : p)),
      );
      toast.success("Playground renamed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to rename playground");
    }
  };

  return (
    <main className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
          ))
        : playgrounds.map((playground) => (
            <Card key={playground.id} className="relative">
              <CardHeader>
                <CardTitle>{playground.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between">
                <Button
                  size="sm"
                  onClick={() => navigate(`/playground/${playground.id}`)}
                >
                  <Play className="mr-1 h-4 w-4" /> Open
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleRename(playground.id)}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(playground.id)}
                      className="text-red-500"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
    </main>
  );
}
