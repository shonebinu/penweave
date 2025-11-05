create extension if not exists moddatetime schema extensions;

-- tables
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null, 
  html text,
  css text,
  js text,
  is_private boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz  not null default now(),
  thumbnail_path text,
  thumbnail_url text
);

create trigger handle_updated_at before update on projects
  for each row execute procedure moddatetime(updated_at);

create table profiles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger handle_updated_at before update on profiles
  for each row execute procedure moddatetime(updated_at);

create table forks (
  id uuid primary key default gen_random_uuid(),
  forked_from uuid,
  forked_to uuid,
  created_at timestamptz not null default now(),
  check (forked_from IS DISTINCT FROM forked_to),
  constraint forks_forked_from_fkey foreign key (forked_from) references projects(id) on delete set null,
  constraint forks_forked_to_fkey foreign key (forked_to) references projects(id) on delete set null
);

-- supabase storage

insert into storage.buckets  (id, name, public)values  ('thumbnails', 'thumbnails', true);

CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'thumbnails');

CREATE POLICY "Users can view own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'thumbnails');

CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'thumbnails'
  AND owner = auth.uid()
);