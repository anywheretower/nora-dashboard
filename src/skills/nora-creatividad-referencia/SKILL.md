---
name: nora-creatividad-referencia
description: Generar creatividades de imagen para marcas en la plataforma NORA. Usar cuando se necesite crear imágenes para paso 4 del pipeline (texto a imagen vía ComfyUI/Qwen). Incluye selección de imagen de referencia del banco, adaptación a identidad de marca, y construcción de prompt. Aplica para generación individual o en lote de creatividades visuales.
id: nora-creatividad-referencia
---

# Creatividad con Referencia — Skill de generación de imágenes para NORA

> **Última revisión:** 2026-02-13 20:14 (GMT-3) — revisada, sin cambios necesarios

## Dependencias

### Pipeline de 3 pasos:
1. **Paso 1 — Concepto** (`nora-imagen-concepto`): define la dirección creativa (QUÉ y POR QUÉ)
2. **Paso 2 — Esta skill** (referencia): elige referencia del banco, escribe copy/campos, construye prompt
3. **Paso 3 — Prompt-master** (`nora-prompt-master`): se aplica como validación final — estructura de 6 bloques, frases probadas, negativos, checklist

Flujo: **Concepto → Referencia (construye prompt) → Prompt-master (valida/optimiza) → Insertar en Supabase paso 4**

> **Nota**: Los 3 pasos se ejecutan en una sola corrida. No son procesos separados.

## Idioma de trabajo

Ver `skills/shared/IDIOMA.md` para reglas de idioma español/inglés y `skills/shared/SUPABASE.md` para encoding y conexión. Ver `shared/SCHEMA.md` y `shared/PIPELINE.md` para esquema de tablas y flujo completo.

## Cuándo se activa

- **Automático**: todos los domingos a las 21:00 hrs — genera 4 creatividades por marca activa usando referencias que la marca NO haya usado antes
- **Por pedido de Jorge**: cuando Jorge solicita creatividades de referencia para una marca específica

En modo automático (domingos 21:00):
1. Para cada marca activa, consultar qué referencias ya se usaron (campo `url` en creatividades de la marca con `origen=referencia`)
2. Seleccionar 3 referencias del banco que la marca NO haya usado
3. Generar 3 creatividades completas (concepto → prompt → inserción)

## Proceso completo

### Paso 1: Cargar identidad de marca

Cargar campos de marca desde Supabase (ver shared/SCHEMA.md tabla `marcas`): ficha, arquetipo, paleta_colores, look_and_feel, notas_generales, contenido_prohibido, logos.

### Paso 1b: Revisar creatividades anteriores con resultado final

Antes de seleccionar referencias, consultar las creatividades previas de la marca que **ya están validadas** (campo `condicion` = `resultado_final` o `aprobado`):

```
creatividades?marca=eq.{marca}&condicion=in.(resultado_final,aprobado)&select=id,concepto,slogan_headline,subtitulo,cta,copy
```

De esta revisión extraer:
- **Conceptos ya usados** — para no repetirlos, o si se repite un territorio temático, darle un ángulo visual y editorial completamente distinto
- **Titulares y CTAs anteriores** — para variar formatos y estructuras (si los anteriores fueron afirmaciones, usar preguntas o declaraciones)
- **Tono editorial previo** — para asegurar diversidad en el contenido global de la marca

El objetivo es que el feed completo de una marca se vea **diverso, no repetitivo**. Cada pieza debe sentirse fresca aunque comparta identidad visual.

### Paso 2: Seleccionar imagen de referencia

Del banco de imágenes (tabla `referencia`, ~130+ imágenes de anuncios ganadores), elegir una imagen aplicando **uno de estos 3 criterios**:

1. **Pertinencia** — La imagen es altamente relevante al rubro o mensaje de la marca. Es la opción más directa y óptima.
2. **Novedad** — La marca nunca ha usado esta referencia. Priorizar imágenes no utilizadas revisando creatividades previas de la marca.
3. **Creatividad** — La imagen está fuera de lo convencional para el rubro. Buscar conexiones inesperadas entre la referencia y la marca para generar impacto visual.

**Equilibrio**: Mezclar los 3 criterios a lo largo de las creatividades de una marca. No siempre lo seguro, no siempre lo arriesgado.

Para seleccionar, usar los campos `summary` y `prompt` de cada referencia para evaluar compatibilidad sin necesidad de ver la imagen.

### Paso 3: Construir el prompt

Combinar la imagen de referencia con la identidad de marca:

1. **Partir del prompt base** de la referencia (`referencia.prompt`)
2. **Adaptar a la marca**: integrar paleta, look & feel, arquetipo, elementos del rubro
3. **Verificar contra contenido prohibido**
4. **Aplicar todas las reglas de prompt-master** (`skills/nora-prompt-master/SKILL.md`): estructura de 6 bloques, frases probadas, fondos según paleta, negativos, checklist de validación
5. **Diversidad**: Aunque el prompt parte de la referencia, el fondo/escenario puede adaptarse. Colores de fondo desde `paleta_colores`, escenarios concretos desde `notas_generales`. Rotar para no repetir siempre el mismo ambiente.
6. **Resultado**: prompt en inglés, descriptivo, orientado a imagen

**Importante**: Ver nora-prompt-master para reglas de negativos.

### Paso 4: Insertar en Supabase

Insertar en tabla `creatividades` con **todos** estos campos obligatorios para paso 4:

**Estado y metadata:**
- `marca`: nombre exacto de la marca (texto, FK)
- `estado`: `"paso 4"` (exacto, así lo recoge el pipeline)
- `origen`: `"referencia"` (indica que se generó a partir de una imagen del banco)

**Imagen:**
- `prompt`: prompt final en inglés construido en paso 3
- `url`: URL de la imagen de referencia usada — puede ser Supabase Storage o Google Drive (campo `url` de tabla `referencia`)
- `gatillador`: instrucciones en español de lo que se quiere lograr + `"Se debe usar esta url: {url_referencia}"` (la URL será de Supabase Storage o Google Drive según la referencia)

**Concepto y copy:**
- `concepto`: descripción breve del concepto creativo (1-2 líneas)
- `slogan_headline`: ver **Guía de textos creativos** más abajo
- `subtitulo`: ver **Guía de textos creativos** más abajo
- `cta`: ver **Guía de textos creativos** más abajo
- `copy`: ver **Guía de textos creativos** más abajo
- `descripcion_corta`: qué comunica la creatividad y por qué

### Guía de textos creativos (slogan_headline, subtitulo, cta, copy)

Ver **`skills/shared/GUIA-TEXTOS.md`** para la guía completa: principios, campo por campo, diversidad editorial y validación de tono contra segmento.

**Estrategia** (extraer de la ficha de marca y adaptar a esta creatividad específica):
- `buyer_persona`: perfil del público objetivo al que apunta esta pieza
- `dolor_anhelo`: pain point + deseo del cliente que esta creatividad aborda
- `cambio_emocional`: transformación emocional "De X → a Y"
- `diferenciador`: qué hace diferente a la marca (relevante para esta pieza)
- `beneficios`: beneficios clave que comunica esta creatividad
- `objeciones_tipicas`: objeciones que esta pieza responde

**Assets:**
- `logo`: URLs de logos de la marca separados por `|` (copiar de tabla `marcas` campo `logos`)

**Dejar en null:** `link_ren_1`, `link_ren_2`, `condicion`, `observacion` (se llenan después por el pipeline o revisión).

### Paso 5: Validar

- Confirmar que el registro se insertó correctamente
- Verificar que no se violó contenido prohibido
- El pipeline n8n + ComfyUI procesará la imagen automáticamente

## Generación en lote

Para múltiples creatividades:
1. Cargar identidad de marca una vez (Paso 1)
2. Seleccionar N referencias distintas variando entre los 3 criterios
3. Construir N prompts
4. Insertar todos en Supabase
5. Reportar resumen: referencias usadas, criterio aplicado, concepto de cada una

## Etiquetas de referencia

La tabla `referencia` tiene columna `etiquetas` con tags por imagen. Usarlas para acelerar la selección:

- **Por composición**: cenital, diagonal, wide-angle, close-up, plano-bajo, regla-tercios, simetría
- **Por técnica**: fotomontaje, render-3d, fotografía-realista, minimalista, surrealista
- **Por sujeto**: persona-sola, grupo, familia, profesional, niños, objeto-hero
- **Por emoción/tema**: metáfora-visual, protección, progreso, conexión, libertad, bienestar, creatividad
- **Por afinidad de rubro**: apto-salud, apto-herramientas, apto-transporte, apto-energía, apto-inmobiliaria, apto-asesoría
- **Desplazamiento**: `desplazamiento-alto` marca imágenes con potencial cross-rubro

Filtrar con `etiquetas=like.*{tag}*` para encontrar candidatas rápidamente. Combinar con los 3 criterios de selección (pertinencia, novedad, creatividad).
