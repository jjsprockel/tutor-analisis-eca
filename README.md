# Tutor IA · ECA

**Tutor interactivo de inteligencia artificial para la lectura crítica de ensayos clínicos aleatorizados**

Desarrollado por el laboratorio **ProfundaMente** en colaboración con la Fundación Universitaria de Ciencias de la Salud (FUCS).

---

## Descripción

Tutor IA · ECA es una aplicación web que guía a estudiantes de medicina —internos y residentes— a través del análisis crítico y secuencial de un ensayo clínico aleatorizado (ECA), sección por sección, desde la Introducción hasta la Discusión. El sistema utiliza un modelo de lenguaje de última generación (Google Gemini) para implementar una metodología socrática adaptada: formula una pregunta por turno, evalúa la respuesta del estudiante y avanza progresivamente a través de 18 etapas de análisis estructurado.

La herramienta está alineada con el libro **"Manual para la Lectura Crítica de la Literatura Orientado a Ciencias Clínicas"** de John Sprockel, Editorial FUCS, que constituye el marco metodológico central del sistema.

---

## ProfundaMente

ProfundaMente es un laboratorio de inteligencia artificial aplicada a la salud, articulado con el Instituto de Investigaciones de la FUCS. Su propósito es integrar tecnologías avanzadas de aprendizaje automático y modelos de lenguaje con los procesos formativos y asistenciales en medicina, promoviendo una práctica más rigurosa, analítica y reflexiva.

El laboratorio se enfoca en el diseño de entornos inteligentes que faciliten la comprensión de la literatura científica, el fortalecimiento del razonamiento clínico y la formación de profesionales capaces de interactuar críticamente con la evidencia. Desarrolla herramientas que combinan procesamiento de lenguaje natural, análisis de documentos biomédicos y tutoría adaptativa.

Sitio web institucional: [fucsalud.edu.co](https://www.fucsalud.edu.co)

---

## Autor

**John Sprockel**
Médico internista, docente e investigador — Instituto de Investigaciones, FUCS.

En este proyecto el Dr. Sprockel lideró de forma integral:

- La estructuración conceptual y pedagógica del contenido
- El diseño metodológico del sistema de lectura crítica
- El desarrollo funcional de la plataforma
- La conducción de las pruebas en entornos reales con estudiantes

---

## Funcionalidades

- **Carga y verificación automática de PDF**: el sistema extrae el texto del artículo, verifica que corresponda a un ECA mediante IA y rechaza documentos que no cumplan ese criterio.
- **18 etapas de análisis secuencial**:
  1. Introducción — problema clínico
  2. Objetivo primario
  3. Hipótesis y tipo de diseño (superioridad / no inferioridad / equivalencia)
  4. Aleatorización y ocultación de la secuencia
  5. Cegamiento
  6. Población — criterios de elegibilidad
  7. Desenlaces — desenlace primario y tipo
  8. Análisis estadístico — tamaño de muestra, α, poder estadístico, ITT
  9. Resultados — flujo de pacientes (diagrama CONSORT)
  10. Resultados — características basales
  11. Resultados — medida de asociación (HR / RR / OR) y tasas de eventos por grupo
  12. Resultados — cálculo de RRA, RRR y NNT con interpretación clínica
  13. Resultados — significancia estadística: valor p e IC 95 %
  14. Resultados — figuras (curvas de supervivencia Kaplan-Meier, forest plots)
  15. Resultados — análisis de subgrupos (prespecificados vs. exploratorios)
  16. Resultados — eventos adversos y balance riesgo-beneficio
  17. Discusión y sesgos
  18. Retroalimentación cualitativa final
- **Método socrático**: una pregunta por turno; el avance de etapa es determinista (no depende del AI para decidir cuándo avanzar).
- **Visor de PDF integrado**: el estudiante puede consultar el artículo mientras responde sin salir de la interfaz.
- **Dashboard de estudiante**: historial de sesiones, progreso por etapa, posibilidad de retomar o eliminar sesiones, zona de arrastre de PDF siempre visible.
- **Panel de coordinador**: seguimiento del avance de todos los estudiantes registrados.
- **Autenticación institucional**: solo se aceptan correos con dominio `@fucsalud.edu.co`.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.2.4 (App Router) |
| Lenguaje | TypeScript (modo estricto) |
| Estilos | Tailwind CSS v4 |
| Autenticación | NextAuth v5 beta (JWT, Credentials) |
| ORM | Prisma 7 con driver adapter |
| Base de datos | SQLite (via `better-sqlite3`) |
| IA | Google Gemini `gemini-2.5-flash` |
| Extracción PDF | `pdf-parse` 1.x (Node.js server-side) |
| Iconos | Lucide React |

---

## Requisitos previos

- **Node.js** ≥ 18.x (recomendado 20.x o superior)
- **npm** ≥ 9.x
- Una **clave de API de Google Gemini** (ver sección siguiente)

---

## Obtener la clave de API de Google Gemini

1. Ve a **[Google AI Studio](https://aistudio.google.com/app/apikey)** e inicia sesión con una cuenta de Google.
2. Haz clic en **"Create API key"**.
3. Selecciona un proyecto de Google Cloud existente o crea uno nuevo cuando se solicite.
4. Copia la clave generada — comienza con `AIza...`.
5. Guárdala de forma segura; la usarás en el archivo `.env.local`.

> La clave es gratuita con una cuota generosa para desarrollo. Para uso en producción consulta los límites en [ai.google.dev/pricing](https://ai.google.dev/pricing).

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/jjsprockel/tutor-analisis-eca.git
cd tutor-analisis-eca
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea el archivo `.env.local` en la raíz del proyecto (al mismo nivel que `package.json`):

```bash
touch .env.local
```

Luego ábrelo con cualquier editor de texto y agrega el siguiente contenido, reemplazando los valores indicados:

```env
# ─────────────────────────────────────────────────────────────
# GOOGLE GEMINI — Clave de la API de inteligencia artificial
# Obtener en: https://aistudio.google.com/app/apikey
# ─────────────────────────────────────────────────────────────
GEMINI_API_KEY=AIzaSy_REEMPLAZA_CON_TU_CLAVE

# ─────────────────────────────────────────────────────────────
# NEXTAUTH — Secreto para firmar tokens de sesión JWT
# Genera uno seguro ejecutando en la terminal:
#   openssl rand -base64 32
# ─────────────────────────────────────────────────────────────
NEXTAUTH_SECRET=REEMPLAZA_CON_UN_SECRETO_ALEATORIO

# ─────────────────────────────────────────────────────────────
# URL base de la aplicación (no cambiar en desarrollo local)
# ─────────────────────────────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000

# ─────────────────────────────────────────────────────────────
# Base de datos SQLite (el archivo se crea automáticamente)
# ─────────────────────────────────────────────────────────────
DATABASE_URL="file:./dev.db"
```

#### Referencia de variables

| Variable | Descripción | Cómo obtenerla |
|----------|-------------|----------------|
| `GEMINI_API_KEY` | Clave para acceder a Google Gemini | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| `NEXTAUTH_SECRET` | Secreto para firmar y verificar tokens JWT | Ejecuta `openssl rand -base64 32` en la terminal |
| `NEXTAUTH_URL` | URL base; NextAuth la usa para redirecciones | `http://localhost:3000` en desarrollo |
| `DATABASE_URL` | Ruta al archivo SQLite | Dejar el valor por defecto para desarrollo local |

### 4. Inicializar la base de datos

```bash
npx prisma migrate deploy
```

Esto crea el archivo `dev.db` con todas las tablas necesarias. Solo se ejecuta una vez.

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 6. Crear usuarios de prueba

Regístralos desde la pantalla `/registro` con las siguientes credenciales:

| Rol | Correo | Contraseña |
|-----|--------|-----------|
| Estudiante | `estudiante@fucsalud.edu.co` | `test1234` |
| Coordinador | `coordinador@fucsalud.edu.co` | `test1234` |

Estos usuarios de prueba aparecen en la pantalla de login para facilitar el acceso rápido durante el desarrollo.

---

## Estructura del proyecto

```
tutor-eca/
├── app/                        # Páginas y rutas (Next.js App Router)
│   ├── acerca/                 # Página pública "Acerca de"
│   ├── quienes-somos/          # Página pública del laboratorio ProfundaMente
│   ├── analisis/[id]/          # Interfaz de análisis (chat + visor de PDF)
│   ├── dashboard/              # Dashboard del estudiante
│   ├── coordinador/            # Panel de seguimiento del coordinador
│   ├── login/                  # Autenticación
│   ├── registro/               # Registro de nuevos usuarios
│   └── api/                    # Endpoints REST
│       ├── articulo/           # Carga y verificación de PDF
│       ├── sesion/             # Gestión de sesiones y mensajes del tutor
│       └── dashboard/          # Datos para los paneles de estadísticas
├── lib/
│   ├── ai/
│   │   ├── geminiClient.ts     # Integración con Google Gemini
│   │   └── rctTutorPrompt.ts   # Definición de las 18 etapas y prompts
│   ├── db/prisma.ts            # Cliente Prisma singleton
│   └── pdf/pdfProcessor.ts     # Extracción de texto de PDF
├── prisma/
│   ├── schema.prisma           # Esquema de la base de datos
│   └── migrations/             # Migraciones SQL
├── public/                     # Recursos estáticos
├── auth.config.ts              # Configuración de NextAuth (edge-compatible)
└── auth.ts                     # Instancia de NextAuth con adaptador Prisma
```

---

## Comandos útiles

```bash
# Servidor de desarrollo con recarga automática
npm run dev

# Construir para producción
npm run build

# Iniciar en modo producción (requiere build previo)
npm start

# Abrir Prisma Studio — interfaz visual de la base de datos
npx prisma studio

# Borrar todos los datos y reiniciar la base de datos
npx prisma migrate reset

# Regenerar el cliente de Prisma tras cambios en el esquema
npx prisma generate
```

---

## Notas para producción

- Reemplaza `DATABASE_URL` por una base de datos PostgreSQL o MySQL para soportar múltiples usuarios concurrentes.
- Ajusta `NEXTAUTH_URL` a la URL pública del servidor.
- Asegúrate de que `NEXTAUTH_SECRET` sea un valor fuerte y mantenlo estrictamente privado.
- El directorio `uploads/` almacena los PDFs subidos temporalmente; configura su limpieza periódica o integra almacenamiento en la nube (AWS S3, Google Cloud Storage).

---

## Licencia

Uso académico e institucional — Fundación Universitaria de Ciencias de la Salud (FUCS) · Laboratorio ProfundaMente.
