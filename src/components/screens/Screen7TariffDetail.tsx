import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  Scale, 
  Layers, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Percent,
  Calculator
} from 'lucide-react';
import { ScreenId, TariffItem } from '../../types';
import { MOCK_TARIFF_ITEMS } from '../../data/mockData';

interface Screen7Props {
  onNavigate: (screen: ScreenId) => void;
  selectedItem?: TariffItem;
  darkMode: boolean;
}

export const Screen7TariffDetail: React.FC<Screen7Props> = ({ 
  onNavigate, 
  selectedItem = MOCK_TARIFF_ITEMS[0],
  darkMode 
}) => {
  const [activeItem, setActiveItem] = useState<TariffItem>(selectedItem);
  const [exchangeRate] = useState<number>(3.76); // USD to PEN (Soles peruanos)

  const containerBg = darkMode ? 'bg-[#0B1F3A] border-[#18335E]' : 'bg-white border-[#0B1F3A]/10';
  const cardBg = darkMode ? 'bg-[#132B4F] border-[#1E4378]' : 'bg-[#F4F7FB] border-[#0B1F3A]/10';
  const textPrimary = darkMode ? 'text-white' : 'text-[#0B1F3A]';
  const textMuted = darkMode ? 'text-white/60' : 'text-[#0B1F3A]/60';

  // Tax calculations
  const cifValue = activeItem.totalValueFob * 1.034; // approximate CIF
  const adValoremAmount = cifValue * (activeItem.adValoremRate / 100);
  const baseIgv = cifValue + adValoremAmount;
  const igvAmount = baseIgv * (activeItem.igvRate / 100);
  const ipmAmount = baseIgv * (activeItem.ipmRate / 100);
  const basePercepcion = cifValue + adValoremAmount + igvAmount + ipmAmount;
  const percepcionAmount = basePercepcion * (activeItem.percepcionRate / 100);
  const totalTaxesUsd = adValoremAmount + igvAmount + ipmAmount + percepcionAmount;
  const totalTaxesPen = totalTaxesUsd * exchangeRate;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with back button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('classifier')}
              className={`p-1.5 rounded-lg ${cardBg} ${textMuted} hover:text-white`}
              title="Volver a la lista de partidas"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00E5B0]/20 text-[#008F6B] border border-[#00E5B0]/40">
              PANTALLA 7 DE 9
            </span>
            <span className="text-xs font-mono text-gray-500">
              Ítem #{activeItem.itemNumber} de 6
            </span>
          </div>

          <h1 className={`text-2xl sm:text-3xl font-bold font-heading ${textPrimary} mt-1`}>
            Fundamento Normativo & Jerarquía Arancelaria
          </h1>
          <p className={`text-sm ${textMuted} mt-1`}>
            {activeItem.commercialDescription}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={activeItem.id}
            onChange={(e) => {
              const found = MOCK_TARIFF_ITEMS.find(i => i.id === e.target.value);
              if (found) setActiveItem(found);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono border ${cardBg} text-[#0B1F3A] dark:text-white`}
          >
            {MOCK_TARIFF_ITEMS.map((item) => (
              <option key={item.id} value={item.id}>
                Ítem #{item.itemNumber} - {item.suggestedNandina} ({item.commercialDescription.slice(0, 24)}...)
              </option>
            ))}
          </select>

          <button
            onClick={() => onNavigate('report')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold shadow-sm"
          >
            <span>VER EN REPORTE PRE-DAM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Classification Tree & Notes (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main NANDINA Code Highlight Box */}
          <div className={`p-6 rounded-3xl border shadow-sm ${containerBg}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#008F6B]">
                  SUBPARTIDA NACIONAL OFICIAL SUNAT
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E6FCF7] text-[#008F6B] border border-[#00E5B0]/30">
                  {activeItem.confidence}% Certeza IA
                </span>
              </div>
              <span className="text-xs font-mono text-gray-500">
                Arancel de Aduanas 2022 (D.S. N° 404-2021-EF)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B1F3A] text-white border border-[#18335E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-[#00E5B0]">
                  {activeItem.suggestedNandina}
                </div>
                <div className="text-xs text-white/70 font-sans mt-1">
                  Máquinas automáticas para tratamiento o procesamiento de datos, portátiles, de peso inferior o igual a 10 kg.
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-[#00E5B0]/20 text-[#00E5B0] font-mono text-xs font-bold border border-[#00E5B0]/40 shrink-0 text-center">
                Ad-Valorem 0% (TLC)
              </span>
            </div>
          </div>

          {/* Arancel Hierarchy Tree */}
          <div className={`p-6 rounded-3xl border shadow-sm ${containerBg}`}>
            <h3 className={`font-heading font-bold text-base mb-4 ${textPrimary} flex items-center gap-2`}>
              <Layers className="w-4 h-4 text-[#00E5B0]" />
              Jerarquía Arancelaria NANDINA
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/5 dark:bg-black/30 border border-[#0B1F3A]/10">
                <span className="text-[10px] text-gray-500 block uppercase">SECCIÓN XVI</span>
                <span className={`font-bold ${textPrimary}`}>Máquinas y aparatos, material eléctrico y sus partes</span>
              </div>

              <div className="pl-4 border-l-2 border-[#00E5B0]/30 space-y-3">
                <div className="p-3 rounded-xl bg-black/5 dark:bg-black/30 border border-[#0B1F3A]/10">
                  <span className="text-[10px] text-gray-500 block uppercase">CAPÍTULO 84 (2 DÍGITOS)</span>
                  <span className={`font-bold ${textPrimary}`}>Reactores nucleares, calderas, máquinas y aparatos mecánicos</span>
                </div>

                <div className="pl-4 border-l-2 border-[#00E5B0]/30 space-y-3">
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-black/30 border border-[#0B1F3A]/10">
                    <span className="text-[10px] text-gray-500 block uppercase">PARTIDA 84.71 (4 DÍGITOS)</span>
                    <span className={`font-bold ${textPrimary}`}>Máquinas automáticas para tratamiento o procesamiento de datos</span>
                  </div>

                  <div className="pl-4 border-l-2 border-[#00E5B0]/30 space-y-3">
                    <div className="p-3 rounded-xl bg-[#00E5B0]/10 border border-[#00E5B0]/40">
                      <span className="text-[10px] text-[#008F6B] font-bold block uppercase">SUBPARTIDA NACIONAL: 8471.30.00.00 (10 DÍGITOS)</span>
                      <span className="font-bold text-[#0B1F3A] dark:text-white">Portátiles de peso inferior o igual a 10 kg, con CPU, teclado y pantalla incorporados.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Official Explanatory Notes */}
          <div className={`p-6 rounded-3xl border shadow-sm ${containerBg}`}>
            <h3 className={`font-heading font-bold text-base mb-3 ${textPrimary} flex items-center gap-2`}>
              <BookOpenCheck className="w-4 h-4 text-[#00E5B0]" />
              Cita Textual de las Notas Explicativas del Sistema Armonizado
            </h3>
            
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-black/30 border border-[#0B1F3A]/10 text-xs font-sans space-y-2 leading-relaxed">
              <p className={textPrimary}>
                "Pertenecen a la subpartida <strong>8471.30</strong> las máquinas portátiles concebidas para funcionar autónomamente sin estar permanentemente conectadas a la red eléctrica principal (alimentadas mediante batería recargable interna). Deben contar al menos con una unidad central de proceso, una unidad de entrada (teclado alfanumérico) y una unidad de salida (pantalla plana), integradas en un solo chasis."
              </p>
              <div className="text-[10px] font-mono text-gray-500 pt-1 border-t border-[#0B1F3A]/10">
                Fuente: Notas Explicativas de la OMA, Edición Oficial 2022, Tomo IV, Pág. 1421.
              </div>
            </div>
          </div>

          {/* Peruvian Trade Restrictions & TLC Rules */}
          <div className={`p-6 rounded-3xl border shadow-sm ${containerBg} space-y-3`}>
            <h3 className={`font-heading font-bold text-base ${textPrimary} flex items-center gap-2`}>
              <ShieldCheck className="w-4 h-4 text-[#00E5B0]" />
              Regulaciones Aduaneras en Perú & Requisitos VUCE
            </h3>

            {activeItem.restrictedGood ? (
              <div className="p-4 rounded-2xl bg-[#FFFBE6] border border-[#FFD600]/40 text-xs text-[#665200] space-y-1">
                <div className="flex items-center gap-2 font-bold font-mono text-[#997A00]">
                  <AlertTriangle className="w-4 h-4 text-[#FFD600]" />
                  <span>MERCANCÍA RESTRINGIDA - REQUISITO MTC PERÚ</span>
                </div>
                <p>
                  Por contar con interfaces inalámbricas WiFi 6E y Bluetooth 5.3, requiere <strong>Certificado de Homologación de Equipos y Aparatos de Telecomunicaciones</strong> expedido por el Ministerio de Transportes y Comunicaciones (VUCE - Trámite MTC-002).
                </p>
                <div className="text-[10px] font-mono text-[#806600] pt-1">
                  ✓ El importador TechImports Perú cuenta con registro de homologador vigente N° H-2023-8819.
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-[#E6FCF7] border border-[#00E5B0]/30 text-xs font-mono text-[#008F6B]">
                ✓ Mercancía de libre importación. No requiere permisos especiales de DIGEMID, DIGESA ni SENASA.
              </div>
            )}

            <div className="p-3 rounded-2xl bg-black/5 dark:bg-black/30 border border-[#0B1F3A]/10 text-xs font-mono flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0B1F3A] dark:text-white">TLC Perú - China:</span>
                <span className="text-gray-500 ml-2">Arancel Base 6% → Arancel Preferencial 0%</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#00E5B0]/20 text-[#008F6B] font-bold text-[10px]">
                AMPRADO POR FORM A
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Customs Tax Calculator (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${containerBg}`}>
            <div className="flex items-center justify-between border-b border-[#0B1F3A]/10 pb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#00E5B0]" />
                <h3 className={`font-heading font-bold text-lg ${textPrimary}`}>
                  Simulador de Tributos SUNAT
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#008F6B] bg-[#E6FCF7] px-2 py-0.5 rounded">
                T/C S/. {exchangeRate.toFixed(2)}
              </span>
            </div>

            {/* Tax Breakdown */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-2 rounded-xl bg-black/5 dark:bg-black/20">
                <span className={textMuted}>Valor FOB Declarado:</span>
                <span className="font-bold">${activeItem.totalValueFob.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
              </div>

              <div className="flex justify-between p-2 rounded-xl bg-black/5 dark:bg-black/20">
                <span className={textMuted}>Base Imponible CIF Estimada:</span>
                <span className="font-bold">${cifValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
              </div>

              <div className="border-t border-[#0B1F3A]/10 pt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00E5B0]" />
                    <span>Ad-Valorem ({activeItem.adValoremRate}%):</span>
                  </span>
                  <span className="font-bold">${adValoremAmount.toFixed(2)} USD</span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00E5B0]" />
                    <span>IGV (16%):</span>
                  </span>
                  <span className="font-bold">${igvAmount.toFixed(2)} USD</span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00E5B0]" />
                    <span>IPM (2%):</span>
                  </span>
                  <span className="font-bold">${ipmAmount.toFixed(2)} USD</span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FFD600]" />
                    <span>Percepción SUNAT ({activeItem.percepcionRate}%):</span>
                  </span>
                  <span className="font-bold">${percepcionAmount.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Total Payment Box */}
              <div className="p-4 rounded-2xl bg-[#0B1F3A] text-white border border-[#18335E] space-y-1 mt-4">
                <div className="text-[10px] text-white/60 uppercase tracking-widest font-bold">
                  TOTAL TRIBUTOS A PAGAR ANTE SUNAT:
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black font-heading text-[#00E5B0] tabular-numbers">
                    ${totalTaxesUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </span>
                  <span className="text-xs font-mono text-white/80">
                    S/. {totalTaxesPen.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PEN
                  </span>
                </div>
              </div>
            </div>

            {/* Alternatives if available */}
            {activeItem.alternativeNandina && activeItem.alternativeNandina.length > 0 && (
              <div className="pt-2">
                <span className={`text-[11px] font-mono uppercase font-bold block mb-2 ${textMuted}`}>
                  Subpartida Alternativa Analizada por IA:
                </span>
                <div className="p-3 rounded-xl border border-[#FFD600]/40 bg-[#FFFBE6] text-xs font-sans">
                  <div className="flex items-center justify-between font-mono font-bold text-[#665200]">
                    <span>{activeItem.alternativeNandina[0].code}</span>
                    <span className="text-[10px]">Ad/Val: {activeItem.alternativeNandina[0].adValorem}%</span>
                  </div>
                  <p className="text-[11px] text-[#806600] mt-1">
                    {activeItem.alternativeNandina[0].reason}
                  </p>
                </div>
              </div>
            )}

            {/* Confirm button */}
            <div className="pt-2">
              <button
                onClick={() => onNavigate('report')}
                className="w-full py-3 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>CONFIRMAR PARTIDA Y GENERAR PRE-DAM</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
