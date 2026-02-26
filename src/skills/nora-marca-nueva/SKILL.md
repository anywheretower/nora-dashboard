---
name: nora-marca-nueva
description: Onboarding rápido de marca nueva. Investiga por cuenta propia, llena vacíos con criterio profesional, entrega una V1 lista para generar creatividades. Filosofía: arrancar, no quedar entrampados.
id: nora-marca-nueva
---

# Marca Nueva — Onboarding rápido para NORA

> **Última revisión:** 2026-02-23 00:31 CLT

## Filosofía

**El objetivo es ARRANCAR.** No quedar entrampados esperando información perfecta. Una marca necesita lo mínimo para que las skills de generación (referencia, original, universal, producto) puedan hacer creatividades con calidad profesional.

La info de marca en NORA es **general** — no necesitamos un brandbook de 50 páginas. Necesitamos lo suficiente para que un prompt genere algo profesional y coherente. Lo que falte se refina después con **nora-mejora-marca** una vez haya creatividades aprobadas.

## Cuándo se activa

- **Cuando entra una marca nueva** a la plataforma
- **Cuando Jorge lo pide**, suministrando uno o varios insumos (nombre, web, brandbook, logos, etc.)

## Dos escenarios de entrada

| Escenario | Input | Qué hacer |
|---|---|---|
| **A. Cliente envía material** | Brandbook, logos, colores, briefing | Extraer todo de ahí, completar vacíos |
| **B. Solo nombre + web/redes** | Nombre de marca + URL | Investigar TODO por cuenta propia |

**En ambos casos**: la skill debe entregar una V1 completa lista para generar. Nunca dejar campos vacíos — si falta info, llenar con criterio profesional pertinente al rubro.

## Idioma

Todo en **español** con ortografía impecable.

Ver `shared/SCHEMA.md` para esquema de tablas. Ver `shared/PIPELINE.md` para el flujo de creatividades.

---

## Fuentes de investigación

Antes de escribir cualquier campo, recopilar información de todas las fuentes disponibles:

### Fuentes primarias (del cliente)
- Conversación directa con Jorge sobre la marca
- Documentos, PDFs, briefings proporcionados
- Logos e imágenes de marca existentes
- Manual de marca / brandbook si existe
- Redes sociales de la marca (links proporcionados)

### Fuentes secundarias (investigación propia con herramientas)
- **`web_search`** (Brave API): buscar "{marca} + {rubro}", "{marca} Chile", competidores del rubro
- **`web_fetch`**: leer sitio web completo de la marca (extraer colores, tono, servicios, público)
- **Redes sociales** (`web_fetch` en perfiles públicos): Instagram, Facebook, LinkedIn — tono, estilo visual, tipo de contenido
- **Competencia**: `web_search` para identificar 2-3 competidores y entender diferenciadores

> **Herramientas disponibles**: `web_search` para búsquedas, `web_fetch` para leer páginas, `image` para analizar logos/screenshots si necesario.

### Registro de fuentes
Documentar en `memory/marcas/{marca}-onboarding.md`:
- Qué fuentes se consultaron
- Qué información se extrajo de cada una
- Qué quedó pendiente / no disponible

---

## Proceso completo

### Paso 1: Verificar que la marca NO existe

```
marcas?marca=eq.{marca}&select=id,marca
```

Si devuelve resultados → ABORTAR. La marca ya existe, usar **nora-ficha-marca** o **nora-mejora-marca**.

### Paso 2: Recopilar insumos

Preguntar a Jorge (si no los proporcionó ya):
- Nombre exacto de la marca
- Rubro / industria
- Sitio web
- Redes sociales (URLs)
- Logos (archivos o URLs)
- Cualquier material de marca existente (brandbook, presentaciones, etc.)
- Público objetivo principal
- Qué quiere comunicar / qué problema resuelve

Investigar por cuenta propia:
- Navegar sitio web con `web_fetch`
- Buscar la marca en web con `web_search`
- Revisar redes sociales si hay URLs

### Paso 3: Construir la FICHA

Seguir la estructura estándar de 13 secciones definida en **nora-ficha-marca**:

1. **Identidad** — nombre, web, slogan, descripción corta
2. **Elevator Pitch** — 3-5 líneas
3. **Propuesta de Valor** — segmento, propuesta, diferenciadores
4. **Productos y Servicios** — catálogo organizado
5. **Problema del Cliente** — 3 dolores con verbatim
6. **Solución y Transformación** — antes/después
7. **Beneficios Clave** — tangibles e intangibles
8. **Públicos Objetivo** — segmentos con perfil y necesidad
9. **CTAs** — 6-10 variados
10. **Infraestructura y Canales** — físicos y digitales
11. **Valores y Cultura** — 3-5 valores con contexto
12. **Misión y Visión** — proponer si el cliente no tiene
13. **Metadata Operativa** — datos duros

Marcar `[pendiente — requiere insumo del cliente]` lo que no se pueda completar con la información disponible.

### Paso 4: Construir el ARQUETIPO

Seguir la estructura de 5 bloques definida en **nora-ficha-marca**:

- **A. Arquetipo y Justificación** — cuál, por qué, cuáles se descartaron
- **B. Manifestación en Tono de Voz** — tabla con 5-8 situaciones (SÍ vs NO)
- **C. Personalidad de Marca** — 5 rasgos con límites
- **D. Territorios de Contenido** — 5-7 territorios temáticos
- **E. Lo que la Marca NUNCA Dice** — 5-8 prohibiciones de tono

El arquetipo debe estar **aterrizado al rubro específico**, no ser genérico de manual.

### Paso 5: Construir PALETA_COLORES

**Principio: partir a la segura.** Los colores base se extraen de lo que exista (logo, web, material). Los fondos y degradados arrancan neutros y profesionales.

Si hay material del cliente → extraer hex exactos del logo/web.
Si solo hay web/redes → usar eyedropper en screenshots.
Si no hay nada → proponer paleta coherente con el rubro y arquetipo.

```
Colores base (extraídos del logo/web):
- [Color 1] [hex]: Rol principal (dominante en logo)
- [Color 2] [hex]: Rol secundario
- [Color 3] [hex]: Acento (si existe)

Fondos neutros (SIEMPRE incluir estos como base segura):
- Fondo claro: blanco puro #FFFFFF o gris muy claro #F5F5F5
- Fondo oscuro: gris grafito #2A2A2A o navy profundo #1A1A2E
- Degradado claro: #F8F9FA → #E9ECEF (centro → bordes)
- Degradado oscuro: #2A2A2A → #1A1A1A (centro → bordes)

Fondos con identidad (basados en colores de marca):
- [Variante clara del color principal] para fondos diurnos
- [Variante oscura del color principal] para fondos nocturnos/premium

Temperatura general: [fría/cálida/mixta]
Balance de blancos: daylight 5600K
```

**Los fondos neutros son la red de seguridad** — funcionan para cualquier marca mientras se refinan los fondos con identidad.

### Paso 6: Construir LOOK_AND_FEEL

Estructura (ver detalle en **nora-mejora-marca** §5b):

```
[Descripción de la estética general — 2-3 líneas]

Equilibrio central: [dos fuerzas que se balancean]

Tensión narrativa central:
- Sin el producto/servicio: [qué se ve/siente]
- Con el producto/servicio: [qué se ve/siente]

Atmósfera:
- Iluminación dominante
- Nivel de dramatismo
- Sensación general

Narrativas que funcionan:
- [Tipos de narrativa recomendados para esta marca]
```

### Paso 7: Construir NOTAS_GENERALES

Estructura (ver detalle en **nora-mejora-marca** §5c):

```
Personas:
- [Reglas de etnia, vestimenta, poses, cantidad]

Equipamiento/objetos del rubro:
- [Forma, realismo, colores, integración]

Iconografía:
- [Estilo: 3D/flat/realista, colores, acabado]

Escenarios y fondos detallados:
- [Mínimo 10 escenarios concretos con descripción técnica]
- [Nombre descriptivo + qué se ve + cuándo usar]

Registros visuales:
- [Nombrar cada estilo visual que aplica a la marca]

Iluminación y fotografía:
- [Balance, tipo de luz, profundidad de campo]

Composición:
- [Espacio negativo, regla de tercios, repetición]

Ángulos de cámara y encuadres:
- [Catálogo de ángulos recomendados]

Tipos de sujeto:
- [Catálogo de protagonistas posibles]

Regla de rotación:
- No repetir registro, fondo, ángulo ni sujeto en creatividades consecutivas
```

**MÍNIMO 10 ESCENARIOS** pertinentes al rubro. No tienen que ser perfectos — son punto de partida. Se refinan con nora-mejora-marca después de las primeras creatividades aprobadas.

**Estrategia para escenarios sin info**: pensar en los contextos naturales donde el producto/servicio vive. Ej: consultora → oficina moderna, sala de reuniones, café de negocios. Transporte → terminal, carretera, interior de vehículo. Salud → consultorio luminoso, sala de espera, exterior jardín clínica.

### Paso 8: Construir CONTENIDO_PROHIBIDO

Formato separado por `|`:

```
[Prohibición 1] | [Prohibición 2] | [Prohibición 3] | ...
```

Incluir:
- Prohibiciones de contenido (comparar con competidores, promesas imposibles, etc.)
- Prohibiciones visuales (reflejos espejo, bordes de estudio, soportes de sinfín, etc.)
- Prohibiciones de tono (derivadas del arquetipo bloque E)
- Prohibiciones específicas del rubro

### Paso 9: Preparar LOGOS

- Si Jorge proporciona archivos → subir a Supabase Storage en `creatividades/{marca}/logos/`
- Registrar URLs resultantes
- Formato esperado: logo principal, logo blanco/invertido si existe

### Paso 10: Definir TIPOGRAFÍA

- Extraer del brandbook o sitio web
- Si no hay info, proponer basándose en el arquetipo y rubro
- Formato: fuente principal (títulos), fuente secundaria (cuerpo), pesos

---

## Checklist de campos mínimos antes de insertar

Antes de insertar en Supabase, verificar que TODOS estos campos están completos:

| # | Campo | Requisito mínimo | ✓ |
|---|---|---|---|
| 1 | `marca` | Nombre exacto definido | ☐ |
| 2 | `ficha` | Mínimo secciones 1-6 completas, resto puede tener [pendiente] | ☐ |
| 3 | `arquetipo` | Los 5 bloques (A-E) completos | ☐ |
| 4 | `paleta_colores` | Al menos 3 colores con hex + combinaciones de fondo | ☐ |
| 5 | `look_and_feel` | Equilibrio central + atmósfera + narrativas | ☐ |
| 6 | `notas_generales` | Mínimo 10 escenarios + registros visuales + ángulos | ☐ |
| 7 | `contenido_prohibido` | Mínimo 8 prohibiciones (contenido + visuales) | ☐ |
| 8 | `logos` | Al menos 1 URL de logo subido a Storage | ☐ |
| 9 | `tipografia` | Al menos fuente principal definida | ☐ |
| 10 | `activa` | `true` | ☐ |

**NUNCA dejar campos vacíos (excepto logos/tipografía si no hay archivos).** Si falta información, llenar con criterio profesional pertinente al rubro. Mejor una V1 imperfecta que funcione que un registro incompleto que bloquee la generación.

**Logos y tipografía (8-9)**: Se puede insertar sin estos si el cliente no proporcionó archivos. Advertir a Jorge y completar después.

---

## Paso 11: Presentar a Jorge para validación

**NUNCA insertar sin aprobación.** Presentar:

1. Resumen ejecutivo de la marca (2-3 líneas)
2. Ficha completa
3. Arquetipo completo
4. Los 4 campos visuales (paleta, look_and_feel, notas, prohibido)
5. Logos y tipografía
6. Checklist de campos completados
7. Lista de [pendientes] que requieren insumo

Esperar confirmación explícita de Jorge.

### Paso 12: Insertar en Supabase

Usar Node.js para preservar UTF-8:

```javascript
// POST a tabla marcas
const body = {
  marca: "<nombre>",
  ficha: "<ficha completa>",
  arquetipo: "<arquetipo completo>",
  paleta_colores: "<paleta>",
  look_and_feel: "<look and feel>",
  notas_generales: "<notas>",
  contenido_prohibido: "<prohibido>",
  logos: "<urls de logos>",
  tipografia: "<tipografía>",
  activa: true
};

const res = await fetch(`${SUPABASE_URL}/rest/v1/marcas`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'apikey': SERVICE_ROLE_KEY,
    'Prefer': 'return=representation'
  },
  body: JSON.stringify(body)
});
```

### Paso 13: Confirmar inserción

Verificar que el registro se creó correctamente:

```
marcas?marca=eq.{marca}&select=id,marca,activa
```

Confirmar a Jorge: marca creada con ID #{id}, activa y lista para generar creatividades.

---

## Notas importantes

- **Investigar primero, preguntar después**: Agotar web, redes y material disponible antes de preguntar a Jorge. Llegar con una propuesta, no con preguntas.
- **Llenar vacíos con criterio profesional**: Si no hay info, proponer algo pertinente al rubro. Fondos neutros, escenarios lógicos del rubro, prohibiciones de sentido común. Mejor arrancar que esperar.
- **V1, no versión final**: Todo lo visual (paleta, look_and_feel, notas, prohibido) es propuesta inicial que se refina con **nora-mejora-marca** después de 10+ creatividades aprobadas. No buscar perfección, buscar funcionalidad.
- **Calidad profesional siempre**: Que sea V1 no significa descuidado. Ortografía impecable, estructura completa, campos coherentes entre sí.
- **Una vez creada → a generar**: La marca queda lista inmediatamente para el pipeline de creatividades (referencia, original, universal, requerida, producto).
- **Encoding**: Usar Node.js para la inserción (preservar UTF-8). Ver `shared/SCHEMA.md`.
