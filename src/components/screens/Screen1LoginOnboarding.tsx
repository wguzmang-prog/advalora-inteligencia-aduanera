import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  UserCheck, 
  Sparkles, 
  Anchor, 
  FileText, 
  UploadCloud, 
  KeyRound, 
  Check, 
  Lock, 
  Ship, 
  AlertCircle 
} from 'lucide-react';
import { ScreenId } from '../../types';

interface Screen1Props {
  onCompleteOnboarding: (targetScreen?: ScreenId) => void;
  darkMode: boolean;
}

export const Screen1LoginOnboarding: React.FC<Screen1Props> = ({ onCompleteOnboarding, darkMode }) => {
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<string>('liquidador');
  const [selectedCustoms, setSelectedCustoms] = useState<string>('118');
  const [rucInput, setRucInput] = useState<string>('20554921098');
  const [loginMode, setLoginMode] = useState<'email' | 'clavesol'>('clavesol');

  const containerBg = darkMode ? 'bg-[#0B1F3A] border-[#18335E]' : 'bg-white border-[#0B1F3A]/10';
  const cardBg = darkMode ? 'bg-[#132B4F] border-[#1E4378]' : 'bg-[#F4F7FB] border-[#0B1F3A]/10';
  const textPrimary = darkMode ? 'text-white' : 'text-[#0B1F3A]';
  const textMuted = darkMode ? 'text-white/60' : 'text-[#0B1F3A]/60';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Screen Title & UX Goal */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#0B1F3A]/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00E5B0]/20 text-[#008F6B] border border-[#00E5B0]/40">
              PANTALLA 1 DE 9
            </span>
            <h1 className={`text-2xl font-bold font-heading ${textPrimary}`}>
              Login & Onboarding de Liquidadores
            </h1>
          </div>
          <p className={`text-sm ${textMuted} mt-1`}>
            Flujo guiado de bienvenida para agencias de aduana, importadores y liquidadores en Perú.
          </p>
        </div>

        <button
          id="skip-onboarding-cta"
          onClick={() => onCompleteOnboarding('dashboard')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wide bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] shadow-sm transition-all"
        >
          <span>SALTAR AL DASHBOARD</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3-Step Interactive Onboarding (7 Cols) */}
        <div className={`lg:col-span-7 rounded-3xl p-6 md:p-8 border shadow-sm ${containerBg}`}>
          {/* Step Progress Tracker */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#00E5B0] text-[#0B1F3A] flex items-center justify-center font-heading font-bold text-sm">
                0{onboardingStep}
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#00E5B0] font-bold block">
                  PASO {onboardingStep} DE 3
                </span>
                <span className={`text-sm font-bold ${textPrimary}`}>
                  {onboardingStep === 1 && 'Perfil del Operador de Comercio Exterior'}
                  {onboardingStep === 2 && 'Jurisdicción Aduanera & RUC en Perú'}
                  {onboardingStep === 3 && 'Expediente Piloto de Validación'}
                </span>
              </div>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((step) => (
                <button
                  key={step}
                  onClick={() => setOnboardingStep(step)}
                  className={`h-2 rounded-full transition-all ${
                    onboardingStep === step
                      ? 'w-8 bg-[#00E5B0]'
                      : onboardingStep > step
                      ? 'w-3 bg-[#00B88C]'
                      : 'w-3 bg-gray-300 dark:bg-white/20'
                  }`}
                  aria-label={`Ir al paso ${step}`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: Seleccionar Perfil */}
          {onboardingStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-bold font-heading ${textPrimary}`}>
                  ¿Cómo operas tus declaraciones ante SUNAT?
                </h3>
                <p className={`text-sm ${textMuted} mt-1`}>
                  Advalora adapta las reglas de validación y límites de tolerancia según tu rol aduanero.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: 'liquidador',
                    title: 'Agencia de Aduana',
                    subtitle: 'Liquidador o Despachador',
                    badge: 'Recomendado',
                    icon: ShieldCheck,
                    desc: 'Cruce masivo de documentos, detección de multas LGA y transmisión teledespacho.'
                  },
                  {
                    id: 'importador',
                    title: 'Importador / Trader',
                    subtitle: 'Empresa RUC 20',
                    icon: Building2,
                    desc: 'Auditoría preventiva de facturas y B/L de proveedores extranjeros antes del embarque.'
                  },
                  {
                    id: 'emprendedor',
                    title: 'Operador Logístico',
                    subtitle: 'Forwarder / Courier',
                    icon: Anchor,
                    desc: 'Pre-clasificación arancelaria rápida y verificación de mercancías restringidas.'
                  }
                ].map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#00E5B0] bg-[#00E5B0]/10 ring-2 ring-[#00E5B0]'
                          : `${cardBg} hover:border-[#00E5B0]/50`
                      }`}
                    >
                      {role.badge && (
                        <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00E5B0] text-[#0B1F3A]">
                          {role.badge}
                        </span>
                      )}
                      <div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                          isSelected ? 'bg-[#00E5B0] text-[#0B1F3A]' : 'bg-[#0B1F3A]/10 dark:bg-white/10 text-[#00E5B0]'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className={`font-heading font-bold text-sm ${textPrimary}`}>
                          {role.title}
                        </div>
                        <div className="text-xs text-[#00E5B0] font-medium mt-0.5">
                          {role.subtitle}
                        </div>
                        <p className={`text-xs ${textMuted} mt-2 line-clamp-3`}>
                          {role.desc}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs font-mono">
                        <span className={isSelected ? 'text-[#00B88C] font-bold' : textMuted}>
                          {isSelected ? 'Seleccionado' : 'Elegir'}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#00E5B0]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-end pt-4 border-t border-[#0B1F3A]/10">
                <button
                  id="onboarding-step1-next"
                  onClick={() => setOnboardingStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] transition-all shadow-md"
                >
                  <span>CONTINUAR A JURISDICCIÓN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Aduana Principal & RUC */}
          {onboardingStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-bold font-heading ${textPrimary}`}>
                  Configura tu Intendencia Aduanera y RUC
                </h3>
                <p className={`text-sm ${textMuted} mt-1`}>
                  SUNAT aplica diferentes criterios de canal (Verde/Naranja/Rojo) según la aduana de ingreso.
                </p>
              </div>

              <div className="space-y-4">
                <label className={`block text-xs font-mono font-bold uppercase tracking-wider ${textPrimary}`}>
                  Aduana de Despacho Habitual en Perú
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: '118', code: '118', name: 'Marítima del Callao', detail: 'Puerto APM & DP World (82% de importaciones)' },
                    { id: '235', code: '235', name: 'Aérea del Callao', detail: 'Aeropuerto Internacional Jorge Chávez (Carga Express)' },
                    { id: '019', code: '019', name: 'Aduana de Paita', detail: 'Terminal Portuario Euroandinos (Norte del Perú)' },
                    { id: '046', code: '046', name: 'Aduana de Ilo / Matarani', detail: 'Despacho Minero e Industrial Sur' }
                  ].map((customs) => (
                    <button
                      key={customs.id}
                      onClick={() => setSelectedCustoms(customs.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        selectedCustoms === customs.id
                          ? 'border-[#00E5B0] bg-[#00E5B0]/10 ring-1 ring-[#00E5B0]'
                          : `${cardBg} hover:border-[#00E5B0]/30`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#00E5B0] px-2 py-0.5 rounded bg-[#0B1F3A] dark:bg-black/30">
                          CÓD. {customs.code}
                        </span>
                        {selectedCustoms === customs.id && <Check className="w-4 h-4 text-[#00E5B0]" />}
                      </div>
                      <div className={`font-heading font-bold text-sm mt-2 ${textPrimary}`}>
                        {customs.name}
                      </div>
                      <p className={`text-xs ${textMuted} mt-0.5`}>
                        {customs.detail}
                      </p>
                    </button>
                  ))}
                </div>

                {/* RUC Input with Validation Check */}
                <div className="pt-2">
                  <label className={`block text-xs font-mono font-bold uppercase tracking-wider mb-2 ${textPrimary}`}>
                    RUC de la Empresa u Operador (11 dígitos)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={rucInput}
                      onChange={(e) => setRucInput(e.target.value)}
                      placeholder="20554921098"
                      className={`w-full px-4 py-3 rounded-xl border font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-[#00E5B0] ${
                        darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20 text-[#0B1F3A]'
                      }`}
                    />
                    <div className="absolute right-3 top-3 flex items-center gap-1.5 text-xs font-mono text-[#008F6B] bg-[#E6FCF7] px-2 py-0.5 rounded-md font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5B0]" />
                      <span>HABIDO / ACTIVO SUNAT</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#008F6B] font-mono mt-1.5">
                    ✓ Razón social verificada: TECHIMPORTS PERÚ S.A.C. (Importador Frecuente Nivel 1)
                  </p>
                </div>
              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-[#0B1F3A]/10">
                <button
                  onClick={() => setOnboardingStep(1)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold ${textMuted} hover:text-white`}
                >
                  ← VOLVER
                </button>
                <button
                  id="onboarding-step2-next"
                  onClick={() => setOnboardingStep(3)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] transition-all shadow-md"
                >
                  <span>CONTINUAR A EXPEDIENTE PILOTO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Expediente Piloto */}
          {onboardingStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-bold font-heading ${textPrimary}`}>
                  ¡Listo! Prueba tu primer expediente de importación
                </h3>
                <p className={`text-sm ${textMuted} mt-1`}>
                  Hemos preparado una operación real desde Shenzhen hacia el Callao con 5 documentos para auditar.
                </p>
              </div>

              {/* Pilot Card Preview */}
              <div className="p-5 rounded-2xl border-2 border-dashed border-[#00E5B0] bg-[#00E5B0]/5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#00E5B0] animate-pulse" />
                    <span className="font-mono text-xs font-bold text-[#0B1F3A] dark:text-white">
                      OPERACIÓN PILOTO: ADV-2024-0892
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF5A5F] text-white">
                    2 DISCREPANCIAS DETECTADAS
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-white/60 dark:bg-black/20">
                    <div className="text-[10px] text-gray-500">Régimen</div>
                    <div className="font-bold text-[#0B1F3A] dark:text-white">10 - Importación</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/60 dark:bg-black/20">
                    <div className="text-[10px] text-gray-500">Origen / Destino</div>
                    <div className="font-bold text-[#0B1F3A] dark:text-white">Shenzhen → Callao</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/60 dark:bg-black/20">
                    <div className="text-[10px] text-gray-500">Documentos</div>
                    <div className="font-bold text-[#00B88C]">5 PDFs (100% OCR)</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/60 dark:bg-black/20">
                    <div className="text-[10px] text-gray-500">Valor CIF</div>
                    <div className="font-bold text-[#0B1F3A] dark:text-white">$153,550 USD</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FFEBEB] border border-[#FF5A5F]/30 text-xs text-[#D92B30] flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#FF5A5F] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Alerta Preventiva SUNAT:</span> Peso en Bill of Lading (1,380 kg) difiere del Packing List (1,420.5 kg). Te mostraremos cómo resolverlo en la Matriz de Consistencia.
                  </div>
                </div>
              </div>

              {/* Final CTA */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#0B1F3A]/10">
                <button
                  onClick={() => setOnboardingStep(2)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold ${textMuted}`}
                >
                  ← VOLVER
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onCompleteOnboarding('dashboard')}
                    className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold border border-[#0B1F3A]/20 dark:border-white/20 text-[#0B1F3A] dark:text-white hover:bg-white/10"
                  >
                    VER DASHBOARD
                  </button>
                  <button
                    id="launch-pilot-matrix"
                    onClick={() => onCompleteOnboarding('consistency-matrix')}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] shadow-lg shadow-[#00E5B0]/30 transition-all scale-105"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AUDITAR MATRIZ DE CONSISTENCIA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Fast Login / Auth Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`rounded-3xl p-6 md:p-7 border shadow-sm ${containerBg}`}>
            {/* Gestión Global Perú Agency Branding Badge */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0B1F3A]/5 dark:bg-white/5 border border-[#0B1F3A]/10 dark:border-white/10 mb-5">
              <div className="w-11 h-11 rounded-xl bg-white p-1 border border-[#0B1F3A]/10 flex items-center justify-center shrink-0 shadow-sm">
                <img src="/favicon.png" alt="Gestión Global Perú" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0B1F3A] dark:text-white truncate">
                  Gestión Global Perú
                </p>
                <p className="text-[11px] text-gray-500 dark:text-white/60 font-mono">
                  Agencia Aduanera & Operador Logístico
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#00E5B0]" />
                <h3 className={`font-heading font-bold text-lg ${textPrimary}`}>
                  Acceso Seguro a la Plataforma
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E5B0]/15 text-[#00E5B0] font-bold">
                256-BIT SSL
              </span>
            </div>

            {/* Login Tab Switcher */}
            <div className="flex p-1 rounded-xl bg-black/5 dark:bg-black/30 mb-5">
              <button
                onClick={() => setLoginMode('clavesol')}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                  loginMode === 'clavesol'
                    ? 'bg-[#00E5B0] text-[#0B1F3A] shadow-sm'
                    : textMuted
                }`}
              >
                Clave SOL SUNAT
              </button>
              <button
                onClick={() => setLoginMode('email')}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                  loginMode === 'email'
                    ? 'bg-[#00E5B0] text-[#0B1F3A] shadow-sm'
                    : textMuted
                }`}
              >
                Email Corporativo
              </button>
            </div>

            {loginMode === 'clavesol' ? (
              <form onSubmit={(e) => { e.preventDefault(); onCompleteOnboarding('dashboard'); }} className="space-y-3.5">
                <div>
                  <label className={`block text-[11px] font-mono uppercase font-bold mb-1 ${textMuted}`}>
                    RUC Empresa (11 dígitos)
                  </label>
                  <input
                    type="text"
                    defaultValue="20554921098"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono ${
                      darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-mono uppercase font-bold mb-1 ${textMuted}`}>
                    Usuario Secundario SOL
                  </label>
                  <input
                    type="text"
                    defaultValue="LIQUIDADOR_CALLAO"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono ${
                      darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-mono uppercase font-bold mb-1 ${textMuted}`}>
                    Contraseña SOL
                  </label>
                  <input
                    type="password"
                    defaultValue="••••••••••••"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono ${
                      darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                    }`}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#0B1F3A] text-white dark:bg-[#00E5B0] dark:text-[#0B1F3A] font-mono text-xs font-bold tracking-wider hover:opacity-95 shadow-md flex items-center justify-center gap-2"
                  >
                    <span>CONECTAR CON PADRÓN SUNAT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); onCompleteOnboarding('dashboard'); }} className="space-y-3.5">
                <div>
                  <label className={`block text-[11px] font-mono uppercase font-bold mb-1 ${textMuted}`}>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    defaultValue="valeria.mendoza@advalora.pe"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                      darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-mono uppercase font-bold mb-1 ${textMuted}`}>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    defaultValue="••••••••••••"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                      darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                    }`}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#00E5B0] text-[#0B1F3A] font-mono text-xs font-bold tracking-wider hover:bg-[#00B88C] shadow-md flex items-center justify-center gap-2"
                  >
                    <span>INICIAR SESIÓN</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Quick Demo Access Button */}
            <div className="mt-5 pt-4 border-t border-[#0B1F3A]/10 text-center">
              <span className={`text-[11px] font-mono ${textMuted} block mb-2`}>
                ¿Revisando el prototipo de diseño?
              </span>
              <button
                id="demo-instant-access-btn"
                onClick={() => onCompleteOnboarding('consistency-matrix')}
                className="w-full py-2.5 px-4 rounded-xl border border-[#00E5B0] text-[#00B88C] dark:text-[#00E5B0] hover:bg-[#00E5B0]/10 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00E5B0]" />
                <span>ACCESO RÁPIDO CON OPERACIÓN AUDITADA</span>
              </button>
            </div>
          </div>

          {/* Value Prop Banner with Brand Colors */}
          <div className="rounded-3xl p-5 bg-[#0B1F3A] text-white border border-[#18335E] relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[#00E5B0] text-xs font-mono font-bold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>GARANTÍA DE CONSISTENCIA ADVALORA</span>
              </div>
              <h4 className="font-heading font-bold text-sm text-white">
                Evita hasta 1.0 UIT de multa por error de teledespacho ante SUNAT
              </h4>
              <p className="text-xs text-white/70 mt-1">
                La IA analiza automáticamente B/L, Packing List y Facturas para asegurar cruce idéntico de pesos y valores FOB/CIF.
              </p>
            </div>
            {/* Geometric container accent */}
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#00E5B0]/10 border border-[#00E5B0]/20 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
