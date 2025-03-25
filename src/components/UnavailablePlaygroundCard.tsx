import { Bookmark, Loader2 } from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";

interface UnavailablePlaygroundCardProps {
  playgroundId: string;
  onRemoveBookmark: (playgroundId: string, isBookmarked: boolean) => void;
}

export default function UnavailablePlaygroundCard({
  playgroundId,
  onRemoveBookmark,
}: UnavailablePlaygroundCardProps) {
  const [loading, setLoading] = useState(false);

  const handleRemoveBookmark = async () => {
    setLoading(true);
    await onRemoveBookmark(playgroundId, true);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-between rounded-sm border p-2 text-sm text-muted-foreground">
      <div></div>
      <div>The owner may have removed or restricted access.</div>
      <div className="ml-auto">
        <Button size="icon" variant="ghost" onClick={handleRemoveBookmark}>
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Bookmark className="text-green-500" />
          )}
        </Button>
      </div>
    </div>
  );
}
