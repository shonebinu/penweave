import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import type { Project } from "@/shared/types/project.ts";
import { handleError } from "@/utils/error.ts";

import { createProject, fetchAllProjectsByUser } from "./projectsService.ts";

export function useProjects(userId?: string) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const loadProjects = async () => {
      try {
        const projs = await fetchAllProjectsByUser(userId);
        setProjects(projs);
      } catch (err) {
        handleError(err, "Project loading failed");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [userId]);

  const createNewProject = async (
    title: string,
    description: string,
    isPrivate: boolean,
  ) => {
    try {
      if (!userId) throw new Error("User not authenticated");

      const response = await createProject(
        userId,
        title,
        description,
        !isPrivate,
      );
      const projectId = response.id;

      toast.success("Project created succesfully. Opening...");
      navigate(`${projectId}/editor`);
    } catch (err) {
      handleError(err, "Project creation failed");
    }
  };

  return { loading, projects, createNewProject };
}
