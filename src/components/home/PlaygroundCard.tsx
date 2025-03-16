import { Loader2, Pencil, Play, Trash2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";
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
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <Pencil />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div className="space-y-2">
                <h4 className="font-medium">Rename</h4>
                <p className="pt-0 text-sm text-muted-foreground">
                  Rename your playground's title
                </p>
              </div>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new title"
              />
              <div className="mt-2 flex justify-end space-x-2">
                <Button variant="ghost" size="icon">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    onRename(playground.id, newTitle);
                  }}
                >
                  Save
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <AlertDialog>
            <AlertDialogTrigger>
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
                <AlertDialogAction asChild>
                  <>
                    <Button
                      variant="destructive"
                      disabled={isDeleting}
                      onClick={() => handleDelete(playground.id)}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
