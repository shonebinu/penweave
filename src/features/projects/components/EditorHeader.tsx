import {
  GitFork,
  HardDriveUpload,
  Home,
  Lock,
  LockOpen,
  Menu,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";

import { Link } from "react-router";

import LoadingDots from "@/components/LoadingDots.tsx";
import Logo from "@/components/Logo.tsx";

import type { ViewerType } from "../pages/Editor.tsx";

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
            <div
              className="tooltip tooltip-bottom"
              data-tip="Edit project title"
            >
              <button
                className="btn-square btn hover:btn-success join-item btn-soft"
                onClick={onEditTitle}
                disabled={titleEditing}
              >
                {titleEditing ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <Pencil size="1rem" />
                )}
              </button>
            </div>
            <div
              className="tooltip tooltip-bottom"
              data-tip={
                "Make project " + (projectInfo.isPrivate ? "public" : "private")
              }
            >
              <button
                className="btn-square btn hover:btn-warning join-item btn-soft"
                onClick={toggleVisibility}
                disabled={togglingVisibility}
              >
                {togglingVisibility ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : !projectInfo.isPrivate ? (
                  <LockOpen size="1rem" />
                ) : (
                  <Lock size="1rem" />
                )}
              </button>
            </div>
            <div className="tooltip tooltip-bottom" data-tip="Delete project">
              <button
                className="btn-square btn hover:btn-error join-item btn-soft"
                onClick={onDeleteProject}
                disabled={deleting}
              >
                {deleting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <Trash2 size="1rem" />
                )}
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col">
          <p className="truncate font-medium">{projectInfo.title}</p>
          <div className="flex items-center gap-2">
            <div
              className="tooltip tooltip-bottom"
              data-tip="View creator's profile"
            >
              <Link
                to={"/users/" + projectInfo.userId}
                className="link label truncate text-sm"
              >
                <UserRound size=".9rem" />
                {projectInfo.userName}
              </Link>
            </div>
            {projectInfo.forkedFrom && (
              <div
                className="tooltip tooltip-bottom"
                data-tip="View fork origin"
              >
                <Link
                  to={"/projects/" + projectInfo.forkedFrom}
                  className="label link truncate text-sm"
                >
                  <GitFork size=".9rem" />
                  Forked from
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {viewerType === "creator" && (
          <>
            <div className="hidden gap-2 md:flex">
              <button
                className="btn"
                onClick={updateThumbnail}
                disabled={thumbnailUpdating}
              >
                {thumbnailUpdating && <LoadingDots />}
                Update thumbnail
              </button>
              <button className="btn" onClick={onFormat}>
                Format Code
              </button>
              <button
                className="btn btn-primary w-25"
                onClick={onSave}
                disabled={saving}
              >
                {saving ? <LoadingDots /> : <HardDriveUpload size="1rem" />}
                Save
              </button>
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
                  <button
                    onClick={onEditTitle}
                    disabled={titleEditing}
                    className="text-success"
                  >
                    {titleEditing ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <Pencil size="1rem" />
                    )}
                    Edit Title
                  </button>
                </li>
                <li>
                  <button
                    onClick={toggleVisibility}
                    disabled={togglingVisibility}
                    className="text-warning"
                  >
                    {togglingVisibility ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : !projectInfo.isPrivate ? (
                      <LockOpen size="1rem" />
                    ) : (
                      <Lock size="1rem" />
                    )}
                    Make {projectInfo.isPrivate ? "Public" : "Private"}
                  </button>
                </li>
                <li>
                  <button
                    className="text-error"
                    onClick={onDeleteProject}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <Trash2 size="1rem" />
                    )}
                    Delete Project
                  </button>
                </li>
                <li>
                  <button
                    onClick={updateThumbnail}
                    disabled={thumbnailUpdating}
                  >
                    {thumbnailUpdating && <LoadingDots />}
                    Update thumbnail
                  </button>
                </li>
                <li>
                  <button onClick={onFormat}>Format Code</button>
                </li>
                <li>
                  <button
                    className="text-primary"
                    onClick={onSave}
                    disabled={saving}
                  >
                    {saving ? <LoadingDots /> : <HardDriveUpload size="1rem" />}
                    Save
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
        {viewerType === "user" && (
          <button
            className="btn btn-primary"
            title="Fork the project to make your changes."
            onClick={onForkProject}
            disabled={forking}
          >
            {forking ? <LoadingDots /> : <GitFork size="1rem" />}
            <span className="hidden md:block">Fork</span>
          </button>
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
