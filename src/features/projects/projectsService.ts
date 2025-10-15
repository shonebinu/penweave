import { supabase } from "@/supabaseClient.ts";

const DEFAULT_CODE = {
  html: "<button>Click Here</button>",
  css: "button { color: green; }",
  js: "document.querySelector('button').onclick = () => alert('Hello world!');",
};

const createProject = async (
  user_id: string,
  title: string,
  description: string,
  is_public: boolean,
  html: string = DEFAULT_CODE.html,
  css: string = DEFAULT_CODE.css,
  js: string = DEFAULT_CODE.js,
) => {
  const { data, error } = await supabase
    .from("projects")
    .insert({ user_id, title, description, is_public, html, css, js })
    .select("id");

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Error creating a new project");

  return data;
};

const fetchAllProjectsByUser = async (user_id: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select()
    .eq("user_id", user_id);

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data returned");

  return data;
};

export { createProject, fetchAllProjectsByUser };
