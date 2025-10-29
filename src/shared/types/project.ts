export interface Project {
  id: number;
  user_id: string;
  title: string;
  html: string | null;
  css: string | null;
  js: string | null;
  is_private: boolean;
  thumbnail_url: string | null;
  thumbnail_path: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface SafeProject extends Project {
  html: string;
  css: string;
  js: string;
}
