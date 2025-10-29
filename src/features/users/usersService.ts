import type { Profile } from "@/shared/types/profile.ts";
import { supabase } from "@/supabaseClient.ts";

const upsertProfile = async (
  user_id: string,
  display_name: string,
  avatar_url?: string,
) => {
  const { error } = await supabase.from("profiles").upsert({
    user_id,
    display_name,
    ...(avatar_url && { avatar_url }),
  });
  if (error) throw new Error(error.message);
};

const fetchProfile = async (user_id: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("user_id", user_id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data returned");

  return data as Profile;
};

export { upsertProfile, fetchProfile };
