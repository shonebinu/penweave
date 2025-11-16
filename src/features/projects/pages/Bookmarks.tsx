import { Bookmark } from "lucide-react";

import HeaderTitle from "../components/HeaderTitle.tsx";

export default function Bookmarks() {
  return (
    <>
      <div className="mb-3">
        <HeaderTitle
          icon={<Bookmark />}
          title="Bookmarks"
          description="Projects you have bookmarked."
        />
      </div>
    </>
  );
}
