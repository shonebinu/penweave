import { Navigate, useParams } from "react-router";

import { useAuth } from "@/features/auth/useAuth.ts";
import { LoadingScreen } from "@/shared/pages/LoadingScreen.tsx";

import { EditorHeader } from "../components/EditorHeader.tsx";
import { EditorTabs } from "../components/EditorTabs.tsx";
import { LivePreview } from "../components/LivePreview.tsx";
import { useProjectEditor } from "../useProjectEditor.ts";

export function Editor() {
  const { session } = useAuth();
  const { projectId } = useParams();

  const { project, updateCode, loading, format, save, saving } =
    useProjectEditor(session?.user?.id, projectId);

  if (loading) return <LoadingScreen />;
  if (!projectId || !project) return <Navigate to="/projects" />;

  return (
    <>
      <EditorHeader
        projectInfo={{ id: projectId, title: project.title }}
        onFormat={format}
        onSave={save}
        saving={saving}
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
        <LivePreview
          htmlCode={project.html}
          cssCode={project.css}
          jsCode={project.js}
        />
      </main>
    </>
  );
}
