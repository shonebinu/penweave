import { Loader2, Play, Trash2 } from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Playground } from "@/types/firestore";

import RenamePopover from "../RenamePopover.tsx";

interface PlaygroundCardProps {
  playground: Playground;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

export default function PlaygroundCard({
  playground,
  onRename,
  onDelete,
}: PlaygroundCardProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    await onDelete(id);
    setIsDeleting(false);
  };

  return (
    <Card className="group overflow-hidden rounded-sm transition-all hover:shadow-md">
      <div className="relative">
        <iframe
          srcDoc={`
            <html>
              <head><style>${playground.css}</style></head>
              <body>${playground.html}<script>${playground.js}</script></body>
            </html>
          `}
          sandbox="allow-scripts"
          className="h-40 w-full border-b bg-slate-50"
          title={playground.title}
        />
      </div>
      <CardHeader className="px-4 py-2 pb-0">
        <p className="truncate" title={playground.title}>
          {playground.title}
        </p>
      </CardHeader>
      <CardFooter className="flex items-center justify-between p-4 pt-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/playground/${playground.id}`)}
        >
          <Play /> Open
        </Button>

        <div className="flex items-center space-x-2">
          <RenamePopover
            initialTitle={playground.title}
            onRename={(newTitle) => onRename(playground.id, newTitle)}
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <p className="text-lg font-medium">Are you sure?</p>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone. Your playground will be
                    permanently deleted.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(playground.id)}
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
      </CardFooter>
    </Card>
  );
}
