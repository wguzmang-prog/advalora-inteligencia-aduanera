import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Ship, 
  Plane, 
  Trash2, 
  RefreshCw, 
  Eye, 
  ShieldCheck,
  FileSpreadsheet,
  Check,
  Plus
} from 'lucide-react';
import { ScreenId, DocumentScan } from '../../types';
import { MOCK_DOCUMENTS, CURRENT_OPERATION, updateCurrentOperation } from '../../data/mockData';
import { 
  saveCustomsOperationToSupabase, 
  getSupabaseCredentials,
  DbCustomsOperation 
} from '../../lib/supabase';
import { Database, CheckCircle, CloudUpload } from 'lucide-react';

interface Screen3Props {
  onNavigate: (screen: ScreenId) => void;
  darkMode: boolean;
}

export const Screen3Wizard: React.FC<Screen3Props> = ({ onNavigate, darkMode }) => {
  const [regime, setRegime] = useState<string>(() => CURRENT_OPERATION.regime?.startsWith('40') ? '40' : '10');
  const [customs, setCustoms] = useState<string>(() => {
    if (CURRENT_OPERATION.customsCode?.includes('235')) return '235';
    if (CURRENT_OPERATION.customsCode?.includes('019')) return '019';
    return '118';
  });
  const [incoterm, setIncoterm] = useState<string>(() => CURRENT_OPERATION.incoterm || 'CIF');
  const [transportMode, setTransportMode] = useState<'Marítimo' | 'Aéreo'>(() => CURRENT_OPERATION.transportMode === 'Aéreo' ? 'Aéreo' : 'Marítimo');
  const [importerRuc, setImporterRuc] = useState<string>(() => CURRENT_OPERATION.importerRuc || '20554921098');
  const [importerName, setImporterName] = useState<string>(() => CURRENT_OPERATION.importerName || 'TechImports Perú S.A.C.');
  const [referenceNumber, setReferenceNumber] = useState<string>(() => CURRENT_OPERATION.referenceNumber || 'ADV-2024-0892');
  const [cifUsd, setCifUsd] = useState<number>(() => CURRENT_OPERATION.totalCifUsd || 153550);
  
  // Document state and file handling
  const [documents, setDocuments] = useState<DocumentScan[]>(MOCK_DOCUMENTS);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);
  const [currentStepNote, setCurrentStepNote] = useState<string>('5 documentos procesados con éxito por el modelo de IA');

  // Supabase Sync States
  const [isSavingSupabase, setIsSavingSupabase] = useState<boolean>(false);
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const [isNavigatingToMatrix, setIsNavigatingToMatrix] = useState<boolean>(false);
  const [supabaseSyncResult, setSupabaseSyncResult] = useState<{ saved: boolean; mode: 'supabase' | 'local'; message: string } | null>(null);
  const { isConfigured: hasSupabaseConfig, source: supabaseSource } = getSupabaseCredentials();

  // Synchronize current operation in memory and local storage
  const syncActiveOperation = () => {
    const customsName = customs === '118' 
      ? 'Intendencia de Aduana Marítima del Callao' 
      : customs === '235'
      ? 'Intendencia de Aduana Aérea del Callao'
      : 'Intendencia de Aduana de Paita';

    updateCurrentOperation({
      referenceNumber: referenceNumber,
      regime: regime === '10' ? '10 - Importación para el Consumo' : '40 - Exportación Definitiva',
      transportMode: transportMode,
      customsCode: `${customs} - ${customsName}`,
      importerRuc: importerRuc,
      importerName: importerName,
      incoterm: incoterm,
      totalCifUsd: cifUsd,
      documentsCount: documents.length,
      documents: documents
    });
  };

  const handleGoToExtraction = () => {
    syncActiveOperation();
    onNavigate('extraction');
  };

  const handleProceedToMatrix = () => {
    setIsNavigatingToMatrix(true);
    // 1. Immediately sync in-memory state and localStorage
    syncActiveOperation();

    const customsName = customs === '118' 
      ? 'Intendencia de Aduana Marítima del Callao' 
      : customs === '235'
      ? 'Intendencia de Aduana Aérea del Callao'
      : 'Intendencia de Aduana de Paita';

    const operationPayload: DbCustomsOperation = {
      reference_number: referenceNumber,
      regime: regime,
      transport_mode: transportMode,
      customs_code: customs,
      customs_name: customsName,
      importer_ruc: importerRuc,
      importer_name: importerName,
      incoterm: incoterm,
      cif_usd: cifUsd,
      documents_count: documents.length,
      critical_issues_count: 2,
      status: 'En Observación',
      metadata: {
        last_updated_by: 'Liquidador Callao',
        source: 'Wizard Creación Pre-DAM',
        documents_list: documents.map(d => ({ name: d.name, type: d.type, fileName: d.fileName }))
      }
    };

    // Save to local operations cache immediately
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('advalora_local_operations');
        const list: DbCustomsOperation[] = stored ? JSON.parse(stored) : [];
        if (Array.isArray(list)) {
          const existingIdx = list.findIndex(op => op && op.reference_number === operationPayload.reference_number);
          if (existingIdx >= 0) {
            list[existingIdx] = operationPayload;
          } else {
            list.unshift(operationPayload);
          }
          localStorage.setItem('advalora_local_operations', JSON.stringify(list));
        }
      } catch (e) {
        // ignore
      }
    }

    // Save to Supabase in background (non-blocking)
    saveCustomsOperationToSupabase(operationPayload).catch(err => {
      console.warn('Background Supabase save notification:', err);
    });

    // Navigate smoothly to Screen 5 (Matriz de Consistencia) with quick feedback
    setTimeout(() => {
      onNavigate('consistency-matrix');
    }, 200);
  };

  // Quick helper to attach a realistic sample document without needing OS dialog
  const handleAddSampleDocument = () => {
    const sampleOptions: DocumentScan[] = [
      {
        id: `doc-sample-${Date.now()}-1`,
        name: `Factura Comercial Rectificada - ${importerName.split(' ')[0]}`,
        type: 'Factura Comercial',
        fileName: `INV-2024-RECT_${referenceNumber}.pdf`,
        fileSize: '1.2 MB',
        pages: 2,
        status: 'validado',
        confidence: 99.2,
        extractedFieldsCount: 22,
        matchedFieldsCount: 22,
        mismatchCount: 0,
        uploadDate: new Date().toLocaleDateString('es-PE')
      },
      {
        id: `doc-sample-${Date.now()}-2`,
        name: `Certificado de Origen TLC Form A`,
        type: 'Certificado de Origen',
        fileName: `COO_Peru_China_${referenceNumber}.pdf`,
        fileSize: '950 KB',
        pages: 1,
        status: 'observado',
        confidence: 97.4,
        extractedFieldsCount: 16,
        matchedFieldsCount: 15,
        mismatchCount: 1,
        uploadDate: new Date().toLocaleDateString('es-PE')
      },
      {
        id: `doc-sample-${Date.now()}-3`,
        name: `Tique de Balanza APM Terminals Callao`,
        type: 'Packing List',
        fileName: `TIQUE_BALANZA_APM_${referenceNumber}.pdf`,
        fileSize: '420 KB',
        pages: 1,
        status: 'validado',
        confidence: 99.8,
        extractedFieldsCount: 8,
        matchedFieldsCount: 8,
        mismatchCount: 0,
        uploadDate: new Date().toLocaleDateString('es-PE')
      }
    ];

    const pick = sampleOptions[documents.length % sampleOptions.length];
    const updated = [pick, ...documents];
    setDocuments(updated);
    setUploadFeedback(`¡Documento adjuntado con éxito: "${pick.name}"!`);
    
    // Sync immediately
    updateCurrentOperation({
      documentsCount: updated.length,
      documents: updated
    });

    setTimeout(() => setUploadFeedback(null), 3500);
  };

  // Helper to detect document type by filename
  const detectDocumentType = (fileName: string): DocumentScan['type'] => {
    const lower = fileName.toLowerCase();
    if (lower.includes('packing') || lower.includes('lista') || lower.includes('empaque') || lower.includes('pl')) {
      return 'Packing List';
    }
    if (lower.includes('bl') || lower.includes('bill') || lower.includes('lading') || lower.includes('awb') || lower.includes('guia') || lower.includes('embarque')) {
      return 'Bill of Lading / AWB';
    }
    if (lower.includes('origen') || lower.includes('origin') || lower.includes('tlc') || lower.includes('cert')) {
      return 'Certificado de Origen';
    }
    if (lower.includes('swift') || lower.includes('banco') || lower.includes('pago') || lower.includes('transfer') || lower.includes('wire')) {
      return 'Swift Bancario';
    }
    return 'Factura Comercial';
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Process selected or dropped files
  const processUploadedFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const newDocs: DocumentScan[] = fileArray.map((file, index) => {
      const docType = detectDocumentType(file.name);
      return {
        id: `doc-uploaded-${Date.now()}-${index}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: docType,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        pages: Math.floor(Math.random() * 3) + 1,
        status: 'validado',
        confidence: Math.floor(Math.random() * 5) + 95, // 95 - 99%
        extractedFieldsCount: Math.floor(Math.random() * 12) + 16,
        matchedFieldsCount: Math.floor(Math.random() * 10) + 14,
        mismatchCount: 0,
        uploadDate: new Date().toLocaleDateString('es-PE')
      };
    });

    setDocuments(prev => [...newDocs, ...prev]);
    setUploadFeedback(`¡${newDocs.length} documento(s) adjuntado(s) exitosamente! Iniciando lectura OCR...`);

    // Run OCR analysis on the newly added documents
    setIsProcessing(true);
    setProgress(15);
    setCurrentStepNote(`Iniciando OCR y reconocimiento de texto en ${newDocs.length} nuevo(s) documento(s)...`);

    setTimeout(() => {
      setProgress(50);
      setCurrentStepNote(`Extrayendo entidades aduaneras de ${newDocs.map(d => d.fileName).join(', ')}...`);
    }, 700);

    setTimeout(() => {
      setProgress(85);
      setCurrentStepNote('Cotejando campos con la normativa SUNAT y consistencia de valores...');
    }, 1400);

    setTimeout(() => {
      setProgress(100);
      setIsProcessing(false);
      setCurrentStepNote(`Lectura completada. ${newDocs.length + documents.length} documentos indexados en el expediente.`);
      setTimeout(() => setUploadFeedback(null), 4000);
    }, 2000);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(e.target.files);
      // Reset input value so same files can be chosen again if needed
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const handleSaveToSupabase = async (proceedNext: boolean = false) => {
    setIsSavingSupabase(true);
    setSupabaseSyncResult(null);
    syncActiveOperation();

    try {
      const customsName = customs === '118' 
        ? 'Intendencia de Aduana Marítima del Callao' 
        : customs === '235'
        ? 'Intendencia de Aduana Aérea del Callao'
        : 'Intendencia de Aduana de Paita';

      const operationPayload: DbCustomsOperation = {
        reference_number: referenceNumber,
        regime: regime,
        transport_mode: transportMode,
        customs_code: customs,
        customs_name: customsName,
        importer_ruc: importerRuc,
        importer_name: importerName,
        incoterm: incoterm,
        cif_usd: cifUsd,
        documents_count: documents.length,
        critical_issues_count: 2,
        status: 'En Observación',
        metadata: {
          last_updated_by: 'Liquidador Callao',
          source: 'Wizard Creación Pre-DAM'
        }
      };

      const res = await saveCustomsOperationToSupabase(operationPayload);

      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3500);

      if (res.mode === 'supabase' && !res.error) {
        setSupabaseSyncResult({
          saved: true,
          mode: 'supabase',
          message: '¡Operación guardada exitosamente en la tabla customs_operations de Supabase!'
        });
      } else {
        setSupabaseSyncResult({
          saved: true,
          mode: 'local',
          message: res.error 
            ? `Operación resguardada localmente en caché (${res.error}).`
            : 'Operación guardada en almacenamiento local seguro.'
        });
      }

      if (proceedNext) {
        onNavigate('consistency-matrix');
      }
    } catch (err: any) {
      console.error('Error saving customs operation:', err);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3500);
      setSupabaseSyncResult({
        saved: true,
        mode: 'local',
        message: 'Operación resguardada en almacenamiento local seguro.'
      });
      if (proceedNext) {
        onNavigate('consistency-matrix');
      }
    } finally {
      setIsSavingSupabase(false);
    }
  };

  const containerBg = darkMode ? 'bg-[#0B1F3A] border-[#18335E]' : 'bg-white border-[#0B1F3A]/10';
  const cardBg = darkMode ? 'bg-[#132B4F] border-[#1E4378]' : 'bg-[#F4F7FB] border-[#0B1F3A]/10';
  const textPrimary = darkMode ? 'text-white' : 'text-[#0B1F3A]';
  const textMuted = darkMode ? 'text-white/60' : 'text-[#0B1F3A]/60';

  const simulateOcrReading = () => {
    setIsProcessing(true);
    setProgress(15);
    setCurrentStepNote(`Iniciando OCR y reconocimiento de texto en ${documents.length} documentos...`);

    setTimeout(() => {
      setProgress(45);
      setCurrentStepNote('Extrayendo entidades: Proveedor, Incoterm, RUC, Pesos Brutos y Líneas de Producto...');
    }, 800);

    setTimeout(() => {
      setProgress(85);
      setCurrentStepNote('Cruzando Bill of Lading con Packing List: ¡Discrepancia en peso detectada!');
    }, 1600);

    setTimeout(() => {
      setProgress(100);
      setIsProcessing(false);
      setCurrentStepNote('Lectura completada. 2 discrepancias bloqueantes identificadas.');
    }, 2400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00E5B0]/20 text-[#008F6B] border border-[#00E5B0]/40">
              PANTALLA 3 DE 9
            </span>

            {/* Supabase Status Pill */}
            <div className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-semibold border ${
              hasSupabaseConfig 
                ? 'bg-[#E6FCF7] text-[#008F6B] border-[#00E5B0]/40' 
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/50'
            }`}>
              <Database className="w-3.5 h-3.5" />
              <span>
                {hasSupabaseConfig ? 'Supabase Conectado' : 'Supabase (Modo Local Activo)'}
              </span>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-bold font-heading w-full ${textPrimary} mt-1`}>
              Wizard de Creación: Nueva Declaración
            </h1>
          </div>
          <p className={`text-sm ${textMuted} mt-1`}>
            Configura los metadatos del despacho y sincroniza el legajo documental con Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-mono font-bold ${cardBg} ${textMuted} hover:text-white transition-colors`}
          >
            ← Cancelar
          </button>
          <button
            id="wizard-top-proceed-matrix"
            type="button"
            onClick={handleProceedToMatrix}
            disabled={isNavigatingToMatrix}
            className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold tracking-wider shadow-lg shadow-[#00E5B0]/25 active:scale-95 transition-all disabled:opacity-50"
          >
            {isNavigatingToMatrix ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>GUARDANDO...</span>
              </>
            ) : (
              <>
                <span>GUARDAR E IR A MATRIZ</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Supabase Sync Notification Banner */}
      {supabaseSyncResult && (
        <div className={`mb-6 p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
          supabaseSyncResult.mode === 'supabase'
            ? 'bg-[#E6FCF7] border-[#00E5B0] text-[#008F6B]'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <div className="text-xs font-mono">
              <span className="font-bold">
                {supabaseSyncResult.mode === 'supabase' ? 'Sincronizado con Supabase Cloud: ' : 'Almacenamiento Local: '}
              </span>
              <span>{supabaseSyncResult.message}</span>
            </div>
          </div>
          <button 
            onClick={() => setSupabaseSyncResult(null)}
            className="text-xs font-mono underline hover:opacity-75"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Operation Metadata (5 Cols) */}
        <div className={`lg:col-span-5 rounded-3xl p-6 border shadow-sm space-y-6 ${containerBg}`}>
          <div className="flex items-center justify-between border-b border-[#0B1F3A]/10 pb-4">
            <h3 className={`font-heading font-bold text-lg ${textPrimary}`}>
              1. Datos de la Operación
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E5B0]/15 text-[#008F6B] font-bold">
              SUNAT REQUISITO
            </span>
          </div>

          <div className="space-y-4">
            {/* Regime Selector */}
            <div>
              <label className={`block text-xs font-mono uppercase font-bold mb-1.5 ${textMuted}`}>
                Régimen Aduanero
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '10', name: '10 - Importación Consumo' },
                  { id: '40', name: '40 - Exportación Definitiva' }
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRegime(r.id)}
                    className={`p-2.5 rounded-xl text-xs font-mono font-bold border transition-all text-left ${
                      regime === r.id
                        ? 'border-[#00E5B0] bg-[#00E5B0]/10 text-[#008F6B] dark:text-[#00E5B0]'
                        : `${cardBg} ${textMuted}`
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Transport Mode */}
            <div>
              <label className={`block text-xs font-mono uppercase font-bold mb-1.5 ${textMuted}`}>
                Vía de Transporte
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTransportMode('Marítimo')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                    transportMode === 'Marítimo'
                      ? 'border-[#00E5B0] bg-[#00E5B0]/10 text-[#008F6B] dark:text-[#00E5B0]'
                      : `${cardBg} ${textMuted}`
                  }`}
                >
                  <Ship className="w-4 h-4" />
                  <span>Marítimo (Callao)</span>
                </button>
                <button
                  onClick={() => setTransportMode('Aéreo')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                    transportMode === 'Aéreo'
                      ? 'border-[#00E5B0] bg-[#00E5B0]/10 text-[#008F6B] dark:text-[#00E5B0]'
                      : `${cardBg} ${textMuted}`
                  }`}
                >
                  <Plane className="w-4 h-4" />
                  <span>Aéreo (Jorge Chávez)</span>
                </button>
              </div>
            </div>

            {/* Customs Office */}
            <div>
              <label className={`block text-xs font-mono uppercase font-bold mb-1.5 ${textMuted}`}>
                Intendencia de Aduana
              </label>
              <select
                value={customs}
                onChange={(e) => setCustoms(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border focus:ring-2 focus:ring-[#00E5B0] ${
                  darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                }`}
              >
                <option value="118">118 - Intendencia de Aduana Marítima del Callao</option>
                <option value="235">235 - Intendencia de Aduana Aérea del Callao</option>
                <option value="019">019 - Intendencia de Aduana de Paita</option>
              </select>
            </div>

            {/* Importer Info */}
            <div>
              <label className={`block text-xs font-mono uppercase font-bold mb-1.5 ${textMuted}`}>
                Importador (RUC y Razón Social)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={importerRuc}
                  onChange={(e) => setImporterRuc(e.target.value)}
                  placeholder="20554921098"
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-mono border ${
                    darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                  }`}
                />
                <input
                  type="text"
                  value={importerName}
                  onChange={(e) => setImporterName(e.target.value)}
                  placeholder="TechImports Perú S.A.C."
                  className={`sm:col-span-2 px-3.5 py-2.5 rounded-xl text-xs font-mono border ${
                    darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                  }`}
                />
              </div>
            </div>

            {/* CIF Value */}
            <div>
              <label className={`block text-xs font-mono uppercase font-bold mb-1.5 ${textMuted}`}>
                Valor CIF Estimado (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-mono text-gray-400">$</span>
                <input
                  type="number"
                  value={cifUsd}
                  onChange={(e) => setCifUsd(Number(e.target.value) || 0)}
                  className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl text-xs font-mono border ${
                    darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                  }`}
                />
              </div>
            </div>

            {/* Incoterm */}
            <div>
              <label className={`block text-xs font-mono uppercase font-bold mb-1.5 ${textMuted}`}>
                Incoterm 2020 Pactado
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['CIF', 'FOB', 'CFR', 'FCA'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setIncoterm(term)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border text-center transition-all ${
                      incoterm === term
                        ? 'border-[#00E5B0] bg-[#00E5B0] text-[#0B1F3A]'
                        : `${cardBg} ${textMuted}`
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Reference Number */}
            <div className="p-3 rounded-xl bg-[#00E5B0]/10 border border-[#00E5B0]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase block">N° Referencia Interna</span>
                <span className="font-mono font-bold text-xs text-[#0B1F3A] dark:text-white">ADV-2024-0892</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#008F6B] bg-[#E6FCF7] px-2 py-0.5 rounded">
                AUTO-GENERADO
              </span>
            </div>
          </div>
        </div>

        {/* Right Form: Document Upload & AI Reader (7 Cols) */}
        <div className={`lg:col-span-7 rounded-3xl p-6 border shadow-sm space-y-6 ${containerBg}`}>
          <div className="flex items-center justify-between border-b border-[#0B1F3A]/10 pb-4">
            <div>
              <h3 className={`font-heading font-bold text-lg ${textPrimary}`}>
                2. Expediente Documental (PDFs)
              </h3>
              <p className={`text-xs ${textMuted} mt-0.5`}>
                Detector automático de tipo documental con OCR neuronal.
              </p>
            </div>
            <button
              onClick={simulateOcrReading}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#FFD600] text-[#0B1F3A] hover:bg-[#E6C200] transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'PROCESANDO...' : 'RE-ESCANEAR IA'}</span>
            </button>
          </div>

          {/* File Input */}
          <input
            ref={fileInputRef}
            id="file-upload-input"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf"
            onChange={handleFileInputChange}
            className="sr-only"
          />

          {/* Drag and Drop Zone as clickable label */}
          <label 
            htmlFor="file-upload-input"
            id="document-dropzone"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`block border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer select-none ${
              isDragging 
                ? 'border-[#00E5B0] bg-[#00E5B0]/20 scale-[1.01] shadow-lg shadow-[#00E5B0]/10 ring-2 ring-[#00E5B0]/50'
                : 'border-[#00E5B0]/60 bg-[#00E5B0]/5 hover:bg-[#00E5B0]/10 hover:border-[#00E5B0]'
            }`}
          >
            <UploadCloud className={`w-10 h-10 text-[#00E5B0] mx-auto mb-2 transition-transform duration-200 ${isDragging ? 'scale-125 animate-bounce' : ''}`} />
            <div className={`text-sm font-bold font-heading ${textPrimary}`}>
              {isDragging ? '¡Suelta tus archivos aquí para procesar!' : 'Arrastra tus documentos aquí o haz clic para examinar'}
            </div>
            <p className={`text-xs ${textMuted} mt-1 max-w-md mx-auto`}>
              Soporta: Factura Comercial, Packing List, Bill of Lading / AWB, Certificado de Origen (TLC) y Swift Bancario en formato PDF.
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#00E5B0] text-[#0B1F3A] shadow-sm hover:bg-[#00B88C] transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Examinar Archivos de tu PC
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddSampleDocument();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#00E5B0]/20 text-[#008F6B] dark:text-[#00E5B0] border border-[#00E5B0]/40 hover:bg-[#00E5B0]/30 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                + Adjuntar Documento de Prueba
              </button>
            </div>
          </label>

          {/* Upload Feedback Toast */}
          {uploadFeedback && (
            <div className="p-3 rounded-xl bg-[#E6FCF7] dark:bg-[#00E5B0]/15 border border-[#00E5B0] text-[#008F6B] dark:text-[#00E5B0] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{uploadFeedback}</span>
              </div>
              <button onClick={() => setUploadFeedback(null)} className="underline text-[10px]">Cerrar</button>
            </div>
          )}

          {/* AI Processing Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-2 text-[#008F6B] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#00E5B0]" />
                <span>Progreso de Análisis IA:</span>
              </span>
              <span className="font-bold tabular-numbers text-[#0B1F3A] dark:text-white">
                {progress}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00E5B0] via-[#FFD600] to-[#00E5B0] transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className={`text-[11px] font-mono ${textMuted}`}>
              {currentStepNote}
            </div>
          </div>

          {/* Detected Documents List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono uppercase font-bold text-gray-400">
              <span>Documentos Identificados ({documents.length})</span>
              <span>Estado OCR</span>
            </div>

            {documents.map((doc, docIdx) => (
              <div
                key={`wizard-doc-${doc.id || doc.fileName}-${docIdx}`}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${cardBg} hover:border-[#00E5B0]/40 transition-colors group`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#00E5B0]/15 text-[#008F6B] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold font-heading truncate ${textPrimary}`}>
                        {doc.type}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">
                        ({doc.fileSize})
                      </span>
                    </div>
                    <p className={`text-[11px] font-mono truncate ${textMuted}`}>
                      {doc.fileName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right font-mono">
                    <div className="text-[11px] font-bold text-[#008F6B]">
                      {doc.confidence}% Confianza
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {doc.extractedFieldsCount} campos
                    </div>
                  </div>

                  {doc.mismatchCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FFEBEB] text-[#FF5A5F] border border-[#FF5A5F]/30">
                      {doc.mismatchCount} obs
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E6FCF7] text-[#008F6B] border border-[#00E5B0]/30">
                      OK
                    </span>
                  )}

                  <button
                    type="button"
                    title="Eliminar documento del expediente"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveDocument(doc.id);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="space-y-3 pt-4 border-t border-[#0B1F3A]/10">
            {/* Inline Feedback Banner right above the action buttons */}
            {supabaseSyncResult && (
              <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono transition-all ${
                supabaseSyncResult.mode === 'supabase'
                  ? 'bg-[#E6FCF7] border-[#00E5B0] text-[#008F6B] dark:bg-[#00E5B0]/15 dark:text-[#00E5B0]'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-[#008F6B] dark:text-[#00E5B0]" />
                  <span className="font-bold">
                    {supabaseSyncResult.mode === 'supabase' ? 'Supabase Cloud: ' : 'Caché Seguro: '}
                  </span>
                  <span>{supabaseSyncResult.message}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setSupabaseSyncResult(null)}
                  className="underline hover:opacity-75 cursor-pointer text-[11px]"
                >
                  Entendido
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#008F6B]">
                <ShieldCheck className="w-4 h-4 text-[#00E5B0]" />
                <span>Verificación previa a transmisión teledespacho</span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  id="view-extracted-data-btn"
                  type="button"
                  onClick={handleGoToExtraction}
                  className="cursor-pointer px-4 py-2.5 rounded-xl border border-[#0B1F3A]/20 dark:border-white/20 text-xs font-mono font-bold hover:bg-white/10 active:scale-95 transition-all text-[#0B1F3A] dark:text-white"
                >
                  VER EXTRACCIÓN OCR
                </button>

                <button
                  id="save-supabase-btn"
                  type="button"
                  onClick={() => handleSaveToSupabase(false)}
                  disabled={isSavingSupabase}
                  className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono text-xs font-bold active:scale-95 transition-all disabled:opacity-50 ${
                    justSaved
                      ? 'border-[#00E5B0] bg-[#00E5B0] text-[#0B1F3A] shadow-md shadow-[#00E5B0]/30'
                      : 'border-[#00E5B0] bg-[#00E5B0]/10 hover:bg-[#00E5B0]/20 text-[#008F6B] dark:text-[#00E5B0]'
                  }`}
                >
                  {justSaved ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Database className="w-4 h-4" />
                  )}
                  <span>
                    {isSavingSupabase 
                      ? 'GUARDANDO...' 
                      : justSaved 
                      ? '¡GUARDADO CON ÉXITO!' 
                      : 'GUARDAR EN SUPABASE'}
                  </span>
                </button>

                <button
                  id="wizard-proceed-matrix"
                  type="button"
                  onClick={handleProceedToMatrix}
                  disabled={isNavigatingToMatrix}
                  className="cursor-pointer flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold tracking-wider shadow-lg shadow-[#00E5B0]/25 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isNavigatingToMatrix ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>GUARDANDO...</span>
                    </>
                  ) : (
                    <>
                      <span>GUARDAR E IR A MATRIZ</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
