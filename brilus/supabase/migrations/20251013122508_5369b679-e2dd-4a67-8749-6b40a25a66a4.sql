-- Extensiones necesarias
create extension if not exists pgcrypto;
create extension if not exists moddatetime;

-- Perfiles / roles (ya debería existir; si no, créalo)
create table if not exists public.users_profiles (
  user_id uuid primary key,
  role text not null check (role in ('user','editor','ops','admin')),
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger users_profiles_set_updated_at
  before update on public.users_profiles
  for each row execute procedure moddatetime(updated_at);

alter table public.users_profiles enable row level security;

-- Políticas de profiles
drop policy if exists up_read_own on public.users_profiles;
create policy up_read_own on public.users_profiles
for select to authenticated
using (user_id = auth.uid());

drop policy if exists up_insert_self on public.users_profiles;
create policy up_insert_self on public.users_profiles
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists up_update_self on public.users_profiles;
create policy up_update_self on public.users_profiles
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists up_admin_all on public.users_profiles;
create policy up_admin_all on public.users_profiles
for all to authenticated
using (exists (select 1 from public.users_profiles up where up.user_id = auth.uid() and up.role = 'admin'))
with check (exists (select 1 from public.users_profiles up where up.user_id = auth.uid() and up.role = 'admin'));

-- Tabla de equipo (Sobre nosotros)
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_title text not null,
  bio_short text,
  photo_url text,
  email text,
  phone text,
  order_index int default 100,
  visible boolean not null default true,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger team_set_updated_at
  before update on public.team_members
  for each row execute procedure moddatetime(updated_at);

alter table public.team_members enable row level security;

-- RLS team_members
drop policy if exists team_public_read on public.team_members;
create policy team_public_read on public.team_members
for select to anon, authenticated
using (visible = true);

drop policy if exists team_editors_insert on public.team_members;
create policy team_editors_insert on public.team_members
for insert to authenticated
with check (
  exists (select 1 from public.users_profiles up where up.user_id = auth.uid() and up.role in ('editor','admin'))
  and (created_by is null or created_by = auth.uid())
);

drop policy if exists team_editors_update on public.team_members;
create policy team_editors_update on public.team_members
for update to authenticated
using (exists (select 1 from public.users_profiles up where up.user_id = auth.uid() and up.role in ('editor','admin')))
with check (updated_by = auth.uid());

drop policy if exists team_admin_delete on public.team_members;
create policy team_admin_delete on public.team_members
for delete to authenticated
using (exists (select 1 from public.users_profiles up where up.user_id = auth.uid() and up.role = 'admin'));

-- Envíos de formularios (se insertan vía Edge Function)
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_name text not null,
  payload jsonb not null,
  email text,
  status text not null default 'new' check (status in ('new','in_review','done','spam')),
  handled_by uuid,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger fs_set_updated_at
  before update on public.form_submissions
  for each row execute procedure moddatetime(updated_at);

alter table public.form_submissions enable row level security;

-- RLS form_submissions: solo ops y admin leen/actualizan
drop policy if exists fs_ops_read on public.form_submissions;
create policy fs_ops_read on public.form_submissions
for select to authenticated
using (exists (select 1 from public.users_profiles up where up.user_id = auth.uid() and up.role in ('ops','admin')));

drop policy if exists fs_ops_update on public.form_submissions;
create policy fs_ops_update on public.form_submissions
for update to authenticated
using (exists (select 1 from public.users_profiles up where up.user_id = auth.uid() and up.role in ('ops','admin')))
with check (true);

drop policy if exists fs_admin_delete on public.form_submissions;
create policy fs_admin_delete on public.form_submissions
for delete to authenticated
using (exists (select 1 from public.users_profiles up where up.user_id = auth.uid() and up.role = 'admin'));

-- Crear bucket blog-media si no existe
insert into storage.buckets (id, name, public)
values ('blog-media', 'blog-media', false)
on conflict (id) do nothing;

-- RLS para bucket blog-media: solo editors y admins pueden subir/actualizar
drop policy if exists "Editors can upload to blog-media" on storage.objects;
create policy "Editors can upload to blog-media"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'blog-media' 
  and exists (select 1 from public.users_profiles up where up.user_id = auth.uid() and up.role in ('editor','admin'))
);

drop policy if exists "Editors can update blog-media" on storage.objects;
create policy "Editors can update blog-media"
on storage.objects for update to authenticated
using (
  bucket_id = 'blog-media'
  and exists (select 1 from public.users_profiles up where up.user_id = auth.uid() and up.role in ('editor','admin'))
);

drop policy if exists "Editors can read blog-media" on storage.objects;
create policy "Editors can read blog-media"
on storage.objects for select to authenticated
using (
  bucket_id = 'blog-media'
  and exists (select 1 from public.users_profiles up where up.user_id = auth.uid() and up.role in ('editor','admin'))
);

drop policy if exists "Editors can delete blog-media" on storage.objects;
create policy "Editors can delete blog-media"
on storage.objects for delete to authenticated
using (
  bucket_id = 'blog-media'
  and exists (select 1 from public.users_profiles up where up.user_id = auth.uid() and up.role = 'admin')
);