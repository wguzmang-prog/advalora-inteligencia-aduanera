import React, { useState, useEffect } from 'react';
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
  Undo2,
  RefreshCw,
  Cpu,
  Database,
  FileSearch,
  CheckCircle,
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScreenId, InconsistencyFinding, Severity, DeclarationOperation } from '../../types';
import { MOCK_INCONSISTENCIES, CURRENT_OPERATION, getActiveOperation } from '../../data/mockData';
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
  // Read saved active operation from localStorage or CURRENT_OPERATION
  const [operation, setOperation] = useState<DeclarationOperation>(() => getActiveOperation());

  // Keep in sync with latest local storage updates
  useEffect(() => {
    const activeOp = getActiveOperation();
    setOperation(activeOp);
    setFindings(buildFindings(activeOp));
  }, []);

  // Generate dynamic findings reflecting the current active operation
  const buildFindings = (op: DeclarationOperation): InconsistencyFinding[] => {
    const refClean = (op.referenceNumber || 'ADV-2024-0892').replace('ADV-', '');
    const impName = op.importerName || 'TechImports Perú S.A.C.';
    const impRuc = op.importerRuc || '20554921098';
    const firstWord = impName.split(' ')[0] || 'TechImports';
    const incotermVal = op.incoterm || 'CIF';
    const cifFormatted = (op.totalCifUsd || 153550).toLocaleString('en-US');

    return MOCK_INCONSISTENCIES.map(f => {
      if (f.id === 'inc-01') {
        return {
          ...f,
          affectedDocuments: [
            {
              docType: 'Packing List',
              docName: `PL-2024-${refClean}_${firstWord}.pdf`,
              quotedValue: 'Total Gross Weight: 1,420.50 KGS (85 Palletized Cartons)',
              location: 'Página 2, Cuadro resumen de pesos finales'
            },
            {
              docType: 'Bill of Lading',
              docName: `MAEU98231019_BL_${refClean}.pdf`,
              quotedValue: 'Gross Cargo Weight: 1,380.00 KGS (Declared by Shipper)',
              location: 'Página 1, Casilla 14 (Gross Weight)'
            }
          ]
        };
      }
      if (f.id === 'inc-02') {
        return {
          ...f,
          title: `Conflicto entre Incoterm ${incotermVal} pactado y Cláusula de Flete`,
          description: `La Factura Comercial indica condición de venta ${incotermVal} por USD ${cifFormatted}, mientras que el B/L marítimo estipula flete por cobrar en destino (Freight Collect).`,
          affectedDocuments: [
            {
              docType: 'Factura Comercial',
              docName: `INV-2024-SZ_${firstWord}.pdf`,
              quotedValue: `Terms of Delivery: ${incotermVal} CALLAO (Valor Total Declarado USD ${cifFormatted})`,
              location: 'Página 1, Encabezado comercial y desglose final'
            },
            {
              docType: 'Bill of Lading',
              docName: `MAEU98231019_BL_${refClean}.pdf`,
              quotedValue: 'Freight & Charges: FREIGHT COLLECT (Payable at destination by consignee)',
              location: 'Página 1, Casilla 17 (Freight Payment Terms)'
            }
          ]
        };
      }
      if (f.id === 'inc-03') {
        return {
          ...f,
          description: `El Certificado de Origen omitió la extensión societaria en la razón social de ${impName}.`,
          affectedDocuments: [
            {
              docType: 'Certificado de Origen',
              docName: `COO_China_Peru_FTA_${refClean}.pdf`,
              quotedValue: `Consignee: ${impName.toUpperCase().replace(' S.A.C.', ' S.A.').replace(' SAC', ' SA')} - RUC ${impRuc} (Calle Las Camelias 490)`,
              location: 'Página 1, Casilla 2 (Consignee Name & Address)'
            },
            {
              docType: 'Factura Comercial',
              docName: `INV-2024-SZ_${firstWord}.pdf`,
              quotedValue: `Buyer: ${impName.toUpperCase()} - RUC ${impRuc}`,
              location: 'Página 1, Casilla Comprador'
            }
          ]
        };
      }
      return f;
    });
  };

  const [findings, setFindings] = useState<InconsistencyFinding[]>(() => buildFindings(operation));
  const [severityFilter, setSeverityFilter] = useState<'all' | 'bloqueante' | 'advertencia' | 'validado'>('all');
  const [resolvingFinding, setResolvingFinding] = useState<InconsistencyFinding | null>(null);
  const [resolutionChoice, setResolutionChoice] = useState<string>('option-1');
  const [customJustification, setCustomJustification] = useState<string>('');

  // Consistency analysis state
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditProgress, setAuditProgress] = useState<number>(100);
  const [auditStep, setAuditStep] = useState<string>('Legajo documental auditado con IA');
  const [auditNotice, setAuditNotice] = useState<{ show: boolean; message: string } | null>(null);

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

  // Handler for requesting consistency analysis
  const handleRequestConsistency = () => {
    const currentOp = getActiveOperation();
    setOperation(currentOp);
    setIsAuditing(true);
    setAuditProgress(15);
    setAuditStep(`1/5: Vinculando ${currentOp.documentsCount || 5} documentos del importador ${currentOp.importerName}...`);

    setTimeout(() => {
      setAuditProgress(40);
      setAuditStep('2/5: Cotejando Factura Comercial vs Packing List (Pesos y Códigos)...');
    }, 400);

    setTimeout(() => {
      setAuditProgress(68);
      setAuditStep(`3/5: Evaluando condición Incoterm ${currentOp.incoterm || 'CIF'} vs Flete Marítimo B/L...`);
    }, 850);

    setTimeout(() => {
      setAuditProgress(88);
      setAuditStep(`4/5: Cruzando RUC ${currentOp.importerRuc} con Certificado de Origen TLC...`);
    }, 1300);

    setTimeout(() => {
      setAuditProgress(100);
      setIsAuditing(false);
      setAuditStep('5/5: Auditoría IA de consistencia completada');
      setFindings(buildFindings(currentOp));
      setAuditNotice({
        show: true,
        message: `¡Consistencia auditada con IA para ${currentOp.importerName}! Se cotejaron los documentos guardados y se identificaron 2 observaciones bloqueantes para subsanar.`
      });
      setTimeout(() => {
        setAuditNotice(null);
      }, 6000);
    }, 1800);
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* STAR SCREEN BADGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FF5A5F]/20 text-[#FF5A5F] border border-[#FF5A5F]/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FFD600]" />
              PANTALLA 5 • CORAZÓN DEL PRODUCTO
            </span>
            <span className="text-xs font-mono text-[#008F6B] font-bold">
              Despacho: {operation.referenceNumber}
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold font-heading ${textPrimary} mt-1`}>
            Matriz de Consistencia Documental IA
          </h1>
          <p className={`text-sm ${textMuted} mt-1`}>
            Cruce exhaustivo entre Factura, Packing List, Bill of Lading, Certificado de Origen y Transferencia SWIFT.
          </p>
        </div>

        {/* Quick Nav & Main Action Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            id="request-consistency-header-btn"
            type="button"
            onClick={handleRequestConsistency}
            disabled={isAuditing}
            className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#00E5B0] bg-[#00E5B0]/15 hover:bg-[#00E5B0]/25 text-[#008F6B] dark:text-[#00E5B0] font-mono text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Cpu className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'ANALIZANDO...' : 'SOLICITAR CONSISTENCIA IA'}</span>
          </button>

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

      {/* EXPEDIENTE GUARDADO SUMMARY CARD */}
      <div className={`p-5 rounded-3xl border shadow-sm ${containerBg}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#0B1F3A]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00E5B0]/15 border border-[#00E5B0]/30 flex items-center justify-center text-[#008F6B] dark:text-[#00E5B0]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#008F6B] dark:text-[#00E5B0]">
                  Expediente Guardado & Sincronizado
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle className="w-3 h-3" />
                  Listo para Consistencia
                </span>
              </div>
              <h2 className={`text-base sm:text-lg font-bold font-heading ${textPrimary}`}>
                {operation.importerName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="request-consistency-main-btn"
              type="button"
              onClick={handleRequestConsistency}
              disabled={isAuditing}
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold tracking-wider shadow-md shadow-[#00E5B0]/25 active:scale-95 transition-all disabled:opacity-50"
            >
              <Cpu className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'EJECUTANDO ANÁLISIS IA...' : 'SOLICITAR CONSISTENCIA IA'}</span>
            </button>
          </div>
        </div>

        {/* Operation Grid Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 text-xs font-mono">
          <div className={`p-3 rounded-2xl ${cardBg}`}>
            <span className="text-[10px] uppercase text-gray-400 block mb-0.5">N° Despacho</span>
            <span className="font-bold text-[#008F6B] dark:text-[#00E5B0]">{operation.referenceNumber}</span>
          </div>

          <div className={`p-3 rounded-2xl ${cardBg}`}>
            <span className="text-[10px] uppercase text-gray-400 block mb-0.5">RUC Importador</span>
            <span className="font-bold">{operation.importerRuc}</span>
          </div>

          <div className={`p-3 rounded-2xl ${cardBg}`}>
            <span className="text-[10px] uppercase text-gray-400 block mb-0.5">Valor CIF Declarado</span>
            <span className="font-bold text-[#0B1F3A] dark:text-white">
              ${Number(operation.totalCifUsd || 153550).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </span>
          </div>

          <div className={`p-3 rounded-2xl ${cardBg}`}>
            <span className="text-[10px] uppercase text-gray-400 block mb-0.5">Incoterm</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{operation.incoterm || 'CIF'}</span>
          </div>

          <div className={`p-3 rounded-2xl ${cardBg}`}>
            <span className="text-[10px] uppercase text-gray-400 block mb-0.5">Aduana</span>
            <span className="font-bold truncate block" title={operation.customsCode}>
              {operation.customsCode?.split(' - ')[0] || '118 Callao'}
            </span>
          </div>

          <div className={`p-3 rounded-2xl ${cardBg}`}>
            <span className="text-[10px] uppercase text-gray-400 block mb-0.5">Legajo Documental</span>
            <span className="font-bold text-[#008F6B] dark:text-[#00E5B0]">
              {operation.documentsCount || 5} Documentos
            </span>
          </div>
        </div>

        {/* Live Consistency Scanning Bar if Auditing */}
        {isAuditing && (
          <div className="mt-4 p-4 rounded-2xl bg-[#00E5B0]/10 border border-[#00E5B0]/30 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#008F6B] dark:text-[#00E5B0] flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                {auditStep}
              </span>
              <span className="font-bold text-[#0B1F3A] dark:text-white">{auditProgress}%</span>
            </div>
            <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-[#00E5B0] h-full rounded-full transition-all duration-300"
                style={{ width: `${auditProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Audit Notice Toast */}
        {auditNotice && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#E6FCF7] dark:bg-[#00E5B0]/15 border border-[#00E5B0] text-[#008F6B] dark:text-[#00E5B0] text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{auditNotice.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setAuditNotice(null)}
              className="text-[11px] underline hover:opacity-75 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>

      {/* SUNAT HEALTH BANNER & SEVERITY COUNTERS */}
      <div className={`p-6 rounded-3xl border relative overflow-hidden shadow-sm ${containerBg}`}>
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
      <div className="flex items-center justify-between gap-4 mb-2">
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
              key={`finding-${finding.id}`}
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
