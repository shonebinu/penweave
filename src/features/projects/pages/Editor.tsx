import { useEffect } from "react";
import { Navigate, useParams } from "react-router";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { useModal } from "@/shared/hooks/useModal.ts";
import LoadingScreen from "@/shared/pages/LoadingScreen.tsx";

import DeleteProjectModal from "../components/DeleteProjectModal.tsx";
import EditTitleModal from "../components/EditTitleModal.tsx";
import EditorHeader from "../components/EditorHeader.tsx";
import EditorTabs from "../components/EditorTabs.tsx";
import { useProject } from "../hooks/useProject.ts";
import { useProjectRenderer } from "../hooks/useProjectRenderer.ts";

export type ViewerType = "creator" | "user" | "visitor";

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
  } = useProject(session?.user?.id, projectId, authLoading);

  const { iframeRef, iframeSrc, sendToIframe, captureScreenshot } =
    useProjectRenderer();

  useEffect(() => {
    if (!project) return;

    sendToIframe(project.html, project.css, project.js);
  }, [project, sendToIframe]);

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
      />
      <main className="flex flex-1 flex-col">
        <EditorTabs
          htmlCode={project.html}
          cssCode={project.css}
          jsCode={project.js}
          setHtmlCode={(val) => updateCode("html", val)}
          setCssCode={(val) => updateCode("css", val)}
          setJsCode={(val) => updateCode("js", val)}
        />
        <div className="flex-1">
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            className="h-full w-full"
            title="Project preview"
          />
        </div>
      </main>
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
