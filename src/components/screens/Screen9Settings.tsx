import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { ScreenId, TeamMember } from '../../types';
import { MOCK_TEAM_MEMBERS } from '../../data/mockData';

interface Screen9Props {
  onNavigate: (screen: ScreenId) => void;
  darkMode: boolean;
}

export const Screen9Settings: React.FC<Screen9Props> = ({ onNavigate, darkMode }) => {
  const [activeTab, setActiveTab] = useState<'equipo' | 'planes' | 'facturacion'>('equipo');
  const [members, setMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [selectedPlan, setSelectedPlan] = useState<string>('team');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // New member form
  const [newEmail, setNewEmail] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('Liquidador Senior');

  const containerBg = darkMode ? 'bg-[#0B1F3A] border-[#18335E]' : 'bg-white border-[#0B1F3A]/10';
  const cardBg = darkMode ? 'bg-[#132B4F] border-[#1E4378]' : 'bg-[#F4F7FB] border-[#0B1F3A]/10';
  const textPrimary = darkMode ? 'text-white' : 'text-[#0B1F3A]';
  const textMuted = darkMode ? 'text-white/60' : 'text-[#0B1F3A]/60';

  const handleAddMember = (e: React.FormEvent) => {
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
    setNewName('');
    setNewEmail('');
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
    </div>
  );
};
