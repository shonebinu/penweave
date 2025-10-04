import { useEffect } from "react";
import { Navigate, useParams } from "react-router";

import { useAuth } from "@/features/auth/useAuth.ts";
import { LoadingScreen } from "@/shared/pages/LoadingScreen.tsx";

import { EditorHeader } from "../components/EditorHeader.tsx";
import { EditorTabs } from "../components/EditorTabs.tsx";
import { useProjectEditor } from "../useProjectEditor.ts";
import { useProjectPreview } from "../useProjectPreview.ts";

export function Editor() {
  const { session } = useAuth();
  const { projectId } = useParams();

  const { project, updateCode, loading, format, save, saving } =
    useProjectEditor(session?.user?.id, projectId);

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
  if (!projectId || !project) return <Navigate to="/projects" />;

  return (
    <>
      <EditorHeader
        projectInfo={{ id: projectId, title: project.title }}
        onFormat={format}
        onSave={save}
        saving={saving}
        thumbnailUpdating={thumbnailUpdating}
        updateThumbnail={updateThumbnail}
      />
      <main>
        <EditorTabs
          htmlCode={project.html}
          cssCode={project.css}
          jsCode={project.js}
          setHtmlCode={(val) => updateCode("html", val)}
          setCssCode={(val) => updateCode("css", val)}
          setJsCode={(val) => updateCode("js", val)}
        />
        <iframe ref={iframeRef} src={iframeSrc} className="h-screen w-full" />
      </main>
    </>
  );
}
