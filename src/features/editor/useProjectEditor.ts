import {
  css as beautifyCSS,
  html as beautifyHTML,
  js as beautifyJS,
} from "js-beautify";
import { useDebouncedCallback } from "use-debounce";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import type { SafeProject } from "@/shared/types/project.ts";
import { handleError } from "@/utils/error.ts";

import { fetchOwnedProject, updatedOwnedProjectCode } from "./editorService.ts";

export function useProjectEditor(userId?: string, projectId?: string) {
  const [project, setProject] = useState<SafeProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId || !projectId) return;

    const load = async () => {
      try {
        const data = await fetchOwnedProject(userId, projectId);
        if (!data?.[0]) {
          setProject(null);
          return;
        }
        const proj = data[0];
        setProject({
          ...proj,
          html: proj.html ?? "",
          css: proj.css ?? "",
          js: proj.js ?? "",
        });
      } catch (err) {
        handleError(err, "Project loading failed");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId, projectId]);

  const persist = async () => {
    if (!userId || !projectId || !project) return;
    try {
      setSaving(true);
      await updatedOwnedProjectCode(
        userId,
        projectId,
        project.html,
        project.css,
        project.js,
      );
    } catch (err) {
      handleError(err, "Project saving failed");
    } finally {
      setSaving(false);
    }
  };

  const debouncedSave = useDebouncedCallback(() => {
    persist();
  }, 2000);

  const updateCode = (field: "html" | "css" | "js", value: string) => {
    if (!project) return;
    setProject({ ...project, [field]: value });
    debouncedSave();
  };

  const format = async () => {
    if (!project) return;
    updateCode("html", beautifyHTML(project.html, { indent_size: 2 }));
    updateCode("css", beautifyCSS(project.css, { indent_size: 2 }));
    updateCode("js", beautifyJS(project.js, { indent_size: 2 }));
    await persist();
  };

  const save = async () => {
    await persist();
    toast.success("Update saved.");
  };

  return { project, updateCode, save, loading, saving, format };
}
