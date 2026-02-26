---
name: nora-creatividad-original
description: Generar creatividades de imagen 100% originales para marcas en la plataforma NORA, sin imagen de referencia del banco. Usar cuando se necesite crear imágenes para paso 4 del pipeline (texto a imagen vía ComfyUI/Qwen) con conceptos creativos propios. Incluye construcción de prompt desde cero basado en identidad de marca. Aplica para generación individual o en lote.
id: nora-creatividad-original
---

# Creatividad Original — Skill de generación de imágenes sin referencia para NORA

> **Última revisión:** 2026-02-13 20:14 (GMT-3) — revisada, sin cambios necesarios

## Dependencias

### Pipeline de 3 pasos:
1. **Paso 1 — Concepto** (`nora-imagen-concepto`): define la dirección creativa (QUÉ y POR QUÉ)
2. **Paso 2 — Esta skill** (original): construye concepto desde cero, escribe copy/campos, construye prompt
3. **Paso 3 — Prompt-master** (`nora-prompt-master`): se aplica como validación final — estructura de 6 bloques, frases probadas, negativos, checklist

Flujo: **Concepto → Original (construye prompt) → Prompt-master (valida/optimiza) → Insertar en Supabase paso 4**

> **Nota**: Los 3 pasos se ejecutan en una sola corrida. No son procesos separados.

## Cuándo se activa

- **Automático**: todos los domingos a las 23:00 hrs — genera 3 creatividades originales por marca activa
- **Por pedido de Jorge**: cuando Jorge solicita creatividades originales para una marca específica

## Idioma de trabajo

Ver `skills/shared/IDIOMA.md` para reglas de idioma español/inglés y `skills/shared/SUPABASE.md` para encoding y conexión. Ver `shared/SCHEMA.md` y `shared/PIPELINE.md` para esquema de tablas y flujo completo.

## Proceso completo

### Paso 1: Cargar identidad de marca

Cargar campos de marca desde Supabase (ver shared/SCHEMA.md tabla `marcas`): ficha, arquetipo, paleta_colores, look_and_feel, notas_generales, contenido_prohibido, logos.

### Paso 1b: Revisar creatividades anteriores con resultado final

Antes de idear conceptos, consultar las creatividades previas de la marca que **ya están validadas** (campo `condicion` = `resultado_final` o `aprobado`):

```
creatividades?marca=eq.{marca}&condicion=in.(resultado_final,aprobado)&select=id,concepto,slogan_headline,subtitulo,cta,copy
```

De esta revisión extraer:
- **Conceptos ya usados** — para no repetirlos. Comparar no solo el nombre del concepto sino la IDEA VISUAL: si ya existe una creatividad con "persona en entorno X haciendo Y", no crear otra con la misma composición aunque el texto sea distinto. Dos creatividades con la misma metáfora visual = duplicado, aunque los textos difieran.
- **Titulares y CTAs anteriores** — para variar formatos y estructuras (si los anteriores fueron afirmaciones, usar preguntas o declaraciones)
- **Tono editorial previo** — para asegurar diversidad en el contenido global de la marca

**IMPORTANTE:** También consultar creatividades en `paso 4` y `paso 5` (para_revision), no solo las aprobadas. Una creatividad pendiente de revisión ya ocupa ese concepto.

El objetivo es que el feed completo de una marca se vea **diverso, no repetitivo**. Cada pieza debe sentirse fresca aunque comparta identidad visual. Si hay duda sobre si un concepto se parece a uno existente, descartarlo y buscar otro.

### Paso 2: Idear el concepto creativo

Usar el concepto validado por **nora-imagen-concepto** (`skills/nora-imagen-concepto/SKILL.md`). Los 7 motores creativos y la validación de impacto se ejecutan allí.

A diferencia de la skill con referencia, aquí el concepto nace **desde cero** — no hay imagen base del banco. El concepto de nora-imagen-concepto define:
- Qué se ve (elementos visuales principales)
- Qué comunica (mensaje/metáfora)
- Por qué es relevante para esta marca específica

### Paso 3: Construir el prompt

Construir el prompt **desde cero** combinando el concepto con la identidad de marca:

1. **Describir la escena completa** — Todos los elementos visuales del concepto, posiciones, relaciones
2. **Integrar colores de marca** — Colores y degradados de fondo desde `paleta_colores`, escenarios concretos desde `notas_generales`
3. **Aplicar la vibra de marca** — Atmósfera y tensión narrativa desde `look_and_feel`, arquetipo como guía de tono
4. **Verificar contra contenido prohibido**
5. **Aplicar todas las reglas de prompt-master** (`skills/nora-prompt-master/SKILL.md`): estructura de 6 bloques, frases probadas, fondos según paleta, negativos, checklist de validación
6. **Resultado**: prompt en inglés, descriptivo, orientado a imagen

**Importante**: Ver nora-prompt-master para reglas de negativos.

### Paso 4: Insertar en Supabase

Insertar en tabla `creatividades` con **todos** estos campos obligatorios para paso 4:

**Estado y metadata:**
- `marca`: nombre exacto de la marca (texto, FK)
- `estado`: `"paso 4"` (exacto, así lo recoge el pipeline)
- `origen`: `"original"` (indica que se generó sin imagen de referencia)

**Imagen:**
- `prompt`: prompt final en inglés construido en paso 3
- `gatillador`: instrucciones en español de lo que se quiere lograr visualmente (sin URL de referencia)

**Dejar en null:** `url` (no hay imagen de referencia en esta modalidad)

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
2. Revisar creatividades con resultado final (Paso 1b)
3. Idear N conceptos originales diversos
4. Construir N prompts
5. Insertar todos en Supabase
6. Reportar resumen: concepto de cada una, técnica usada, ángulo editorial

## Diferencia con nora-creatividad-referencia

| Aspecto | nora-creatividad-referencia | nora-creatividad-original |
|---------|---------------------------|--------------------------|
| Punto de partida | Imagen del banco de referencia | Concepto propio desde cero |
| Campo `url` | URL de la referencia usada | null |
| Campo `gatillador` | Incluye "Se debe usar esta url:" | Solo descripción del concepto |
| Construcción del prompt | Adapta el prompt base de la referencia | Construye desde cero |
| Cuándo usar | Cuando se quiere partir de una composición/metáfora probada | Cuando se busca originalidad total o el banco no tiene referencias adecuadas |
