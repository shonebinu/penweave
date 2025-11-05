import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { handleError } from "@/utils/error.ts";

import {
  createProject,
  deleteOwnedProject,
  fetchUserProjectsWithForkInfo,
  toggleOwnedProjectVisibility,
  updateOwnedProjectTitle,
} from "../services/projectsService.ts";
import type { ProjectWithForkInfo } from "../types/types.ts";

export function useProjects(userId?: string, page = 1, pageSize = 8) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectWithForkInfo[] | null>(null);
  const [totalProjectsCount, SetTotalProjectsCount] = useState(0);

  const [creatingProject, setCreatingProject] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingVisibilityId, setTogglingVisibilityId] = useState<
    string | null
  >(null);
  const [titleEditingId, setTitleEditingId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const loadProjects = async () => {
      try {
        setLoading(true);
        const { projects: projs, totalProjectsCount: total } =
          await fetchUserProjectsWithForkInfo(userId, page, pageSize);
        setProjects(projs);
        SetTotalProjectsCount(total);
      } catch (err) {
        handleError(err, "Project loading failed");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [userId, page, pageSize]);

  const createNewProject = async () => {
    if (!userId) return;
    try {
      setCreatingProject(true);
      const project = await createProject(userId, "Untitled");
      toast.success("Project created succesfully. Opening...");
      navigate("/projects/" + project.id);
    } catch (err) {
      handleError(err, "Project creation failed");
    } finally {
      setCreatingProject(false);
    }
  };

  const toggleVisibility = async (
    projectId: string,
    currentVisibility: boolean,
  ) => {
    if (!userId || !projectId) return;
    try {
      setTogglingVisibilityId(projectId);
      await toggleOwnedProjectVisibility(userId, projectId, currentVisibility);
      setProjects((prev) =>
        prev
          ? prev.map((proj) =>
              proj.id === projectId
                ? { ...proj, is_private: !currentVisibility }
                : proj,
            )
          : prev,
      );
      toast.success(
        `Project is now ${currentVisibility ? "public" : "private"}.`,
      );
    } catch (err) {
      handleError(err, "Visibility toggling failed");
    } finally {
      setTogglingVisibilityId(null);
    }
  };

  const editTitle = async (projectId: string, newTitle: string) => {
    if (!userId || !projectId) return;
    try {
      setTitleEditingId(projectId);
      await updateOwnedProjectTitle(userId, projectId, newTitle);
      setProjects((prev) =>
        prev
          ? prev.map((proj) =>
              proj.id === projectId ? { ...proj, title: newTitle } : proj,
            )
          : prev,
      );
      toast.success("Title updated.");
    } catch (err) {
      handleError(err, "Title update failed");
    } finally {
      setTitleEditingId(null);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!userId || !projectId) return;
    try {
      setDeletingId(projectId);
      await deleteOwnedProject(userId, projectId);
      setProjects((prev) =>
        prev ? prev.filter((proj) => proj.id !== projectId) : prev,
      );
      toast.success("Project deleted.");
    } catch (err) {
      handleError(err, "Project deletion failed");
    } finally {
      setDeletingId(null);
    }
  };

  return {
    loading,
    projects,
    createNewProject,
    toggleVisibility,
    editTitle,
    totalProjectsCount,
    deleteProject,
    titleEditingId,
    togglingVisibilityId,
    deletingId,
    creatingProject,
  };
}
