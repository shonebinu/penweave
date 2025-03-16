import { Code, LucideIcon } from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import PenWeaveIcon from "../PenWeaveIcon.tsx";
import { Separator } from "../ui/separator.tsx";

type NavigationItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export default function Sidebar({
  navigationItems,
}: {
  navigationItems: NavigationItem[];
}) {
  const location = useLocation();

  return (
    <SidebarComponent>
      <SidebarHeader>
        <div className="ml-1 mt-5 flex items-center gap-2">
          <PenWeaveIcon />
          <span className="text-base font-semibold">PenWeave</span>
        </div>
        <Separator className="mx-auto mb-2 mt-4 w-[90%]" />
      </SidebarHeader>
      <SidebarMenuButton
        size={"lg"}
        className="pw-button mx-auto w-[90%] justify-center"
        asChild
      >
        <Link to={"/playground/new"}>
          <Code />
          <span>New Playground</span>
        </Link>
      </SidebarMenuButton>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size={"lg"}
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
}
