import React, { useState, useEffect } from 'react';
import { 
  ListTree, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  ChevronRight,
  Filter,
  ShieldAlert,
  Percent,
  Database,
  FileSearch,
  Scan,
  Eye,
  X,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Cpu,
  Download,
  ExternalLink,
  Check
} from 'lucide-react';
import { ScreenId, TariffItem, DocumentScan } from '../../types';
import { MOCK_TARIFF_ITEMS, MOCK_DOCUMENTS, getActiveOperation } from '../../data/mockData';
import { saveClassificationToSupabase } from '../../lib/supabase';

interface Screen6Props {
  onNavigate: (screen: ScreenId, itemId?: string) => void;
  onSelectItemForDetail: (item: TariffItem) => void;
  darkMode: boolean;
}

export const Screen6TariffClassifier: React.FC<Screen6Props> = ({ 
  onNavigate, 
  onSelectItemForDetail,
  darkMode 
}) => {
  const [items, setItems] = useState<TariffItem[]>(MOCK_TARIFF_ITEMS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'validado' | 'en_revision' | 'observado'>('all');
  const [isSyncingSupabase, setIsSyncingSupabase] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Active operation & attached PDF documents
  const [activeOperation, setActiveOperation] = useState(() => getActiveOperation());
  const attachedDocuments: DocumentScan[] = (activeOperation.documents && activeOperation.documents.length > 0) 
    ? activeOperation.documents 
    : MOCK_DOCUMENTS;

  // Selected PDF document for modal inspection
  const [selectedDocId, setSelectedDocId] = useState<string>(() => attachedDocuments[0]?.id || 'doc-1');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const [highlightedItemNumber, setHighlightedItemNumber] = useState<number | null>(null);

  // Search tariff from PDF action states
  const [isSearchingPdfTariff, setIsSearchingPdfTariff] = useState<boolean>(false);
  const [searchProgress, setSearchProgress] = useState<number>(0);
  const [searchStepText, setSearchStepText] = useState<string>('');
  const [searchSuccessBanner, setSearchSuccessBanner] = useState<{
    itemsFound: number;
    docName: string;
    details: string;
  } | null>(null);

  const containerBg = darkMode ? 'bg-[#0B1F3A] border-[#18335E]' : 'bg-white border-[#0B1F3A]/10';
  const cardBg = darkMode ? 'bg-[#132B4F] border-[#1E4378]' : 'bg-[#F4F7FB] border-[#0B1F3A]/10';
  const textPrimary = darkMode ? 'text-white' : 'text-[#0B1F3A]';
  const textMuted = darkMode ? 'text-white/60' : 'text-[#0B1F3A]/60';

  useEffect(() => {
    setActiveOperation(getActiveOperation());
  }, []);

  const activeDoc = attachedDocuments.find(d => d.id === selectedDocId) || attachedDocuments[0] || MOCK_DOCUMENTS[0];

  const handleSyncWithSupabase = async () => {
    setIsSyncingSupabase(true);
    let successCount = 0;
    for (const item of items) {
      await saveClassificationToSupabase({
        reference_code: item.id || `ITEM-${item.itemNumber}`,
        commercial_description: item.commercialDescription,
        hs_code: item.suggestedNandina,
        confidence_score: item.confidence,
        tariff_rate_adv: item.adValoremRate,
        igv_rate: 16.0,
        ipm_rate: 2.0,
        restrictions: item.restrictedGood ? item.restrictedEntity : undefined
      });
      successCount++;
    }
    setIsSyncingSupabase(false);
    setSyncStatusMsg(`¡${successCount} partidas NANDINA sincronizadas exitosamente con Supabase!`);
    setTimeout(() => setSyncStatusMsg(null), 4000);
  };

  // ACTION 1: Revisar PDF escaneado para la asignación de la partida arancelaria
  const handleOpenPdfReview = (targetItemNumber?: number) => {
    if (typeof targetItemNumber === 'number') {
      setHighlightedItemNumber(targetItemNumber);
    } else {
      setHighlightedItemNumber(null);
    }
    setIsPdfModalOpen(true);
  };

  // ACTION 2: Realizar la acción de buscar Partida Arancelaria del PDF Adjuntado
  const handleSearchTariffFromPdf = () => {
    setIsSearchingPdfTariff(true);
    setSearchProgress(20);
    setSearchStepText(`1/4: Extrayendo descripciones comerciales y especificaciones técnicas desde ${activeDoc.fileName}...`);

    setTimeout(() => {
      setSearchProgress(45);
      setSearchStepText('2/4: Consultando Nomenclatura NANDINA 2024 (D.S. N° 404-2021-EF) y base de datos SUNAT...');
    }, 450);

    setTimeout(() => {
      setSearchProgress(75);
      setSearchStepText('3/4: Evaluando Reglas Generales de Interpretación (RGI 1 y RGI 6) y notas de exclusión de capítulos 84, 85 y 42...');
    }, 950);

    setTimeout(() => {
      setSearchProgress(100);
      setIsSearchingPdfTariff(false);
      
      // Update items with boosted verification and match indicators
      const updated = items.map(item => ({
        ...item,
        confidence: Math.min(99.4, Math.max(item.confidence, 94.5)),
        status: item.status === 'observado' ? ('en_revision' as const) : ('validado' as const)
      }));
      setItems(updated);

      setSearchSuccessBanner({
        itemsFound: updated.length,
        docName: activeDoc.fileName,
        details: 'Se identificaron 6 subpartidas nacionales a 10 dígitos cotejadas contra las líneas comerciales del documento PDF.'
      });

      setTimeout(() => {
        setSearchSuccessBanner(null);
      }, 7000);
    }, 1500);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.commercialDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.suggestedNandina.includes(searchQuery) ||
      item.technicalDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleInspect = (item: TariffItem) => {
    onSelectItemForDetail(item);
    onNavigate('tariff-detail', item.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00E5B0]/20 text-[#008F6B] border border-[#00E5B0]/40">
              PANTALLA 6 DE 9
            </span>
            <h1 className={`text-2xl sm:text-3xl font-bold font-heading ${textPrimary}`}>
              Clasificador Arancelario NANDINA (SUNAT)
            </h1>
          </div>
          <p className={`text-sm ${textMuted} mt-1`}>
            Recomendación de subpartidas nacionales a 10 dígitos con fundamentación de notas explicativas y reglas de origen.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* BOTÓN 1: Revisar PDF escaneado para la asignación de la partida arancelaria */}
          <button
            id="btn-review-scanned-pdf-tariff"
            type="button"
            onClick={() => handleOpenPdfReview()}
            className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#00E5B0] bg-[#00E5B0]/10 hover:bg-[#00E5B0]/20 text-[#008F6B] dark:text-[#00E5B0] font-mono text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Abre el visor interactivo del PDF escaneado con las líneas comerciales y técnicas resaltadas"
          >
            <FileSearch className="w-4 h-4 text-[#008F6B] dark:text-[#00E5B0]" />
            <span>Revisar PDF escaneado para la asignación de la partida arancelaria</span>
          </button>

          {/* BOTÓN 2: Realizar la acción de buscar Partida Arancelaria del PDF Adjuntado */}
          <button
            id="btn-search-tariff-attached-pdf"
            type="button"
            onClick={handleSearchTariffFromPdf}
            disabled={isSearchingPdfTariff}
            className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold tracking-wider shadow-md shadow-[#00E5B0]/25 active:scale-95 transition-all disabled:opacity-50"
            title="Inicia el escaneo neuronal del PDF adjuntado para clasificar y asignar las subpartidas NANDINA a 10 dígitos"
          >
            <Sparkles className={`w-4 h-4 ${isSearchingPdfTariff ? 'animate-spin' : ''}`} />
            <span>
              {isSearchingPdfTariff 
                ? 'BUSCANDO PARTIDAS EN PDF...' 
                : 'Buscar Partida Arancelaria del PDF Adjuntado'}
            </span>
          </button>

          <button
            id="sync-classifications-supabase"
            onClick={handleSyncWithSupabase}
            disabled={isSyncingSupabase}
            className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 font-mono text-xs font-bold text-gray-700 dark:text-gray-300 transition-all disabled:opacity-50"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSyncingSupabase ? 'SINCRONIZANDO...' : 'SINCRONIZAR'}</span>
          </button>

          <button
            onClick={() => onNavigate('tariff-detail')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#0B1F3A]/20 dark:border-white/20 font-mono text-xs font-bold hover:bg-white/10 ${textPrimary}`}
          >
            <span>DETALLE LEGAL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AI Search Progress Modal / Overlay */}
      {isSearchingPdfTariff && (
        <div className="mb-6 p-5 rounded-2xl bg-[#0B1F3A] border-2 border-[#00E5B0] text-white shadow-xl animate-pulse">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00E5B0]/20 border border-[#00E5B0]/40 flex items-center justify-center text-[#00E5B0]">
                <Cpu className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E5B0] font-bold">
                  Motor Neuronal de Clasificación Arancelaria
                </span>
                <h3 className="text-sm font-bold font-heading">
                  Buscando y Asignando Partidas Arancelarias desde {activeDoc.fileName}...
                </h3>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-[#00E5B0]">{searchProgress}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-2">
            <div 
              className="bg-[#00E5B0] h-full transition-all duration-300 rounded-full"
              style={{ width: `${searchProgress}%` }}
            />
          </div>
          <p className="text-xs font-mono text-gray-300">{searchStepText}</p>
        </div>
      )}

      {/* Success Notice Banner after searching */}
      {searchSuccessBanner && (
        <div className="mb-6 p-4 rounded-2xl bg-[#E6FCF7] dark:bg-[#00E5B0]/15 border border-[#00E5B0] text-[#008F6B] dark:text-[#00E5B0] flex items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div className="text-xs font-mono">
              <span className="font-bold block text-sm">
                ¡Búsqueda de Partidas completada desde {searchSuccessBanner.docName}!
              </span>
              <span>{searchSuccessBanner.details}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenPdfReview()}
              className="px-3 py-1.5 rounded-lg bg-[#00E5B0] text-[#0B1F3A] font-mono text-xs font-bold hover:bg-[#00B88C] transition-colors"
            >
              Revisar en PDF
            </button>
            <button 
              onClick={() => setSearchSuccessBanner(null)} 
              className="px-2 py-1 text-xs font-mono underline hover:opacity-80"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Sync Status Banner */}
      {syncStatusMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-[#E6FCF7] border border-[#00E5B0] text-[#008F6B] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{syncStatusMsg}</span>
          </div>
          <button onClick={() => setSyncStatusMsg(null)} className="underline">Cerrar</button>
        </div>
      )}

      {/* Callout Action Banner for Scanned PDF & Classifier */}
      <div className={`mb-6 p-5 rounded-3xl border shadow-sm ${containerBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#00E5B0]/15 border border-[#00E5B0]/30 flex items-center justify-center text-[#008F6B] dark:text-[#00E5B0] shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#00E5B0]/20 text-[#008F6B] dark:text-[#00E5B0] font-bold">
                  Expediente Documental Activo
                </span>
                <span className="text-xs font-mono text-gray-400">
                  {attachedDocuments.length} documentos adjuntos
                </span>
              </div>
              <h2 className={`text-base sm:text-lg font-bold font-heading ${textPrimary} mt-0.5`}>
                {activeDoc.name}
              </h2>
              <p className={`text-xs ${textMuted} mt-0.5 font-mono`}>
                Archivo: <span className="font-bold text-[#008F6B] dark:text-[#00E5B0]">{activeDoc.fileName}</span> | Páginas: {activeDoc.pages} | Confianza OCR: {activeDoc.confidence}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => handleOpenPdfReview()}
              className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs font-mono font-bold transition-all"
            >
              <Eye className="w-4 h-4 text-[#008F6B] dark:text-[#00E5B0]" />
              <span>Ver PDF Escaneado</span>
            </button>

            <button
              onClick={handleSearchTariffFromPdf}
              disabled={isSearchingPdfTariff}
              className="cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ejecutar Búsqueda en PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-2xl border ${containerBg}`}>
          <span className={`text-[11px] font-mono uppercase ${textMuted} block`}>Ítems Declarados</span>
          <span className={`text-2xl font-bold font-heading tabular-numbers ${textPrimary}`}>{items.length} Series</span>
          <span className="text-[10px] text-gray-500 font-mono block truncate">Doc: {activeDoc.fileName}</span>
        </div>
        <div className={`p-4 rounded-2xl border ${containerBg}`}>
          <span className={`text-[11px] font-mono uppercase ${textMuted} block`}>Confianza Promedio</span>
          <span className="text-2xl font-bold font-heading tabular-numbers text-[#008F6B]">94.6%</span>
          <span className="text-[10px] text-gray-500 font-mono block">Cotejado con PDF escaneado</span>
        </div>
        <div className={`p-4 rounded-2xl border ${containerBg}`}>
          <span className={`text-[11px] font-mono uppercase ${textMuted} block`}>Mercancías Restringidas</span>
          <span className="text-2xl font-bold font-heading tabular-numbers text-[#FFD600]">2 Ítems (MTC)</span>
          <span className="text-[10px] text-gray-500 font-mono block">Requieren Homologación WiFi</span>
        </div>
        <div className={`p-4 rounded-2xl border ${containerBg}`}>
          <span className={`text-[11px] font-mono uppercase ${textMuted} block`}>Beneficio TLC China</span>
          <span className="text-2xl font-bold font-heading tabular-numbers text-[#008F6B]">0% Ad-Valorem</span>
          <span className="text-[10px] text-gray-500 font-mono block">Ahorro tributario: $8,910 USD</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={`p-4 rounded-2xl border mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 ${containerBg}`}>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: `Todos (${items.length})` },
            { id: 'validado', label: `Validados (${items.filter(i => i.status === 'validado').length})` },
            { id: 'en_revision', label: `En Revisión (${items.filter(i => i.status === 'en_revision').length})` },
            { id: 'observado', label: `Observados (${items.filter(i => i.status === 'observado').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-[#00E5B0] text-[#0B1F3A] shadow-sm'
                  : `${cardBg} ${textMuted} hover:text-white`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className={`w-4 h-4 absolute left-3 top-2.5 ${textMuted}`} />
          <input
            type="text"
            placeholder="Buscar por partida o producto del PDF..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-[#00E5B0] ${
              darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
            }`}
          />
        </div>
      </div>

      {/* High Density Table for Customs Liquidators */}
      <div className={`rounded-3xl border shadow-sm overflow-hidden ${containerBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#0B1F3A]/10 bg-black/5 dark:bg-black/30 font-mono text-[11px] text-gray-400">
                <th className="py-3 px-4">SERIE</th>
                <th className="py-3 px-4">DESCRIPCIÓN COMERCIAL & TÉCNICA</th>
                <th className="py-3 px-4">PARTIDA NANDINA (10 DÍGITOS)</th>
                <th className="py-3 px-4 text-center">CONFIANZA IA</th>
                <th className="py-3 px-4 text-center">TRIBUTOS</th>
                <th className="py-3 px-4 text-center">RESTRICCIÓN</th>
                <th className="py-3 px-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B1F3A]/10">
              {filteredItems.map((item) => (
                <tr 
                  key={item.id}
                  className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                    item.status === 'observado' ? 'bg-[#FFEBEB]/20' : ''
                  }`}
                >
                  {/* Serie # */}
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-500">
                    #{String(item.itemNumber).padStart(2, '0')}
                  </td>

                  {/* Descriptions */}
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold font-heading text-sm ${textPrimary}`}>
                        {item.commercialDescription}
                      </span>
                    </div>
                    <p className={`text-[11px] font-sans ${textMuted} mt-0.5 line-clamp-2`}>
                      {item.technicalDescription}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-gray-500">
                      <span>Cant: {item.quantity} {item.unit}</span>
                      <span>•</span>
                      <span>FOB: ${item.totalValueFob.toLocaleString()} USD</span>
                      <span>•</span>
                      <span className="text-[#008F6B] dark:text-[#00E5B0]">Cotejado con PDF</span>
                    </div>
                  </td>

                  {/* NANDINA Tariff Code */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00E5B0]/15 text-[#008F6B] dark:text-[#00E5B0] font-bold text-xs tracking-wider border border-[#00E5B0]/30">
                      <span>{item.suggestedNandina}</span>
                    </div>
                    {item.alternativeNandina && item.alternativeNandina.length > 0 && (
                      <div className="text-[10px] text-[#FFD600] mt-1">
                        Alt: {item.alternativeNandina[0].code}
                      </div>
                    )}
                  </td>

                  {/* Confidence */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      item.confidence >= 90
                        ? 'bg-[#E6FCF7] text-[#008F6B]'
                        : item.confidence >= 80
                        ? 'bg-[#FFFBE6] text-[#B29500]'
                        : 'bg-[#FFEBEB] text-[#FF5A5F]'
                    }`}>
                      {item.confidence}%
                    </span>
                  </td>

                  {/* Taxes */}
                  <td className="py-3.5 px-4 text-center font-mono text-[11px]">
                    <div className="font-bold text-[#0B1F3A] dark:text-white">
                      Ad/Val: {item.adValoremRate}%
                    </div>
                    <div className="text-gray-500 text-[10px]">
                      IGV+IPM: 18% | Percep: {item.percepcionRate}%
                    </div>
                  </td>

                  {/* Restrictions */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    {item.restrictedGood ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFFBE6] text-[#B29500] border border-[#FFD600]/40 text-[10px] font-bold">
                        <ShieldAlert className="w-3 h-3" />
                        {item.restrictedEntity}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-mono">Libre</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenPdfReview(item.itemNumber)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#00E5B0]/40 bg-[#00E5B0]/10 hover:bg-[#00E5B0]/20 text-[#008F6B] dark:text-[#00E5B0] font-mono text-[11px] font-bold transition-all"
                        title="Ver este ítem directamente en el PDF escaneado"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver en PDF</span>
                      </button>

                      <button
                        id={`inspect-tariff-${item.id}`}
                        onClick={() => handleInspect(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-[11px] font-bold transition-all shadow-sm"
                      >
                        <span>Fundamento</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Revisar PDF escaneado para la asignación de la partida arancelaria */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`relative w-full max-w-5xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${containerBg}`}>
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#0B1F3A]/10 flex items-center justify-between gap-4 bg-black/5 dark:bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00E5B0]/20 text-[#008F6B] dark:text-[#00E5B0] flex items-center justify-center">
                  <FileSearch className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#00E5B0]/20 text-[#008F6B] dark:text-[#00E5B0] font-bold">
                      Visor de Legajo PDF
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                      Asignación Arancelaria
                    </span>
                  </div>
                  <h3 className={`text-base font-bold font-heading ${textPrimary}`}>
                    Revisión de PDF Escaneado: {activeDoc.fileName}
                  </h3>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-black/5 dark:bg-white/10 font-mono text-xs">
                  <button
                    onClick={() => setPdfZoom(z => Math.max(75, z - 15))}
                    className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                    title="Alejar"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-1 font-bold">{pdfZoom}%</span>
                  <button
                    onClick={() => setPdfZoom(z => Math.min(130, z + 15))}
                    className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                    title="Acercar"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Tabs */}
            <div className="px-4 py-2.5 border-b border-[#0B1F3A]/10 bg-black/5 dark:bg-black/10 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-mono uppercase text-gray-400 font-bold whitespace-nowrap">
                Documento a revisar:
              </span>
              {attachedDocuments.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedDocId === doc.id
                      ? 'bg-[#00E5B0] text-[#0B1F3A] font-bold shadow-sm'
                      : 'hover:bg-black/10 dark:hover:bg-white/10 text-gray-500'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>{doc.type}</span>
                </button>
              ))}
            </div>

            {/* Modal Body: Scanned Document Render */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100 dark:bg-[#071324]/80">
              <div 
                className="max-w-3xl mx-auto bg-white text-gray-900 shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200 transition-all font-sans text-xs"
                style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center' }}
              >
                {/* Official Invoice Header */}
                <div className="border-b-2 border-gray-800 pb-4 mb-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 font-serif">
                        SHENZHEN GLOBAL HARDWARE TECH CO. LTD.
                      </h2>
                      <p className="text-[11px] text-gray-600">
                        Building 4B, High-Tech Industrial Park, Nanshan District, Shenzhen, China
                      </p>
                      <p className="text-[11px] text-gray-600">
                        Tax ID: 91440300MA5FB7890 | Tel: +86-755-88992200
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="inline-block border-2 border-gray-900 px-3 py-1 font-mono font-bold text-sm bg-gray-50">
                        COMMERCIAL INVOICE
                      </div>
                      <p className="text-[11px] font-mono mt-1 font-bold">INV NO: INV-2024-SZ8821</p>
                      <p className="text-[10px] text-gray-500 font-mono">DATE: 2024-10-28</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-gray-200 text-[11px]">
                    <div>
                      <span className="font-bold text-gray-700 block uppercase text-[9px]">Buyer / Consignee:</span>
                      <p className="font-bold text-gray-900">{activeOperation.importerName}</p>
                      <p className="font-mono text-gray-600">RUC: {activeOperation.importerRuc}</p>
                      <p className="text-gray-500">Calle Las Camelias 490, San Isidro, Lima - Perú</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-700 block uppercase text-[9px]">Terms & Shipment:</span>
                      <p className="font-mono font-bold text-gray-900">Incoterm: {activeOperation.incoterm || 'CIF'} CALLAO</p>
                      <p className="text-gray-600">Port of Loading: Yantian Port, Shenzhen, China</p>
                      <p className="text-gray-600">Port of Discharge: Callao, Perú (Aduana 118)</p>
                    </div>
                  </div>
                </div>

                {/* Scanned Line Items with interactive NANDINA highlights */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold uppercase tracking-wider text-xs text-gray-800">
                      DESGLOSE DE MERCANCÍAS Y ASIGNACIÓN ARANCELARIA (6 SERIES):
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                      OCR verificado al 99.4%
                    </span>
                  </div>

                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead className="bg-gray-100 border-b border-gray-300 font-mono text-[10px] text-gray-700 uppercase">
                        <tr>
                          <th className="py-2 px-2.5">Item</th>
                          <th className="py-2 px-3">Descripción Comercial en Factura</th>
                          <th className="py-2 px-2 text-center">Cant.</th>
                          <th className="py-2 px-2.5 text-right">FOB (USD)</th>
                          <th className="py-2 px-3 text-center bg-emerald-50 text-emerald-900">
                            Subpartida NANDINA Asignada
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 font-mono">
                        {items.map((it) => {
                          const isHighlighted = highlightedItemNumber === it.itemNumber;
                          return (
                            <tr 
                              key={it.id} 
                              className={`transition-colors ${
                                isHighlighted 
                                  ? 'bg-amber-100/80 ring-2 ring-amber-400 font-semibold' 
                                  : 'hover:bg-emerald-50/50'
                              }`}
                            >
                              <td className="py-2 px-2.5 text-gray-500 font-bold">
                                #{String(it.itemNumber).padStart(2, '0')}
                              </td>
                              <td className="py-2 px-3">
                                <span className="font-bold text-gray-900 block font-sans">
                                  {it.commercialDescription}
                                </span>
                                <span className="text-[10px] text-gray-500 line-clamp-1">
                                  {it.technicalDescription}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-center text-gray-700">
                                {it.quantity}
                              </td>
                              <td className="py-2 px-2.5 text-right font-bold text-gray-900">
                                ${it.totalValueFob.toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-center bg-emerald-50/40">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  {it.suggestedNandina}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Scanned Seal & Totals */}
                <div className="flex justify-between items-end pt-4 border-t border-gray-200">
                  <div className="text-[10px] text-gray-500 font-mono">
                    <p>Cotejo aduanero: RGI 1 y RGI 6 de la Nomenclatura del Arancel de Aduanas.</p>
                    <p>Sello de Recepción Digital: SUNAT - Intendencia de Aduana Marítima del Callao.</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-xs text-gray-600">TOTAL FACTURA FOB: <span className="font-bold text-gray-900">$114,820.00 USD</span></p>
                    <p className="text-sm font-bold text-emerald-800">CIF DECLARADO: ${Number(activeOperation.totalCifUsd || 153550).toLocaleString()} USD</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#0B1F3A]/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/5 dark:bg-black/20">
              <div className="text-xs font-mono text-gray-400">
                <span>¿Deseas reclasificar o profundizar en notas de sección? Usa el </span>
                <span className="text-[#008F6B] dark:text-[#00E5B0] font-bold">Fundamento Normativo (Pantalla 7)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsPdfModalOpen(false);
                    handleSearchTariffFromPdf();
                  }}
                  className="cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold shadow-md shadow-[#00E5B0]/25 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Re-buscar Partidas desde este PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="cursor-pointer px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 text-xs font-mono font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

