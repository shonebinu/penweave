import { Loader2, Pencil } from "lucide-react";

import { useState } from "react";

import { PopoverClose } from "@radix-ui/react-popover";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RenamePopoverProps {
  initialTitle: string;
  onRename: (newTitle: string) => void;
}

export default function RenamePopover({
  initialTitle,
  onRename,
}: RenamePopoverProps) {
  const [newTitle, setNewTitle] = useState(initialTitle);
  const [isRenaming, setIsRenaming] = useState(false);
  const [open, setOpen] = useState(false);

  const handleRename = async () => {
    if (!newTitle.trim() || isRenaming) return;
    setIsRenaming(true);
    await onRename(newTitle.trim());
    setIsRenaming(false);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
            if (e.key === "Enter") handleRename();
          }}
        />
        <div className="mt-3 flex justify-end gap-1">
          <PopoverClose asChild>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </PopoverClose>
          <Button size="sm" disabled={isRenaming} onClick={handleRename}>
            {isRenaming ? (
              <>
                <Loader2 className="animate-spin" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
