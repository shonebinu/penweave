import {
  css as beautifyCSS,
  html as beautifyHTML,
  js as beautifyJS,
} from "js-beautify";
import { useDebouncedCallback } from "use-debounce";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { fetchProfile } from "@/features/users/services/usersService.ts";
import type { Fork } from "@/types/fork.ts";
import type { Profile } from "@/types/profile.ts";
import type { SafeProject } from "@/types/project.ts";
import { handleError } from "@/utils/error.ts";

import {
  deleteOwnedProject,
  fetchForkInfo,
  fetchProject,
  forkPublicProject,
  toggleOwnedProjectVisibility,
  updateOwnedProjectCode,
  updateOwnedProjectThumbnail,
  updateOwnedProjectTitle,
} from "../services/projectsService.ts";

export function useProject(
  userId?: string,
  projectId?: string,
  authLoading?: boolean,
) {
  const [project, setProject] = useState<SafeProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authorProfile, setAuthorProfile] = useState<Profile | null>(null);
  const [forkInfo, setForkInfo] = useState<Fork | null>(null);
  const [togglingVisibility, setTogglingVisibility] = useState(false);
  const [thumbnailUpdating, setThumbnailUpdating] = useState(false);
  const [forking, setForking] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId || authLoading) return;

    const load = async () => {
      try {
        const proj = await fetchProject(projectId);

        if (!proj || (proj.is_private && proj.user_id !== userId)) {
          setProject(null);
          return;
        }

        const profile = await fetchProfile(proj.user_id);
        const forkInfo = await fetchForkInfo(proj.id);

        setAuthorProfile(profile);
        setForkInfo(forkInfo);
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
  }, [userId, projectId, authLoading]);

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
      handleError(err, "Visibility toggling failed");
    } finally {
      setTogglingVisibility(false);
    }
  };

  const editTitle = async (newTitle: string) => {
    if (!userId || !projectId || !project) return;
    try {
      setTitleEditing(true);
      await updateOwnedProjectTitle(userId, projectId, newTitle);
      setProject((prev) => (prev ? { ...prev, title: newTitle } : prev));
      toast.success("Title updated.");
    } catch (err) {
      handleError(err, "Title update failed");
    } finally {
      setTitleEditing(false);
    }
  };

  const deleteProject = async () => {
    if (!userId || !projectId || !project) return;
    try {
      setDeleting(true);
      await deleteOwnedProject(userId, projectId);
      toast.success("Project deleted.");
      setProject(null);
    } catch (err) {
      handleError(err, "Project deletion failed");
    } finally {
      setDeleting(false);
    }
  };

  const forkProject = async () => {
    if (!userId || !projectId || !project) return;
    try {
      setForking(true);
      const newProjectId = await forkPublicProject(userId, projectId);
      toast.success("Project successfully forked. Redirecting...");
      navigate("/projects/" + newProjectId);
    } catch (err) {
      handleError(err, "Project forking failed");
    } finally {
      setForking(false);
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

    if (project.user_id !== userId)
      toast.error("Fork the project to make your changes.");
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
    if (!userId || !projectId || !project) return;

    try {
      setThumbnailUpdating(true);
      const dataUrl = await captureScreenshot();
      const base64Data = dataUrl.split("base64,")[1];
      if (!base64Data) throw new Error("The editor is empty");

      await updateOwnedProjectThumbnail(userId, projectId, base64Data);
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
    forking,
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
    forkProject,
    titleEditing,
    deleting,
    forkInfo,
  };
}
