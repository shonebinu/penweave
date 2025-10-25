import { Bookmark, BriefcaseBusiness, Earth, Rss } from "lucide-react";

import { Link } from "react-router";

const navItems = [
  { icon: BriefcaseBusiness, label: "My Works", href: "/projects" },
  { icon: Earth, label: "Explore", href: "/explore" },
  { icon: Rss, label: "Following", href: "/following" },
  { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
];

export default function NavMenu() {
  return (
    <div className="flex-none">
      <ul className="menu menu-horizontal gap-1 px-1">
        {navItems.map(({ icon: Icon, label, href }) => (
          <li key={label}>
            <Link to={href}>
              <Icon size="1rem" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
