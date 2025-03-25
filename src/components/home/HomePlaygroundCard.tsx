import { Globe, Loader2, Lock, Trash2 } from "lucide-react";

import { useState } from "react";

import BasePlaygroundCard from "@/components/BasePlaygroundCard.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlaygroundMeta } from "@/types/firestore";

import RenamePopover from "../RenamePopover.tsx";

interface HomePlaygroundCardProps {
  playground: PlaygroundMeta;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  onTogglePublic: (id: string, isPublic: boolean) => void;
}

export default function HomePlaygroundCard({
  playground,
  onRename,
  onDelete,
  onTogglePublic,
}: HomePlaygroundCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTogglePublic = async () => {
    setIsToggling(true);
    await onTogglePublic(playground.id, !playground.isPublic);
    setIsToggling(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(playground.id);
    setIsDialogOpen(false);
    setIsDeleting(false);
  };

  return (
    <BasePlaygroundCard
      playground={playground}
      bookmarkCount={playground.bookmarkCount}
    >
      <div className="flex items-center space-x-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleTogglePublic}
          disabled={isToggling}
        >
          {isToggling ? (
            <Loader2 className="animate-spin" />
          ) : playground.isPublic ? (
            <Globe className="text-green-500" />
          ) : (
            <Lock />
          )}
        </Button>

        <RenamePopover
          initialTitle={playground.title}
          onRename={(newTitle) => onRename(playground.id, newTitle)}
        />

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-medium">
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                This action cannot be undone. Your playground will be
                permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={isDeleting}
                className={buttonVariants({ variant: "destructive" })}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </BasePlaygroundCard>
  );
}
