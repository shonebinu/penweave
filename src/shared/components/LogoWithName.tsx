import { Link } from "react-router";

import PenweaveLogo from "@/assets/penweave.svg";

export default function LogoWithName() {
  return (
    <Link to="/" className="flex items-center">
      <img src={PenweaveLogo} alt="PenWeave Logo" className="h-10 w-10" />
      <h1 className="ml-1 font-medium">PenWeave</h1>
    </Link>
  );
}
