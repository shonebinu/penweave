import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { handleError } from "@/utils/error.ts";

import {
  fetchExploreProjects,
  forkPublicProject,
} from "../services/projectsService.ts";
import type { ExploreProject } from "../types/types.ts";

export function useExploreProjects(
  userId?: string,
  page = 1,
  pageSize = 8,
  searchQuery = "",
) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ExploreProject[] | null>(null);
  const [totalProjectsCount, setTotalProjectsCount] = useState(0);
  const [forkingId, setForkingId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadExploreProjects = async () => {
      try {
        setLoading(true);
        const { projects: projs, totalProjectsCount: total } =
          await fetchExploreProjects(page, pageSize, searchQuery);
        setProjects(projs);
        setTotalProjectsCount(total);
      } catch (err) {
        handleError(err, "Explore projects loading failed");
      } finally {
        setLoading(false);
      }
    };

    loadExploreProjects();
  }, [page, pageSize, searchQuery]);

  const forkProject = async (projectId: string) => {
    if (!userId || !projectId) return;
    try {
      setForkingId(projectId);
      const newProjectId = await forkPublicProject(userId, projectId);
      toast.success("Project successfully forked. Redirecting...");
      navigate("/projects/" + newProjectId);
    } catch (err) {
      handleError(err, "Project forking failed");
    } finally {
      setForkingId(null);
    }
  };

  return {
    loading,
    projects,
    totalProjectsCount,
    forkProject,
    forkingId,
  };
}
