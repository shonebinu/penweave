import { Ellipsis } from "lucide-react";

import { useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Navigate, useParams } from "react-router";

import LoadingScreen from "@/components/LoadingScreen.tsx";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { useModal } from "@/features/projects/hooks/useModal.ts";

import DeleteProjectModal from "../components/DeleteProjectModal.tsx";
import EditTitleModal from "../components/EditTitleModal.tsx";
import EditorHeader from "../components/EditorHeader.tsx";
import EditorTabs from "../components/EditorTabs.tsx";
import { useProject } from "../hooks/useProject.ts";
import { useProjectRenderer } from "../hooks/useProjectRenderer.ts";
import type { ViewerType } from "../types/types.ts";

export default function Editor() {
  const { projectId } = useParams();

  // editor is outside protected route
  const { session, loading: authLoading } = useAuth();

  const editTitleModal = useModal();
  const deleteProjectModal = useModal();

  const {
    project,
    authorProfile,
    updateCode,
    loading: projectLoading,
    format,
    save,
    saving,
    toggleVisibility,
    editTitle,
    togglingVisibility,
    forking,
    deleteProject,
    updateThumbnail,
    thumbnailUpdating,
    titleEditing,
    deleting,
    forkProject,
    forkInfo,
    likeInfo,
    likeToggling,
    toggleLike,
    bookmarkInfo,
    bookmarkToggling,
    toggleBookmark,
  } = useProject(session?.user?.id, projectId, authLoading);

  const {
    iframeRef,
    iframeSrc,
    sendToIframe,
    captureScreenshot,
    iframeLoaded,
  } = useProjectRenderer();

  useEffect(() => {
    if (!project || !iframeLoaded) return;
    sendToIframe(project.html, project.css, project.js);
  }, [project, sendToIframe, iframeLoaded]);

  if (authLoading || projectLoading) return <LoadingScreen />;

  if (!projectId || !project || !authorProfile)
    return <Navigate to="/projects" />;

  let viewerType: ViewerType;

  if (session?.user.id === project.user_id) viewerType = "creator";
  else if (session?.user.id) viewerType = "user";
  else viewerType = "visitor";

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader
        viewerType={viewerType}
        projectInfo={{
          title: project.title,
          isPrivate: project.is_private,
          userId: project.user_id,
          userName: authorProfile.display_name,
          userPhoto: authorProfile.avatar_url,
          forkedFrom: forkInfo ? forkInfo.forked_from : null,
          likeCount: likeInfo?.likeCount ?? 0,
        }}
        onFormat={format}
        onSave={save}
        saving={saving}
        thumbnailUpdating={thumbnailUpdating}
        updateThumbnail={() => updateThumbnail(captureScreenshot)}
        toggleVisibility={toggleVisibility}
        togglingVisibility={togglingVisibility}
        onEditTitle={editTitleModal.open}
        onDeleteProject={deleteProjectModal.open}
        onForkProject={forkProject}
        forking={forking}
        titleEditing={titleEditing}
        deleting={deleting}
        isCurrentUserLiked={likeInfo?.isLikedByCurrentUser}
        likeToggling={likeToggling}
        toggleLike={toggleLike}
        isCurrentUserBookmarked={bookmarkInfo?.isBookmarkedByCurrentUser}
        bookmarkToggling={bookmarkToggling}
        toggleBookmark={toggleBookmark}
      />
      <PanelGroup direction="vertical" className="flex flex-1 flex-col">
        <Panel minSize={10} defaultSize={45}>
          <EditorTabs
            htmlCode={project.html}
            cssCode={project.css}
            jsCode={project.js}
            setHtmlCode={(val) => updateCode("html", val)}
            setCssCode={(val) => updateCode("css", val)}
            setJsCode={(val) => updateCode("js", val)}
          />
        </Panel>
        <PanelResizeHandle>
          <Ellipsis size="1rem" className="mx-auto" />
        </PanelResizeHandle>
        <Panel minSize={10} defaultSize={55} className="flex-1">
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            className="h-full w-full"
            title="Project preview"
          />
        </Panel>
      </PanelGroup>
      {viewerType === "creator" && (
        <>
          <EditTitleModal
            oldTitle={project.title}
            isOpen={editTitleModal.isOpen}
            onClose={editTitleModal.close}
            onSubmit={editTitle}
          />
          <DeleteProjectModal
            isOpen={deleteProjectModal.isOpen}
            onClose={deleteProjectModal.close}
            onSubmit={deleteProject}
          />
        </>
      )}
    </div>
  );
}
