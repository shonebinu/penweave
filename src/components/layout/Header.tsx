import { User } from "firebase/auth";
import { BellDot, LogOut, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ThemeToggle } from "../ThemeToggle.tsx";
import { Button } from "../ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { Separator } from "../ui/separator.tsx";
import { SidebarTrigger } from "../ui/sidebar.tsx";

type HeaderProps = {
  user: User | null;
  handleLogout: () => Promise<void>;
};

export default function Header({ user, handleLogout }: HeaderProps) {
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
    <header className="flex h-16 w-full shrink-0 items-center justify-between gap-2 border-b px-2 md:pr-6">
      <div className="flex items-center">
        <SidebarTrigger />
        <Separator orientation="vertical" className="ml-2 h-6" />
      </div>
      <div className="flex items-center gap-3">
        <Button variant={"outline"} size={"icon"}>
          <BellDot />
        </Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="hover:cursor-pointer">
              {user?.photoURL ? (
                <AvatarImage
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                />
              ) : (
                <AvatarFallback>
                  {getAvatarFallback(user?.displayName)}
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
