import { Bookmark } from "lucide-react";

import { Link } from "react-router-dom";

import BasePlaygroundCard from "@/components/BasePlaygroundCard.tsx";
import { PlaygroundWithUser } from "@/types/firestore";

import AvatarIcon from "../AvatarIcon.tsx";
import { Button } from "../ui/button.tsx";

interface HomePlaygroundCardProps {
  playground: PlaygroundWithUser;
}

export default function ExplorePlayground({
  playground,
}: HomePlaygroundCardProps) {
  return (
    <BasePlaygroundCard playground={playground}>
      <div className="flex items-center space-x-2">
        <Button size="sm" variant="ghost">
          <Bookmark />
        </Button>
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
