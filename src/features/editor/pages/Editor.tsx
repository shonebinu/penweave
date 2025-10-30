import { useEffect } from "react";
import { Navigate, useParams } from "react-router";

import { useAuth } from "@/features/auth/useAuth.ts";
import { useModal } from "@/shared/hooks/useModal.ts";
import LoadingScreen from "@/shared/pages/LoadingScreen.tsx";

import DeleteProjectModal from "../components/DeleteProjectModal.tsx";
import EditTitleModal from "../components/EditTitleModal.tsx";
import EditorHeader from "../components/EditorHeader.tsx";
import EditorTabs from "../components/EditorTabs.tsx";
import { useProjectEditor } from "../useProjectEditor.ts";
import { useProjectPreview } from "../useProjectPreview.ts";

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
    deleteProject,
  } = useProjectEditor(session?.user?.id, projectId);

  const {
    iframeRef,
    iframeSrc,
    sendToIframe,
    updateThumbnail,
    thumbnailUpdating,
  } = useProjectPreview(session?.user?.id, projectId);

  useEffect(() => {
    if (!project) return;
    sendToIframe(project.html, project.css, project.js);
  }, [project, sendToIframe]);

  if (authLoading || projectLoading) return <LoadingScreen />;

  if (!projectId || !project || !authorProfile)
    return <Navigate to="/projects" />;

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader
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
        updateThumbnail={updateThumbnail}
        toggleVisibility={toggleVisibility}
        togglingVisibility={togglingVisibility}
        onEditTitle={editTitleModal.open}
        onDeleteProject={deleteProjectModal.open}
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
    </div>
  );
}
