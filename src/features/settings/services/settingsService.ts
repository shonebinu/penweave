import { supabase } from "@/supabaseClient.ts";
import type { Profile } from "@/types/profile";

const upsertProfile = async (
  userId: string,
  displayName: string,
  avatarUrl?: string,
) => {
  const { error } = await supabase.from("profiles").upsert({
    user_id: userId,
    display_name: displayName,
    ...(avatarUrl && { avatar_url: avatarUrl }),
  });
  if (error) throw new Error(error.message);
};

const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("user_id", userId)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data returned");

  return data as Profile;
};

export { upsertProfile, fetchProfile };
