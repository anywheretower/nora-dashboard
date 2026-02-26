---
name: nora-creatividad-calendario
description: Generar creatividades proactivas basadas en efemérides, feriados y fechas comerciales para marcas en NORA. Anticipa necesidades del cliente con creatividades temáticas listas para publicar. Produce creatividades con origen 'calendario' y composición con mucho espacio para texto overlay con mensaje temático de la fecha.
id: nora-creatividad-calendario
---

# Creatividad Calendario — Generación proactiva por efemérides y fechas comerciales

> **Última revisión:** 2026-02-13 20:19 (GMT-3)

## Propósito

Generar creatividades **anticipadas** para fechas relevantes (feriados, efemérides, fechas comerciales) que cada marca puede publicar. La creatividad se genera con origen **calendario** — composición con mucho espacio para texto overlay donde irá el mensaje temático de la fecha, con copy temático propio vinculado a la efeméride.

## Dependencias

### Pipeline de 3 pasos:
1. **Paso 1 — Concepto** (`nora-imagen-concepto`): idea concepto creativo temático vinculado a la fecha
2. **Paso 2 — Esta skill** (calendario): define composición para la efeméride, escribe copy/campos, construye prompt
3. **Paso 3 — Prompt-master** (`nora-prompt-master`): se aplica como validación final — estructura de 6 bloques, frases probadas, negativos, checklist

Flujo: **Fecha → Concepto → Calendario (construye prompt) → Prompt-master (valida/optimiza) → Insertar en Supabase paso 4**

> **Nota**: Los 3 pasos se ejecutan en una sola corrida. No son procesos separados.

## Cuándo se activa

- **Automático**: todos los lunes a las 01:00 hrs — busca en web + tabla `calendario` fechas relevantes para los próximos 15 días. Si encuentra fechas aplicables a alguna marca activa, genera las creatividades correspondientes.
- **Por pedido de Jorge**: cuando Jorge solicita creatividades de calendario para una fecha o marca específica

### Flujo automático (lunes 01:00):
1. Para cada marca activa, determinar su rubro (desde campo `ficha`)
2. Consultar tabla `calendario` filtrando: fechas en los próximos 15 días que apliquen (nacional, rubro de la marca, o marca específica)
3. **Buscar en web** (`web_search`) fechas adicionales del rubro para los próximos 15 días que no estén en la tabla
4. Si encuentra fechas nuevas relevantes, insertarlas en tabla `calendario` para futuro
5. Para cada fecha encontrada: generar 1 creatividad por marca a la que aplique
6. Ejecutar `comfy-text2img.mjs --once` para generar las imágenes

## Idioma de trabajo

Ver `skills/shared/IDIOMA.md` para reglas de idioma español/inglés y `skills/shared/SUPABASE.md` para encoding y conexión. Ver `shared/SCHEMA.md` y `shared/PIPELINE.md` para esquema de tablas y flujo completo.

## Herramientas

- **`web_search`** (Brave API): buscar efemérides relevantes por rubro, confirmar fechas variables (CyberDay, Día de la Madre), descubrir fechas nuevas
- **Tabla `calendario`** en Supabase: fuente principal de fechas con 3 niveles de herencia:
  - `marca=null, rubro=null` → aplica a TODAS las marcas (feriados nacionales)
  - `marca=null, rubro="salud"` → aplica a marcas del rubro
  - `marca="Equos"` → exclusiva de esa marca (aniversario, evento propio)

### Consultar fechas próximas para una marca:
```
calendario?or=(marca.is.null,marca.eq.{marca})&or=(rubro.is.null,rubro.eq.{rubro_marca})&activa=eq.true&order=fecha.asc
```

### Agregar fecha nueva descubierta por web_search:
Insertar en tabla `calendario` con los campos correspondientes. Las fechas de rubro o marca las puede agregar también el cliente desde la plataforma.

## Input

- **marca**: marca objetivo
- **fecha_objetivo**: fecha del evento (MM-DD o YYYY-MM-DD)
- **tipo**: `feriado` | `efemeride` | `comercial` | `rubro` | `marca`
- **nombre_fecha**: nombre del evento (ej: "Día de la Madre", "Fiestas Patrias")

## Output

Creatividad insertada en tabla `creatividades` con:
- `origen`: `"calendario"` (indica que es creatividad proactiva por fecha/efeméride)
- `estado`: `"paso 4"`
- Composición universal: 65-70% espacio libre para texto overlay
- Copy temático alineado a la fecha Y a la marca

## Proceso

### Paso 1: Cargar identidad de marca

Cargar campos de marca desde Supabase (ver shared/SCHEMA.md tabla `marcas`): ficha, arquetipo, paleta_colores, look_and_feel, notas_generales, contenido_prohibido, logos.

### Paso 2: Vincular fecha con marca

Encontrar la conexión natural entre la fecha y el rubro/propuesta de la marca:

| Tipo | Estrategia |
|---|---|
| **Feriado nacional** | Mensaje institucional de celebración + conexión con valores de marca |
| **Fecha comercial** | Oferta/promoción específica o mensaje aspiracional de la marca |
| **Efeméride de rubro** | Posicionamiento como experto, reconocimiento al público del rubro |

**Preguntas guía:**
- ¿Qué significa esta fecha para el buyer persona de la marca?
- ¿Cómo se conecta el servicio/producto con la celebración?
- ¿Qué emoción predomina en esta fecha? (gratitud, orgullo, alegría, reflexión)

### Paso 3: Concepto creativo temático

Usar nora-imagen-concepto con el contexto de la fecha. El concepto debe:
- Ser reconocible como pieza de la fecha (sin necesidad de leer el texto)
- Mantener identidad visual de la marca (paleta, estilo)
- Ser universal en composición: elementos en tercio inferior, 65-70% espacio libre

### Paso 4: Construir prompt

Aplicar reglas de prompt-master con énfasis en:
- Composición tipo universal (mucho espacio para overlay)
- Elementos visuales que evoquen la fecha sin texto
- Paleta de marca integrada con la temática

### Paso 5: Escribir copy temático

Ver **`skills/shared/GUIA-TEXTOS.md`** para la guía completa.

El copy debe:
- **slogan_headline**: Mensaje de la fecha + conexión con marca (ej: "Este 18, brindamos por quienes construyen Chile" para una marca de herramientas en Fiestas Patrias)
- **subtitulo**: Aterrizar en propuesta de valor de la marca vinculada a la fecha
- **cta**: Puede ser más suave en fechas institucionales, más directo en comerciales
- **copy**: 3-5 líneas con tono de celebración/reconocimiento + hashtags de marca + hashtag de la fecha

### Paso 6: Insertar en Supabase

Campos obligatorios:
- `marca`, `estado`: "paso 4", `origen`: "calendario"
- `prompt`: en inglés, composición universal
- `concepto`: incluir referencia a la fecha
- `slogan_headline`, `subtitulo`, `cta`, `copy`: temáticos
- `descripcion_corta`: "Creatividad para [nombre_fecha] — [qué comunica]"
- `gatillador`: "Creatividad proactiva para [nombre_fecha] ([fecha]). [Instrucciones visuales]"
- `logo`: URLs de logos de la marca

Campos de estrategia (`buyer_persona`, `dolor_anhelo`, `cambio_emocional`, `diferenciador`, `beneficios`, `objeciones_tipicas`): dejar **null** — las creatividades de calendario son genéricas por fecha, no segmentadas por persona.

---

## Calendario base Chile (ahora en tabla `calendario` de Supabase)

> Las fechas viven en la tabla `calendario`. Ya no están hardcodeadas aquí. Consultar la tabla para obtener fechas actualizadas. Usar `web_search` periódicamente para descubrir fechas nuevas e insertarlas en la tabla.

### Resumen de lo cargado (33 fechas):

### Feriados nacionales
| Fecha | Nombre | Notas creativas |
|---|---|---|
| 1 enero | Año Nuevo | Renovación, propósitos, inicio fresco |
| Viernes Santo (variable) | Semana Santa | Reflexión, familia, pausa |
| 1 mayo | Día del Trabajo | Reconocimiento al trabajador, esfuerzo, dignidad |
| 21 mayo | Glorias Navales | Orgullo patrio, heroísmo |
| 21 junio | Día Nacional de los Pueblos Indígenas | Diversidad, raíces, cultura |
| 16 julio | Virgen del Carmen | Tradición, devoción |
| 15 agosto | Asunción de la Virgen | Tradición |
| 18-19 septiembre | Fiestas Patrias | Chilenidad, celebración, orgullo, tradición, empanadas y asado |
| 12 octubre | Encuentro de Dos Mundos | Diversidad cultural |
| 31 octubre | Día de las Iglesias Evangélicas | Respeto, comunidad |
| 1 noviembre | Día de Todos los Santos | Memoria, trascendencia |
| 8 diciembre | Inmaculada Concepción | Tradición |
| 25 diciembre | Navidad | Familia, generosidad, gratitud, cierre de año |

### Fechas comerciales clave
| Fecha (aprox) | Nombre | Potencial |
|---|---|---|
| 14 febrero | San Valentín | Alto para marcas B2C, bajo para B2B |
| 2do domingo mayo | Día de la Madre | MUY alto — universal |
| 3er domingo junio | Día del Padre | Alto |
| 1er viernes agosto | Día del Niño | Medio — familias |
| Último viernes noviembre | Black Friday | MUY alto — comercial puro |
| Lunes post-Black Friday | Cyber Monday | Alto — e-commerce |
| Octubre (variable) | CyberDay Chile | Alto — comercial |

### Fechas por rubro

**Salud / Clínicas:**
| Fecha | Nombre |
|---|---|
| 7 abril | Día Mundial de la Salud |
| 6 mayo | Día de la Kinesiología (Chile) |
| 12 mayo | Día Internacional de la Enfermería |
| 1 octubre | Día Internacional de las Personas Mayores |
| 10 octubre | Día Mundial de la Salud Mental |
| Junio (variable) | Día Mundial de la Fisioterapia (8 sept) |

**Seguros / Empresarial / Asesoría:**
| Fecha | Nombre |
|---|---|
| 28 abril | Día de la Seguridad y Salud en el Trabajo |
| 1 mayo | Día del Trabajo (ángulo RRHH/beneficios) |
| 20 mayo | Día del Trabajador del Comercio Exterior |
| Noviembre | Mes de la prevención |

**Industrial / Construcción / Herramientas:**
| Fecha | Nombre |
|---|---|
| 1 mayo | Día del Trabajador (ángulo herramientas/oficio) |
| 15 octubre | Día del Maestro Constructor |
| 4 diciembre | Día de la Minería |
| Fiestas Patrias | Alta demanda de herramientas por proyectos de verano |

**Climatización / Energía:**
| Fecha | Nombre |
|---|---|
| Octubre-noviembre | Inicio temporada calor — alta demanda |
| Marzo-abril | Inicio temporada frío — segunda ola |
| 5 junio | Día Mundial del Medio Ambiente (eficiencia energética) |
| Septiembre | Post-Fiestas Patrias — renovación hogar |

---

## Planificación sugerida

- Generar creatividades **con 7-10 días de anticipación** a la fecha
- Para fechas MUY relevantes (18 sept, Navidad, Día de la Madre): generar **2-3 variantes** por marca
- Para fechas de rubro: generar solo para las marcas del rubro correspondiente
- Mantener un log en `memory/calendario-creativas.md` de qué fechas se cubrieron por marca

## Notas

- Las creatividades de calendario son ADICIONALES al flujo normal — no reemplazan la generación regular
- En fechas institucionales (feriados), el tono es de celebración/reconocimiento, NO de venta agresiva
- En fechas comerciales, el tono puede ser más directo con oferta/promoción
- Siempre mantener la identidad visual de la marca — la fecha es el tema, no el dueño de la pieza
