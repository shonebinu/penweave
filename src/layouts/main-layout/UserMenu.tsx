import { BellRing, LogOut, Settings, UserPen } from "lucide-react";

import { Link } from "react-router";

import { useAuth } from "@/features/auth/useAuth.ts";

const menuItems = [
  { icon: BellRing, label: "Notifications", href: "/notifications" },
  { icon: UserPen, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: LogOut, label: "Logout", href: "/logout" },
];

export function UserMenu() {
  const { session } = useAuth();
  const userAvatar = session?.user.user_metadata.avatar_url;
  const userName = session?.user.user_metadata.full_name;

  const userInitials =
    userName
      ?.split(" ")
      .map((word: string) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "N/A";

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar avatar-online"
      >
        <div className="w-10 rounded-full">
          {userAvatar ? (
            <img
              src={userAvatar}
              referrerPolicy="no-referrer"
              alt="user avatar"
            />
          ) : (
            <div className="bg-neutral text-neutral-content flex h-full items-center justify-center">
              <span>{userInitials}</span>
            </div>
          )}
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 gap-1 p-2 shadow"
      >
        {menuItems.map(({ icon: Icon, label, href }) => (
          <li key={label}>
            <Link to={href}>
              <Icon size="1rem" />
              {label}
              {label === "Notifications" && (
                <div className="badge badge-primary badge-xs">New</div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
