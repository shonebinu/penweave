import { decode } from "base64-arraybuffer";

import type { Project } from "@/shared/types/project.ts";
import { supabase } from "@/supabaseClient.ts";

const fetchOwnedProject = async (user_id: string, project_id: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select()
    .eq("id", project_id)
    .eq("user_id", user_id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data returned");
  return data as Project;
};

const updateOwnedProjectCode = async (
  user_id: string,
  project_id: string,
  html: string,
  css: string,
  js: string,
) => {
  const { error } = await supabase
    .from("projects")
    .update({ html, css, js })
    .eq("id", project_id)
    .eq("user_id", user_id);

  if (error) throw new Error(error.message);
};

const updateOwnedProjectThumbnail = async (
  user_id: string,
  project_id: string,
  base64DataUrl: string,
) => {
  const { data: projectData, error: fetchError } = await supabase
    .from("projects")
    .select("image_path")
    .eq("id", project_id)
    .eq("user_id", user_id)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  if (projectData?.image_path) {
    const { error: deleteError } = await supabase.storage
      .from("thumbnails")
      .remove([projectData.image_path]);

    if (deleteError) throw new Error(deleteError.message);
  }

  const filePath = `${user_id}/${project_id}-${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("thumbnails")
    .upload(filePath, decode(base64DataUrl.split("base64,")[1]), {
      contentType: "image/jpeg",
    });

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("thumbnails").getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from("projects")
    .update({ image_url: publicUrl, image_path: filePath })
    .eq("id", project_id)
    .eq("user_id", user_id);

  if (updateError) throw new Error(updateError.message);
};

export {
  fetchOwnedProject,
  updateOwnedProjectCode,
  updateOwnedProjectThumbnail,
};
