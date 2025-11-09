export default function UserAvatar({
  avatarUrl,
  displayName,
}: {
  avatarUrl?: string;
  displayName: string;
}) {
  const userInitials =
    displayName
      ?.split(" ")
      .map((word: string) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "N/A";

  return (
    <div className="avatar">
      <div className="w-full rounded-full">
        {avatarUrl ? (
          <img src={avatarUrl} referrerPolicy="no-referrer" alt="user avatar" />
        ) : (
          <div className="bg-neutral text-neutral-content flex h-full items-center justify-center">
            <span>{userInitials}</span>
          </div>
        )}
      </div>
    </div>
  );
}
