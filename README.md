# Advalora - Plataforma de Consistencia Documental Aduanera & Pre-DAM (SUNAT)

Plataforma especializada de inteligencia aduanera para agencias de aduana, liquidadores colegiados e importadores en Perú (Callao - Lima). Permite realizar el cruce exhaustivo de expedientes de importación definitiva (Despacho 10), clasificar partidas arancelarias NANDINA a 10 dígitos, proyectar canales de control SUNAT (Verde / Naranja / Rojo) y generar la Pre-DAM antes de la numeración oficial.

---

## 🚀 Características Principales

1. **Dashboard de Operaciones Aduaneras**: Monitoreo de tráficos marítimos y aéreos, alertas de severidad, ahorro arancelario por TLC (TLC China / Form A) y control de levante en puerto Callao.
2. **Wizard de Carga Multidocumental**: Carga y cotejo de Factura Comercial, Packing List, Bill of Lading (B/L), Certificado de Origen y Transferencia SWIFT.
3. **Extracción OCR Inteligente**: Visor split-screen con resaltado bidireccional entre metadatos y documentos fuente.
4. **Matriz de Consistencia Documental (Corazón del Producto)**:
   - Detección de discrepancias bloqueantes (ej. peso bruto con tolerancia > 2.5% según `DESPA-PG.01`).
   - Inconsistencias de Incoterms y condición de flete (*Prepaid* vs *Collect*).
   - Flujo interactivo de subsanación (tique de balanza APM Terminals / carta de corrección marítima Maersk).
5. **Clasificador Arancelario NANDINA**:
   - Asignación de subpartidas a 10 dígitos según el Arancel de Aduanas de Perú (D.S. N° 404-2021-EF).
   - Notas Explicativas de la OMA integradas textualmente.
   - Identificación de mercancías restringidas (permisos MTC para equipos con WiFi/Bluetooth, DIGESA, DIGEMID).
6. **Simulador de Tributos Aduaneros**:
   - Liquidación de Base CIF, Ad-Valorem, IGV (16%), IPM (2%) y Régimen de Percepción SUNAT en USD y Soles (PEN).
7. **Reporte Pre-DAM & Compartir**:
   - Dossier oficial con sello aduanero digital y código QR de validación.
   - Exportación a PDF y Excel.
   - Enlace colaborativo para revisión y visto bueno del cliente importador.
8. **Configuración de Agencia**:
   - Control de roles aduaneros (Agente Principal, Liquidador Senior, Asistente, Cliente).
   - Facturación electrónica con RUC y clave SOL.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Bundler & Dev Server**: Vite
- **Estilos**: Tailwind CSS con paleta institucional aduanera (Azul Medianoche `#0B1F3A`, Turquesa `#00E5B0`, Amarillo `#FFD600`, Coral `#FF5A5F`)
- **Iconografía**: Lucide React
- **Micro-interacciones**: Canvas Confetti

---

## 💻 Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/advalora-customs-ai.git
cd advalora-customs-ai
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000` (o el puerto configurado por Vite).

### 4. Compilar para producción
```bash
npm run build
```

---

## 📁 Estructura del Proyecto

```
├── public/                 # Recursos estáticos
├── src/
│   ├── components/
│   │   ├── common/         # Sellos aduaneros, badges y decoraciones
│   │   ├── screens/        # Las 9 pantallas funcionales del flujo aduanero
│   │   │   ├── Screen1LoginOnboarding.tsx
│   │   │   ├── Screen2Dashboard.tsx
│   │   │   ├── Screen3Wizard.tsx
│   │   │   ├── Screen4DataExtraction.tsx
│   │   │   ├── Screen5ConsistencyMatrix.tsx  # Pantalla Estrella
│   │   │   ├── Screen6TariffClassifier.tsx
│   │   │   ├── Screen7TariffDetail.tsx
│   │   │   ├── Screen8ReportShare.tsx
│   │   │   └── Screen9Settings.tsx
│   │   └── Navigation.tsx  # Barra de navegación principal y conmutador
│   ├── data/
│   │   └── mockData.ts     # Datos aduaneros del Callao (embarques, partidas, reglas)
│   ├── types.ts            # Tipos de TypeScript para despachos y tributos
│   ├── App.tsx             # Orquestador de estados y flujo
│   ├── main.tsx            # Punto de entrada
│   └── index.css           # Configuración de Tailwind CSS
├── metadata.json           # Metadatos de la aplicación
├── package.json
└── vite.config.ts
```

---

## ⚖️ Licencia
Apache-2.0
