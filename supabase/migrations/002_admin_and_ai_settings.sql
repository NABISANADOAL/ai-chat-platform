-- Profiles: first registered user becomes admin (via trigger)

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

grant select on public.profiles to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_count int;
  assigned_role text;
begin
  select count(*) into existing_count from public.profiles;
  if existing_count = 0 then
    assigned_role := 'admin';
  else
    assigned_role := 'user';
  end if;

  insert into public.profiles (id, role) values (new.id, assigned_role);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- AI + prompt settings (read/write only via service role API routes)

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

alter table public.app_settings enable row level security;

insert into public.app_settings (key, value)
values (
  'ai',
  jsonb_build_object(
    'provider', 'openrouter',
    'model', 'meta-llama/llama-3.3-70b-instruct:free',
    'systemPrompt', '',
    'baseUrl', null,
    'apiKey', null
  )
)
on conflict (key) do nothing;
