import { Bookmark, Loader2 } from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

import BasePlaygroundCard from "@/components/BasePlaygroundCard.tsx";
import { PlaygroundMeta } from "@/types/firestore";

import AvatarIcon from "../AvatarIcon.tsx";
import { Button } from "../ui/button.tsx";

interface ExplorePlaygroundProps {
  playground: PlaygroundMeta;
  onToggleBookmark: (playgroundId: string, isBookmarked: boolean) => void;
  isOwner: boolean;
}

export default function ExplorePlayground({
  playground,
  onToggleBookmark,
  isOwner,
}: ExplorePlaygroundProps) {
  const [loading, setLoading] = useState(false);

  const handleToggleBookmark = async () => {
    setLoading(true);
    await onToggleBookmark(playground.id, !!playground.isBookmarked);
    setLoading(false);
  };

  return (
    <BasePlaygroundCard
      playground={playground}
      bookmarkCount={playground.bookmarkCount}
    >
      <div className="flex items-center space-x-2">
        {!isOwner && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleToggleBookmark}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Bookmark
                className={playground.isBookmarked ? "text-green-500" : ""}
              />
            )}
          </Button>
        )}
        <Button size="icon" variant="ghost" asChild className="rounded-full">
          <Link to={`/user/${playground.userId}`}>
            <AvatarIcon
              photoURL={playground.userPhotoURL}
              userName={playground.userName}
              className="h-7 w-7"
            />
          </Link>
        </Button>
      </div>
    </BasePlaygroundCard>
  );
}
