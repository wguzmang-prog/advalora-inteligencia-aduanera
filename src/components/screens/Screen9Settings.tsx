import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  Building2, 
  Check, 
  ShieldCheck, 
  Mail, 
  UserPlus, 
  FileText, 
  Download, 
  Sparkles,
  Lock,
  ArrowRight,
  Database,
  Copy,
  CheckCircle2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { ScreenId, TeamMember } from '../../types';
import { MOCK_TEAM_MEMBERS } from '../../data/mockData';
import { 
  getSupabaseCredentials, 
  setSupabaseCredentials, 
  clearSupabaseCredentials, 
  saveTeamMemberToSupabase,
  SUPABASE_SQL_SCHEMA,
  DbTeamMember 
} from '../../lib/supabase';

interface Screen9Props {
  onNavigate: (screen: ScreenId) => void;
  darkMode: boolean;
}

export const Screen9Settings: React.FC<Screen9Props> = ({ onNavigate, darkMode }) => {
  const [activeTab, setActiveTab] = useState<'equipo' | 'planes' | 'facturacion' | 'supabase'>('equipo');
  const [members, setMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [selectedPlan, setSelectedPlan] = useState<string>('team');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // New member form
  const [newEmail, setNewEmail] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('Liquidador Senior');
  const [memberSaveStatus, setMemberSaveStatus] = useState<string | null>(null);

  // Supabase Configuration Form state
  const creds = getSupabaseCredentials();
  const [customUrl, setCustomUrl] = useState<string>(creds.url);
  const [customKey, setCustomKey] = useState<string>(creds.key);
  const [configSuccessMsg, setConfigSuccessMsg] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  const containerBg = darkMode ? 'bg-[#0B1F3A] border-[#18335E]' : 'bg-white border-[#0B1F3A]/10';
  const cardBg = darkMode ? 'bg-[#132B4F] border-[#1E4378]' : 'bg-[#F4F7FB] border-[#0B1F3A]/10';
  const textPrimary = darkMode ? 'text-white' : 'text-[#0B1F3A]';
  const textMuted = darkMode ? 'text-white/60' : 'text-[#0B1F3A]/60';

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole as any,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'Activo',
      operationsCount: 0,
      lastActive: 'Recién invitado'
    };

    setMembers([...members, newMember]);
    
    // Save to Supabase (or local fallback)
    const res = await saveTeamMemberToSupabase({
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'Activo',
      avatar_url: newMember.avatar,
      operations_count: 0
    });

    if (res.mode === 'supabase') {
      setMemberSaveStatus('¡Miembro guardado en la tabla team_members de Supabase!');
    } else {
      setMemberSaveStatus('Guardado localmente. (Configura Supabase en la pestaña 4 para sincronizar)');
    }
    setTimeout(() => setMemberSaveStatus(null), 4000);

    setNewName('');
    setNewEmail('');
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl || !customKey) return;
    setSupabaseCredentials(customUrl, customKey);
    setConfigSuccessMsg('¡Credenciales de Supabase guardadas y cliente conectado!');
    setTimeout(() => setConfigSuccessMsg(null), 4000);
  };

  const handleResetSupabaseConfig = () => {
    clearSupabaseCredentials();
    setCustomUrl('');
    setCustomKey('');
    setConfigSuccessMsg('Credenciales locales restablecidas.');
    setTimeout(() => setConfigSuccessMsg(null), 3000);
  };

  const handleCopySql = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00E5B0]/20 text-[#008F6B] border border-[#00E5B0]/40">
              PANTALLA 9 DE 9
            </span>
            <h1 className={`text-2xl sm:text-3xl font-bold font-heading ${textPrimary}`}>
              Configuración: Equipo, Planes & Facturación
            </h1>
          </div>
          <p className={`text-sm ${textMuted} mt-1`}>
            Administración de permisos de liquidación, subcuentas SUNAT y suscripción corporativa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Agencia: Advalora Logistics Perú S.A.C.</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#0B1F3A]/10 pb-4 mb-8">
        {[
          { id: 'equipo', label: '1. Equipo & Permisos', icon: Users },
          { id: 'planes', label: '2. Planes de Suscripción', icon: Sparkles },
          { id: 'facturacion', label: '3. Facturación SUNAT', icon: CreditCard },
          { id: 'supabase', label: '4. Supabase DB & API', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                isActive
                  ? 'bg-[#00E5B0] text-[#0B1F3A] shadow-sm'
                  : `${cardBg} ${textMuted} hover:text-white`
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: GESTIÓN DE EQUIPO */}
      {activeTab === 'equipo' && (
        <div className="space-y-6">
          {memberSaveStatus && (
            <div className="p-4 rounded-2xl bg-[#E6FCF7] border border-[#00E5B0] text-[#008F6B] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{memberSaveStatus}</span>
              </div>
              <button onClick={() => setMemberSaveStatus(null)} className="underline">Cerrar</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Members List (8 Cols) */}
            <div className={`lg:col-span-8 rounded-3xl p-6 border shadow-sm space-y-4 ${containerBg}`}>
            <div className="flex items-center justify-between border-b border-[#0B1F3A]/10 pb-4">
              <div>
                <h3 className={`font-heading font-bold text-lg ${textPrimary}`}>
                  Miembros de la Agencia ({members.length})
                </h3>
                <p className={`text-xs ${textMuted} mt-0.5`}>
                  Control de roles para firma de DAM y acceso a expedientes aduaneros.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#E6FCF7] text-[#008F6B]">
                4/10 Asientos Usados
              </span>
            </div>

            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${cardBg}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#00E5B0]/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold font-heading text-sm ${textPrimary}`}>
                          {member.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#00E5B0]/15 text-[#008F6B] font-bold">
                          {member.status}
                        </span>
                      </div>
                      <div className={`text-xs font-mono ${textMuted} mt-0.5`}>
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 font-mono text-xs">
                    <div className="text-right">
                      <div className="font-bold text-[#008F6B] dark:text-[#00E5B0]">
                        {member.role}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {member.operationsCount} despachos • {member.lastActive}
                      </div>
                    </div>

                    <select
                      defaultValue={member.role}
                      className={`px-2 py-1 rounded-lg text-xs font-mono border ${
                        darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                      }`}
                    >
                      <option>Agente Principal</option>
                      <option>Liquidador Senior</option>
                      <option>Asistente</option>
                      <option>Cliente Solo Lectura</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Form (4 Cols) */}
          <div className={`lg:col-span-4 rounded-3xl p-6 border shadow-sm space-y-4 ${containerBg}`}>
            <div className="flex items-center gap-2 border-b border-[#0B1F3A]/10 pb-4">
              <UserPlus className="w-5 h-5 text-[#00E5B0]" />
              <h3 className={`font-heading font-bold text-base ${textPrimary}`}>
                Invitar Colaborador
              </h3>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5">
              <div>
                <label className={`block text-xs font-mono uppercase font-bold mb-1 ${textMuted}`}>
                  Nombre Completo
                </label>
                <input
                  type="text"
                  placeholder="Ej: Rodrigo Paz"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono border ${
                    darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase font-bold mb-1 ${textMuted}`}>
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="rodrigo@advalora.pe"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono border ${
                    darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase font-bold mb-1 ${textMuted}`}>
                  Rol Aduanero
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono border ${
                    darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                  }`}
                >
                  <option value="Liquidador Senior">Liquidador Senior (Edita y valida)</option>
                  <option value="Agente de Aduana Principal">Agente de Aduana Principal (Firma DAM)</option>
                  <option value="Asistente de Despacho">Asistente de Despacho (Carga PDFs)</option>
                  <option value="Cliente Importador">Cliente Importador (Solo lectura)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold tracking-wider transition-all shadow-md"
                >
                  ENVIAR INVITACIÓN
                </button>
              </div>
            </form>
          </div>
        </div>
        </div>
      )}

      {/* TAB 2: PLANES DE SUSCRIPCIÓN */}
      {activeTab === 'planes' && (
        <div className="space-y-8">
          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-xs font-mono font-bold ${billingCycle === 'monthly' ? textPrimary : textMuted}`}>
              Mensual
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 rounded-full bg-[#00E5B0] p-0.5 transition-colors relative"
            >
              <div className={`w-5 h-5 rounded-full bg-[#0B1F3A] transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`} />
            </button>
            <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${billingCycle === 'yearly' ? textPrimary : textMuted}`}>
              <span>Anual</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#FFD600] text-[#0B1F3A]">
                -20% AHORRO
              </span>
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className={`rounded-3xl p-6 border shadow-sm space-y-4 ${containerBg}`}>
              <div>
                <span className="font-mono text-xs font-bold text-gray-400 uppercase">INICIAL</span>
                <h3 className={`font-heading font-bold text-xl ${textPrimary} mt-0.5`}>Free Explorer</h3>
                <p className={`text-xs ${textMuted} mt-1`}>Para importadores que realizan despachos ocasionales.</p>
              </div>

              <div className="py-2">
                <span className={`text-3xl font-black font-heading ${textPrimary}`}>$0</span>
                <span className={`text-xs font-mono ${textMuted}`}> / mes</span>
              </div>

              <ul className="space-y-2 text-xs font-sans">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E5B0]" />
                  <span>Hasta 3 declaraciones al mes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E5B0]" />
                  <span>Cruce de peso y bultos</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span>✕ Sin API de Teledespacho</span>
                </li>
              </ul>

              <button className={`w-full py-2.5 rounded-xl border text-xs font-mono font-bold ${cardBg} ${textMuted}`}>
                Plan Actual
              </button>
            </div>

            {/* Pro Liquidadores */}
            <div className={`rounded-3xl p-6 border shadow-sm space-y-4 ${containerBg}`}>
              <div>
                <span className="font-mono text-xs font-bold text-[#008F6B] uppercase">INDIVIDUAL</span>
                <h3 className={`font-heading font-bold text-xl ${textPrimary} mt-0.5`}>Pro Liquidador</h3>
                <p className={`text-xs ${textMuted} mt-1`}>Para liquidadores independientes y brokers colegiados.</p>
              </div>

              <div className="py-2">
                <span className={`text-3xl font-black font-heading ${textPrimary}`}>$49</span>
                <span className={`text-xs font-mono ${textMuted}`}> / mes (S/. 185 PEN)</span>
              </div>

              <ul className="space-y-2 text-xs font-sans">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E5B0]" />
                  <span>Hasta 50 declaraciones al mes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E5B0]" />
                  <span>Clasificador NANDINA con notas explicativas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E5B0]" />
                  <span>Reportes Pre-DAM exportables</span>
                </li>
              </ul>

              <button className="w-full py-2.5 rounded-xl border border-[#00E5B0] text-[#008F6B] dark:text-[#00E5B0] font-mono text-xs font-bold hover:bg-[#00E5B0]/10">
                Cambiar a Pro
              </button>
            </div>

            {/* Team Agencia (ACTIVE) */}
            <div className={`rounded-3xl p-6 border-2 border-[#00E5B0] shadow-lg relative overflow-hidden space-y-4 ${containerBg}`}>
              <div className="absolute top-0 right-0 bg-[#00E5B0] text-[#0B1F3A] text-[10px] font-mono font-black px-3 py-0.5 rounded-bl-xl uppercase">
                PLAN ACTIVO DE LA AGENCIA
              </div>

              <div>
                <span className="font-mono text-xs font-bold text-[#008F6B] uppercase">EMPRESARIAL</span>
                <h3 className={`font-heading font-bold text-xl ${textPrimary} mt-0.5`}>Team Agencia</h3>
                <p className={`text-xs ${textMuted} mt-1`}>Para agencias de aduana con volumen alto de teledespacho.</p>
              </div>

              <div className="py-2">
                <span className={`text-3xl font-black font-heading text-[#008F6B] dark:text-[#00E5B0]`}>$199</span>
                <span className={`text-xs font-mono ${textMuted}`}> / mes (S/. 750 PEN)</span>
              </div>

              <ul className="space-y-2 text-xs font-sans">
                <li className="flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4 text-[#00E5B0]" />
                  <span>Declaraciones ILIMITADAS</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E5B0]" />
                  <span>Hasta 10 asientos de liquidadores</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E5B0]" />
                  <span>Conexión directa con Teledespacho SUNAT</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E5B0]" />
                  <span>Soporte prioritario 24/7 en puerto Callao</span>
                </li>
              </ul>

              <button className="w-full py-2.5 rounded-xl bg-[#00E5B0] text-[#0B1F3A] font-mono text-xs font-bold tracking-wider">
                GESTIONAR SUSCRIPCIÓN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FACTURACIÓN ELECTRÓNICA SUNAT */}
      {activeTab === 'facturacion' && (
        <div className="max-w-3xl space-y-6">
          <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${containerBg}`}>
            <h3 className={`font-heading font-bold text-lg ${textPrimary}`}>
              Datos de Facturación Electrónica en Perú
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className={`block uppercase font-bold mb-1 ${textMuted}`}>RUC Empresa</label>
                <input
                  type="text"
                  readOnly
                  defaultValue="20601829301"
                  className={`w-full p-2.5 rounded-xl border ${cardBg} text-[#0B1F3A] dark:text-white`}
                />
              </div>

              <div>
                <label className={`block uppercase font-bold mb-1 ${textMuted}`}>Razón Social</label>
                <input
                  type="text"
                  readOnly
                  defaultValue="ADVALORA LOGISTICS PERÚ S.A.C."
                  className={`w-full p-2.5 rounded-xl border ${cardBg} text-[#0B1F3A] dark:text-white`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={`block uppercase font-bold mb-1 ${textMuted}`}>Dirección Fiscal en Lima</label>
                <input
                  type="text"
                  readOnly
                  defaultValue="Av. Elmer Faucett 2823, Oficina 402, Callao - Perú"
                  className={`w-full p-2.5 rounded-xl border ${cardBg} text-[#0B1F3A] dark:text-white`}
                />
              </div>
            </div>
          </div>

          {/* Invoices List */}
          <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${containerBg}`}>
            <h3 className={`font-heading font-bold text-base ${textPrimary}`}>
              Historial de Facturas Electrónicas (XML / PDF)
            </h3>

            <div className="divide-y divide-[#0B1F3A]/10 text-xs font-mono">
              {[
                { number: 'F001-000492', date: '01/11/2024', amount: 'S/. 748.24', status: 'Pagada' },
                { number: 'F001-000381', date: '01/10/2024', amount: 'S/. 748.24', status: 'Pagada' },
                { number: 'F001-000270', date: '01/09/2024', amount: 'S/. 748.24', status: 'Pagada' },
              ].map((inv) => (
                <div key={inv.number} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0B1F3A] dark:text-white">{inv.number}</span>
                    <span className="text-gray-400 ml-2">{inv.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{inv.amount}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#E6FCF7] text-[#008F6B] font-bold">
                      {inv.status}
                    </span>
                    <button className="text-[#008F6B] hover:underline flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUPABASE & BASE DE DATOS */}
      {activeTab === 'supabase' && (
        <div className="space-y-8">
          {/* Notifications */}
          {configSuccessMsg && (
            <div className="p-4 rounded-2xl bg-[#E6FCF7] border border-[#00E5B0] text-[#008F6B] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{configSuccessMsg}</span>
              </div>
              <button onClick={() => setConfigSuccessMsg(null)} className="underline">Cerrar</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Supabase Connection Form (7 Cols) */}
            <div className={`lg:col-span-7 rounded-3xl p-6 border shadow-sm space-y-6 ${containerBg}`}>
              <div className="flex items-center justify-between border-b border-[#0B1F3A]/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#3ECF8E]/20 border border-[#3ECF8E]/40 flex items-center justify-center text-[#3ECF8E]">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-heading font-bold text-lg ${textPrimary}`}>
                      Conexión a Supabase Cloud
                    </h3>
                    <p className={`text-xs ${textMuted}`}>
                      Base de datos PostgreSQL para sincronización de despachos y partidas en tiempo real.
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                  creds.isConfigured
                    ? 'bg-[#E6FCF7] text-[#008F6B] border-[#00E5B0]'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {creds.isConfigured ? '● Conectado' : '○ Modo Local Fallback'}
                </span>
              </div>

              {/* Status Details */}
              <div className={`p-4 rounded-2xl border space-y-2 text-xs font-mono ${cardBg}`}>
                <div className="flex justify-between items-center py-1 border-b border-black/5 dark:border-white/5">
                  <span className={textMuted}>Estado del Backend:</span>
                  <span className="font-bold text-[#008F6B]">
                    {creds.isConfigured ? 'Conexión Supabase Activa' : 'Persistencia Local (LocalStorage)'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-black/5 dark:border-white/5">
                  <span className={textMuted}>Origen de Configuración:</span>
                  <span className="font-bold">
                    {creds.source === 'env' ? '.env.example / Variables de Entorno' : creds.source === 'storage' ? 'Configuración en Vivo (Browser)' : 'No configurado'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className={textMuted}>URL Registrada:</span>
                  <span className="font-bold truncate max-w-[220px]">
                    {creds.url || 'No especificada'}
                  </span>
                </div>
              </div>

              {/* Form to update Supabase credentials */}
              <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
                <div>
                  <label className={`block text-xs font-mono uppercase font-bold mb-1.5 ${textMuted}`}>
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://xxxxxxxxxxxxxxxxxxxx.supabase.co"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-mono border focus:ring-2 focus:ring-[#00E5B0] ${
                      darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                    }`}
                  />
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">
                    Encuéntralo en tu Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL
                  </p>
                </div>

                <div>
                  <label className={`block text-xs font-mono uppercase font-bold mb-1.5 ${textMuted}`}>
                    Supabase Anon Public Key (API Key)
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-mono border focus:ring-2 focus:ring-[#00E5B0] ${
                      darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                    }`}
                  />
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">
                    Encuéntralo en tu Supabase Dashboard &gt; Project Settings &gt; API &gt; Project API keys (anon public)
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>GUARDAR Y CONECTAR</span>
                  </button>

                  {creds.isConfigured && (
                    <button
                      type="button"
                      onClick={handleResetSupabaseConfig}
                      className="py-2.5 px-4 rounded-xl border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-mono text-xs font-bold transition-all"
                    >
                      Desconectar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* SQL Script & Schema Reference (5 Cols) */}
            <div className={`lg:col-span-5 rounded-3xl p-6 border shadow-sm space-y-4 ${containerBg}`}>
              <div className="flex items-center justify-between border-b border-[#0B1F3A]/10 pb-3">
                <div>
                  <h4 className={`font-heading font-bold text-sm ${textPrimary}`}>
                    Script SQL para Tablas
                  </h4>
                  <p className={`text-[11px] ${textMuted}`}>
                    Copia y ejecuta en el SQL Editor de Supabase
                  </p>
                </div>

                <button
                  onClick={handleCopySql}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                    copiedSql 
                      ? 'bg-[#00E5B0] text-[#0B1F3A] border-[#00E5B0]' 
                      : `${cardBg} ${textPrimary} hover:border-[#00E5B0]`
                  }`}
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? '¡Copiado!' : 'Copiar SQL'}</span>
                </button>
              </div>

              {/* SQL preview */}
              <div className="relative">
                <pre className="p-3.5 rounded-2xl bg-[#050C16] text-[#00E5B0] font-mono text-[11px] leading-relaxed overflow-x-auto max-h-80 border border-white/10 select-all">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#3ECF8E]/10 border border-[#3ECF8E]/30 space-y-1.5 text-xs font-mono">
                <div className="font-bold text-[#008F6B] dark:text-[#3ECF8E] flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Pasos para inicializar en Supabase:</span>
                </div>
                <ol className="list-decimal list-inside text-gray-500 dark:text-gray-300 text-[11px] space-y-1">
                  <li>Ingresa a <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline font-bold text-[#008F6B]">supabase.com/dashboard</a></li>
                  <li>Ve a <strong>SQL Editor</strong> &gt; <strong>New query</strong></li>
                  <li>Pega el código SQL y presiona <strong>Run</strong></li>
                  <li>¡Listo! Las tablas y formularios quedan vinculados.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
