export interface Project {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  html: string | null;
  css: string | null;
  js: string | null;
  is_public: boolean;
  is_forked: boolean;
  forked_from: number | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface SafeProject extends Project {
  html: string;
  css: string;
  js: string;
}
