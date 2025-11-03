import {
  GitFork,
  HardDriveUpload,
  Home,
  Lock,
  LockOpen,
  Menu,
  Pencil,
  Trash2,
} from "lucide-react";

import { Link } from "react-router";

import Logo from "@/components/Logo.tsx";

import type { ViewerType } from "../types/types.ts";
import ActionButton from "./ActionButton.tsx";
import EditorProjectInfo from "./EditorProjectInfo.tsx";

export default function EditorHeader({
  viewerType,
  projectInfo,
  onFormat,
  onSave,
  saving,
  thumbnailUpdating,
  updateThumbnail,
  toggleVisibility,
  togglingVisibility,
  onEditTitle,
  onDeleteProject,
  onForkProject,
  forking,
  titleEditing,
  deleting,
}: {
  viewerType: ViewerType;
  projectInfo: {
    title: string;
    isPrivate: boolean;
    userId: string;
    userName: string;
    userPhoto: string | null;
    forkedFrom: string | null;
  };
  onFormat: () => void;
  onSave: () => void;
  saving: boolean;
  thumbnailUpdating: boolean;
  updateThumbnail: () => void;
  toggleVisibility: () => void;
  togglingVisibility: boolean;
  onEditTitle: () => void;
  onDeleteProject: () => void;
  onForkProject: () => void;
  forking: boolean;
  titleEditing: boolean;
  deleting: boolean;
}) {
  return (
    <header className="mb-1 flex h-[var(--header-height)] items-center justify-between border-b px-2 md:px-3">
      <div className="flex items-center gap-2 md:gap-3">
        {viewerType !== "visitor" && (
          <Link to="/projects" className="btn btn-soft btn-square btn-sm">
            <Home size="1rem" />
          </Link>
        )}
        <Logo />
        {viewerType === "creator" && (
          <div className="join hidden md:flex">
            <ActionButton
              className="btn-square btn join-item btn-soft hover:btn-success"
              onClick={onEditTitle}
              loading={titleEditing}
              icon={Pencil}
              tooltip="Edit project title"
            />
            <ActionButton
              className="btn-square btn join-item btn-soft hover:btn-warning"
              onClick={toggleVisibility}
              loading={togglingVisibility}
              icon={projectInfo.isPrivate ? Lock : LockOpen}
              tooltip={
                "Make project " + (projectInfo.isPrivate ? "public" : "private")
              }
            />
            <ActionButton
              className="btn-square btn join-item btn-soft hover:btn-error"
              onClick={onDeleteProject}
              loading={deleting}
              icon={Trash2}
              tooltip="Delete project"
            />
          </div>
        )}
        <EditorProjectInfo projectInfo={projectInfo} />
      </div>
      <div className="flex gap-2">
        {viewerType === "creator" && (
          <>
            <div className="hidden gap-2 md:flex">
              <ActionButton
                className="btn"
                onClick={updateThumbnail}
                loading={thumbnailUpdating}
              >
                Update thumbnail
              </ActionButton>
              <button className="btn" onClick={onFormat}>
                Format Code
              </button>
              <ActionButton
                className="btn btn-primary w-25"
                onClick={onSave}
                loading={saving}
                icon={HardDriveUpload}
              >
                Save
              </ActionButton>
            </div>
            <div className="dropdown dropdown-end md:hidden">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-square"
              >
                <Menu size="1rem" />
              </div>
              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li>
                  <ActionButton
                    className="text-success"
                    onClick={onEditTitle}
                    loading={titleEditing}
                    icon={Pencil}
                  >
                    Edit Title
                  </ActionButton>
                </li>
                <li>
                  <ActionButton
                    className="text-warning"
                    onClick={toggleVisibility}
                    loading={togglingVisibility}
                    icon={projectInfo.isPrivate ? Lock : LockOpen}
                  >
                    Make {projectInfo.isPrivate ? "Public" : "Private"}
                  </ActionButton>
                </li>
                <li>
                  <ActionButton
                    className="text-error"
                    onClick={onDeleteProject}
                    loading={deleting}
                    icon={Trash2}
                  >
                    Delete Project
                  </ActionButton>
                </li>
                <li>
                  <ActionButton
                    onClick={updateThumbnail}
                    loading={thumbnailUpdating}
                  >
                    Update thumbnail
                  </ActionButton>
                </li>
                <li>
                  <button onClick={onFormat}>Format Code</button>
                </li>
                <li>
                  <ActionButton
                    className="text-primary"
                    onClick={onSave}
                    loading={saving}
                    icon={HardDriveUpload}
                  >
                    Save
                  </ActionButton>
                </li>
              </ul>
            </div>
          </>
        )}
        {viewerType === "user" && (
          <ActionButton
            className="btn btn-primary"
            onClick={onForkProject}
            loading={forking}
            icon={GitFork}
            title="Fork the project to make your changes."
          >
            <span className="hidden md:block">Fork</span>
          </ActionButton>
        )}
        {viewerType === "visitor" && (
          <>
            <a className="btn-primary btn" href="/login">
              <span className="hidden md:block">
                <GitFork size="1rem" />
              </span>
              Log in <span className="hidden md:block">to fork</span>
            </a>
            <div className="hidden md:block">
              <a className="btn" href="/signup">
                Sign up
              </a>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
