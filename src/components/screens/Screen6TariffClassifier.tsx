import React, { useState } from 'react';
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
  Database
} from 'lucide-react';
import { ScreenId, TariffItem } from '../../types';
import { MOCK_TARIFF_ITEMS } from '../../data/mockData';
import { saveClassificationToSupabase, getSupabaseCredentials } from '../../lib/supabase';

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

  const containerBg = darkMode ? 'bg-[#0B1F3A] border-[#18335E]' : 'bg-white border-[#0B1F3A]/10';
  const cardBg = darkMode ? 'bg-[#132B4F] border-[#1E4378]' : 'bg-[#F4F7FB] border-[#0B1F3A]/10';
  const textPrimary = darkMode ? 'text-white' : 'text-[#0B1F3A]';
  const textMuted = darkMode ? 'text-white/60' : 'text-[#0B1F3A]/60';

  const handleSyncWithSupabase = async () => {
    setIsSyncingSupabase(true);
    let successCount = 0;
    for (const item of items) {
      await saveClassificationToSupabase({
        reference_code: item.code,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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

        <div className="flex items-center gap-3 flex-wrap">
          <button
            id="sync-classifications-supabase"
            onClick={handleSyncWithSupabase}
            disabled={isSyncingSupabase}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#00E5B0] bg-[#00E5B0]/10 hover:bg-[#00E5B0]/20 text-[#008F6B] dark:text-[#00E5B0] font-mono text-xs font-bold transition-all disabled:opacity-50"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSyncingSupabase ? 'SINCRONIZANDO...' : 'SINCRONIZAR CON SUPABASE'}</span>
          </button>

          <button
            onClick={() => onNavigate('tariff-detail')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold shadow-sm"
          >
            <span>VER DETALLE NORMATIVO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

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

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-2xl border ${containerBg}`}>
          <span className={`text-[11px] font-mono uppercase ${textMuted} block`}>Ítems Declarados</span>
          <span className={`text-2xl font-bold font-heading tabular-numbers ${textPrimary}`}>{items.length} Series</span>
          <span className="text-[10px] text-gray-500 font-mono block">Factura INV-2024-SZ8821</span>
        </div>
        <div className={`p-4 rounded-2xl border ${containerBg}`}>
          <span className={`text-[11px] font-mono uppercase ${textMuted} block`}>Confianza Promedio</span>
          <span className="text-2xl font-bold font-heading tabular-numbers text-[#008F6B]">92.8%</span>
          <span className="text-[10px] text-gray-500 font-mono block">Modelo Aduanero CAN</span>
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
            { id: 'all', label: 'Todos (6)' },
            { id: 'validado', label: 'Validados (4)' },
            { id: 'en_revision', label: 'En Revisión (1)' },
            { id: 'observado', label: 'Observados (1)' },
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

        <div className="relative w-full sm:w-72">
          <Search className={`w-4 h-4 absolute left-3 top-2.5 ${textMuted}`} />
          <input
            type="text"
            placeholder="Buscar por partida o producto..."
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
                <th className="py-3 px-4 text-right">ACCIÓN</th>
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
                    <div className={`font-bold font-heading text-sm ${textPrimary}`}>
                      {item.commercialDescription}
                    </div>
                    <p className={`text-[11px] font-sans ${textMuted} mt-0.5 line-clamp-2`}>
                      {item.technicalDescription}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-gray-500">
                      <span>Cant: {item.quantity} {item.unit}</span>
                      <span>•</span>
                      <span>FOB: ${item.totalValueFob.toLocaleString()} USD</span>
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

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      id={`inspect-tariff-${item.id}`}
                      onClick={() => handleInspect(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00E5B0] text-[#0B1F3A] hover:bg-[#00B88C] font-mono text-xs font-bold transition-all shadow-sm"
                    >
                      <span>Fundamento</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
