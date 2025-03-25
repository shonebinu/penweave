import { Bookmark, GitFork, Loader2 } from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

import BasePlaygroundCard from "@/components/BasePlaygroundCard.tsx";
import { PlaygroundMeta } from "@/types/firestore";

import AvatarIcon from "./AvatarIcon.tsx";
import { Button } from "./ui/button.tsx";

interface ExplorePlaygroundProps {
  playground: PlaygroundMeta;
  onToggleBookmark: (playgroundId: string, isBookmarked: boolean) => void;
  onFork: (playgroundId: string) => void;
  isOwner: boolean;
}

export default function PublicPlaygroundCard({
  playground,
  onToggleBookmark,
  onFork,
  isOwner,
}: ExplorePlaygroundProps) {
  const [isForking, setIsForking] = useState(false);
  const [isBookmarking, setisBookmarking] = useState(false);

  const handleToggleBookmark = async () => {
    setisBookmarking(true);
    await onToggleBookmark(playground.id, !!playground.isBookmarked);
    setisBookmarking(false);
  };

  const handleFork = async () => {
    setIsForking(true);
    await onFork(playground.id);
    setIsForking(false);
  };

  return (
    <BasePlaygroundCard
      playground={playground}
      bookmarkCount={playground.bookmarkCount}
    >
      <div className="flex items-center gap-1">
        {!isOwner && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleFork}
            disabled={isForking}
          >
            {isForking ? <Loader2 className="animate-spin" /> : <GitFork />}
          </Button>
        )}
        {!isOwner && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleToggleBookmark}
            disabled={isBookmarking}
          >
            {isBookmarking ? (
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
