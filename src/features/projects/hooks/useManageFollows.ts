import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { type Profile } from "@/types/profile.ts";
import { handleError } from "@/utils/error.ts";

import {
  fetchFollowingProfiles,
  unFollowUser,
} from "../services/projectsService.ts";

export function useManageFollows(userId?: string) {
  const [loading, setLoading] = useState(true);
  const [followingProfiles, setFollowingProfiles] = useState<Profile[] | null>(
    null,
  );
  const [unfollowingId, setUnfollowingId] = useState<string | null>(null);

  useEffect(() => {
    const loadFollowingProfiles = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setFollowingProfiles(await fetchFollowingProfiles(userId));
      } catch (err) {
        handleError(err, "Failed to fetch following profiles");
      } finally {
        setLoading(false);
      }
    };

    loadFollowingProfiles();
  }, [userId]);

  const unfollowCreator = async (creatorId: string) => {
    if (!userId || !creatorId) return;

    try {
      setUnfollowingId(creatorId);
      await unFollowUser(userId, creatorId);
      setFollowingProfiles((prev) =>
        prev ? prev.filter((profile) => profile.user_id !== creatorId) : null,
      );
      toast.success("Successfully unfollowed the creator");
    } catch (err) {
      handleError(err, "Failed to unfollow creator");
    } finally {
      setUnfollowingId(null);
    }
  };

  return {
    loading,
    followingProfiles,
    unfollowCreator,
    unfollowingId,
  };
}
