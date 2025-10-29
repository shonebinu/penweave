import { useEffect } from "react";
import { Navigate, useParams } from "react-router";

import { useAuth } from "@/features/auth/useAuth.ts";
import LoadingScreen from "@/shared/pages/LoadingScreen.tsx";

import EditorHeader from "../components/EditorHeader.tsx";
import EditorTabs from "../components/EditorTabs.tsx";
import { useProjectEditor } from "../useProjectEditor.ts";
import { useProjectPreview } from "../useProjectPreview.ts";

export default function Editor() {
  const { session } = useAuth();
  const { projectId } = useParams();

  const {
    project,
    authorProfile,
    updateCode,
    loading,
    format,
    save,
    saving,
    toggleVisibility,
    togglingVisibility,
  } = useProjectEditor(session?.user?.id, projectId);

  const {
    iframeRef,
    iframeSrc,
    sendToIframe,
    updateThumbnail,
    thumbnailUpdating,
  } = useProjectPreview(session?.user?.id, projectId, "100vh");

  useEffect(() => {
    if (!project) return;
    sendToIframe(project.html, project.css, project.js);
  }, [project, sendToIframe]);

  if (loading) return <LoadingScreen />;

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
            className="h-full w-full border-0"
          />
        </div>
      </main>
    </div>
  );
}
