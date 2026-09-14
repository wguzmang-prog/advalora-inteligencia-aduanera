-- ============================================================================
-- ADVALORA - INTELIGENCIA ADUANERA & SUNAT PRE-DAM
-- ARCHIVO DE MIGRACIÓN SUPABASE / POSTGRESQL
--
-- INSTRUCCIONES:
-- 1. Entra a tu proyecto en https://supabase.com/dashboard
-- 2. En el menú lateral haz clic en "SQL Editor" (ícono con corchetes >_)
-- 3. Haz clic en "New query"
-- 4. Pega todo el contenido de este script y presiona el botón verde "Run"
-- ============================================================================

-- 1. Habilitar extensión para UUIDs automáticos
create extension if not exists "pgcrypto";

-- ============================================================================
-- TABLA 1: customs_operations (Despachos, Expedientes y Declaraciones Pre-DAM)
-- Usado por: Screen 3 (Wizard), Screen 2 (Dashboard), Screen 4 (OCR), Screen 7 (Liquidación)
-- ============================================================================
create table if not exists public.customs_operations (
  id uuid default gen_random_uuid() primary key,
  reference_number text unique not null,
  regime text not null default '10', -- 10: Importación para el Consumo
  transport_mode text not null default 'Marítimo', -- Marítimo / Aéreo
  customs_code text not null default '118', -- 118: Callao Marítimo, 235: Callao Aéreo
  customs_name text default 'Intendencia de Aduana Marítima del Callao',
  importer_ruc text not null,
  importer_name text not null,
  incoterm text not null default 'CIF',
  cif_usd numeric(14, 2) default 0.00,
  documents_count int default 0,
  critical_issues_count int default 0,
  status text default 'Borrador', -- Borrador, Auditado, En Observación, Transmitido SUNAT
  assigned_to text default 'Liquidador Senior',
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices para búsqueda rápida en el Dashboard
create index if not exists idx_customs_operations_ruc on public.customs_operations (importer_ruc);
create index if not exists idx_customs_operations_ref on public.customs_operations (reference_number);
create index if not exists idx_customs_operations_status on public.customs_operations (status);

-- ============================================================================
-- TABLA 2: team_members (Gestión de Equipo, Liquidadores y Agentes)
-- Usado por: Screen 9 (Ajustes y Permisos del Equipo Aduanero)
-- ============================================================================
create table if not exists public.team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  role text not null default 'Liquidador Senior',
  status text default 'Activo',
  avatar_url text,
  operations_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_team_members_email on public.team_members (email);

-- ============================================================================
-- TABLA 3: nandina_classifications (Clasificador Arancelario Inteligente NANDINA)
-- Usado por: Screen 6 (Clasificador Arancelario) y Screen 5 (Detalle de Subpartida)
-- ============================================================================
create table if not exists public.nandina_classifications (
  id uuid default gen_random_uuid() primary key,
  reference_code text not null,
  commercial_description text not null,
  hs_code text not null, -- Subpartida nacional a 10 dígitos (ej: 8471.30.00.00)
  confidence_score int default 95,
  tariff_rate_adv numeric(5, 2) default 0.00, -- Ad-Valórem %
  igv_rate numeric(5, 2) default 16.00, -- IGV %
  ipm_rate numeric(5, 2) default 2.00, -- IPM %
  restrictions text, -- SENASA, DIGEMID, MTC, SUCAMEC
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_nandina_hs_code on public.nandina_classifications (hs_code);

-- ============================================================================
-- POLÍTICAS DE ACCESO (ROW LEVEL SECURITY - RLS)
-- Permite que la API Key 'anon' configurada en Vercel lea y guarde datos
-- ============================================================================
alter table public.customs_operations enable row level security;
alter table public.team_members enable row level security;
alter table public.nandina_classifications enable row level security;

-- Limpiar políticas previas si existían
drop policy if exists "Acceso público lectura/escritura operaciones" on public.customs_operations;
drop policy if exists "Acceso público lectura/escritura equipo" on public.team_members;
drop policy if exists "Acceso público lectura/escritura clasificaciones" on public.nandina_classifications;

-- Crear políticas permisivas para clientes anónimos autenticados por token anon
create policy "Acceso público lectura/escritura operaciones"
  on public.customs_operations for all
  using (true)
  with check (true);

create policy "Acceso público lectura/escritura equipo"
  on public.team_members for all
  using (true)
  with check (true);

create policy "Acceso público lectura/escritura clasificaciones"
  on public.nandina_classifications for all
  using (true)
  with check (true);

-- ============================================================================
-- REGISTROS INICIALES (SEMILLA / SEED DATA PARA PRUEBAS INMEDIATAS)
-- ============================================================================
insert into public.team_members (name, email, role, status, avatar_url, operations_count)
values
  ('Ing. Carlos Mendoza', 'carlos.mendoza@gestionglobal.pe', 'Agente de Aduana', 'Activo', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80', 142),
  ('Lic. Patricia Vega', 'patricia.vega@gestionglobal.pe', 'Liquidadora Senior', 'Activo', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', 98),
  ('Dr. Fernando Quispe', 'fernando.quispe@gestionglobal.pe', 'Abogado Aduanero', 'Activo', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', 54)
on conflict (email) do nothing;

insert into public.customs_operations (reference_number, regime, transport_mode, customs_code, customs_name, importer_ruc, importer_name, incoterm, cif_usd, documents_count, critical_issues_count, status)
values
  ('ADV-2024-0892', '10', 'Marítimo', '118', 'Intendencia de Aduana Marítima del Callao', '20554921098', 'TechImports Perú S.A.C.', 'CIF', 153550.00, 5, 2, 'En Observación'),
  ('ADV-2024-0891', '10', 'Aéreo', '235', 'Intendencia de Aduana Aérea del Callao', '20100123456', 'Distribuidora Médica del Pacífico S.A.', 'FOB', 48200.00, 4, 0, 'Transmitido SUNAT'),
  ('ADV-2024-0890', '10', 'Marítimo', '118', 'Intendencia de Aduana Marítima del Callao', '20498765432', 'Agroindustrias del Norte S.A.A.', 'CIF', 89400.00, 6, 0, 'Auditado')
on conflict (reference_number) do nothing;
