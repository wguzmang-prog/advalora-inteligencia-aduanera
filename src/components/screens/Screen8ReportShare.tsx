import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  FileSpreadsheet, 
  ShieldCheck, 
  Printer, 
  Mail, 
  Sparkles,
  QrCode,
  CheckCircle2,
  Lock,
  Eye,
  Ship
} from 'lucide-react';
import { ScreenId } from '../../types';
import { CURRENT_OPERATION, MOCK_DOCUMENTS, MOCK_TARIFF_ITEMS } from '../../data/mockData';
import { CustomsSeal, SunatChannelPill } from '../common/CustomsDecorations';

interface Screen8Props {
  onNavigate: (screen: ScreenId) => void;
  darkMode: boolean;
}

export const Screen8ReportShare: React.FC<Screen8Props> = ({ onNavigate, darkMode }) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [clientEmail, setClientEmail] = useState<string>('compras@techimports.pe');
  const [clientRole, setClientRole] = useState<'view' | 'comment'>('view');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const containerBg = darkMode ? 'bg-[#0B1F3A] border-[#18335E]' : 'bg-white border-[#0B1F3A]/10';
  const cardBg = darkMode ? 'bg-[#132B4F] border-[#1E4378]' : 'bg-[#F4F7FB] border-[#0B1F3A]/10';
  const textPrimary = darkMode ? 'text-white' : 'text-[#0B1F3A]';
  const textMuted = darkMode ? 'text-white/60' : 'text-[#0B1F3A]/60';

  const shareUrl = `https://app.advalora.pe/shared/pre-dam/${CURRENT_OPERATION.referenceNumber.toLowerCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSimulateDownload = (format: 'pdf' | 'excel') => {
    setDownloadSuccess(`Descargando reporte en ${format.toUpperCase()}...`);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00E5B0]/20 text-[#008F6B] border border-[#00E5B0]/40">
              PANTALLA 8 DE 9
            </span>
            <h1 className={`text-2xl sm:text-3xl font-bold font-heading ${textPrimary}`}>
              Reporte Pre-DAM & Compartir con Cliente
            </h1>
          </div>
          <p className={`text-sm ${textMuted} mt-1`}>
            Dossier ejecutivo listo para ser validado por el importador y transmitido al Teledespacho SUNAT.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleSimulateDownload('excel')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-colors ${cardBg} ${textPrimary} hover:border-[#00E5B0]`}
          >
            <FileSpreadsheet className="w-4 h-4 text-[#00E5B0]" />
            <span>EXPORTAR EXCEL</span>
          </button>

          <button
            onClick={() => handleSimulateDownload('pdf')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-colors ${cardBg} ${textPrimary} hover:border-[#00E5B0]`}
          >
            <Download className="w-4 h-4 text-[#00E5B0]" />
            <span>DESCARGAR PDF OFICIAL</span>
          </button>

          <button
            id="open-share-modal-btn"
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold tracking-wider shadow-md shadow-[#00E5B0]/20 scale-105"
          >
            <Share2 className="w-4 h-4" />
            <span>COMPARTIR ENLACE SEGURO</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-[#E6FCF7] border border-[#00E5B0] text-xs font-mono text-[#008F6B] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#00E5B0]" />
          <span>{downloadSuccess} ¡Archivo listo con sello digital de Advalora!</span>
        </div>
      )}

      {/* DOCUMENT PREVIEW CONTAINER (Elegantly Styled Official Pre-DAM Sheet) */}
      <div className="bg-white text-[#0B1F3A] rounded-3xl shadow-xl border border-gray-200 overflow-hidden max-w-4xl mx-auto p-6 sm:p-10 font-sans">
        {/* Document Header with Logos & Formal Stamp */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b-2 border-[#0B1F3A]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0B1F3A] flex items-center justify-center text-[#00E5B0] font-bold">
                A
              </div>
              <span className="font-heading font-black text-xl tracking-tight text-[#0B1F3A]">
                ADVALORA ADUANAS
              </span>
            </div>
            <p className="text-xs text-gray-600 font-mono">
              Certificación de Consistencia Previa a Declaración Aduanera de Mercancías (DAM)
            </p>
            <div className="flex items-center gap-3 text-[11px] font-mono text-gray-500 pt-1">
              <span>AGENCIA: ADVALORA LOGISTICS PERÚ S.A.C.</span>
              <span>•</span>
              <span>CÓDIGO ADUANERO SUNAT: 4921</span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <CustomsSeal refNumber={CURRENT_OPERATION.referenceNumber} date="04 NOV 2024" />
          </div>
        </div>

        {/* Executive Summary Cards for the Client */}
        <div className="my-6 p-5 rounded-2xl bg-[#F4F7FB] border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
              RESUMEN EJECUTIVO PARA EL CLIENTE
            </span>
            <SunatChannelPill channel="Verde" percentage={98} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white border border-gray-200">
              <span className="text-[10px] text-gray-500 uppercase block">Importador</span>
              <span className="font-bold text-[#0B1F3A] truncate block">{CURRENT_OPERATION.importerName}</span>
              <span className="text-[10px] text-gray-500">RUC {CURRENT_OPERATION.importerRuc}</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-gray-200">
              <span className="text-[10px] text-gray-500 uppercase block">Nave & Manifiesto</span>
              <span className="font-bold text-[#0B1F3A] truncate block">{CURRENT_OPERATION.vesselOrFlight}</span>
              <span className="text-[10px] text-gray-500">B/L: {CURRENT_OPERATION.billOfLading.slice(0, 15)}...</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-gray-200">
              <span className="text-[10px] text-gray-500 uppercase block">Valor CIF Total</span>
              <span className="font-bold text-[#0B1F3A] text-sm block">
                ${CURRENT_OPERATION.totalCifUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </span>
              <span className="text-[10px] text-[#008F6B] font-bold">Flete Acreditado</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-gray-200">
              <span className="text-[10px] text-gray-500 uppercase block">Total Tributos</span>
              <span className="font-bold text-[#0B1F3A] text-sm block">$33,781.00 USD</span>
              <span className="text-[10px] text-gray-600 font-bold">S/. 127,016.56 PEN</span>
            </div>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed font-sans">
            Estimado cliente: Se ha completado el cotejo inteligente de su despacho marítimo desde Shenzhen. Se subsanaron 2 diferencias documentales previas a la numeración, garantizando cero contingencias de multa y una probabilidad del <strong>98% de Canal Verde</strong> (levante aduanero inmediato dentro de las 24 horas de descarga).
          </p>
        </div>

        {/* Audited Document Legajo Breakdown */}
        <div className="my-6">
          <h4 className="font-heading font-bold text-sm text-[#0B1F3A] uppercase tracking-wider mb-3">
            Expediente Documental Auditado (5 PDFs)
          </h4>

          <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left font-mono">
              <thead className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-500 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Documento</th>
                  <th className="py-2.5 px-3">N° / Referencia</th>
                  <th className="py-2.5 px-3 text-center">Estado Auditoría</th>
                  <th className="py-2.5 px-3 text-right">Firma Digital</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[11px]">
                {MOCK_DOCUMENTS.map((doc) => (
                  <tr key={doc.id}>
                    <td className="py-2 px-3 font-sans font-medium text-[#0B1F3A]">
                      {doc.type}
                    </td>
                    <td className="py-2 px-3 text-gray-600 truncate max-w-[180px]">
                      {doc.fileName}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6FCF7] text-[#008F6B]">
                        <CheckCircle2 className="w-3 h-3 text-[#00E5B0]" />
                        Validado
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-gray-400 font-mono text-[10px]">
                      SHA256: 9b28f10a...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Series of Items Declared */}
        <div className="my-6">
          <h4 className="font-heading font-bold text-sm text-[#0B1F3A] uppercase tracking-wider mb-3">
            Clasificación Arancelaria y Tributación (Resumen de Series)
          </h4>

          <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left font-mono">
              <thead className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-500 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Serie</th>
                  <th className="py-2.5 px-3">Partida NANDINA</th>
                  <th className="py-2.5 px-3">Descripción Mercancía</th>
                  <th className="py-2.5 px-3 text-center">Ad/Val</th>
                  <th className="py-2.5 px-3 text-right">FOB (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[11px]">
                {MOCK_TARIFF_ITEMS.slice(0, 4).map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-3 font-bold text-gray-500">#{item.itemNumber}</td>
                    <td className="py-2 px-3 font-bold text-[#008F6B]">{item.suggestedNandina}</td>
                    <td className="py-2 px-3 font-sans truncate max-w-[200px] text-[#0B1F3A]">
                      {item.commercialDescription}
                    </td>
                    <td className="py-2 px-3 text-center">{item.adValoremRate}%</td>
                    <td className="py-2 px-3 text-right font-bold">${item.totalValueFob.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Digital Signature & Footer Seal */}
        <div className="pt-6 border-t-2 border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-600 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 p-1.5 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <QrCode className="w-12 h-12 text-[#0B1F3A]" />
            </div>
            <div>
              <div className="font-bold text-[#0B1F3A]">VALIDACIÓN ELECTRÓNICA ADVALORA</div>
              <div className="text-[10px]">Cotejo con Padrón y Procedimientos SUNAT</div>
              <div className="text-[10px] text-[#008F6B] font-bold">Verificado el 04/11/2024 a las 11:42 AM</div>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="font-bold text-[#0B1F3A] font-sans">Valeria Mendoza Santillán</div>
            <div className="text-[10px]">Agente / Liquidadora Colegiada SUNAT Reg. 4921</div>
            <div className="text-[10px] text-gray-400">Firma Digital Verificada con Certificado RENIEC</div>
          </div>
        </div>
      </div>

      {/* SHARE MODAL */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-3xl p-6 md:p-8 border shadow-2xl space-y-6 ${containerBg} animate-in fade-in`}>
            <div className="flex items-start justify-between border-b border-[#0B1F3A]/10 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#008F6B] uppercase">COLABORACIÓN CON CLIENTE</span>
                <h3 className={`text-xl font-bold font-heading ${textPrimary} mt-0.5`}>
                  Compartir Pre-DAM Auditada
                </h3>
              </div>
              <button
                onClick={() => setShareModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Copy Link Input */}
              <div>
                <label className={`block text-xs font-mono uppercase font-bold mb-1.5 ${textMuted}`}>
                  Enlace Seguro de Acceso
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs font-mono border ${
                      darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                    }`}
                  />
                  <button
                    id="copy-share-link-btn"
                    onClick={handleCopy}
                    className="px-4 py-2.5 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? '¡COPIADO!' : 'COPIAR'}</span>
                  </button>
                </div>
              </div>

              {/* Direct Email Invite */}
              <div>
                <label className={`block text-xs font-mono uppercase font-bold mb-1.5 ${textMuted}`}>
                  Enviar Invitación por Correo al Importador
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="compras@cliente.com"
                    className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs font-mono border ${
                      darkMode ? 'bg-[#071324] border-[#18335E] text-white' : 'bg-white border-[#0B1F3A]/20'
                    }`}
                  />
                  <button
                    onClick={() => {
                      alert(`Invitación enviada con éxito a ${clientEmail}`);
                      setShareModalOpen(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#0B1F3A] text-white dark:bg-white dark:text-[#0B1F3A] font-mono text-xs font-bold shrink-0"
                  >
                    ENVIAR
                  </button>
                </div>
              </div>

              {/* Permissions */}
              <div className="pt-2">
                <label className={`block text-xs font-mono uppercase font-bold mb-1.5 ${textMuted}`}>
                  Permisos del Cliente
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setClientRole('view')}
                    className={`p-3 rounded-xl border text-left text-xs font-mono transition-all ${
                      clientRole === 'view'
                        ? 'border-[#00E5B0] bg-[#00E5B0]/10 font-bold text-[#008F6B] dark:text-[#00E5B0]'
                        : `${cardBg} ${textMuted}`
                    }`}
                  >
                    <Eye className="w-4 h-4 mb-1" />
                    <div>Solo Lectura</div>
                    <span className="text-[10px] text-gray-500">Visualizar y descargar PDF</span>
                  </button>

                  <button
                    onClick={() => setClientRole('comment')}
                    className={`p-3 rounded-xl border text-left text-xs font-mono transition-all ${
                      clientRole === 'comment'
                        ? 'border-[#00E5B0] bg-[#00E5B0]/10 font-bold text-[#008F6B] dark:text-[#00E5B0]'
                        : `${cardBg} ${textMuted}`
                    }`}
                  >
                    <Share2 className="w-4 h-4 mb-1" />
                    <div>Comentarios & Aprobación</div>
                    <span className="text-[10px] text-gray-500">Dar visto bueno previo a SUNAT</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#0B1F3A]/10 text-right">
              <button
                onClick={() => setShareModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-[#00E5B0] text-[#0B1F3A]"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
