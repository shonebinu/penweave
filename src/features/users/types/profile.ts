export interface Profile {
  user_id: string;
  avatar_url: string | null;
  display_name: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}
