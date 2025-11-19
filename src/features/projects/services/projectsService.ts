import { decode } from "base64-arraybuffer";

import { supabase } from "@/supabaseClient.ts";
import type { Fork } from "@/types/fork";
import type { Like } from "@/types/like";
import type { Project } from "@/types/project";

import type {
  ExploreProject,
  ProjectWithForkAndLikeInfo,
} from "../types/types.ts";

const DEFAULT_CODE = {
  html: `<!-- Everything inside <body></body> goes here.-->

<button>Click Here</button>`,
  css: `body {
  background-color: white;
}`,

  js: `document.querySelector("button").onclick = () => alert("Hello world!");`,
};

const createProject = async (
  user_id: string,
  title: string,
  html: string = DEFAULT_CODE.html,
  css: string = DEFAULT_CODE.css,
  js: string = DEFAULT_CODE.js,
) => {
  const { data, error } = await supabase
    .from("projects")
    .insert({ user_id, title, html, css, js })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Error creating a new project");

  return data;
};

const fetchUserProjectsWithForkInfo = async (
  user_id: string,
  page: number,
  pageSize: number,
  searchQuery: string,
) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("projects")
    .select(
      `
      *,
      forks:forks_forked_to_fkey (
        forked_from
      ),
      likes:likes (
        user_id
      )
      `,
      { count: "exact" },
    )
    .eq("user_id", user_id)
    .ilike("title", `%${searchQuery}%`)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data returned");

  const projectsWithForkInfo = data.map(({ forks, likes, ...proj }) => ({
    ...proj,
    forkedFrom: forks[0]?.forked_from ?? null,
    likeCount: likes?.length ?? 0,
  }));

  return {
    projects: projectsWithForkInfo as ProjectWithForkAndLikeInfo[],
    totalProjectsCount: count ?? 0,
  };
};

const fetchProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select()
    .eq("id", projectId)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data returned");
  return data as Project;
};

const fetchForkInfo = async (projectId: string) => {
  const { data, error } = await supabase
    .from("forks")
    .select()
    .eq("forked_to", projectId);

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data returned");

  return data.length ? (data[0] as Fork) : null;
};

const fetchLikeInfo = async (userId: string, projectId: string) => {
  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact" })
    .eq("project_id", projectId);

  if (error) throw new Error(error.message);

  const { data, error: likeError } = await supabase
    .from("likes")
    .select()
    .eq("user_id", userId)
    .eq("project_id", projectId);

  if (likeError) throw new Error(likeError.message);

  return {
    likeCount: count as number,
    isLikedByCurrentUser: data.length === 0 ? false : true,
  };
};

const fetchBookmarkInfo = async (userId: string, projectId: string) => {
  const { error, data } = await supabase
    .from("bookmarks")
    .select()
    .eq("project_id", projectId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  return {
    isBookmarkedByCurrentUser: data.length === 0 ? false : true,
  };
};

const fetchFollowInfo = async (sessionUserId: string, targetUserId: string) => {
  const { data, error } = await supabase
    .from("follows")
    .select()
    .eq("user_id", sessionUserId)
    .eq("target_user_id", targetUserId);

  if (error) throw new Error(error.message);

  return { userFollows: data.length === 0 ? false : true };
};

const toggleOwnedProjectVisibility = async (
  userId: string,
  projectId: string,
  currentVisibility: boolean,
) => {
  const { error } = await supabase
    .from("projects")
    .update({ is_private: !currentVisibility })
    .eq("id", projectId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};

const updateOwnedProjectCode = async (
  userId: string,
  projectId: string,
  html: string,
  css: string,
  js: string,
) => {
  const { error } = await supabase
    .from("projects")
    .update({ html, css, js })
    .eq("id", projectId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};

const updateOwnedProjectTitle = async (
  userId: string,
  projectId: string,
  newTitle: string,
) => {
  const { error } = await supabase
    .from("projects")
    .update({ title: newTitle })
    .eq("id", projectId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};

const deleteOwnedProject = async (userId: string, projectId: string) => {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};

const forkPublicProject = async (newUserId: string, projectId: string) => {
  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("title, html, css, js, is_private")
    .eq("id", projectId)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  if (!project) throw new Error("Project not found");
  if (project.is_private) throw new Error("Cannot fork a private project");

  const newProject = await createProject(
    newUserId,
    `${project.title} (fork)`,
    project.html,
    project.css,
    project.js,
  );

  const newProjectId = newProject.id;

  const { error: forkError } = await supabase.from("forks").insert({
    forked_from: projectId,
    forked_to: newProjectId,
  });

  if (forkError) throw new Error(forkError.message);

  return newProjectId as string;
};

const updateOwnedProjectThumbnail = async (
  userId: string,
  projectId: string,
  base64Data: string,
) => {
  const { data: projectData, error: fetchError } = await supabase
    .from("projects")
    .select("thumbnail_path")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  if (projectData?.thumbnail_path) {
    const { error: deleteError } = await supabase.storage
      .from("thumbnails")
      .remove([projectData.thumbnail_path]);

    if (deleteError) throw new Error(deleteError.message);
  }

  const filePath = `${userId}/${projectId}-${Date.now()}.webp`;

  const { error: uploadError } = await supabase.storage
    .from("thumbnails")
    .upload(filePath, decode(base64Data), {
      contentType: "image/webp",
    });

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("thumbnails").getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from("projects")
    .update({ thumbnail_url: publicUrl, thumbnail_path: filePath })
    .eq("id", projectId)
    .eq("user_id", userId);

  if (updateError) throw new Error(updateError.message);
};

const fetchExploreProjects = async (
  page: number,
  pageSize: number,
  searchQuery: string,
  currentUserId: string,
  exploreUserId?: string,
  followsProjectsOnly = false,
) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = supabase
    .from("projects")
    .select(
      `
    *,
    forks!forks_forked_to_fkey (forked_from),
    likes:likes (user_id)
  `,
      { count: "exact" },
    )
    .eq("is_private", false);

  if (exploreUserId) query.eq("user_id", exploreUserId);
  if (followsProjectsOnly) {
    const { data: follows, error: followsError } = await supabase
      .from("follows")
      .select("target_user_id")
      .eq("user_id", currentUserId);

    if (followsError) throw new Error(followsError.message);

    const followsIds = follows.map((f) => f.target_user_id);

    query.in("user_id", followsIds);
  }

  query
    .ilike("title", `%${searchQuery}%`)
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data: projects, error, count } = await query;

  if (error) throw new Error(error.message);

  const userIds = projects.map((p) => p.user_id);

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("user_id, display_name")
    .in("user_id", userIds);

  if (profileError) throw new Error(profileError.message);

  const exploreProjects = projects.map(({ forks, likes, ...proj }) => ({
    ...proj,
    forkedFrom: forks[0]?.forked_from ?? null,
    likeCount: likes?.length ?? 0,
    isLikedByCurrentUser:
      (likes as Like[] | undefined)?.some((l) => l.user_id === currentUserId) ??
      false,
    authorDisplayName:
      profiles?.find((pr) => pr.user_id === proj.user_id)?.display_name ?? null,
  }));

  return {
    projects: exploreProjects as ExploreProject[],
    totalProjectsCount: count ?? 0,
  };
};

const likeProject = async (userId: string, projectId: string) => {
  const { error } = await supabase
    .from("likes")
    .insert({ user_id: userId, project_id: projectId });

  if (error) throw new Error(error.message);
};

const removeLike = async (userId: string, projectId: string) => {
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", userId)
    .eq("project_id", projectId);

  if (error) throw new Error(error.message);
};

const followUser = async (userId: string, targetUserId: string) => {
  const { error } = await supabase
    .from("follows")
    .insert({ user_id: userId, target_user_id: targetUserId });

  if (error) throw new Error(error.message);
};

const unFollowUser = async (userId: string, targetUserId: string) => {
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("user_id", userId)
    .eq("target_user_id", targetUserId);

  if (error) throw new Error(error.message);
};

const addBookmark = async (userId: string, projectId: string) => {
  const { error } = await supabase
    .from("bookmarks")
    .insert({ user_id: userId, project_id: projectId });

  if (error) throw new Error(error.message);
};

const removeBookmark = async (userId: string, projectId: string) => {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("project_id", projectId);

  if (error) throw new Error(error.message);
};

const fetchFollowingProfiles = async (userId: string) => {
  const { data: followingUsers, error: followsError } = await supabase
    .from("follows")
    .select()
    .eq("user_id", userId);

  if (followsError) throw new Error(followsError.message);

  const followingIds = followingUsers?.map((row) => row.target_user_id);

  const { data: followingProfiles, error: profilesError } = await supabase
    .from("profiles")
    .select()
    .in("user_id", followingIds)
    .order("display_name");

  if (profilesError) throw new Error(profilesError.message);

  return followingProfiles;
};

export {
  fetchProject,
  fetchFollowingProfiles,
  updateOwnedProjectCode,
  updateOwnedProjectThumbnail,
  toggleOwnedProjectVisibility,
  updateOwnedProjectTitle,
  forkPublicProject,
  deleteOwnedProject,
  fetchForkInfo,
  fetchUserProjectsWithForkInfo,
  createProject,
  fetchExploreProjects,
  likeProject,
  fetchLikeInfo,
  removeLike,
  fetchFollowInfo,
  followUser,
  unFollowUser,
  addBookmark,
  removeBookmark,
  fetchBookmarkInfo,
};
