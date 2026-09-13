import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Ship, 
  Plane, 
  FileText, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { ScreenId, DeclarationOperation } from '../../types';
import { MOCK_OPERATIONS } from '../../data/mockData';
import { SeverityBadge, SunatChannelPill } from '../common/CustomsDecorations';

interface Screen2Props {
  onNavigate: (screen: ScreenId, operationId?: string) => void;
  darkMode: boolean;
}

export const Screen2Dashboard: React.FC<Screen2Props> = ({ onNavigate, darkMode }) => {
  const [activeFilter, setActiveFilter] = useState<'Todos' | 'Observada' | 'Validada' | 'En revisión' | 'Borrador'>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customsFilter, setCustomsFilter] = useState<string>('all');

  const containerBg = darkMode ? 'bg-[#0B1F3A] border-[#18335E]' : 'bg-white border-[#0B1F3A]/10';
  const cardBg = darkMode ? 'bg-[#132B4F] border-[#1E4378]' : 'bg-[#F4F7FB] border-[#0B1F3A]/10';
  const textPrimary = darkMode ? 'text-white' : 'text-[#0B1F3A]';
  const textMuted = darkMode ? 'text-white/60' : 'text-[#0B1F3A]/60';

  const filteredOperations = MOCK_OPERATIONS.filter(op => {
    const matchesFilter = activeFilter === 'Todos' || op.status === activeFilter;
    const matchesSearch = 
      op.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.importerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.importerRuc.includes(searchQuery) ||
      op.billOfLading.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCustoms = customsFilter === 'all' || op.customsCode.includes(customsFilter);
    return matchesFilter && matchesSearch && matchesCustoms;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header with Breadcrumb & CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00E5B0]/20 text-[#008F6B] border border-[#00E5B0]/40">
              PANTALLA 2 DE 9
            </span>
            <h1 className={`text-2xl sm:text-3xl font-bold font-heading ${textPrimary}`}>
              Mis Operaciones Aduaneras
            </h1>
          </div>
          <p className={`text-sm ${textMuted} mt-1`}>
            Despachos y pre-declaraciones en proceso de auditoría previa a teledespacho SUNAT.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="new-declaration-cta"
            onClick={() => onNavigate('wizard')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono font-bold text-xs tracking-wider transition-all shadow-md shadow-[#00E5B0]/20 scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ NUEVA DECLARACIÓN</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip (Dense & Meaningful) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={`p-5 rounded-2xl border shadow-sm ${containerBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono uppercase font-bold tracking-wider ${textMuted}`}>
              Operaciones del Mes
            </span>
            <span className="p-1.5 rounded-lg bg-[#00E5B0]/15 text-[#00E5B0]">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-heading tabular-numbers ${textPrimary}`}>
              48
            </span>
            <span className="text-xs font-mono font-bold text-[#008F6B] flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>
          <div className={`text-xs ${textMuted} mt-1`}>
            38 en Callao Marítima (118), 10 Aérea
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm ${containerBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono uppercase font-bold tracking-wider ${textMuted}`}>
              Tasa de Consistencia IA
            </span>
            <span className="p-1.5 rounded-lg bg-[#00E5B0]/15 text-[#00E5B0]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-heading tabular-numbers text-[#00B88C]`}>
              98.4%
            </span>
            <span className="text-xs font-mono text-[#008F6B] font-bold">
              Cuadraron sin error
            </span>
          </div>
          <div className={`text-xs ${textMuted} mt-1`}>
            Margen de tolerancia SUNAT &lt; 0.5%
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm ${containerBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono uppercase font-bold tracking-wider ${textMuted}`}>
              Riesgo SUNAT Prevenido
            </span>
            <span className="p-1.5 rounded-lg bg-[#FFD600]/20 text-[#B29500]">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-heading tabular-numbers text-[#FFD600]`}>
              $18,450
            </span>
            <span className="text-xs font-mono text-[#FFD600] font-bold">
              USD
            </span>
          </div>
          <div className={`text-xs ${textMuted} mt-1`}>
            Multas evitadas por declaración inexacta
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm ${containerBg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono uppercase font-bold tracking-wider ${textMuted}`}>
              Tiempo Promedio
            </span>
            <span className="p-1.5 rounded-lg bg-[#0B1F3A]/10 dark:bg-white/10 text-[#00E5B0]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-heading tabular-numbers ${textPrimary}`}>
              14 min
            </span>
            <span className="text-xs font-mono text-[#008F6B] font-bold">
              -82% vs manual
            </span>
          </div>
          <div className={`text-xs ${textMuted} mt-1`}>
            Lectura de 5 PDFs y cruce en 45 seg
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 rounded-2xl border mb-6 ${containerBg}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {(['Todos', 'Observada', 'Validada', 'En revisión', 'Borrador'] as const).map((filter) => {
              const count = filter === 'Todos' 
                ? MOCK_OPERATIONS.length 
                : MOCK_OPERATIONS.filter(o => o.status === filter).length;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeFilter === filter
                      ? 'bg-[#00E5B0] text-[#0B1F3A] shadow-sm'
                      : `${cardBg} ${textMuted} hover:text-white hover:bg-[#00E5B0]/10`
                  }`}
                >
                  <span>{filter}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeFilter === filter ? 'bg-[#0B1F3A] text-[#00E5B0]' : 'bg-black/10 dark:bg-white/10'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Customs Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className={`w-4 h-4 absolute left-3 top-3 ${textMuted}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar RUC, B/L, Referencia..."
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-[#00E5B0] ${
                  darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                }`}
              />
            </div>

            <select
              value={customsFilter}
              onChange={(e) => setCustomsFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-[#00E5B0] ${
                darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
              }`}
            >
              <option value="all">Todas las Aduanas</option>
              <option value="118">118 - Callao Marítima</option>
              <option value="235">235 - Aérea Callao</option>
              <option value="019">019 - Paita</option>
            </select>
          </div>
        </div>
      </div>

      {/* Operations Cards Grid */}
      <div className="space-y-4">
        {filteredOperations.map((op) => {
          const isSelectedPilot = op.id === 'op-0892';

          return (
            <div
              key={op.id}
              className={`rounded-2xl border p-5 transition-all relative overflow-hidden ${
                isSelectedPilot 
                  ? `${containerBg} ring-2 ring-[#FF5A5F]/60 shadow-md` 
                  : `${containerBg} hover:shadow-md`
              }`}
            >
              {/* Highlight ribbon for pilot */}
              {isSelectedPilot && (
                <div className="absolute top-0 right-0 bg-[#FF5A5F] text-white text-[10px] font-mono font-bold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
                  Auditoría Activa • Requiere Atención
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Block: Identity & Importer */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    op.transportMode === 'Marítimo' 
                      ? 'bg-[#00E5B0]/15 text-[#008F6B]' 
                      : 'bg-[#FFD600]/20 text-[#B29500]'
                  }`}>
                    {op.transportMode === 'Marítimo' ? <Ship className="w-6 h-6" /> : <Plane className="w-6 h-6" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#008F6B] dark:text-[#00E5B0]">
                        {op.referenceNumber}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-mono ${cardBg}`}>
                        Régimen {op.regime.split(' - ')[0]}
                      </span>
                      <span className={`text-xs font-mono ${textMuted}`}>
                        Aduana {op.customsCode.split(' - ')[0]}
                      </span>
                    </div>

                    <h3 className={`font-heading font-bold text-base mt-1 ${textPrimary}`}>
                      {op.importerName}
                    </h3>

                    <div className={`flex flex-wrap items-center gap-3 text-xs font-mono ${textMuted} mt-1`}>
                      <span>RUC: {op.importerRuc}</span>
                      <span>•</span>
                      <span>B/L: {op.billOfLading}</span>
                      <span>•</span>
                      <span>Nave: {op.vesselOrFlight}</span>
                    </div>
                  </div>
                </div>

                {/* Middle Block: Financial & SUNAT Status */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-[#0B1F3A]/10 pt-3 lg:pt-0 lg:pl-6">
                  <div>
                    <span className={`text-[10px] font-mono uppercase block ${textMuted}`}>
                      Valor CIF Aduanero
                    </span>
                    <span className={`text-base font-bold font-mono tabular-numbers ${textPrimary}`}>
                      ${op.totalCifUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono block">
                      Incoterm {op.incoterm}
                    </span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-mono uppercase block ${textMuted}`}>
                      Docs & Hallazgos
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <FileText className="w-3.5 h-3.5 text-[#00E5B0]" />
                      <span className="text-xs font-mono font-bold text-[#0B1F3A] dark:text-white">
                        {op.documentsCount} PDFs
                      </span>
                    </div>
                    {op.criticalIssuesCount > 0 ? (
                      <span className="text-[11px] font-mono font-bold text-[#FF5A5F] block">
                        {op.criticalIssuesCount} Bloqueantes
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-[#008F6B] block">
                        100% Consistente
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className={`text-[10px] font-mono uppercase block ${textMuted}`}>
                      Canal Estimado
                    </span>
                    <div className="mt-1">
                      <SunatChannelPill channel={op.projectedChannel} percentage={op.projectedChannel === 'Verde' ? 95 : 68} />
                    </div>
                  </div>
                </div>

                {/* Right Action Block */}
                <div className="flex items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0">
                  {op.criticalIssuesCount > 0 ? (
                    <button
                      id={`inspect-issues-${op.id}`}
                      onClick={() => onNavigate('consistency-matrix')}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FF5A5F] text-white hover:bg-[#E0484D] font-mono text-xs font-bold tracking-wider transition-all shadow-sm"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>RESOLVER ERRORES ({op.criticalIssuesCount})</span>
                    </button>
                  ) : (
                    <button
                      id={`view-report-${op.id}`}
                      onClick={() => onNavigate('report')}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold tracking-wider transition-all shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>VER PRE-DAM</span>
                    </button>
                  )}

                  <button
                    onClick={() => onNavigate('extraction')}
                    title="Ver extracción de datos OCR"
                    className={`p-2.5 rounded-xl border ${cardBg} hover:border-[#00E5B0] transition-colors`}
                  >
                    <ArrowRight className="w-4 h-4 text-[#00E5B0]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
