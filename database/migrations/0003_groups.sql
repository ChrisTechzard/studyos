-- StudyOS groups and membership (first social loop).
-- Invite codes are capability secrets: only their SHA-256 hash is stored.

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  handle text not null,
  course_label text,
  level text not null check (level in ('L100', 'L200', 'L300', 'L400', 'POSTGRAD')),
  description text,
  invite_code_hash text not null unique,
  created_at timestamptz not null default now(),
  constraint groups_name_length check (char_length(name) between 3 and 80),
  constraint groups_handle_format check (
    char_length(handle) between 3 and 32
    and handle ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ),
  constraint groups_course_label_length check (char_length(course_label) <= 60),
  constraint groups_description_length check (char_length(description) <= 500)
);

create unique index if not exists groups_handle_lower_key on public.groups (lower(handle));
create index if not exists groups_owner_id_idx on public.groups (owner_id);

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create index if not exists group_members_group_id_idx on public.group_members (group_id);
create index if not exists group_members_user_id_idx on public.group_members (user_id);

-- Security definer avoids recursive RLS checks while keeping membership private to the caller.
create or replace function public.is_current_user_group_member(target_group_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.group_members
    where group_id = target_group_id and user_id = auth.uid()
  );
$$;

revoke all on function public.is_current_user_group_member(uuid) from public, anon;
grant execute on function public.is_current_user_group_member(uuid) to authenticated;

alter table public.groups enable row level security;
alter table public.group_members enable row level security;

drop policy if exists "group members can view groups" on public.groups;
create policy "group members can view groups"
on public.groups for select to authenticated
using (public.is_current_user_group_member(public.groups.id));

drop policy if exists "authenticated users can create groups" on public.groups;
create policy "authenticated users can create groups"
on public.groups for insert to authenticated
with check (owner_id = auth.uid());

drop policy if exists "owners can rotate group invite codes" on public.groups;
create policy "owners can rotate group invite codes"
on public.groups for update to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "group members can view memberships" on public.group_members;
create policy "group members can view memberships"
on public.group_members for select to authenticated
using (
  user_id = auth.uid()
  or public.is_current_user_group_member(public.group_members.group_id)
);

drop policy if exists "users can join groups" on public.group_members;
create policy "users can join groups"
on public.group_members for insert to authenticated
with check (user_id = auth.uid());

-- Supabase grants broad defaults on new tables. Keep only required privileges.
revoke all on public.groups, public.group_members from public, anon, authenticated;

grant select, insert, update on public.groups to authenticated;
grant select, insert on public.group_members to authenticated;
