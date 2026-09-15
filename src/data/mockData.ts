import { DeclarationOperation, DocumentScan, InconsistencyFinding, TariffItem, ExtractedField, TeamMember } from '../types';

export const CURRENT_OPERATION: DeclarationOperation = {
  id: 'op-0892',
  referenceNumber: 'ADV-2024-0892',
  customsCode: '118 - Marítima del Callao',
  regime: '10 - Importación para el Consumo',
  importerRuc: '20554921098',
  importerName: 'TechImports Perú S.A.C.',
  supplierName: 'Shenzhen Yantian Precision Tech Co., Ltd.',
  supplierCountry: 'China (CN)',
  transportMode: 'Marítimo',
  vesselOrFlight: 'MSC INES V.402W',
  billOfLading: 'MAEU-98231019-CALLAO',
  incoterm: 'CIF',
  totalFobUsd: 148500.00,
  freightUsd: 4200.00,
  insuranceUsd: 850.00,
  totalCifUsd: 153550.00,
  status: 'Observada',
  projectedChannel: 'Naranja',
  projectedRiskScore: 68,
  documentsCount: 5,
  criticalIssuesCount: 2,
  warningIssuesCount: 1,
  createdAt: '2024-11-04 09:30',
  lastUpdated: 'Hace 12 min',
  liquidator: {
    name: 'Valeria Mendoza',
    role: 'Liquidadora Senior SUNAT (Reg. 4921)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
};

// Restore saved active operation from localStorage if available
if (typeof window !== 'undefined') {
  try {
    const savedOp = localStorage.getItem('advalora_active_operation');
    if (savedOp) {
      const parsed = JSON.parse(savedOp);
      Object.assign(CURRENT_OPERATION, parsed);
    }
  } catch (e) {
    // Ignore JSON parse errors
  }
}

/**
 * Updates the globally active operation in memory and persists to localStorage
 */
export function updateCurrentOperation(updates: Partial<DeclarationOperation>) {
  Object.assign(CURRENT_OPERATION, updates);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('advalora_active_operation', JSON.stringify(CURRENT_OPERATION));
    } catch (e) {
      // Ignore
    }
  }
}

/**
 * Returns the freshest active operation, giving priority to localStorage
 */
export function getActiveOperation(): DeclarationOperation {
  if (typeof window !== 'undefined') {
    try {
      const savedOp = localStorage.getItem('advalora_active_operation');
      if (savedOp) {
        const parsed = JSON.parse(savedOp);
        return { ...CURRENT_OPERATION, ...parsed };
      }
    } catch (e) {
      // Ignore
    }
  }
  return CURRENT_OPERATION;
}

export const MOCK_OPERATIONS: DeclarationOperation[] = [
  CURRENT_OPERATION,
  {
    id: 'op-0891',
    referenceNumber: 'ADV-2024-0891',
    customsCode: '235 - Aérea del Callao (Jorge Chávez)',
    regime: '10 - Importación para el Consumo',
    importerRuc: '20601829301',
    importerName: 'Biomédica Andina S.A.C.',
    supplierName: 'Siemens Healthineers AG',
    supplierCountry: 'Alemania (DE)',
    transportMode: 'Aéreo',
    vesselOrFlight: 'KLM Cargo KL743',
    billOfLading: 'AWB 074-88419201',
    incoterm: 'CIF',
    totalFobUsd: 84200.00,
    freightUsd: 6100.00,
    insuranceUsd: 1250.00,
    totalCifUsd: 91550.00,
    status: 'Validada',
    projectedChannel: 'Verde',
    projectedRiskScore: 8,
    documentsCount: 5,
    criticalIssuesCount: 0,
    warningIssuesCount: 0,
    createdAt: '2024-11-03 14:15',
    lastUpdated: 'Ayer',
    liquidator: {
      name: 'Carlos Benites',
      role: 'Agente de Aduana Colegiado',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'op-0890',
    referenceNumber: 'ADV-2024-0890',
    customsCode: '118 - Marítima del Callao',
    regime: '10 - Importación para el Consumo',
    importerRuc: '20492817291',
    importerName: 'Textiles del Mantaro S.A.',
    supplierName: 'Zhejiang Tex Machinery',
    supplierCountry: 'China (CN)',
    transportMode: 'Marítimo',
    vesselOrFlight: 'CMA CGM TANGER V.11',
    billOfLading: 'CMAU-49102830',
    incoterm: 'FOB',
    totalFobUsd: 62400.00,
    freightUsd: 3800.00,
    insuranceUsd: 490.00,
    totalCifUsd: 66690.00,
    status: 'En revisión',
    projectedChannel: 'Verde',
    projectedRiskScore: 18,
    documentsCount: 4,
    criticalIssuesCount: 0,
    warningIssuesCount: 2,
    createdAt: '2024-11-02 11:20',
    lastUpdated: 'Hace 2 días',
    liquidator: {
      name: 'Valeria Mendoza',
      role: 'Liquidadora Senior SUNAT',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'op-0889',
    referenceNumber: 'ADV-2024-0889',
    customsCode: '019 - Paita',
    regime: '40 - Exportación Definitiva',
    importerRuc: '20192837461',
    importerName: 'Campos del Norte Agro S.A.C.',
    supplierName: 'Fresh Fruit Global Rotterdam',
    supplierCountry: 'Países Bajos (NL)',
    transportMode: 'Marítimo',
    vesselOrFlight: 'Hapag-Lloyd SANTOS EXPRESS',
    billOfLading: 'HLCU-99482710',
    incoterm: 'CIF',
    totalFobUsd: 215000.00,
    freightUsd: 12000.00,
    insuranceUsd: 1400.00,
    totalCifUsd: 228400.00,
    status: 'Validada',
    projectedChannel: 'Verde',
    projectedRiskScore: 5,
    documentsCount: 6,
    criticalIssuesCount: 0,
    warningIssuesCount: 0,
    createdAt: '2024-10-31 16:45',
    lastUpdated: 'Hace 4 días',
    liquidator: {
      name: 'Raúl Huamán',
      role: 'Especialista Operativo',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'op-0888',
    referenceNumber: 'ADV-2024-0888',
    customsCode: '118 - Marítima del Callao',
    regime: '10 - Importación para el Consumo',
    importerRuc: '20511892019',
    importerName: 'Inversiones Ferreteras Lima S.A.C.',
    supplierName: 'Anshan Iron & Steel Group',
    supplierCountry: 'China (CN)',
    transportMode: 'Marítimo',
    vesselOrFlight: 'COSCO SHIPPING ANDES',
    billOfLading: 'COSU-66291048',
    incoterm: 'CFR',
    totalFobUsd: 94000.00,
    freightUsd: 5200.00,
    insuranceUsd: 780.00,
    totalCifUsd: 99980.00,
    status: 'Borrador',
    projectedChannel: 'Rojo',
    projectedRiskScore: 82,
    documentsCount: 3,
    criticalIssuesCount: 3,
    warningIssuesCount: 1,
    createdAt: '2024-10-30 08:10',
    lastUpdated: 'Hace 5 días',
    liquidator: {
      name: 'Lucía Paredes',
      role: 'Asistente de Liquidación',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  }
];

export const MOCK_DOCUMENTS: DocumentScan[] = [
  {
    id: 'doc-1',
    name: 'Factura Comercial (Commercial Invoice)',
    type: 'Factura Comercial',
    fileName: 'INV-2024-SZ8821_TechImports.pdf',
    fileSize: '1.4 MB',
    pages: 3,
    status: 'validado',
    confidence: 99.4,
    extractedFieldsCount: 24,
    matchedFieldsCount: 22,
    mismatchCount: 2,
    uploadDate: '2024-11-04 09:32'
  },
  {
    id: 'doc-2',
    name: 'Lista de Empaque (Packing List)',
    type: 'Packing List',
    fileName: 'PL-2024-8821_TechImports.pdf',
    fileSize: '890 KB',
    pages: 2,
    status: 'observado',
    confidence: 98.1,
    extractedFieldsCount: 18,
    matchedFieldsCount: 17,
    mismatchCount: 1,
    uploadDate: '2024-11-04 09:32'
  },
  {
    id: 'doc-3',
    name: 'Conocimiento de Embarque (Bill of Lading)',
    type: 'Bill of Lading / AWB',
    fileName: 'MAEU98231019_BL_Master.pdf',
    fileSize: '2.1 MB',
    pages: 2,
    status: 'observado',
    confidence: 97.6,
    extractedFieldsCount: 31,
    matchedFieldsCount: 29,
    mismatchCount: 2,
    uploadDate: '2024-11-04 09:33'
  },
  {
    id: 'doc-4',
    name: 'Certificado de Origen (Form A - TLC Perú-China)',
    type: 'Certificado de Origen',
    fileName: 'COO_China_Peru_FTA_SZ2024.pdf',
    fileSize: '1.1 MB',
    pages: 1,
    status: 'observado',
    confidence: 96.8,
    extractedFieldsCount: 14,
    matchedFieldsCount: 13,
    mismatchCount: 1,
    uploadDate: '2024-11-04 09:34'
  },
  {
    id: 'doc-5',
    name: 'Transferencia Bancaria Swift (MT103 BCP - HSBC)',
    type: 'Swift Bancario',
    fileName: 'SWIFT_MT103_USD148500_BCP.pdf',
    fileSize: '450 KB',
    pages: 1,
    status: 'validado',
    confidence: 99.8,
    extractedFieldsCount: 12,
    matchedFieldsCount: 12,
    mismatchCount: 0,
    uploadDate: '2024-11-04 09:35'
  }
];

export const MOCK_INCONSISTENCIES: InconsistencyFinding[] = [
  {
    id: 'inc-01',
    title: 'Discrepancia crítica en Peso Bruto (> 2.5% margen SUNAT)',
    severity: 'bloqueante',
    category: 'Pesos y Bultos',
    description: 'El peso bruto total manifestado en el Bill of Lading difiere sustancialmente del peso total consignado en el Packing List.',
    sunatImpact: 'Supera el 2.5% de tolerancia permitido por el Procedimiento General DESPA-PG.01. Genera asignación inmediata de Canal Rojo, inmovilización preventiva de carga y multa por declaración inexacta (Art. 192 inc. c LGA: 0.1 UIT a 1 UIT).',
    legalBasis: 'Ley General de Aduanas D.Leg. 1053, Art. 192 / Procedimiento Específico DESPA-PE.01.07.',
    toleranceMargin: 'Diferencia: 40.50 kg (2.93% de desviación > 2.50% máx permitido)',
    affectedDocuments: [
      {
        docType: 'Packing List',
        docName: 'PL-2024-8821_TechImports.pdf',
        quotedValue: 'Total Gross Weight: 1,420.50 KGS (85 Palletized Cartons)',
        location: 'Página 2, Cuadro resumen de pesos finales'
      },
      {
        docType: 'Bill of Lading',
        docName: 'MAEU98231019_BL_Master.pdf',
        quotedValue: 'Gross Cargo Weight: 1,380.00 KGS (Declared by Shipper)',
        location: 'Página 1, Casilla 14 (Gross Weight)'
      }
    ],
    resolutionStatus: 'abierto',
    suggestedAction: 'Solicitar rectificación de manifiesto (CSI) a Maersk Line o presentar tique oficial de balanza de APM Terminals Callao como valor definitivo antes de numerar la DAM.'
  },
  {
    id: 'inc-02',
    title: 'Conflicto entre Incoterm CIF y Cláusula de Flete',
    severity: 'bloqueante',
    category: 'Incoterm y Valoración',
    description: 'La Factura Comercial indica condición de venta CIF Callao con flete pagado en origen, mientras que el B/L marítimo estipula flete por cobrar en destino (Freight Collect).',
    sunatImpact: 'Incertidumbre en la Base Imponible CIF. Si SUNAT detecta flete no acreditado, liquidará sobretasa ad-valorem y desconocerá el valor de transacción según Acuerdo de Valor de la OMC (Método 1).',
    legalBasis: 'Reglamento de Valoración de la OMC / D.S. N° 186-99-EF y modificatorias.',
    affectedDocuments: [
      {
        docType: 'Factura Comercial',
        docName: 'INV-2024-SZ8821_TechImports.pdf',
        quotedValue: 'Terms of Delivery: CIF CALLAO (Includes Ocean Freight USD 4,200.00 Prepaid)',
        location: 'Página 1, Encabezado comercial y desglose final'
      },
      {
        docType: 'Bill of Lading',
        docName: 'MAEU98231019_BL_Master.pdf',
        quotedValue: 'Freight & Charges: FREIGHT COLLECT (Payable at destination by consignee)',
        location: 'Página 1, Casilla 17 (Freight Payment Terms)'
      }
    ],
    resolutionStatus: 'abierto',
    suggestedAction: 'Validar si el flete fue abonado en origen y solicitar emisión de B/L Corrector "Freight Prepaid" o corregir factura a condición FOB con factura de flete local.'
  },
  {
    id: 'inc-03',
    title: 'Discrepancia en Razón Social de Consignatario en Certificado de Origen',
    severity: 'advertencia',
    category: 'Datos Fiscales y RUC',
    description: 'El Certificado de Origen omitió el tipo societario "S.A.C." en la razón social del importador peruano.',
    sunatImpact: 'Riesgo de Notificación de Duda Razonable por SUNAT en control concurrente, lo que retrasaría el despacho en 48 a 72 horas exigiendo fianza o carta aclaratoria de la entidad emisora (CCPIT China).',
    legalBasis: 'Capítulo 3 (Reglas de Origen) del Tratado de Libre Comercio Perú - China.',
    affectedDocuments: [
      {
        docType: 'Certificado de Origen',
        docName: 'COO_China_Peru_FTA_SZ2024.pdf',
        quotedValue: 'Consignee: TECHIMPORTS PERU S.A. - RUC 20554921098 (Calle Las Camelias 490)',
        location: 'Página 1, Casilla 2 (Consignee Name & Address)'
      },
      {
        docType: 'Factura Comercial',
        docName: 'INV-2024-SZ8821_TechImports.pdf',
        quotedValue: 'Buyer: TECHIMPORTS PERÚ S.A.C. - RUC 20554921098',
        location: 'Página 1, Casilla Comprador'
      }
    ],
    resolutionStatus: 'abierto',
    suggestedAction: 'El número de RUC coincide exactamente (20554921098). Presentar carta aclaratoria de importador amparada en la Decisión de la Comisión Mixta del TLC sobre errores formales no sustanciales.'
  },
  {
    id: 'inc-04',
    title: 'Validación de Pago Swift MT103 con Factura',
    severity: 'validado',
    category: 'Incoterm y Valoración',
    description: 'El valor total transferido vía SWIFT coincide al 100% con el importe total facturado por el proveedor.',
    sunatImpact: 'Acreditación bancaria fehaciente de medio de pago según Ley N° 28194 (Ley para la Lucha contra la Evasión y para la Formalización de la Economía). Sin contingencia.',
    legalBasis: 'Ley N° 28194, Art. 3, 4 y 5 sobre bancarización de operaciones de comercio exterior.',
    affectedDocuments: [
      {
        docType: 'Swift Bancario',
        docName: 'SWIFT_MT103_USD148500_BCP.pdf',
        quotedValue: 'Field 32A: Value Date 241028 | Currency: USD | Amount: 148,500.00',
        location: 'Campo 32A (Amount & Date)'
      },
      {
        docType: 'Factura Comercial',
        docName: 'INV-2024-SZ8821_TechImports.pdf',
        quotedValue: 'Total Invoice FOB Value: USD 148,500.00',
        location: 'Página 3, Total General'
      }
    ],
    resolutionStatus: 'resuelto',
    suggestedAction: 'Documento conforme. Listo para archivar en Carpeta Electrónica de Despacho SUNAT.'
  },
  {
    id: 'inc-05',
    title: 'Consistencia en Conteo de Bultos y Embalaje',
    severity: 'validado',
    category: 'Pesos y Bultos',
    description: 'La cantidad de bultos (85 pallets termoencogidos) coincide idénticamente entre Packing List y Bill of Lading.',
    sunatImpact: 'Coincidencia física garantizada. No generará observaciones en transmisión electrónica del manifiesto de carga.',
    legalBasis: 'Procedimiento Específico Manifiesto de Carga Marítimo DESPA-PE.09.02.',
    affectedDocuments: [
      {
        docType: 'Packing List',
        docName: 'PL-2024-8821_TechImports.pdf',
        quotedValue: 'Total Packages: 85 Standard Heat-Treated Wooden Pallets',
        location: 'Página 2, Resumen de Bultos'
      },
      {
        docType: 'Bill of Lading',
        docName: 'MAEU98231019_BL_Master.pdf',
        quotedValue: 'No. of Pkgs: 85 PALLETS STC 1,200 CTNS ELECTRONICS',
        location: 'Casilla 12 (Kind of Packages)'
      }
    ],
    resolutionStatus: 'resuelto',
    suggestedAction: 'Conforme.'
  }
];

export const MOCK_TARIFF_ITEMS: TariffItem[] = [
  {
    id: 'item-1',
    itemNumber: 1,
    commercialDescription: 'Laptop Ultrabook Lenovo ThinkPad X1 Carbon Gen 11',
    technicalDescription: 'Máquina automática para tratamiento o procesamiento de datos portátil, peso 1.12 kg, pantalla 14" OLED, procesador Intel Core i7-1365U, 32GB RAM LPDDR5, 1TB SSD NVMe, con WiFi 6E y Bluetooth 5.3',
    quantity: 100,
    unit: 'UNIDAD (NIU)',
    unitValueFob: 820.00,
    totalValueFob: 82000.00,
    netWeightKg: 112.00,
    suggestedNandina: '8471.30.00.00',
    confidence: 98.6,
    status: 'validado',
    adValoremRate: 0,
    igvRate: 16,
    ipmRate: 2,
    percepcionRate: 3.5,
    antidumpingApplies: false,
    restrictedGood: true,
    restrictedEntity: 'MTC',
    tlcCountry: 'China (TLC Perú-China: Arancel 0%)',
    alternativeNandina: [
      {
        code: '8471.41.00.00',
        description: 'Las demás máquinas digitales que incluyan CPU en la misma envoltura',
        reason: 'Solo aplica si no posee teclado y pantalla integrados en un solo cuerpo portátil.',
        adValorem: 0
      }
    ]
  },
  {
    id: 'item-2',
    itemNumber: 2,
    commercialDescription: 'Monitor Gamer Curvo 27" Lenovo Legion QHD 165Hz',
    technicalDescription: 'Monitor de visualización tipo LCD con retroiluminación LED, resolución 2560x1440, curvatura 1500R, entradas DisplayPort 1.4 y HDMI 2.0, uso principal con sistemas de computación',
    quantity: 60,
    unit: 'UNIDAD (NIU)',
    unitValueFob: 210.00,
    totalValueFob: 12600.00,
    netWeightKg: 348.00,
    suggestedNandina: '8528.52.00.00',
    confidence: 94.2,
    status: 'validado',
    adValoremRate: 0,
    igvRate: 16,
    ipmRate: 2,
    percepcionRate: 3.5,
    antidumpingApplies: false,
    restrictedGood: false,
    tlcCountry: 'China (TLC Perú-China: 0%)',
    alternativeNandina: [
      {
        code: '8528.59.00.00',
        description: 'Los demás monitores de visualización no concebidos para computadoras',
        reason: 'Esta subpartida nacional tributa 6% Ad-Valorem si carece de puertos DVI/DP dedicados a PC.',
        adValorem: 6
      }
    ]
  },
  {
    id: 'item-3',
    itemNumber: 3,
    commercialDescription: 'Teclado Mecánico Inalámbrico Retroiluminado RGB',
    technicalDescription: 'Unidad de entrada para máquinas del 84.71, switches mecánicos intercambiables, conectividad dual 2.4GHz + BT, batería recargable de litio integrada',
    quantity: 200,
    unit: 'UNIDAD (NIU)',
    unitValueFob: 45.00,
    totalValueFob: 9000.00,
    netWeightKg: 190.00,
    suggestedNandina: '8471.60.20.00',
    confidence: 96.0,
    status: 'validado',
    adValoremRate: 0,
    igvRate: 16,
    ipmRate: 2,
    percepcionRate: 3.5,
    antidumpingApplies: false,
    restrictedGood: true,
    restrictedEntity: 'MTC',
    tlcCountry: 'China (TLC: 0%)'
  },
  {
    id: 'item-4',
    itemNumber: 4,
    commercialDescription: 'Cables HDMI 2.1 Ultra High Speed 8K 2 Metros',
    technicalDescription: 'Conductores eléctricos aislados para telecomunicaciones, provistos de conectores macho HDMI chapados en oro en ambos extremos, tensión inferior a 80V',
    quantity: 1000,
    unit: 'UNIDAD (NIU)',
    unitValueFob: 5.50,
    totalValueFob: 5500.00,
    netWeightKg: 180.00,
    suggestedNandina: '8544.42.21.00',
    confidence: 88.4,
    status: 'en_revision',
    adValoremRate: 6,
    igvRate: 16,
    ipmRate: 2,
    percepcionRate: 3.5,
    antidumpingApplies: false,
    restrictedGood: false,
    tlcCountry: 'China (TLC Desgravación Categoría C: Tasa preferencial 0% con Certificado Form A)',
    alternativeNandina: [
      {
        code: '8544.42.29.00',
        description: 'Los demás conductores eléctricos provistos de piezas de conexión',
        reason: 'Aplica si el cable no está tipificado expresamente para telecomunicaciones/audio-video.',
        adValorem: 6
      }
    ]
  },
  {
    id: 'item-5',
    itemNumber: 5,
    commercialDescription: 'Fundas Protectoras de Neopreno Acolchadas para Laptop 14"',
    technicalDescription: 'Fundas protectoras tipo sleeve con cierre de cremallera, superficie exterior de materia textil sintética (neopreno laminado), forro polar interior',
    quantity: 400,
    unit: 'UNIDAD (NIU)',
    unitValueFob: 6.80,
    totalValueFob: 2720.00,
    netWeightKg: 88.00,
    suggestedNandina: '4202.92.00.00',
    confidence: 76.5,
    status: 'observado',
    adValoremRate: 11,
    igvRate: 16,
    ipmRate: 2,
    percepcionRate: 3.5,
    antidumpingApplies: false,
    restrictedGood: false,
    tlcCountry: 'China (TLC Exclusión temporal: Requiere verificación rigurosa de regla de origen)',
    alternativeNandina: [
      {
        code: '6307.90.90.00',
        description: 'Los demás artículos textiles confeccionados',
        reason: 'Si no se considera continente o estuche con forma propia según Regla General 5a.',
        adValorem: 11
      }
    ]
  },
  {
    id: 'item-6',
    itemNumber: 6,
    commercialDescription: 'Cargadores Rápidos GaN 65W USB-C Dual Port',
    technicalDescription: 'Convertidores estáticos de energía, rectificadores cargadores con tecnología de Nitruro de Galio (GaN), entrada 100-240V, salida PD 3.0 hasta 65W',
    quantity: 800,
    unit: 'UNIDAD (NIU)',
    unitValueFob: 14.50,
    totalValueFob: 11600.00,
    netWeightKg: 144.00,
    suggestedNandina: '8504.40.90.00',
    confidence: 93.8,
    status: 'validado',
    adValoremRate: 0,
    igvRate: 16,
    ipmRate: 2,
    percepcionRate: 3.5,
    antidumpingApplies: false,
    restrictedGood: false,
    tlcCountry: 'China (TLC: 0%)'
  }
];

export const MOCK_EXTRACTED_FIELDS: ExtractedField[] = [
  {
    id: 'f-1',
    fieldKey: 'invoice_number',
    label: 'N° Factura Comercial',
    documentValue: 'INV-2024-SZ8821',
    normalizedValue: 'INV-2024-SZ8821',
    confidence: 99.8,
    status: 'coincide',
    boundingBox: { page: 1, x: 68, y: 12, width: 24, height: 4 }
  },
  {
    id: 'f-2',
    fieldKey: 'seller_name',
    label: 'Exportador / Proveedor',
    documentValue: 'Shenzhen Yantian Precision Tech Co., Ltd.',
    normalizedValue: 'Shenzhen Yantian Precision Tech Co., Ltd.',
    confidence: 99.4,
    status: 'coincide',
    boundingBox: { page: 1, x: 8, y: 14, width: 45, height: 6 }
  },
  {
    id: 'f-3',
    fieldKey: 'buyer_ruc',
    label: 'RUC Importador Perú',
    documentValue: 'RUC: 20554921098',
    normalizedValue: '20554921098',
    confidence: 99.7,
    status: 'coincide',
    boundingBox: { page: 1, x: 8, y: 22, width: 32, height: 4 }
  },
  {
    id: 'f-4',
    fieldKey: 'incoterm_declared',
    label: 'Incoterm Factura',
    documentValue: 'CIF CALLAO PORT, PERU',
    normalizedValue: 'CIF CALLAO',
    confidence: 98.9,
    status: 'discrepancia',
    boundingBox: { page: 1, x: 55, y: 22, width: 38, height: 5 }
  },
  {
    id: 'f-5',
    fieldKey: 'currency_code',
    label: 'Moneda Transacción',
    documentValue: 'USD - UNITED STATES DOLLARS',
    normalizedValue: 'USD',
    confidence: 99.9,
    status: 'coincide',
    boundingBox: { page: 1, x: 72, y: 28, width: 22, height: 4 }
  },
  {
    id: 'f-6',
    fieldKey: 'total_fob_usd',
    label: 'Total Valor FOB',
    documentValue: '$148,500.00',
    normalizedValue: '148500.00',
    confidence: 99.6,
    status: 'coincide',
    boundingBox: { page: 3, x: 65, y: 82, width: 28, height: 5 }
  },
  {
    id: 'f-7',
    fieldKey: 'freight_amount',
    label: 'Flete Marítimo Declarado',
    documentValue: '$4,200.00 (Prepaid)',
    normalizedValue: '4200.00',
    confidence: 97.2,
    status: 'discrepancia',
    boundingBox: { page: 3, x: 65, y: 88, width: 28, height: 4 }
  },
  {
    id: 'f-8',
    fieldKey: 'total_gross_weight',
    label: 'Peso Bruto Total (Factura)',
    documentValue: '1,420.50 KGS',
    normalizedValue: '1420.50',
    confidence: 98.5,
    status: 'discrepancia',
    boundingBox: { page: 2, x: 60, y: 92, width: 26, height: 4 }
  },
  {
    id: 'f-9',
    fieldKey: 'total_cartons',
    label: 'Bultos / Pallets',
    documentValue: '85 PALLETS (1,200 CARTONS)',
    normalizedValue: '85 PALLETS',
    confidence: 99.1,
    status: 'coincide',
    boundingBox: { page: 2, x: 12, y: 92, width: 34, height: 4 }
  }
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'usr-1',
    name: 'Valeria Mendoza',
    email: 'valeria.m@advalora.pe',
    role: 'Liquidadora Senior',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'Activo',
    operationsCount: 38,
    lastActive: 'En línea ahora'
  },
  {
    id: 'usr-2',
    name: 'Carlos Benites',
    email: 'carlos.b@advalora.pe',
    role: 'Agente de Aduana Principal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'Activo',
    operationsCount: 64,
    lastActive: 'Hace 15 min'
  },
  {
    id: 'usr-3',
    name: 'Lucía Paredes',
    email: 'lucia.p@advalora.pe',
    role: 'Asistente de Despacho',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Activo',
    operationsCount: 19,
    lastActive: 'Hace 2 horas'
  },
  {
    id: 'usr-4',
    name: 'Renato Castillo',
    email: 'compras@techimports.pe',
    role: 'Cliente Importador',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Activo',
    operationsCount: 7,
    lastActive: 'Ayer'
  }
];
