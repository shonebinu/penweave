import { formatDistanceToNow } from "date-fns";
import {
  BellDot,
  CircleUserRound,
  ExternalLink,
  LogOut,
  Settings,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth.ts";
import { useNotifications } from "@/hooks/useNotifications.ts";
import { doSignOut } from "@/services/firebase/auth.ts";
import { markAllNotificationsAsRead } from "@/services/firebase/notificationService.ts";

import AvatarIcon from "../AvatarIcon.tsx";
import { ThemeToggle } from "../ThemeToggle.tsx";
import { Button } from "../ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { Separator } from "../ui/separator.tsx";
import { SidebarTrigger } from "../ui/sidebar.tsx";

export default function Header() {
  const { user } = useAuth();
  const { notifications, isLoading } = useNotifications();

  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate("/", { replace: true });
    await doSignOut();
  };

  const handleNotificationDropdownOpen = (isOpen: boolean) => {
    if (isOpen && user?.uid) {
      markAllNotificationsAsRead(user.uid);
    }
  };

  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between gap-2 border-b px-2 md:pr-6">
      <div className="flex items-center">
        <SidebarTrigger />
        <Separator orientation="vertical" className="ml-2 h-6" />
      </div>
      <div className="flex items-center gap-3">
        <DropdownMenu onOpenChange={handleNotificationDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"} className="relative">
              <BellDot />
              {!isLoading && notifications.some((n) => !n.read) && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isLoading ? (
              <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
            ) : notifications.length === 0 ? (
              <DropdownMenuItem disabled>
                No notifications yet.
              </DropdownMenuItem>
            ) : (
              notifications.map((notif) => (
                <DropdownMenuItem
                  key={notif.id}
                  className="relative flex items-center gap-3 space-y-0"
                  onClick={() => {
                    navigate(`/user/${notif.fromUserId}`);
                  }}
                >
                  <AvatarIcon
                    photoURL={notif.fromUserPhotoURL}
                    userName={notif.fromUserName}
                    className="h-8 w-8"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notif.fromUserName}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {notif.type === "follow" ? (
                          "started following you"
                        ) : (
                          <>
                            forked your{" "}
                            <a
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              href={`/playground/${notif.playgroundId}`}
                              target="_blank"
                              className="underline hover:cursor-pointer"
                            >
                              playground
                              <ExternalLink
                                size={10}
                                className="ml-0.5 inline"
                              />
                            </a>
                          </>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notif.createdAt.toDate(), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  {!notif.read && (
                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
                  )}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span>
              <AvatarIcon
                className="cursor-pointer"
                photoURL={user?.photoURL}
                userName={user?.displayName}
              />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <CircleUserRound />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
