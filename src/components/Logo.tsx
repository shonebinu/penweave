import { Link } from "react-router";

import PenweaveLogo from "@/assets/penweave.svg";

export default function Logo({
  includeName = false,
  showNameOnLargeOnly = false,
}) {
  return (
    <Link to="/" className="flex shrink-0 items-center">
      <img src={PenweaveLogo} alt="PenWeave Logo" className="h-10 w-10" />

      {includeName && !showNameOnLargeOnly && (
        <h1 className="ml-1 font-medium">PenWeave</h1>
      )}

      {showNameOnLargeOnly && (
        <h1 className="ml-1 hidden font-medium md:block">PenWeave</h1>
      )}
    </Link>
  );
}
