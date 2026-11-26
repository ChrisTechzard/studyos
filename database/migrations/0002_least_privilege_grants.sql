-- Supabase grants broad default privileges to anon/authenticated on public tables.
-- StudyOS tables should expose only the CRUD the application and RLS policies need.

revoke all on public.profiles, public.tasks, public.study_sessions from public;
revoke all on public.profiles, public.tasks, public.study_sessions from anon;

revoke truncate, references, trigger on public.profiles from authenticated;
revoke truncate, references, trigger on public.tasks from authenticated;
revoke truncate, references, trigger on public.study_sessions from authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.tasks, public.study_sessions to authenticated;
