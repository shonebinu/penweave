import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import {
  fetchUserProjectsWithForkInfo,
  forkPublicProject,
} from "@/features/projects/services/projectsService.ts";
import type { ProjectWithForkInfo } from "@/features/projects/types/types.ts";
import type { Profile } from "@/types/profile.ts";
import { handleError } from "@/utils/error.ts";

import { fetchProfile } from "../services/usersService.ts";

export function useExploreUsersProjects(
  userId?: string,
  sessionUserId?: string,
  page = 1,
  pageSize = 8,
  searchQuery = "",
) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectWithForkInfo[] | null>(null);
  const [totalProjectsCount, setTotalProjectsCount] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [forkingId, setForkingId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProjectsAndProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        const [projectsResult, profile] = await Promise.all([
          fetchUserProjectsWithForkInfo(
            userId,
            page,
            pageSize,
            searchQuery,
            true,
          ),
          fetchProfile(userId),
        ]);

        const { projects: projs, totalProjectsCount: total } = projectsResult;

        setProfile(profile);
        setProjects(projs);
        setTotalProjectsCount(total);
      } catch (err) {
        handleError(err, "User projects loading failed");
      } finally {
        setLoading(false);
      }
    };

    loadUserProjectsAndProfile();
  }, [page, pageSize, searchQuery, userId]);

  const forkProject = async (projectId: string) => {
    if (!sessionUserId || !projectId) return;
    try {
      setForkingId(projectId);
      const newProjectId = await forkPublicProject(sessionUserId, projectId);
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
    profile,
    projects,
    totalProjectsCount,
    forkProject,
    forkingId,
  };
}
