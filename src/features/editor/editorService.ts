import type { Project } from "@/shared/types/project.ts";
import { supabase } from "@/supabaseClient.ts";

const fetchOwnedProject = async (user_id: string, project_id: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select()
    .eq("id", project_id)
    .eq("user_id", user_id);

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data returned");
  return data as Project[];
};

const updatedOwnedProjectCode = async (
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

export { fetchOwnedProject, updatedOwnedProjectCode };
