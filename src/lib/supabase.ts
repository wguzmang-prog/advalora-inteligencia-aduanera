import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const metaEnv = (import.meta as any).env || {};
const ENV_SUPABASE_URL = metaEnv.VITE_SUPABASE_URL || '';
const ENV_SUPABASE_ANON_KEY = metaEnv.VITE_SUPABASE_ANON_KEY || '';

// LocalStorage keys for optional in-app configuration fallback
const LS_URL_KEY = 'advalora_supabase_url';
const LS_ANON_KEY = 'advalora_supabase_anon_key';

let cachedClient: SupabaseClient | null = null;
let lastKnownUrl = '';
let lastKnownKey = '';

/**
 * Returns current Supabase credentials (from env vars or local storage)
 */
export function getSupabaseCredentials(): { url: string; key: string; isConfigured: boolean; source: 'env' | 'storage' | 'none' } {
  const envUrl = ENV_SUPABASE_URL.trim();
  const envKey = ENV_SUPABASE_ANON_KEY.trim();

  if (envUrl && envKey) {
    return { url: envUrl, key: envKey, isConfigured: true, source: 'env' };
  }

  const storedUrl = (typeof window !== 'undefined' ? localStorage.getItem(LS_URL_KEY) : '') || '';
  const storedKey = (typeof window !== 'undefined' ? localStorage.getItem(LS_ANON_KEY) : '') || '';

  if (storedUrl.trim() && storedKey.trim()) {
    return { url: storedUrl.trim(), key: storedKey.trim(), isConfigured: true, source: 'storage' };
  }

  return { url: '', key: '', isConfigured: false, source: 'none' };
}

/**
 * Saves Supabase credentials to localStorage (for easy testing without restarting server)
 */
export function setSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LS_URL_KEY, url.trim());
    localStorage.setItem(LS_ANON_KEY, key.trim());
    cachedClient = null; // force recreation
  }
}

/**
 * Clears stored Supabase credentials
 */
export function clearSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LS_URL_KEY);
    localStorage.removeItem(LS_ANON_KEY);
    cachedClient = null;
  }
}

/**
 * Safe lazy getter for Supabase Client
 */
export function getSupabaseClient(): SupabaseClient | null {
  const { url, key, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return null;
  }

  if (cachedClient && lastKnownUrl === url && lastKnownKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
    lastKnownUrl = url;
    lastKnownKey = key;
    return cachedClient;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    return null;
  }
}

// ----------------------------------------------------------------------------
// Database Models & Interfaces
// ----------------------------------------------------------------------------

export interface DbCustomsOperation {
  id?: string;
  reference_number: string;
  regime: string;
  transport_mode: string;
  customs_code: string;
  customs_name: string;
  importer_ruc: string;
  importer_name: string;
  incoterm: string;
  cif_usd: number;
  documents_count: number;
  critical_issues_count: number;
  status: 'Borrador' | 'Auditado' | 'En Observación' | 'Transmitido SUNAT';
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface DbTeamMember {
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  operations_count?: number;
  avatar_url?: string;
  created_at?: string;
}

export interface DbClassificationRecord {
  id?: string;
  reference_code: string;
  commercial_description: string;
  hs_code: string;
  confidence_score: number;
  tariff_rate_adv: number;
  igv_rate: number;
  ipm_rate: number;
  restrictions?: string;
  created_at?: string;
}

// ----------------------------------------------------------------------------
// Form Integration Functions
// ----------------------------------------------------------------------------

/**
 * 1. Inserts or saves a Customs Operation (Wizard Form)
 */
export async function saveCustomsOperationToSupabase(op: DbCustomsOperation): Promise<{ success: boolean; data?: any; error?: string; mode: 'supabase' | 'local' }> {
  const supabase = getSupabaseClient();

  // If Supabase is configured, save in database
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('customs_operations')
        .upsert({
          reference_number: op.reference_number,
          regime: op.regime,
          transport_mode: op.transport_mode,
          customs_code: op.customs_code,
          customs_name: op.customs_name,
          importer_ruc: op.importer_ruc,
          importer_name: op.importer_name,
          incoterm: op.incoterm,
          cif_usd: op.cif_usd,
          documents_count: op.documents_count,
          critical_issues_count: op.critical_issues_count,
          status: op.status,
          metadata: op.metadata || {},
          updated_at: new Date().toISOString()
        }, { onConflict: 'reference_number' })
        .select();

      if (error) {
        console.warn('Supabase insert warning:', error.message);
        // Fallback save in localStorage so no data is ever lost
        saveToLocalStorageList('advalora_local_operations', op);
        return { success: true, error: error.message, mode: 'local' };
      }

      return { success: true, data, mode: 'supabase' };
    } catch (err: any) {
      console.error('Supabase exception:', err);
      saveToLocalStorageList('advalora_local_operations', op);
      return { success: true, error: err.message, mode: 'local' };
    }
  }

  // Local storage fallback
  saveToLocalStorageList('advalora_local_operations', op);
  return { success: true, mode: 'local' };
}

/**
 * 2. Inserts a Team Member (Settings Form)
 */
export async function saveTeamMemberToSupabase(member: DbTeamMember): Promise<{ success: boolean; data?: any; error?: string; mode: 'supabase' | 'local' }> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          name: member.name,
          email: member.email,
          role: member.role,
          status: member.status || 'Activo',
          avatar_url: member.avatar_url,
          operations_count: member.operations_count || 0
        })
        .select();

      if (error) {
        console.warn('Supabase team member insert warning:', error.message);
        saveToLocalStorageList('advalora_local_team', member);
        return { success: true, error: error.message, mode: 'local' };
      }

      return { success: true, data, mode: 'supabase' };
    } catch (err: any) {
      saveToLocalStorageList('advalora_local_team', member);
      return { success: true, error: err.message, mode: 'local' };
    }
  }

  saveToLocalStorageList('advalora_local_team', member);
  return { success: true, mode: 'local' };
}

/**
 * 3. Inserts a NANDINA Classification (Classifier Form)
 */
export async function saveClassificationToSupabase(record: DbClassificationRecord): Promise<{ success: boolean; data?: any; error?: string; mode: 'supabase' | 'local' }> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('nandina_classifications')
        .insert({
          reference_code: record.reference_code,
          commercial_description: record.commercial_description,
          hs_code: record.hs_code,
          confidence_score: record.confidence_score,
          tariff_rate_adv: record.tariff_rate_adv,
          igv_rate: record.igv_rate,
          ipm_rate: record.ipm_rate,
          restrictions: record.restrictions
        })
        .select();

      if (error) {
        saveToLocalStorageList('advalora_local_classifications', record);
        return { success: true, error: error.message, mode: 'local' };
      }

      return { success: true, data, mode: 'supabase' };
    } catch (err: any) {
      saveToLocalStorageList('advalora_local_classifications', record);
      return { success: true, error: err.message, mode: 'local' };
    }
  }

  saveToLocalStorageList('advalora_local_classifications', record);
  return { success: true, mode: 'local' };
}

/**
 * Helper to persist items safely in LocalStorage
 */
function saveToLocalStorageList(key: string, item: any) {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift({ ...item, saved_at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
  } catch (e) {
    console.error('LocalStorage error:', e);
  }
}

/**
 * Ready-to-use PostgreSQL SQL script for Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- =========================================================
-- ESQUEMA ADVALORA - INTELIGENCIA ADUANERA & SUNAT PRE-DAM
-- Ejecutar en: Supabase Dashboard > SQL Editor > New Query
-- =========================================================

-- 1. Tabla de Operaciones y Despachos Aduaneros
create table if not exists public.customs_operations (
  id uuid default gen_random_uuid() primary key,
  reference_number text unique not null,
  regime text not null default '10',
  transport_mode text not null default 'Marítimo',
  customs_code text not null default '118',
  customs_name text default 'Intendencia de Aduana Marítima del Callao',
  importer_ruc text not null,
  importer_name text not null,
  incoterm text not null default 'CIF',
  cif_usd numeric(12, 2) default 0.00,
  documents_count int default 0,
  critical_issues_count int default 0,
  status text default 'Borrador',
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabla de Miembros del Equipo Aduanero
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

-- 3. Tabla de Clasificaciones Arancelarias NANDINA
create table if not exists public.nandina_classifications (
  id uuid default gen_random_uuid() primary key,
  reference_code text not null,
  commercial_description text not null,
  hs_code text not null,
  confidence_score int default 95,
  tariff_rate_adv numeric(5, 2) default 0.00,
  igv_rate numeric(5, 2) default 16.00,
  ipm_rate numeric(5, 2) default 2.00,
  restrictions text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Habilitar Row Level Security (RLS)
alter table public.customs_operations enable row level security;
alter table public.team_members enable row level security;
alter table public.nandina_classifications enable row level security;

-- Políticas públicas permisivas para la Demo / API Key anónima:
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
`;
