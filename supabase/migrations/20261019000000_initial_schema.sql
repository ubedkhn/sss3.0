-- Initial Supabase schema for Shri Sawariya Seth Interior Designs.
-- Public content is read-only in the browser. Writes are handled by Vercel server routes.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null default 'user' check (role in ('admin','user')),
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  location text not null default '',
  project_type text not null default 'Residential',
  category text not null default '',
  year integer not null default extract(year from now())::integer,
  square_footage integer,
  client_brief text not null default '',
  vision text not null default '',
  spatial_challenge text not null default '',
  crafted_solution text not null default '',
  challenge text not null default '',
  solution text not null default '',
  narrative text not null default '',
  cover_image_url text,
  hero_video_url text,
  hero_alt_text text not null default '',
  gallery_items jsonb not null default '[]'::jsonb,
  before_after_items jsonb not null default '[]'::jsonb,
  gallery_urls jsonb not null default '[]'::jsonb,
  video_urls jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null default '',
  phone text,
  project_scope text not null,
  geographic_location text not null,
  desired_timeline text not null,
  investment_range text not null,
  message text,
  status text not null default 'new' check (status in ('new','contacted','qualified','closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.project_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  email text,
  rating integer not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 3 and 1200),
  created_at timestamptz not null default now()
);

create table if not exists public.journal_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  body text not null default '',
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_published_year_idx on public.projects (published, year desc);
create index if not exists project_reviews_project_idx on public.project_reviews (project_id, created_at desc);
create index if not exists inquiries_status_created_idx on public.inquiries (status, created_at desc);
create index if not exists journal_published_idx on public.journal_posts (published, published_at desc);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.inquiries enable row level security;
alter table public.project_reviews enable row level security;
alter table public.journal_posts enable row level security;

drop policy if exists "Published projects are public" on public.projects;
create policy "Published projects are public" on public.projects for select to anon, authenticated using (published = true);
drop policy if exists "Published journal is public" on public.journal_posts;
create policy "Published journal is public" on public.journal_posts for select to anon, authenticated using (published = true);
drop policy if exists "Reviews for published projects are public" on public.project_reviews;
create policy "Reviews for published projects are public" on public.project_reviews for select to anon, authenticated
using (exists (select 1 from public.projects p where p.id = project_id and p.published = true));
drop policy if exists "Read own profile" on public.profiles;
create policy "Read own profile" on public.profiles for select to authenticated using (id = auth.uid());

-- Admin database policies. A profile defaults to role=user; promote only your own verified account.
drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects" on public.projects for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
drop policy if exists "Admins manage inquiries" on public.inquiries;
create policy "Admins manage inquiries" on public.inquiries for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
drop policy if exists "Admins manage reviews" on public.project_reviews;
create policy "Admins manage reviews" on public.project_reviews for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
drop policy if exists "Admins manage journal" on public.journal_posts;
create policy "Admins manage journal" on public.journal_posts for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''), 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Do not seed fictional client projects. Verified portfolio content and local images are a separate step.
-- Keep any Supabase service-role/secret key server-side only; never add it to VITE_* variables.
