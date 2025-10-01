import { ArrowLeft, HardDriveUpload, Link as LinkIcon } from "lucide-react";

import { Link } from "react-router";

import { LoadingDots } from "@/shared/components/LoadingDots.tsx";
import { LogoWithName } from "@/shared/components/LogoWithName";

export function EditorHeader({
  projectInfo,
  onFormat,
  onSave,
  saving,
}: {
  projectInfo: { id: string; title: string };
  onFormat: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <header className="mb-1 flex h-[var(--header-height)] items-center justify-between border-b px-6">
      <div className="flex items-center gap-3">
        <LogoWithName />
        <Link to="/projects">
          <div className="tooltip tooltip-right" data-tip="Go to My Works">
            <button className="btn btn-square">
              <ArrowLeft size="1rem" />
            </button>
          </div>
        </Link>
      </div>
      <div>
        <Link
          to={`/projects/${projectInfo.id}`}
          className="link flex items-center gap-1"
        >
          <p className="truncate">{projectInfo.title}</p>
          <LinkIcon size="1rem" />
        </Link>
      </div>
      <div className="flex gap-3">
        <button className="btn btn-neutral" onClick={onFormat}>
          Format Code
        </button>
        <button className="btn btn-primary w-30" onClick={onSave}>
          {saving ? (
            <>
              <LoadingDots />
              Saving...
            </>
          ) : (
            <>
              <HardDriveUpload size="1rem" />
              Save
            </>
          )}
        </button>
      </div>
    </header>
  );
}
