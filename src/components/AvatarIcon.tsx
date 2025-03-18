import { forwardRef } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const AvatarIcon = forwardRef<
  HTMLSpanElement,
  {
    photoURL: string | null | undefined;
    userName: string | null | undefined;
    className?: string;
  }
>(({ photoURL, userName, className }, ref) => {
  const getAvatarFallback = (name: string | null | undefined) =>
    name
      ? name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";

  return (
    <Avatar ref={ref} className={cn("h-10 w-10", className)}>
      {photoURL ? (
        <AvatarImage src={photoURL} alt={userName || "User"} />
      ) : (
        <AvatarFallback>{getAvatarFallback(userName)}</AvatarFallback>
      )}
    </Avatar>
  );
});

AvatarIcon.displayName = "AvatarIcon";

export default AvatarIcon;
