import { Loader2, Pencil, Play, Trash2 } from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { PopoverClose } from "@radix-ui/react-popover";

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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Playground } from "@/types/firestore";

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
  const [newTitle, setNewTitle] = useState(playground.title);
  const [isRenaming, setIsRenaming] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRename = async (id: string, newTitle: string) => {
    setIsRenaming(true);
    await onRename(id, newTitle);
    setIsRenaming(false);
    setOpenPopover(false);
  };

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
          <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <Pencil />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div>
                <h4 className="font-medium">Rename</h4>
                <p className="pb-3 text-sm text-muted-foreground">
                  Rename your playground's title
                </p>
              </div>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new title"
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !isRenaming &&
                    newTitle.trim().length !== 0
                  ) {
                    handleRename(playground.id, newTitle.trim());
                  }
                }}
              />
              <div className="mt-3 flex justify-end gap-1">
                <PopoverClose asChild>
                  <Button variant="ghost" size="sm">
                    Cancel
                  </Button>
                </PopoverClose>
                <Button
                  size="sm"
                  disabled={isRenaming}
                  onClick={() => {
                    handleRename(playground.id, newTitle.trim());
                  }}
                >
                  {isRenaming ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </PopoverContent>
          </Popover>

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
