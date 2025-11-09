import { Share2 } from "lucide-react";

import toast from "react-hot-toast";

import ActionButton from "./ActionButton.tsx";

export default function CopyProjectLinkButton({
  projectId,
}: {
  projectId: string;
}) {
  return (
    <ActionButton
      tooltip="Copy project link to clipboard"
      icon={Share2}
      className="btn btn-square btn-soft"
      onClick={async () => {
        await navigator.clipboard.writeText(
          window.location.origin + "/projects/" + projectId,
        );
        toast.success("Project link copied to clipboard successfully");
      }}
    />
  );
}
