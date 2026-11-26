-- StudyOS initial schema: identity-linked profiles and personal study data.
-- Apply in Supabase SQL editor or with `psql "$DATABASE_URL" -f ...`.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  notes text check (notes is null or char_length(notes) <= 2000),
  course_label text check (course_label is null or char_length(course_label) <= 60),
  due_at timestamptz not null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists tasks_owner_due_at_idx on public.tasks (owner_id, due_at);
create index if not exists tasks_owner_completed_at_idx on public.tasks (owner_id, completed_at);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  title text not null check (char_length(title) between 1 and 120),
  started_at timestamptz not null,
  ended_at timestamptz,
  constraint study_sessions_time_order check (ended_at is null or ended_at > started_at)
);

create unique index if not exists study_sessions_one_active_per_owner
  on public.study_sessions (owner_id) where ended_at is null;
create index if not exists study_sessions_owner_started_at_idx
  on public.study_sessions (owner_id, started_at desc);

-- Security: RLS is a second layer; the repository always filters by owner_id.
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.study_sessions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "tasks_owner_all" on public.tasks;
create policy "tasks_owner_all" on public.tasks
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "sessions_owner_all" on public.study_sessions;
create policy "sessions_owner_all" on public.study_sessions
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.tasks, public.study_sessions to authenticated;
grant select, update on public.profiles to authenticated;

-- New auth users get a profile row that foreign keys can reference.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(coalesce(new.raw_user_meta_data ->> 'display_name', ''), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
