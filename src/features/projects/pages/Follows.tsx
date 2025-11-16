import { Rss } from "lucide-react";

import HeaderTitle from "../components/HeaderTitle.tsx";

export default function Follows() {
  return (
    <>
      <div className="mb-3">
        <HeaderTitle
          icon={<Rss />}
          title="Follows"
          description="Creations of people you follow."
        />
      </div>
    </>
  );
}
