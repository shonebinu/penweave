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

import type { ProjectInfo, ViewerType } from "../types/types.ts";
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
  projectInfo: ProjectInfo;
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
  const creatorActions = {
    // ActionButton component receives these fields as props
    desktopLeft: [
      {
        onClick: onEditTitle,
        loading: titleEditing,
        icon: Pencil,
        tooltip: "Edit title",
        className: "btn-square btn join-item btn-soft hover:btn-success",
      },
      {
        onClick: toggleVisibility,
        loading: togglingVisibility,
        icon: projectInfo.isPrivate ? Lock : LockOpen,
        tooltip: `Make ${projectInfo.isPrivate ? "public" : "private"}`,
        className: "btn-square btn join-item btn-soft hover:btn-warning",
      },
      {
        onClick: onDeleteProject,
        loading: deleting,
        icon: Trash2,
        tooltip: "Delete project",
        className: "btn-square btn join-item btn-soft hover:btn-error",
      },
    ],
    desktopRight: [
      {
        onClick: updateThumbnail,
        loading: thumbnailUpdating,
        className: "btn",
        children: "Update thumbnail",
      },
      {
        onClick: onFormat,
        className: "btn",
        children: "Format code",
      },
      {
        onClick: onSave,
        loading: saving,
        icon: HardDriveUpload,
        className: "btn btn-primary w-25",
        children: "Save",
      },
    ],
  };

  return (
    <header className="mb-1 flex h-[var(--header-height)] items-center justify-between border-b px-2 lg:px-3">
      {/* left side */}
      <div className="flex items-center gap-2 lg:gap-3">
        {viewerType !== "visitor" && (
          <Link to="/projects" className="btn btn-soft btn-square btn-sm">
            <Home size="1rem" />
          </Link>
        )}
        <Logo />
        {viewerType === "creator" && (
          <div className="join hidden lg:flex">
            {creatorActions.desktopLeft.map((props, i) => (
              <ActionButton key={i} {...props} />
            ))}
          </div>
        )}
        <EditorProjectInfo projectInfo={projectInfo} />
      </div>

      {/* right side */}
      <div className="flex gap-2">
        {viewerType === "creator" && (
          <>
            <div className="hidden gap-2 lg:flex">
              {creatorActions.desktopRight.map(({ children, ...props }, i) => (
                <ActionButton key={i} {...props}>
                  {children}
                </ActionButton>
              ))}
            </div>
            <div className="dropdown dropdown-end lg:hidden">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-square"
              >
                <Menu size="1rem" />
              </div>
              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow"
              >
                {[
                  ...creatorActions.desktopLeft,
                  ...creatorActions.desktopRight,
                ].map((props, i) => (
                  <li key={i}>
                    <ActionButton
                      onClick={props.onClick}
                      loading={props.loading}
                    >
                      {"tooltip" in props ? props.tooltip : props.children}
                    </ActionButton>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {viewerType === "user" && (
          <ActionButton
            className="btn btn-primary max-sm:btn-square"
            onClick={onForkProject}
            loading={forking}
            icon={GitFork}
            title="Fork your own copy of this project."
          >
            <span className="hidden sm:block">Fork</span>
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
