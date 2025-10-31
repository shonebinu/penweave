import {
  css as beautifyCSS,
  html as beautifyHTML,
  js as beautifyJS,
} from "js-beautify";
import { useDebouncedCallback } from "use-debounce";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { fetchProfile } from "@/features/users/usersService.ts";
import type { Profile } from "@/shared/types/profile.ts";
import type { SafeProject } from "@/shared/types/project.ts";
import { handleError } from "@/utils/error.ts";

import {
  deleteOwnedProject,
  fetchProject,
  toggleOwnedProjectVisibility,
  updateOwnedProjectCode,
  updateOwnedProjectThumbnail,
  updateOwnedProjectTitle,
} from "./editorService.ts";

export function useProject(userId?: string, projectId?: string) {
  const [project, setProject] = useState<SafeProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authorProfile, setAuthorProfile] = useState<Profile | null>(null);
  const [togglingVisibility, setTogglingVisibility] = useState(false);
  const [thumbnailUpdating, setThumbnailUpdating] = useState(false);

  useEffect(() => {
    if (!projectId || !userId) return;

    const load = async () => {
      try {
        const proj = await fetchProject(projectId);

        if (!proj || (proj.is_private && proj.user_id !== userId)) {
          setProject(null);
          return;
        }

        const profile = await fetchProfile(proj.user_id);

        setAuthorProfile(profile);
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

  const toggleVisibility = async () => {
    if (!userId || !projectId || !project) return;
    try {
      setTogglingVisibility(true);
      await toggleOwnedProjectVisibility(userId, projectId, project.is_private);
      setProject((prev) =>
        prev ? { ...prev, is_private: !prev.is_private } : prev,
      );
      toast.success(
        `Project is now ${project.is_private ? "public" : "private"}.`,
      );
    } catch (err) {
      handleError(err, "Visibility toggle failed");
    } finally {
      setTogglingVisibility(false);
    }
  };

  const editTitle = async (newTitle: string) => {
    if (!userId || !projectId || !project) return;
    try {
      await updateOwnedProjectTitle(userId, projectId, newTitle);
      setProject((prev) => (prev ? { ...prev, title: newTitle } : prev));
      toast.success("Title updated.");
    } catch (err) {
      handleError(err, "Title update failed");
    }
  };

  const deleteProject = async () => {
    if (!userId || !projectId || !project) return;
    try {
      await deleteOwnedProject(userId, projectId);
      toast.success("Project deleted.");
      setProject(null);
    } catch (err) {
      handleError(err, "Project deletion failed");
    }
  };

  const persist = async () => {
    if (!userId || !projectId || !project) return;
    try {
      setSaving(true);
      await updateOwnedProjectCode(
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
  }, 5000);

  const updateCode = (field: "html" | "css" | "js", value: string) => {
    if (!project) return;
    setProject((prev) => (prev ? { ...prev, [field]: value } : prev));
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

  const updateThumbnail = async (captureScreenshot: () => Promise<string>) => {
    if (!userId || !projectId) return;

    try {
      setThumbnailUpdating(true);
      const dataUrl = await captureScreenshot();
      await updateOwnedProjectThumbnail(userId, projectId, dataUrl);
      toast.success("Thumbnail updated!");
    } catch (err) {
      handleError(err, "Thumbnail update failed");
    } finally {
      setThumbnailUpdating(false);
    }
  };

  return {
    project,
    authorProfile,
    updateCode,
    save,
    loading,
    saving,
    format,
    toggleVisibility,
    togglingVisibility,
    editTitle,
    deleteProject,
    updateThumbnail,
    thumbnailUpdating,
  };
}
