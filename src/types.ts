export type ScreenId = 
  | 'login-onboarding'
  | 'dashboard'
  | 'wizard'
  | 'extraction'
  | 'consistency-matrix'
  | 'classifier'
  | 'tariff-detail'
  | 'report'
  | 'settings';

export type Severity = 'bloqueante' | 'advertencia' | 'validado' | 'informativo';

export interface DocumentScan {
  id: string;
  name: string;
  type: 'Factura Comercial' | 'Packing List' | 'Bill of Lading / AWB' | 'Certificado de Origen' | 'Swift Bancario';
  fileName: string;
  fileSize: string;
  pages: number;
  status: 'validado' | 'leyendo' | 'observado' | 'pendiente';
  confidence: number;
  extractedFieldsCount: number;
  matchedFieldsCount: number;
  mismatchCount: number;
  uploadDate: string;
}

export interface InconsistencyFinding {
  id: string;
  title: string;
  severity: Severity;
  category: 'Pesos y Bultos' | 'Incoterm y Valoración' | 'Datos Fiscales y RUC' | 'Clasificación Arancelaria' | 'Regla de Origen';
  description: string;
  sunatImpact: string;
  legalBasis: string;
  affectedDocuments: {
    docType: string;
    docName: string;
    quotedValue: string;
    location: string;
  }[];
  resolutionStatus: 'abierto' | 'resuelto' | 'ignorado_con_justificacion';
  resolutionNote?: string;
  suggestedAction: string;
  toleranceMargin?: string;
}

export interface TariffItem {
  id: string;
  itemNumber: number;
  commercialDescription: string;
  technicalDescription: string;
  quantity: number;
  unit: string;
  unitValueFob: number;
  totalValueFob: number;
  netWeightKg: number;
  suggestedNandina: string;
  confidence: number;
  status: 'validado' | 'en_revision' | 'observado';
  adValoremRate: number; // e.g. 0% or 6%
  igvRate: number; // e.g. 16%
  ipmRate: number; // e.g. 2%
  percepcionRate: number; // e.g. 3.5%
  antidumpingApplies: boolean;
  restrictedGood: boolean;
  restrictedEntity?: 'MTC' | 'DIGEMID' | 'DIGESA' | 'SENASA' | 'SUCAMEC';
  tlcCountry?: string;
  alternativeNandina?: {
    code: string;
    description: string;
    reason: string;
    adValorem: number;
  }[];
}

export interface DeclarationOperation {
  id: string;
  referenceNumber: string; // e.g. ADV-2024-0892
  customsCode: string; // e.g. 118 - Marítima del Callao
  regime: string; // e.g. 10 - Importación para el Consumo
  importerRuc: string;
  importerName: string;
  supplierName: string;
  supplierCountry: string;
  transportMode: 'Marítimo' | 'Aéreo';
  vesselOrFlight: string;
  billOfLading: string;
  incoterm: 'CIF' | 'FOB' | 'CFR' | 'FCA' | 'EXW';
  totalFobUsd: number;
  freightUsd: number;
  insuranceUsd: number;
  totalCifUsd: number;
  status: 'Borrador' | 'En revisión' | 'Validada' | 'Observada';
  projectedChannel: 'Verde' | 'Naranja' | 'Rojo';
  projectedRiskScore: number; // 0 to 100 (lower is better)
  documentsCount: number;
  criticalIssuesCount: number;
  warningIssuesCount: number;
  createdAt: string;
  lastUpdated: string;
  liquidator: {
    name: string;
    role: string;
    avatar: string;
  };
}

export interface ExtractedField {
  id: string;
  fieldKey: string;
  label: string;
  documentValue: string;
  normalizedValue: string;
  confidence: number;
  status: 'coincide' | 'discrepancia' | 'verificado';
  boundingBox: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Agente de Aduana Principal' | 'Liquidador Senior' | 'Liquidadora Senior' | 'Asistente de Despacho' | 'Cliente Importador';
  avatar: string;
  status: 'Activo' | 'Pendiente';
  operationsCount: number;
  lastActive: string;
}
