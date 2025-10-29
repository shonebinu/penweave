import {
  ArrowLeft,
  HardDriveUpload,
  Loader2,
  Lock,
  LockOpen,
  Pencil,
  Trash2,
} from "lucide-react";

import { Link } from "react-router";

import LoadingDots from "@/shared/components/LoadingDots.tsx";
import Logo from "@/shared/components/Logo.tsx";

export default function EditorHeader({
  projectInfo,
  onFormat,
  onSave,
  saving,
  thumbnailUpdating,
  updateThumbnail,
  toggleVisibility,
  togglingVisibility,
}: {
  projectInfo: {
    title: string;
    isPrivate: boolean;
    userId: string;
    userName: string;
    userPhoto: string | null;
  };
  onFormat: () => void;
  onSave: () => void;
  saving: boolean;
  thumbnailUpdating: boolean;
  updateThumbnail: () => void;
  toggleVisibility: () => void;
  togglingVisibility: boolean;
}) {
  return (
    <header className="mb-1 flex h-[var(--header-height)] items-center justify-between border-b px-3">
      <div className="flex items-center gap-3">
        <Logo />
        <Link to="/projects" className="btn btn-soft btn-sm">
          <ArrowLeft size="1rem" />
          Home
        </Link>
        <div className="flex gap-2">
          <div className="tooltip tooltip-bottom" data-tip="Edit title">
            <button className="btn-square btn hover:btn-success">
              <Pencil size="1rem" />
            </button>
          </div>
          <div
            className="tooltip tooltip-bottom"
            data-tip={
              "Make this project " +
              (projectInfo.isPrivate ? "public" : "private")
            }
          >
            <button
              className="btn-square btn hover:btn-warning"
              onClick={toggleVisibility}
              disabled={togglingVisibility}
            >
              {togglingVisibility ? (
                <Loader2 className="animate-spin" size="1rem" />
              ) : !projectInfo.isPrivate ? (
                <LockOpen size="1rem" />
              ) : (
                <Lock size="1rem" />
              )}
            </button>
          </div>
          <div className="tooltip tooltip-bottom" data-tip="Delete project">
            <button className="btn-square btn hover:btn-error">
              <Trash2 size="1rem" />
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="truncate">{projectInfo.title}</p>
          <Link
            to={"/users/" + projectInfo.userId}
            className="link label truncate text-sm"
          >
            {projectInfo.userName}
          </Link>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn" onClick={updateThumbnail}>
          {thumbnailUpdating && <LoadingDots />}
          Update thumbnail
        </button>
        <button className="btn" onClick={onFormat}>
          Format Code
        </button>
        <button className="btn btn-primary w-25" onClick={onSave}>
          {saving ? <LoadingDots /> : <HardDriveUpload size="1rem" />}
          Save
        </button>
      </div>
    </header>
  );
}
