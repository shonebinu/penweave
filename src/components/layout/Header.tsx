import { User as UserType } from "firebase/auth";
import { BellDot, CircleUserRound, LogOut, Settings } from "lucide-react";

import AvatarIcon from "../AvatarIcon.tsx";
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
  user: UserType | null;
  handleLogout: () => Promise<void>;
};

export default function Header({ user, handleLogout }: HeaderProps) {
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
