import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarIcon({
  photoURL,
  userName,
}: {
  photoURL: string | null | undefined;
  userName: string | null | undefined;
}) {
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
    <Avatar className="hover:cursor-pointer">
      {photoURL ? (
        <AvatarImage src={photoURL} alt={userName || "User"} />
      ) : (
        <AvatarFallback>{getAvatarFallback(userName)}</AvatarFallback>
      )}
    </Avatar>
  );
}
