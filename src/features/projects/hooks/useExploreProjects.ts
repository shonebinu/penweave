import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { fetchProfile } from "@/features/settings/services/settingsService.ts";
import type { Profile } from "@/types/profile.ts";
import { handleError } from "@/utils/error.ts";

import {
  fetchExploreProjects,
  fetchFollowInfo,
  followUser,
  forkPublicProject,
  likeProject,
  removeLike,
  unFollowUser,
} from "../services/projectsService.ts";
import type { ExploreProject } from "../types/types.ts";

export function useExploreProjects(
  userId?: string,
  page = 1,
  pageSize = 8,
  searchQuery = "",
  exploreUserId?: string,
  followsProjectsOnly = false,
) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ExploreProject[] | null>(null);
  const [totalProjectsCount, setTotalProjectsCount] = useState(0);
  const [forkingId, setForkingId] = useState<string | null>(null);
  const [toggleLikeId, setToggleLikeId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [followInfo, setFollowInfo] = useState<{ userFollows: boolean } | null>(
    null,
  );
  const [togglingFollow, setTogglingFollow] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadExploreProjects = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const { projects: projs, totalProjectsCount: total } =
          await fetchExploreProjects(
            page,
            pageSize,
            searchQuery,
            userId,
            exploreUserId,
            followsProjectsOnly,
          );
        setProjects(projs);
        setTotalProjectsCount(total);
        if (exploreUserId) {
          const [prof, foll] = await Promise.all([
            fetchProfile(exploreUserId),
            fetchFollowInfo(userId, exploreUserId),
          ]);
          setProfile(prof);
          setFollowInfo(foll);
        }
      } catch (err) {
        handleError(err, "Explore projects loading failed");
      } finally {
        setLoading(false);
      }
    };

    loadExploreProjects();
  }, [page, pageSize, searchQuery, userId, exploreUserId, followsProjectsOnly]);

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

  const toggleFollow = async () => {
    if (!userId || !exploreUserId) return;
    try {
      setTogglingFollow(true);
      if (followInfo?.userFollows) {
        await unFollowUser(userId, exploreUserId);
      } else {
        await followUser(userId, exploreUserId);
      }
      setFollowInfo((prev) => ({ ...prev, userFollows: !prev?.userFollows }));
      toast.success(
        followInfo?.userFollows
          ? "Successfully unfollowed"
          : "Successfully followed",
      );
    } catch (err) {
      handleError(
        err,
        followInfo?.userFollows ? "Failed to unfollow" : "Failed to follow",
      );
    } finally {
      setTogglingFollow(false);
    }
  };

  const toggleLike = async (projectId: string) => {
    if (!userId || !projectId || !projects) return;

    const proj = projects.find((p) => p.id === projectId);

    if (!proj) return;

    try {
      setToggleLikeId(projectId);
      if (proj.isLikedByCurrentUser) {
        await removeLike(userId, projectId);
      } else {
        await likeProject(userId, projectId);
      }
      setProjects((prev) =>
        prev
          ? prev.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    isLikedByCurrentUser: !p.isLikedByCurrentUser,
                    likeCount: p.isLikedByCurrentUser
                      ? p.likeCount - 1
                      : p.likeCount + 1,
                  }
                : p,
            )
          : prev,
      );
      toast.success(
        !proj.isLikedByCurrentUser
          ? "Project has been liked"
          : "Project like has been removed",
      );
    } catch (err) {
      handleError(
        err,
        !proj.isLikedByCurrentUser ? "Liking failed" : "Remove like failed",
      );
    } finally {
      setToggleLikeId(null);
    }
  };

  return {
    profile,
    loading,
    projects,
    totalProjectsCount,
    forkProject,
    forkingId,
    toggleLike,
    toggleLikeId,
    followInfo,
    togglingFollow,
    toggleFollow,
  };
}
