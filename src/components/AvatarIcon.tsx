import { forwardRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const getAvatarFallback = (name: string | null | undefined) =>
  name
    ? name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

const AvatarIcon = forwardRef<
  HTMLSpanElement,
  {
    photoURL: string | null | undefined;
    userName: string | null | undefined;
    className?: string;
  }
>(({ photoURL, userName, className }, ref) => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => setLoaded(true);
  const handleError = () => setHasError(true);

  return (
    <Avatar ref={ref} className={cn("h-10 w-10", className)}>
      {photoURL && !hasError ? (
        <>
          <AvatarImage
            src={photoURL}
            alt={userName || "User"}
            onLoad={handleLoad}
            onError={handleError}
            className={loaded ? "block" : "hidden"}
            referrerPolicy="no-referrer"
          />
          {!loaded && (
            <AvatarFallback>{getAvatarFallback(userName)}</AvatarFallback>
          )}
        </>
      ) : (
        <AvatarFallback>{getAvatarFallback(userName)}</AvatarFallback>
      )}
    </Avatar>
  );
});

AvatarIcon.displayName = "AvatarIcon";

export default AvatarIcon;
