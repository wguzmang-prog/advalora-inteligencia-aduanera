import React, { useState } from 'react';
import { 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Check, 
  Edit3, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles, 
  RotateCw,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ScreenId, ExtractedField } from '../../types';
import { MOCK_EXTRACTED_FIELDS, MOCK_DOCUMENTS } from '../../data/mockData';

interface Screen4Props {
  onNavigate: (screen: ScreenId) => void;
  darkMode: boolean;
}

export const Screen4DataExtraction: React.FC<Screen4Props> = ({ onNavigate, darkMode }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-1');
  const [selectedFieldId, setSelectedFieldId] = useState<string>('f-4'); // Incoterm selected by default to show discrepancy
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [fields, setFields] = useState<ExtractedField[]>(MOCK_EXTRACTED_FIELDS);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const containerBg = darkMode ? 'bg-[#0B1F3A] border-[#18335E]' : 'bg-white border-[#0B1F3A]/10';
  const cardBg = darkMode ? 'bg-[#132B4F] border-[#1E4378]' : 'bg-[#F4F7FB] border-[#0B1F3A]/10';
  const textPrimary = darkMode ? 'text-white' : 'text-[#0B1F3A]';
  const textMuted = darkMode ? 'text-white/60' : 'text-[#0B1F3A]/60';

  const activeField = fields.find(f => f.id === selectedFieldId);
  const activeDoc = MOCK_DOCUMENTS.find(d => d.id === selectedDocId) || MOCK_DOCUMENTS[0];

  const handleStartEdit = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setEditValue(field.documentValue);
  };

  const handleSaveEdit = (fieldId: string) => {
    setFields(prev => prev.map(f => f.id === fieldId ? { ...f, documentValue: editValue, status: 'verificado' } : f));
    setEditingFieldId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00E5B0]/20 text-[#008F6B] border border-[#00E5B0]/40">
              PANTALLA 4 DE 9
            </span>
            <h1 className={`text-2xl sm:text-3xl font-bold font-heading ${textPrimary}`}>
              Extracción de Datos OCR con Resaltado en PDF
            </h1>
          </div>
          <p className={`text-sm ${textMuted} mt-1`}>
            Inspecciona cada entidad extraída por IA y valida su ubicación exacta en el documento fuente original.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('consistency-matrix')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono font-bold text-xs shadow-sm"
          >
            <span>IR A MATRIZ DE CONSISTENCIA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Document Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        <span className={`text-xs font-mono font-bold uppercase tracking-wider ${textMuted} px-2 whitespace-nowrap`}>
          Documento Activo:
        </span>
        {MOCK_DOCUMENTS.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setSelectedDocId(doc.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              selectedDocId === doc.id
                ? 'bg-[#0B1F3A] text-[#00E5B0] ring-2 ring-[#00E5B0]'
                : `${cardBg} ${textMuted} hover:text-white`
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{doc.type}</span>
            {doc.mismatchCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#FF5A5F]" />
            )}
          </button>
        ))}
      </div>

      {/* Main Split Layout: PDF Viewer (Left) & Extraction Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Interactive Simulated PDF Viewer (6 Cols) */}
        <div className={`lg:col-span-6 rounded-3xl border shadow-sm overflow-hidden ${containerBg}`}>
          {/* PDF Viewer Toolbar */}
          <div className="p-3.5 border-b border-[#0B1F3A]/10 bg-black/5 dark:bg-black/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="font-bold text-[#008F6B] truncate max-w-[200px]">
                {activeDoc.fileName}
              </span>
              <span className="text-gray-400">|</span>
              <span className={textMuted}>Pág. 1 de {activeDoc.pages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
                className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-gray-500"
                title="Alejar"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono font-bold px-2">{zoomLevel}%</span>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-gray-500"
                title="Acercar"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* PDF Document Canvas Render with Real Customs Look & Bounding Boxes */}
          <div className="p-6 bg-[#EBEFF5] dark:bg-[#071324] overflow-auto max-h-[640px] flex justify-center">
            <div 
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-[520px] min-h-[680px] bg-white text-[#0B1F3A] p-8 shadow-xl rounded-xl relative font-sans text-xs transition-transform duration-200"
            >
              {/* Simulated Paper Header */}
              <div className="border-b-2 border-[#0B1F3A] pb-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-[#0B1F3A]">
                      SHENZHEN YANTIAN PRECISION TECH CO., LTD.
                    </h4>
                    <p className="text-[10px] text-gray-600">
                      Bldg 4, High-Tech Industrial Park, Yantian District, Shenzhen, China
                    </p>
                    <p className="text-[10px] text-gray-600">
                      Tel: +86 755 8829 1002 | Email: export@yantiantech.cn
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-heading font-black text-base text-[#0B1F3A]">
                      COMMERCIAL INVOICE
                    </div>
                    <div className="font-mono text-[11px] font-bold text-gray-700">
                      INV-2024-SZ8821
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">Date: 28 OCT 2024</div>
                  </div>
                </div>
              </div>

              {/* Consignee & Delivery Block */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b text-[10px]">
                <div>
                  <span className="font-bold uppercase text-gray-500 block">CONSIGNEE / BUYER:</span>
                  <div className="font-bold text-[#0B1F3A] mt-0.5">TECHIMPORTS PERÚ S.A.C.</div>
                  <div>RUC: 20554921098</div>
                  <div>Calle Las Camelias 490, San Isidro, Lima - Perú</div>
                </div>
                <div>
                  <span className="font-bold uppercase text-gray-500 block">TERMS OF SALE / SHIPMENT:</span>
                  <div className="mt-0.5 font-bold">PORT OF LOADING: YANTIAN, CHINA</div>
                  <div>PORT OF DISCHARGE: CALLAO, PERU</div>
                  <div>VESSEL: MSC INES V.402W</div>
                </div>
              </div>

              {/* Highlighted Bounding Box for Active Selection */}
              {activeField && (
                <div 
                  className={`absolute rounded transition-all duration-300 pointer-events-none ${
                    activeField.status === 'discrepancia'
                      ? 'border-2 border-[#FF5A5F] bg-[#FF5A5F]/20 shadow-[0_0_15px_rgba(255,90,95,0.5)] ring-2 ring-[#FF5A5F]'
                      : 'border-2 border-[#00E5B0] bg-[#00E5B0]/20 shadow-[0_0_15px_rgba(0,229,176,0.5)] ring-2 ring-[#00E5B0]'
                  }`}
                  style={{
                    left: `${activeField.boundingBox.x}%`,
                    top: `${activeField.boundingBox.y}%`,
                    width: `${activeField.boundingBox.width}%`,
                    height: `${activeField.boundingBox.height}%`,
                  }}
                >
                  <span className={`absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase whitespace-nowrap ${
                    activeField.status === 'discrepancia' ? 'bg-[#FF5A5F] text-white' : 'bg-[#00E5B0] text-[#0B1F3A]'
                  }`}>
                    {activeField.label} ({activeField.confidence}%)
                  </span>
                </div>
              )}

              {/* Interactive Document Fields Table inside PDF */}
              <div className="mt-4">
                <table className="w-full text-[10px] text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-y border-gray-300">
                      <th className="py-1 px-1.5 font-bold">ITEM</th>
                      <th className="py-1 px-1.5 font-bold">DESCRIPTION</th>
                      <th className="py-1 px-1.5 font-bold text-center">QTY</th>
                      <th className="py-1 px-1.5 font-bold text-right">UNIT PRICE</th>
                      <th className="py-1 px-1.5 font-bold text-right">TOTAL FOB</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-mono text-[9px]">
                    <tr>
                      <td className="py-1 px-1.5">01</td>
                      <td className="py-1 px-1.5 font-sans font-medium">Laptop Ultrabook 14" Intel Core i7 32GB</td>
                      <td className="py-1 px-1.5 text-center">100 UN</td>
                      <td className="py-1 px-1.5 text-right">$820.00</td>
                      <td className="py-1 px-1.5 text-right font-bold">$82,000.00</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-1.5">02</td>
                      <td className="py-1 px-1.5 font-sans font-medium">Monitor Gamer Curvo 27" QHD 165Hz</td>
                      <td className="py-1 px-1.5 text-center">60 UN</td>
                      <td className="py-1 px-1.5 text-right">$210.00</td>
                      <td className="py-1 px-1.5 text-right font-bold">$12,600.00</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-1.5">03</td>
                      <td className="py-1 px-1.5 font-sans font-medium">Teclado Mecánico Inalámbrico RGB</td>
                      <td className="py-1 px-1.5 text-center">200 UN</td>
                      <td className="py-1 px-1.5 text-right">$45.00</td>
                      <td className="py-1 px-1.5 text-right font-bold">$9,000.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom Totals with Highlight Areas */}
              <div className="mt-8 border-t-2 border-gray-300 pt-3 space-y-1 text-[10px] font-mono">
                <div className="flex justify-between">
                  <span>TOTAL FOB VALUE:</span>
                  <span className="font-bold">$148,500.00 USD</span>
                </div>
                <div className="flex justify-between text-[#D92B30]">
                  <span className="font-bold">OCEAN FREIGHT (CIF CLAUSE):</span>
                  <span className="font-bold">$4,200.00 USD (Prepaid)</span>
                </div>
                <div className="flex justify-between border-t pt-1 font-bold text-[#0B1F3A]">
                  <span>TOTAL INVOICE AMOUNT (CIF CALLAO):</span>
                  <span>$152,700.00 USD</span>
                </div>
                <div className="flex justify-between text-gray-500 pt-1 text-[9px]">
                  <span>PACKING: 85 HEAT-TREATED PALLETS</span>
                  <span>GROSS WEIGHT: 1,420.50 KGS</span>
                </div>
              </div>

              {/* Simulated Stamp Seal */}
              <div className="absolute bottom-6 right-6 border-2 border-dashed border-[#00B88C] text-[#008F6B] p-2 rounded-lg font-mono text-[9px] text-center rotate-[-4deg] opacity-80">
                <div className="font-bold">EXPORT CUSTOMS SHENZHEN</div>
                <div>RELEASED / LEVANTE OK</div>
                <div>2024-10-29</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Editable Extraction Table (6 Cols) */}
        <div className={`lg:col-span-6 rounded-3xl p-6 border shadow-sm space-y-4 ${containerBg}`}>
          <div className="flex items-center justify-between border-b border-[#0B1F3A]/10 pb-4">
            <div>
              <h3 className={`font-heading font-bold text-lg ${textPrimary}`}>
                Campos Extraídos por la IA
              </h3>
              <p className={`text-xs ${textMuted} mt-0.5`}>
                Haz clic en cualquier campo para ubicarlo directamente en el PDF.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#008F6B] bg-[#E6FCF7] px-2.5 py-1 rounded-lg">
              99.2% Precisión
            </span>
          </div>

          {/* Fields List */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {fields.map((field) => {
              const isSelected = selectedFieldId === field.id;
              const isEditing = editingFieldId === field.id;

              return (
                <div
                  key={field.id}
                  onClick={() => setSelectedFieldId(field.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? field.status === 'discrepancia'
                        ? 'border-[#FF5A5F] bg-[#FF5A5F]/10 ring-2 ring-[#FF5A5F]'
                        : 'border-[#00E5B0] bg-[#00E5B0]/10 ring-2 ring-[#00E5B0]'
                      : `${cardBg} hover:border-[#00E5B0]/40`
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold font-heading ${textPrimary}`}>
                          {field.label}
                        </span>
                        {field.status === 'discrepancia' ? (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#FFEBEB] text-[#FF5A5F]">
                            Discrepancia
                          </span>
                        ) : (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#E6FCF7] text-[#008F6B]">
                            Coincide
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-mono ${textMuted}`}>
                        Pág. {field.boundingBox.page} • Confianza {field.confidence}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(field);
                        }}
                        className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-gray-400 hover:text-white"
                        title="Editar valor"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedFieldId(field.id)}
                        className={`p-1.5 rounded-lg ${isSelected ? 'text-[#00E5B0]' : 'text-gray-400'}`}
                        title="Ver en PDF"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Value Row / Edit Mode */}
                  <div className="mt-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg text-xs font-mono border border-[#00E5B0] bg-white dark:bg-black text-[#0B1F3A] dark:text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveEdit(field.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#00E5B0] text-[#0B1F3A] font-mono text-xs font-bold"
                        >
                          Guardar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-between font-mono text-xs">
                        <span className="text-gray-500 text-[11px]">Valor leído:</span>
                        <span className={`font-bold tabular-numbers ${
                          field.status === 'discrepancia' ? 'text-[#FF5A5F]' : textPrimary
                        }`}>
                          {field.documentValue}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Discrepancy Alert inside card */}
                  {field.status === 'discrepancia' && (
                    <div className="mt-2.5 p-2 rounded-xl bg-[#FFEBEB] border border-[#FF5A5F]/30 text-[11px] font-sans text-[#D92B30] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#FF5A5F] shrink-0" />
                        <span>No cuadra con Bill of Lading MAEU98231019.</span>
                      </div>
                      <button
                        onClick={() => onNavigate('consistency-matrix')}
                        className="font-mono font-bold text-[#FF5A5F] hover:underline whitespace-nowrap ml-2"
                      >
                        Resolver →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-[#0B1F3A]/10 flex items-center justify-between">
            <span className={`text-xs font-mono ${textMuted}`}>
              {fields.length} campos sincronizados
            </span>
            <button
              onClick={() => onNavigate('consistency-matrix')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold tracking-wider shadow-md"
            >
              <span>AUDITAR EN MATRIZ DE CONSISTENCIA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
