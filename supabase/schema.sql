create extension if not exists moddatetime schema extensions;

-- TABLES
-- projects
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

alter table projects enable row level security;

create policy "Public can read non-private projects"
on projects
for select
using (is_private = false);

create policy "Authors can read their own private projects"
on projects
for select
using (auth.uid() = user_id);

create policy "Authors can insert their own projects"
on projects
for insert
with check (auth.uid() = user_id);

create policy "Authors can update their own projects"
on projects
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Authors can delete their own projects"
on projects
for delete
using (auth.uid() = user_id);

-- profiles
create table profiles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger handle_updated_at before update on profiles
  for each row execute procedure moddatetime(updated_at);

alter table profiles enable row level security;

create policy "Anyone can read profiles"
on profiles
for select
using (true);

create policy "Users can insert their own profile"
on profiles
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own profile"
on profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own profile"
on profiles
for delete
using (auth.uid() = user_id);

-- forks
create table forks (
  id uuid primary key default gen_random_uuid(),
  forked_from uuid,
  forked_to uuid,
  created_at timestamptz not null default now(),
  check (forked_from IS DISTINCT FROM forked_to),
  constraint forks_forked_from_fkey foreign key (forked_from) references projects(id) on delete set null,
  constraint forks_forked_to_fkey foreign key (forked_to) references projects(id) on delete set null
);

alter table forks enable row level security;

create policy "Public can read forks"
on forks
for select
using (true);

create policy "owners of forked_to can insert"
on forks
for insert
with check (
  auth.uid() is not null
  and forked_to is not null
  and exists (
    select 1
    from projects p
    where p.id = forked_to
      and p.user_id = auth.uid()
  )
);

-- likes
create table likes (
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (user_id, project_id)
);

alter table likes enable row level security;

create policy "Public can read likes"
on likes
for select
using (true);

create policy "Users can insert their own likes (but not on their own projects)"
on likes
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from projects p
    where p.id = project_id
      and p.user_id <> auth.uid()
  )
);

create policy "Users can delete their own likes"
on likes
for delete
using (auth.uid() = user_id);

-- follows
create table follows (
  user_id uuid references auth.users(id) on delete cascade not null,       -- the follower
  target_user_id uuid references auth.users(id) on delete cascade not null, -- the person being followed
  created_at timestamptz not null default now(),
  primary key (user_id, target_user_id),
  check (user_id IS DISTINCT FROM target_user_id)
);

alter table follows enable row level security;

create policy "Public can read follows"
on follows
for select
using (true);

create policy "Users can follow others (but not themselves)"
on follows
for insert
with check (
  auth.uid() = user_id
  and user_id IS DISTINCT FROM target_user_id
);

create policy "Users can unfollow others"
on follows
for delete
using (auth.uid() = user_id);

-- bookmarks
create table bookmarks (
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (user_id, project_id)
);

alter table bookmarks enable row level security;

create policy "Users can read their own bookmarks"
on bookmarks
for select
using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks (but not on their own projects)"
on bookmarks
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from projects p
    where p.id = project_id
      and p.user_id <> auth.uid()
  )
);

create policy "Users can delete their own bookmarks"
on bookmarks
for delete
using (auth.uid() = user_id);


-- STORAGE
-- thumbnails
insert into storage.buckets  (id, name, public)values  ('thumbnails', 'thumbnails', true);

create policy "Authenticated users can upload files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'thumbnails'
  and owner = auth.uid()
);

create policy "Any authenticated user can view thumbnails"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'thumbnails'
);

create policy "Users can delete own files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'thumbnails'
  and owner = auth.uid()
);