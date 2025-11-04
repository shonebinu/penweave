import { decode } from "base64-arraybuffer";

import { supabase } from "@/supabaseClient.ts";
import type { Fork } from "@/types/fork";
import type { Project } from "@/types/project";

const DEFAULT_CODE = {
  html: `<button>Click Here</button>`,
  css: `body { 
  background-color: white; 
} 

button { 
  color: green;
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

const fetchAllProjectsByUser = async (user_id: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select()
    .eq("user_id", user_id)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data returned");

  return data as Project[];
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

  const filePath = `${userId}/${projectId}-${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("thumbnails")
    .upload(filePath, decode(base64Data), {
      contentType: "image/jpeg",
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

export {
  fetchProject,
  updateOwnedProjectCode,
  updateOwnedProjectThumbnail,
  toggleOwnedProjectVisibility,
  updateOwnedProjectTitle,
  forkPublicProject,
  deleteOwnedProject,
  fetchForkInfo,
  fetchAllProjectsByUser,
  createProject,
};
