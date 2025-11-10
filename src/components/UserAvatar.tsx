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
    <div className="avatar avatar-placeholder w-24">
      {avatarUrl ? (
        <div className="w-full rounded-full">
          <img
            src={avatarUrl}
            referrerPolicy="no-referrer"
            alt="User avatar image"
          />
        </div>
      ) : (
        <div className="bg-neutral text-neutral-content w-full rounded-full">
          <span className="font-bold">{userInitials}</span>
        </div>
      )}
    </div>
  );
}
