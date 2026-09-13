import React from 'react';
import { 
  FileSpreadsheet, 
  Layers, 
  FileUp, 
  ScanSearch, 
  ShieldAlert, 
  ListTree, 
  BookOpenCheck, 
  FileCheck, 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  ChevronRight,
  Anchor,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ScreenId } from '../types';
import { CURRENT_OPERATION } from '../data/mockData';

interface NavigationProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  criticalIssuesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  onSelectScreen,
  darkMode,
  onToggleDarkMode,
  criticalIssuesCount
}) => {
  const screens: { id: ScreenId; label: string; short: string; icon: React.ComponentType<{ className?: string }>; badge?: string; isStar?: boolean }[] = [
    { id: 'login-onboarding', label: '1. Onboarding & Login', short: 'Onboarding', icon: Sparkles },
    { id: 'dashboard', label: '2. Mis Operaciones', short: 'Dashboard', icon: Layers },
    { id: 'wizard', label: '3. Wizard Creación', short: 'Crear DAM', icon: FileUp },
    { id: 'extraction', label: '4. Extracción OCR', short: 'Extracción', icon: ScanSearch },
    { 
      id: 'consistency-matrix', 
      label: '5. Matriz Consistencia', 
      short: 'Matriz IA', 
      icon: ShieldAlert, 
      badge: criticalIssuesCount > 0 ? `${criticalIssuesCount} CRÍTICOS` : 'OK',
      isStar: true 
    },
    { id: 'classifier', label: '6. Clasificador NANDINA', short: 'Partidas', icon: ListTree },
    { id: 'tariff-detail', label: '7. Fundamento Normativo', short: 'Detalle Legal', icon: BookOpenCheck },
    { id: 'report', label: '8. Reporte & Compartir', short: 'Pre-DAM', icon: FileCheck },
    { id: 'settings', label: '9. Equipo & Facturación', short: 'Ajustes', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-200 bg-[#0B1F3A] text-white border-[#132B4F] shadow-lg">
      {/* Top Brand & Utility Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectScreen('dashboard')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5B0] to-[#00B88C] flex items-center justify-center shadow-md shadow-[#00E5B0]/20 group-hover:scale-105 transition-transform">
                <div className="relative">
                  <Anchor className="w-5 h-5 text-[#0B1F3A] stroke-[2.5]" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FFD600] ring-2 ring-[#0B1F3A]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-xl font-bold tracking-tight text-white flex items-center">
                    advalora
                    <span className="w-2 h-2 rounded-full bg-[#00E5B0] ml-0.5 inline-block"></span>
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#00E5B0]/15 text-[#00E5B0] border border-[#00E5B0]/30">
                    SUNAT IA
                  </span>
                </div>
                <p className="text-[11px] text-white/60 font-sans leading-none hidden sm:block">
                  Consistencia Documental & Partidas NANDINA
                </p>
              </div>
            </button>

            <div className="h-6 w-px bg-white/15 hidden md:block mx-1" />

            {/* Current Active Operation Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">
              <span className="text-white/50 font-mono">DESPACHO:</span>
              <span className="font-mono font-semibold text-[#00E5B0]">{CURRENT_OPERATION.referenceNumber}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/90 truncate max-w-[130px]">{CURRENT_OPERATION.importerName}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/60 font-mono text-[11px]">Aduana {CURRENT_OPERATION.customsCode.split(' - ')[0]}</span>
              {criticalIssuesCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF5A5F] text-white">
                  {criticalIssuesCount} BLOQUEANTES
                </span>
              )}
            </div>
          </div>

          {/* Right Action Tools: Dark Mode, Notifications, User */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="theme-toggle-btn"
              onClick={onToggleDarkMode}
              title={darkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#FFD600]" /> : <Moon className="w-4 h-4 text-[#00E5B0]" />}
            </button>

            <div className="relative">
              <button 
                id="notifications-btn"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5A5F] ring-2 ring-[#0B1F3A]" />
              </button>
            </div>

            {/* Liquidador Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/15">
              <img
                src={CURRENT_OPERATION.liquidator.avatar}
                alt={CURRENT_OPERATION.liquidator.name}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#00E5B0]/40"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white leading-tight">
                  {CURRENT_OPERATION.liquidator.name}
                </div>
                <div className="text-[10px] text-[#00E5B0] font-mono leading-none">
                  SUNAT Reg. 4921
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Selector Tab Bar (9 screens) */}
      <div className="bg-[#071324] border-t border-white/10 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center gap-1 py-1.5 min-w-max">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 px-2 flex items-center gap-1">
            Vistas:
          </span>
          {screens.map((screen) => {
            const Icon = screen.icon;
            const isActive = currentScreen === screen.id;

            return (
              <button
                key={screen.id}
                id={`nav-screen-${screen.id}`}
                onClick={() => onSelectScreen(screen.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                  isActive
                    ? 'bg-[#00E5B0] text-[#0B1F3A] font-bold shadow-sm shadow-[#00E5B0]/30 scale-[1.02]'
                    : screen.isStar
                    ? 'bg-white/10 text-white hover:bg-white/15 border border-[#FF5A5F]/40'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0B1F3A]' : screen.isStar ? 'text-[#FF5A5F]' : 'text-white/60'}`} />
                <span className="whitespace-nowrap">{screen.short}</span>
                {screen.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-[#0B1F3A] text-[#00E5B0]'
                        : 'bg-[#FF5A5F] text-white animate-pulse'
                    }`}
                  >
                    {screen.badge}
                  </span>
                )}
                {screen.isStar && !screen.badge && (
                  <span className="text-[8px] bg-[#FFD600] text-[#0B1F3A] font-bold px-1 rounded">ESTRELLA</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
