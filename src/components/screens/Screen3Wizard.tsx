import React, { useState } from 'react';
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
  FileSpreadsheet
} from 'lucide-react';
import { ScreenId, DocumentScan } from '../../types';
import { MOCK_DOCUMENTS, CURRENT_OPERATION } from '../../data/mockData';
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
  const [regime, setRegime] = useState<string>('10');
  const [customs, setCustoms] = useState<string>('118');
  const [incoterm, setIncoterm] = useState<string>('CIF');
  const [transportMode, setTransportMode] = useState<'Marítimo' | 'Aéreo'>('Marítimo');
  const [importerRuc, setImporterRuc] = useState<string>('20554921098');
  const [importerName, setImporterName] = useState<string>('TechImports Perú S.A.C.');
  const [referenceNumber, setReferenceNumber] = useState<string>('ADV-2024-0892');
  const [cifUsd, setCifUsd] = useState<number>(153550);
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);
  const [currentStepNote, setCurrentStepNote] = useState<string>('5 documentos procesados con éxito por el modelo de IA');

  // Supabase Sync States
  const [isSavingSupabase, setIsSavingSupabase] = useState<boolean>(false);
  const [supabaseSyncResult, setSupabaseSyncResult] = useState<{ saved: boolean; mode: 'supabase' | 'local'; message: string } | null>(null);
  const { isConfigured: hasSupabaseConfig, source: supabaseSource } = getSupabaseCredentials();

  const handleSaveToSupabase = async (proceedNext: boolean = false) => {
    setIsSavingSupabase(true);
    setSupabaseSyncResult(null);

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
      documents_count: MOCK_DOCUMENTS.length,
      critical_issues_count: 2,
      status: 'En Observación',
      metadata: {
        last_updated_by: 'Liquidador Callao',
        source: 'Wizard Creación Pre-DAM'
      }
    };

    const res = await saveCustomsOperationToSupabase(operationPayload);
    setIsSavingSupabase(false);

    if (res.mode === 'supabase') {
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
          ? `Almacenado localmente (${res.error}). Puedes configurar tus claves en Ajustes.`
          : 'Guardado localmente. Agrega tus credenciales Supabase en Ajustes para sincronización en la nube.'
      });
    }

    if (proceedNext) {
      setTimeout(() => {
        onNavigate('consistency-matrix');
      }, 600);
    }
  };

  const containerBg = darkMode ? 'bg-[#0B1F3A] border-[#18335E]' : 'bg-white border-[#0B1F3A]/10';
  const cardBg = darkMode ? 'bg-[#132B4F] border-[#1E4378]' : 'bg-[#F4F7FB] border-[#0B1F3A]/10';
  const textPrimary = darkMode ? 'text-white' : 'text-[#0B1F3A]';
  const textMuted = darkMode ? 'text-white/60' : 'text-[#0B1F3A]/60';

  const simulateOcrReading = () => {
    setIsProcessing(true);
    setProgress(15);
    setCurrentStepNote('Iniciando OCR y reconocimiento de texto en 5 documentos...');

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

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold ${cardBg} ${textMuted} hover:text-white`}
          >
            ← Cancelar
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

          {/* Drag and Drop Zone */}
          <div className="border-2 border-dashed border-[#00E5B0]/60 bg-[#00E5B0]/5 hover:bg-[#00E5B0]/10 rounded-2xl p-6 text-center transition-all cursor-pointer">
            <UploadCloud className="w-10 h-10 text-[#00E5B0] mx-auto mb-2" />
            <div className={`text-sm font-bold font-heading ${textPrimary}`}>
              Arrastra tus documentos aquí o haz clic para examinar
            </div>
            <p className={`text-xs ${textMuted} mt-1 max-w-md mx-auto`}>
              Soporta: Factura Comercial, Packing List, Bill of Lading / AWB, Certificado de Origen (TLC) y Swift Bancario en formato PDF.
            </p>
          </div>

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
              <span>Documentos Identificados ({MOCK_DOCUMENTS.length})</span>
              <span>Estado OCR</span>
            </div>

            {MOCK_DOCUMENTS.map((doc) => (
              <div
                key={doc.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${cardBg}`}
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
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#0B1F3A]/10">
            <div className="flex items-center gap-2 text-xs font-mono text-[#008F6B]">
              <ShieldCheck className="w-4 h-4 text-[#00E5B0]" />
              <span>Verificación previa a transmisión teledespacho</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                id="view-extracted-data-btn"
                onClick={() => onNavigate('extraction')}
                className="px-4 py-2.5 rounded-xl border border-[#0B1F3A]/20 dark:border-white/20 text-xs font-mono font-bold hover:bg-white/10"
              >
                VER EXTRACCIÓN OCR
              </button>

              <button
                id="save-supabase-btn"
                onClick={() => handleSaveToSupabase(false)}
                disabled={isSavingSupabase}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#00E5B0] bg-[#00E5B0]/10 hover:bg-[#00E5B0]/20 text-[#008F6B] dark:text-[#00E5B0] font-mono text-xs font-bold transition-all disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                <span>{isSavingSupabase ? 'GUARDANDO...' : 'GUARDAR EN SUPABASE'}</span>
              </button>

              <button
                id="wizard-proceed-matrix"
                onClick={() => handleSaveToSupabase(true)}
                disabled={isSavingSupabase}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold tracking-wider shadow-md shadow-[#00E5B0]/20 transition-all disabled:opacity-50"
              >
                <span>GUARDAR E IR A MATRIZ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
