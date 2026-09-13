import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight, 
  FileText, 
  Check, 
  X, 
  Sparkles, 
  Scale, 
  DollarSign, 
  Building2, 
  HelpCircle,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Undo2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScreenId, InconsistencyFinding, Severity } from '../../types';
import { MOCK_INCONSISTENCIES, CURRENT_OPERATION } from '../../data/mockData';
import { SeverityBadge, CustomsSeal, SunatChannelPill } from '../common/CustomsDecorations';

interface Screen5Props {
  onNavigate: (screen: ScreenId) => void;
  darkMode: boolean;
  onUpdateBlockersCount?: (count: number) => void;
}

export const Screen5ConsistencyMatrix: React.FC<Screen5Props> = ({ 
  onNavigate, 
  darkMode,
  onUpdateBlockersCount 
}) => {
  const [findings, setFindings] = useState<InconsistencyFinding[]>(MOCK_INCONSISTENCIES);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'bloqueante' | 'advertencia' | 'validado'>('all');
  const [resolvingFinding, setResolvingFinding] = useState<InconsistencyFinding | null>(null);
  const [resolutionChoice, setResolutionChoice] = useState<string>('option-1');
  const [customJustification, setCustomJustification] = useState<string>('');

  const containerBg = darkMode ? 'bg-[#0B1F3A] border-[#18335E]' : 'bg-white border-[#0B1F3A]/10';
  const cardBg = darkMode ? 'bg-[#132B4F] border-[#1E4378]' : 'bg-[#F4F7FB] border-[#0B1F3A]/10';
  const textPrimary = darkMode ? 'text-white' : 'text-[#0B1F3A]';
  const textMuted = darkMode ? 'text-white/60' : 'text-[#0B1F3A]/60';

  const blockersCount = findings.filter(f => f.severity === 'bloqueante' && f.resolutionStatus === 'abierto').length;
  const warningsCount = findings.filter(f => f.severity === 'advertencia' && f.resolutionStatus === 'abierto').length;
  const validatedCount = findings.filter(f => f.severity === 'validado' || f.resolutionStatus === 'resuelto').length;

  const filteredFindings = findings.filter(f => {
    if (severityFilter === 'all') return true;
    if (severityFilter === 'bloqueante') return f.severity === 'bloqueante';
    if (severityFilter === 'advertencia') return f.severity === 'advertencia';
    if (severityFilter === 'validado') return f.severity === 'validado' || f.resolutionStatus === 'resuelto';
    return true;
  });

  const handleResolve = (findingId: string, choiceNote: string) => {
    const updated = findings.map(f => {
      if (f.id === findingId) {
        return {
          ...f,
          resolutionStatus: 'resuelto' as const,
          resolutionNote: choiceNote
        };
      }
      return f;
    });

    setFindings(updated);
    setResolvingFinding(null);

    const newBlockers = updated.filter(f => f.severity === 'bloqueante' && f.resolutionStatus === 'abierto').length;
    if (onUpdateBlockersCount) {
      onUpdateBlockersCount(newBlockers);
    }

    if (newBlockers === 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00E5B0', '#FFD600', '#0B1F3A']
      });
    }
  };

  const handleReopen = (findingId: string) => {
    const updated = findings.map(f => {
      if (f.id === findingId) {
        return {
          ...f,
          resolutionStatus: 'abierto' as const,
          resolutionNote: undefined
        };
      }
      return f;
    });
    setFindings(updated);
    const newBlockers = updated.filter(f => f.severity === 'bloqueante' && f.resolutionStatus === 'abierto').length;
    if (onUpdateBlockersCount) {
      onUpdateBlockersCount(newBlockers);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* STAR SCREEN BADGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FF5A5F]/20 text-[#FF5A5F] border border-[#FF5A5F]/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FFD600]" />
              PANTALLA 5 • CORAZÓN DEL PRODUCTO
            </span>
            <span className="text-xs font-mono text-[#008F6B] font-bold">
              Despacho: {CURRENT_OPERATION.referenceNumber}
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold font-heading ${textPrimary} mt-1`}>
            Matriz de Consistencia Documental IA
          </h1>
          <p className={`text-sm ${textMuted} mt-1`}>
            Cruce exhaustivo entre Factura, Packing List, Bill of Lading, Certificado de Origen y Transferencia SWIFT.
          </p>
        </div>

        {/* Quick Nav Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('classifier')}
            className="px-4 py-2.5 rounded-xl border border-[#0B1F3A]/20 dark:border-white/20 font-mono text-xs font-bold hover:bg-white/10"
          >
            CLASIFICADOR NANDINA →
          </button>
          <button
            onClick={() => onNavigate('report')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider shadow-md transition-all ${
              blockersCount === 0
                ? 'bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] shadow-[#00E5B0]/30 scale-105'
                : 'bg-[#0B1F3A] text-white hover:bg-opacity-90'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{blockersCount === 0 ? 'GENERAR PRE-DAM APROBADA' : 'VER REPORTE PRE-DAM'}</span>
          </button>
        </div>
      </div>

      {/* SUNAT HEALTH BANNER & SEVERITY COUNTERS */}
      <div className={`p-6 rounded-3xl border mb-8 relative overflow-hidden shadow-sm ${containerBg}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Status Indicator */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {blockersCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBEB] text-[#FF5A5F] border border-[#FF5A5F]/40 font-mono text-xs font-extrabold animate-pulse">
                  <AlertOctagon className="w-4 h-4" />
                  NO APTO PARA TELE-DESPACHO SUNAT
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6FCF7] text-[#008F6B] border border-[#00E5B0]/40 font-mono text-xs font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-[#00E5B0]" />
                  EXPEDIENTE 100% CONSISTENTE • LISTO PARA TRANSMISIÓN
                </span>
              )}
              <SunatChannelPill 
                channel={blockersCount === 0 ? 'Verde' : 'Naranja'} 
                percentage={blockersCount === 0 ? 98 : 68} 
              />
            </div>

            <h3 className={`text-xl font-bold font-heading ${textPrimary}`}>
              {blockersCount > 0
                ? `Se detectaron ${blockersCount} discrepancias bloqueantes que generarían multa o canal rojo`
                : 'Todas las observaciones documentales han sido resueltas y justificadas'
              }
            </h3>
            <p className={`text-xs ${textMuted} mt-1 max-w-2xl`}>
              Tolerancia aduanera SUNAT: Peso &lt; 2.5% según Procedimiento General DESPA-PG.01. Valores FOB y flete respaldados ante el Acuerdo de Valoración de la OMC.
            </p>
          </div>

          {/* Severity Counters Strip */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Coral: Bloqueantes */}
            <button
              onClick={() => setSeverityFilter('bloqueante')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                severityFilter === 'bloqueante'
                  ? 'border-[#FF5A5F] bg-[#FF5A5F]/15 ring-2 ring-[#FF5A5F]'
                  : 'bg-[#FFEBEB] border-[#FF5A5F]/30 hover:scale-105'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#FF5A5F] uppercase">
                <AlertOctagon className="w-3.5 h-3.5" />
                Bloqueantes
              </div>
              <div className="text-2xl font-black font-heading text-[#FF5A5F] tabular-numbers mt-0.5">
                {blockersCount}
              </div>
              <div className="text-[10px] text-[#D92B30] font-mono">
                {blockersCount > 0 ? 'Impiden DAM' : 'Subsanados'}
              </div>
            </button>

            {/* Solar Yellow: Advertencias */}
            <button
              onClick={() => setSeverityFilter('advertencia')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                severityFilter === 'advertencia'
                  ? 'border-[#FFD600] bg-[#FFD600]/20 ring-2 ring-[#FFD600]'
                  : 'bg-[#FFFBE6] border-[#FFD600]/40 hover:scale-105'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#B29500] uppercase">
                <AlertTriangle className="w-3.5 h-3.5" />
                Advertencias
              </div>
              <div className="text-2xl font-black font-heading text-[#B29500] tabular-numbers mt-0.5">
                {warningsCount}
              </div>
              <div className="text-[10px] text-gray-600 font-mono">
                Riesgo medio
              </div>
            </button>

            {/* Electric Turquoise: Validados */}
            <button
              onClick={() => setSeverityFilter('validado')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                severityFilter === 'validado'
                  ? 'border-[#00E5B0] bg-[#00E5B0]/20 ring-2 ring-[#00E5B0]'
                  : 'bg-[#E6FCF7] border-[#00E5B0]/40 hover:scale-105'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#008F6B] uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Validados
              </div>
              <div className="text-2xl font-black font-heading text-[#008F6B] tabular-numbers mt-0.5">
                {validatedCount}
              </div>
              <div className="text-[10px] text-[#008F6B] font-mono">
                Cruces conformes
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER TABS STRIP */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Todos los Hallazgos', count: findings.length },
            { id: 'bloqueante', label: 'Bloqueantes Críticos', count: blockersCount, isRed: true },
            { id: 'advertencia', label: 'Advertencias', count: warningsCount, isYellow: true },
            { id: 'validado', label: 'Validados & Resueltos', count: validatedCount, isGreen: true }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSeverityFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                severityFilter === tab.id
                  ? 'bg-[#00E5B0] text-[#0B1F3A] shadow-sm scale-102'
                  : `${cardBg} ${textMuted} hover:text-white`
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 text-[10px]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <span className={`text-xs font-mono ${textMuted} hidden md:inline`}>
          Mostrando {filteredFindings.length} hallazgos
        </span>
      </div>

      {/* DISCREPANCY CARDS LIST */}
      <div className="space-y-6">
        {filteredFindings.map((finding) => {
          const isResolved = finding.resolutionStatus === 'resuelto';
          const isBloqueante = finding.severity === 'bloqueante';
          const isAdvertencia = finding.severity === 'advertencia';

          return (
            <div
              key={finding.id}
              className={`rounded-3xl border p-6 transition-all relative overflow-hidden ${
                isResolved
                  ? `${containerBg} opacity-90 border-[#00E5B0]/40`
                  : isBloqueante
                  ? `${containerBg} border-[#FF5A5F]/70 shadow-md ring-1 ring-[#FF5A5F]/30`
                  : isAdvertencia
                  ? `${containerBg} border-[#FFD600]/60`
                  : `${containerBg} border-[#00E5B0]/40`
              }`}
            >
              {/* Top Row: Category, Title, Status Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <SeverityBadge
                    severity={isResolved ? 'validado' : finding.severity}
                    label={isResolved ? 'RESUELTO POR LIQUIDADOR' : undefined}
                    size="md"
                  />
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${cardBg}`}>
                    {finding.category}
                  </span>
                  {finding.toleranceMargin && (
                    <span className="text-xs font-mono font-bold text-[#FF5A5F] bg-[#FFEBEB] px-2 py-0.5 rounded-md">
                      {finding.toleranceMargin}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isResolved ? (
                    <button
                      onClick={() => handleReopen(finding.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono text-gray-500 hover:text-[#FF5A5F] hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Reabrir</span>
                    </button>
                  ) : (
                    <button
                      id={`resolve-btn-${finding.id}`}
                      onClick={() => setResolvingFinding(finding)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all shadow-sm ${
                        isBloqueante
                          ? 'bg-[#FF5A5F] text-white hover:bg-[#E0484D] scale-105'
                          : 'bg-[#FFD600] text-[#0B1F3A] hover:bg-[#E6C200]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>RESOLVER DISCREPANCIA</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className={`text-lg font-bold font-heading ${textPrimary}`}>
                {finding.title}
              </h3>
              <p className={`text-xs sm:text-sm ${textMuted} mt-1`}>
                {finding.description}
              </p>

              {/* SIDE-BY-SIDE QUOTED EXCERPTS COMPARISON */}
              <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {finding.affectedDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border relative ${
                      isBloqueante && !isResolved
                        ? 'bg-[#FFEBEB]/40 border-[#FF5A5F]/40'
                        : `${cardBg} border-[#0B1F3A]/10`
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-[#008F6B] dark:text-[#00E5B0]">
                        <FileText className="w-4 h-4" />
                        <span>{doc.docType}</span>
                      </div>
                      <span className="text-gray-400 text-[11px] truncate max-w-[150px]">
                        {doc.docName}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-black/40 border border-[#0B1F3A]/10 font-mono text-xs text-[#0B1F3A] dark:text-white font-semibold">
                      "{doc.quotedValue}"
                    </div>

                    <div className="mt-2 text-[10px] font-mono text-gray-500 flex items-center justify-between">
                      <span>Ubicación: {doc.location}</span>
                      <button 
                        onClick={() => onNavigate('extraction')}
                        className="text-[#008F6B] hover:underline flex items-center gap-1"
                      >
                        Ver en PDF <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUNAT IMPACT & LEGAL BASIS BOX */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-black/30 border border-[#0B1F3A]/10 space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <ShieldAlert className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold font-mono text-[#FFD600] block mb-0.5">
                      IMPACTO ADUANERO SUNAT:
                    </span>
                    <span className={`text-xs ${textPrimary}`}>
                      {finding.sunatImpact}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500 pt-1 border-t border-[#0B1F3A]/10">
                  <span className="font-bold">Base Normativa:</span>
                  <span>{finding.legalBasis}</span>
                </div>
              </div>

              {/* Resolved Note if already solved */}
              {isResolved && finding.resolutionNote && (
                <div className="mt-3 p-3 rounded-xl bg-[#E6FCF7] border border-[#00E5B0]/40 text-xs font-mono text-[#008F6B] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5B0] shrink-0" />
                    <span><strong>Acción de resolución aplicada:</strong> {finding.resolutionNote}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">Valeria M. (Liquidadora)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* RESOLUTION MODAL / DRAWER */}
      {resolvingFinding && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-3xl p-6 md:p-8 border shadow-2xl space-y-6 ${containerBg} animate-in fade-in zoom-in duration-200`}>
            <div className="flex items-start justify-between border-b border-[#0B1F3A]/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={resolvingFinding.severity} />
                  <span className="text-xs font-mono font-bold text-gray-400">RESOLUCIÓN DE DISCREPANCIA</span>
                </div>
                <h3 className={`text-xl font-bold font-heading ${textPrimary} mt-1`}>
                  {resolvingFinding.title}
                </h3>
              </div>
              <button
                onClick={() => setResolvingFinding(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Choice Options based on Finding ID */}
            <div className="space-y-3">
              <label className={`block text-xs font-mono uppercase font-bold ${textMuted}`}>
                Selecciona la Criterio de Subsanación para el Teledespacho:
              </label>

              {resolvingFinding.id === 'inc-01' ? (
                <>
                  <button
                    onClick={() => setResolutionChoice('Prevalece peso de Packing List (1,420.50 kg) respaldado por tique oficial de balanza APM Terminals Callao.')}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      resolutionChoice.includes('1,420.50')
                        ? 'border-[#00E5B0] bg-[#00E5B0]/10 ring-2 ring-[#00E5B0]'
                        : `${cardBg} hover:border-[#00E5B0]/40`
                    }`}
                  >
                    <div className="font-bold text-sm text-[#008F6B] dark:text-[#00E5B0] font-mono">
                      Opción A: Prevalece Packing List (1,420.50 kg) con Tique de Balanza
                    </div>
                    <p className={`text-xs ${textMuted} mt-1`}>
                      Se adjunta tique N° BZ-9910 de APM Terminals Callao. Se subsana la discrepancia de origen del shipper sin necesidad de rectificar el B/L.
                    </p>
                  </button>

                  <button
                    onClick={() => setResolutionChoice('Rectificación de manifiesto (CSI) vía transmisión electrónica de Maersk Line antes de numeración.')}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      resolutionChoice.includes('CSI')
                        ? 'border-[#00E5B0] bg-[#00E5B0]/10 ring-2 ring-[#00E5B0]'
                        : `${cardBg} hover:border-[#00E5B0]/40`
                    }`}
                  >
                    <div className="font-bold text-sm text-[#0B1F3A] dark:text-white font-mono">
                      Opción B: Solicitar Carta de Corrección (CSI) a la Naviera Maersk
                    </div>
                    <p className={`text-xs ${textMuted} mt-1`}>
                      La agencia marítima emite B/L corrector en el portal VUCE/SUNAT alineando el peso exacto a 1,420.50 kg.
                    </p>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setResolutionChoice('Adjuntar comprobante SWIFT y factura de flete local acreditando condición Freight Prepaid.')}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      resolutionChoice.includes('SWIFT')
                        ? 'border-[#00E5B0] bg-[#00E5B0]/10 ring-2 ring-[#00E5B0]'
                        : `${cardBg} hover:border-[#00E5B0]/40`
                    }`}
                  >
                    <div className="font-bold text-sm text-[#008F6B] dark:text-[#00E5B0] font-mono">
                      Acreditar Flete Pagado en Origen (Prepaid)
                    </div>
                    <p className={`text-xs ${textMuted} mt-1`}>
                      Consignar base CIF completa con Swift de respaldo, evitando recargo por flete no declarado.
                    </p>
                  </button>

                  <button
                    onClick={() => setResolutionChoice('Ajustar declaración a término FOB Callao y liquidar flete marítimo localmente.')}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      resolutionChoice.includes('FOB')
                        ? 'border-[#00E5B0] bg-[#00E5B0]/10 ring-2 ring-[#00E5B0]'
                        : `${cardBg} hover:border-[#00E5B0]/40`
                    }`}
                  >
                    <div className="font-bold text-sm text-[#0B1F3A] dark:text-white font-mono">
                      Ajustar a Término FOB con Flete por Separado
                    </div>
                    <p className={`text-xs ${textMuted} mt-1`}>
                      Modificar casilla 4.1 de la DAM registrando la factura de flete local de Maersk Perú.
                    </p>
                  </button>
                </>
              )}

              {/* Justification note input */}
              <div className="pt-2">
                <label className={`block text-xs font-mono uppercase font-bold mb-1.5 ${textMuted}`}>
                  Nota de Auditoría para Carpeta SUNAT (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Justificación formal que se incluirá en el anexo de teledespacho..."
                  value={customJustification}
                  onChange={(e) => setCustomJustification(e.target.value)}
                  className={`w-full p-3 rounded-xl text-xs font-mono border focus:ring-2 focus:ring-[#00E5B0] ${
                    darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                  }`}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#0B1F3A]/10">
              <button
                onClick={() => setResolvingFinding(null)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold ${textMuted}`}
              >
                Cancelar
              </button>
              <button
                id="confirm-resolution-btn"
                onClick={() => handleResolve(
                  resolvingFinding.id, 
                  customJustification ? `${resolutionChoice} (Nota: ${customJustification})` : resolutionChoice
                )}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold tracking-wider shadow-lg shadow-[#00E5B0]/30"
              >
                <Check className="w-4 h-4" />
                <span>APLICAR RESOLUCIÓN Y VALIDAR</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
