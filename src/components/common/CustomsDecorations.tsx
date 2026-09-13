import React from 'react';
import { ShieldCheck, AlertOctagon, AlertTriangle, CheckCircle2, Info, Anchor, Plane, Ship, FileCheck2 } from 'lucide-react';
import { Severity } from '../../types';

export const SeverityBadge: React.FC<{
  severity: Severity;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
}> = ({ severity, label, size = 'md', icon = true }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  }[size];

  switch (severity) {
    case 'bloqueante':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium tracking-wide bg-[#FFEBEB] text-[#FF5A5F] border border-[#FF5A5F]/30 ${sizeClasses}`}>
          {icon && <AlertOctagon className="w-3.5 h-3.5 shrink-0 animate-pulse" />}
          <span>{label || 'BLOQUEANTE'}</span>
        </span>
      );
    case 'advertencia':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium tracking-wide bg-[#FFFBE6] text-[#B29500] border border-[#FFD600]/40 ${sizeClasses}`}>
          {icon && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
          <span>{label || 'ADVERTENCIA'}</span>
        </span>
      );
    case 'validado':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium tracking-wide bg-[#E6FCF7] text-[#008F6B] border border-[#00E5B0]/40 ${sizeClasses}`}>
          {icon && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
          <span>{label || 'VALIDADO'}</span>
        </span>
      );
    case 'informativo':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium tracking-wide bg-[#0B1F3A]/5 text-[#0B1F3A] border border-[#0B1F3A]/20 ${sizeClasses}`}>
          {icon && <Info className="w-3.5 h-3.5 shrink-0" />}
          <span>{label || 'INFORMATIVO'}</span>
        </span>
      );
  }
};

export const CustomsSeal: React.FC<{
  refNumber?: string;
  date?: string;
  compact?: boolean;
}> = ({ refNumber = 'ADV-2024-0892', date = '04 NOV 2024', compact = false }) => {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#00E5B0]/10 border border-[#00E5B0] text-[#0B1F3A] rounded-lg font-mono text-[11px] font-bold tracking-wider">
        <ShieldCheck className="w-3.5 h-3.5 text-[#00E5B0]" />
        <span>SELLO PRE-DAM SUNAT</span>
      </div>
    );
  }

  return (
    <div className="relative inline-flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-[#00E5B0] bg-[#00E5B0]/5 rounded-2xl text-center select-none shadow-sm">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#00B88C] font-mono tracking-widest uppercase">
        <ShieldCheck className="w-4 h-4 text-[#00E5B0]" />
        CERTIFICACIÓN DIGITAL ADVALORA
      </div>
      <div className="text-sm font-extrabold tracking-wider text-[#0B1F3A] font-heading mt-0.5">
        AUDITADO PREVIO A SUNAT
      </div>
      <div className="flex items-center gap-3 text-[10px] font-mono text-[#0B1F3A]/70 mt-1">
        <span>REF: {refNumber}</span>
        <span>•</span>
        <span>{date}</span>
      </div>
      <div className="mt-1 text-[9px] font-mono text-[#008F6B] bg-[#00E5B0]/20 px-2 py-0.5 rounded-full font-semibold">
        HASH: SHA256-ad991a27e0...
      </div>
    </div>
  );
};

export const SunatChannelPill: React.FC<{
  channel: 'Verde' | 'Naranja' | 'Rojo';
  percentage?: number;
}> = ({ channel, percentage = 92 }) => {
  const styles = {
    Verde: {
      bg: 'bg-[#E6FCF7]',
      border: 'border-[#00E5B0]',
      text: 'text-[#008F6B]',
      dot: 'bg-[#00E5B0]'
    },
    Naranja: {
      bg: 'bg-[#FFFBE6]',
      border: 'border-[#FFD600]',
      text: 'text-[#997A00]',
      dot: 'bg-[#FFD600]'
    },
    Rojo: {
      bg: 'bg-[#FFEBEB]',
      border: 'border-[#FF5A5F]',
      text: 'text-[#D92B30]',
      dot: 'bg-[#FF5A5F]'
    }
  }[channel];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${styles.bg} ${styles.border} font-mono text-xs font-semibold`}>
      <span className={`w-2 h-2 rounded-full ${styles.dot} animate-pulse`} />
      <span className={styles.text}>Canal Proyectado: {channel}</span>
      <span className="text-[#0B1F3A]/60 text-[10px]">({percentage}% certidumbre)</span>
    </div>
  );
};

export const ContainerGraphic: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="10" width="40" height="28" rx="4" stroke="#0B1F3A" strokeWidth="2.5" fill="#F4F7FB" />
    <path d="M12 10V38" stroke="#0B1F3A" strokeWidth="2" strokeDasharray="3 2" />
    <path d="M20 10V38" stroke="#0B1F3A" strokeWidth="2" strokeDasharray="3 2" />
    <path d="M28 10V38" stroke="#0B1F3A" strokeWidth="2" strokeDasharray="3 2" />
    <path d="M36 10V38" stroke="#0B1F3A" strokeWidth="2" strokeDasharray="3 2" />
    <rect x="8" y="15" width="6" height="4" rx="1" fill="#00E5B0" />
    <rect x="8" y="22" width="6" height="4" rx="1" fill="#FFD600" />
    <circle cx="39" cy="31" r="2" fill="#FF5A5F" />
  </svg>
);
