---
name: nora-imagen-observacion
description: Resolver observaciones en creatividades de IMAGEN de NORA. Detecta creatividades con observación pendiente, interpreta la corrección solicitada (imagen, textos o ambos). Si requiere nueva imagen, DUPLICA la creatividad con prompt corregido y deja en "paso 4". Si solo requiere corrección de textos, modifica directamente sin duplicar. La original queda con condición "observacion_resuelta". Para video ver nora-video-observacion.
id: nora-imagen-observacion
---

# Resolución de Observaciones de Imagen — Skill de corrección de creatividades de imagen para NORA

> ⚠️ **REGLA FUNDAMENTAL: NUNCA sobrescribir la creatividad original.** Siempre DUPLICAR: crear nueva entrada con el prompt corregido y marcar la original como `observacion_resuelta`. Esto preserva el historial para comparación antes/después.

> **Última revisión:** 2026-02-23 01:30 CLT

## Cuándo se activa

- **Automático**: todos los días a las 03:00 hrs — revisa creatividades con `condicion=observado` y genera 2 versiones nuevas por cada observación
- **Por pedido de Jorge**: cuando Jorge solicita resolver observaciones específicas

## Dependencia

Al modificar prompts, consultar **nora-prompt-master** (`skills/nora-prompt-master/SKILL.md`) para frases probadas, negativos obligatorios y checklist de validación.

## Idioma de trabajo

Ver `skills/shared/IDIOMA.md` para reglas de idioma español/inglés y `skills/shared/SUPABASE.md` para encoding y conexión. Ver `shared/SCHEMA.md` y `shared/PIPELINE.md` para esquema de tablas y flujo completo.

## Proceso completo

### Paso 1: Detectar creatividades con observación pendiente

Consultar tabla `creatividades` con filtro:
```
observacion=not.is.null&observacion=neq.&condicion=eq.observado
```

Filtrar por marca específica si se indica, o procesar todas las marcas con observaciones pendientes.

Campos a traer: `id, marca, estado, observacion, prompt, copy, slogan_headline, subtitulo, cta, origen, url, gatillador, concepto, descripcion_corta, logo`

### Paso 2: Cargar identidad de marca

Cargar campos de marca desde Supabase (ver shared/SCHEMA.md tabla `marcas`): ficha, arquetipo, paleta_colores, look_and_feel, notas_generales, contenido_prohibido, logos. Necesario para que las modificaciones al prompt sigan siendo coherentes con la marca.

### Paso 3: Interpretar la observación y modificar

Para cada creatividad con observación:

1. **Leer la observación** del cliente
2. **Clasificar el tipo de cambio**:
   - **Validación positiva (NO requiere corrección)**: la observación es un elogio o aprobación sin corrección concreta (ej: "entorno impecable", "perfecto", "muy logrado", "todo ok"). → NO modificar nada. Cambiar `condicion` a `aprobado` (o `resultado_final` si corresponde) y `observacion` a null. Detectar palabras clave: "impecable", "perfecto", "logrado", "ok", "bien" SIN un "pero", "solo", "ajustar", "cambiar" que indique corrección.
   - **Ajuste puntual al prompt**: quitar/agregar/cambiar un elemento específico (ej: "elimina las líneas", "fondo blanco", "quitar el domo"). → Modificar solo la parte relevante del prompt, mantener todo lo demás intacto.
   - **Cambio de composición**: cambiar objeto principal, escenario o concepto (ej: "cambia la herramienta", "prefiero un doctor y enfermera"). → Reescribir secciones mayores del prompt pero mantener estilo y paleta de marca.
   - **Rehacer completo**: el cliente pide algo completamente diferente (ej: "volver a crear completa de nuevo, prefiero un doctor y enfermera"). → Construir prompt nuevo **desde cero** usando la indicación del cliente como brief creativo. Aplicar el mismo proceso que las skills de generación: respetar paleta, look & feel, contenido prohibido, espacio negativo. **Reescribir TODOS los campos de texto** (copy, slogan_headline, subtitulo, cta, concepto, descripcion_corta, gatillador, buyer_persona, dolor_anhelo, cambio_emocional, diferenciador, beneficios, objeciones_tipicas) porque el concepto visual es completamente nuevo. Seguir la **Guía de textos creativos** de las skills de generación para los nuevos textos.
   - **Ajuste a copy/textos**: la observación menciona textos, tono, slogan, copy, hashtags o CTA → Modificar los campos de texto correspondientes. Puede ser con o sin cambio de imagen.
   - **Solo textos (sin cambio de imagen)**: la observación SOLO pide corregir textos sin tocar la imagen → Modificar campos de texto directamente en la creatividad original (NO duplicar). Cambiar `condicion` a `para_revision` y `observacion` a null.

3. **Modificar el prompt** (si aplica — consultar **prompt-master** para reglas y frases probadas):
   - Partir del prompt existente de la creatividad
   - Aplicar los cambios que indica la observación
   - Ver nora-prompt-master para reglas de negativos. Si la observación pide "quitar X", simplemente eliminar toda mención de X del prompt.
   - Verificar coherencia con paleta de colores, look & feel y contenido prohibido de la marca
   - Mantener las reglas base de prompt-master: espacio para texto (mínimo 30% zona limpia), fondo según paleta_colores

4. **Modificar textos** (si la observación lo requiere):
   - Campos de texto: `copy`, `slogan_headline`, `subtitulo`, `cta`, `concepto`, `descripcion_corta`, `gatillador`
   - Seguir **GUIA-TEXTOS.md** para reglas de emojis (2-4), hashtags (3-5), tono de marca
   - Si el cambio visual es tan radical que el copy ya no tiene sentido → reescribir textos completos calibrados al nuevo concepto
   - Si la observación pide ajuste de tono → modificar solo el tono manteniendo el concepto
   - Si la observación pide cambio de CTA/slogan específico → cambiar solo ese campo

5. **Reglas de modificación**:
   - **Mínima intervención**: cambiar solo lo necesario. Si la observación dice "quitar las trizaduras", solo eliminar esa parte del prompt.
   - **Preservar lo que funciona**: si el cliente no menciona un aspecto, dejarlo exactamente como está.
   - **Textos + imagen son independientes**: una observación puede pedir cambio de imagen, de textos, o de ambos. Evaluar cada dimensión por separado.
   - **Negativos**: Ver nora-prompt-master para reglas de negativos.

### Paso 5: Actualizar en Supabase

**CREAR 2 NUEVAS ENTRADAS** (no modificar la original). Cada versión interpreta la observación con un enfoque ligeramente distinto, dando más posibilidades de obtener un buen resultado. La creatividad observada se conserva intacta como historial para comparación.

```javascript
// 1. INSERTAR versión A — interpretación principal de la observación:
POST creatividades
{
  // Copiar TODOS los campos tal cual de la original
  // SOLO cambiar:
  "prompt": "<prompt MODIFICADO versión A>",
  "estado": "paso 4",
  "observacion": null,
  "condicion": null
  // NO copiar: id, created_at, link_ren_1, link_ren_2
}

// 2. INSERTAR versión B — interpretación alternativa (diferente ángulo, fondo, composición):
POST creatividades
{
  // Copiar TODOS los campos tal cual de la original
  // SOLO cambiar:
  "prompt": "<prompt MODIFICADO versión B>",
  "estado": "paso 4",
  "observacion": null,
  "condicion": null
  // NO copiar: id, created_at, link_ren_1, link_ren_2
}

// 3. ACTUALIZAR la original — limpiar observación y devolver a para_revision:
PATCH creatividades?id=eq.{id_original}
{
  "observacion": null,
  "condicion": "para_revision"
}
```

**Diferenciación entre versiones A y B**: ambas respetan la observación de Jorge, pero varían en algún aspecto secundario (ángulo de cámara, variante de fondo, composición, iluminación). No son interpretaciones opuestas — son dos caminos válidos que resuelven lo mismo.

**La original queda intacta** con `condicion: "para_revision"` y `observacion: null`. Sirve para comparar antes/después.

### Paso 5b: Log de observaciones (ANTES del PATCH)

Guardar cada observación resuelta en `memory/observaciones-log.md` para aprendizaje:

```markdown
## YYYY-MM-DD — Observaciones resueltas

| ID | Marca | Observación original | Tipo de cambio | Qué se modificó en el prompt |
|---|---|---|---|---|
| 520 | [marca] | "quitar las líneas del fondo" | ajuste puntual | Eliminada mención de líneas, reforzado fondo liso |
```

Este log permite detectar patrones: si la misma observación se repite en muchas creatividades (ej: "fondo sucio", "mucho texto"), actualizar el prompt-master para prevenirlo.

### Paso 6: Generar imagen con ComfyUI (si hubo cambio de prompt)

Una vez creada la nueva creatividad en paso 4, ejecutar la generación de imagen inmediatamente.

**Seleccionar script según el `origen` de la creatividad:**

| Origen | Script | Tipo |
|--------|--------|------|
| `original`, `referencia`, `universal`, `requerido`, `calendario` | `comfy-text2img.mjs` | Texto a imagen (Qwen 2.5) |
| `Producto`, `Colaborador`, `Interior`, `Exterior`, `Fachada` | `comfy-img2img.mjs` | Imagen a imagen (Qwen Image Edit) |
| `Pantalla` | `comfy-text2img.mjs --ratio=16:9` | Texto a imagen 16:9 (Qwen 2.5) |

#### Flujo text2img / img2img:

```bash
cd C:\Users\conta\.openclaw\workspace

# Para texto a imagen:
node comfy-text2img.mjs --once --id=<ID_NUEVA_CREATIVIDAD>

# Para imagen a imagen:
node comfy-img2img.mjs --once --id=<ID_NUEVA_CREATIVIDAD>
```

- `--once`: procesa y sale (no queda en polling)
- `--id=<ID>`: genera solo esa creatividad específica
- Al terminar, la creatividad pasa automáticamente a paso 5 (text2img) o paso 8/10 (img2img)
- **Notificar a Jorge inmediatamente** cuando ComfyUI termine (ver protocolo en SOUL.md)

Si hay múltiples observaciones de la misma marca y mismo tipo, se pueden generar en lote:
```bash
node comfy-text2img.mjs --once   # procesa todas las paso 4 de text2img
node comfy-img2img.mjs --once    # procesa todas las paso 7 de img2img
```
**Filtrar por marca antes** si hay creatividades de otras marcas estacionadas en paso 4/7.

**Nota**: Para observaciones en creatividades de video (`origen=video`), ver skill `nora-video-observacion`.

### Paso 7: Confirmar

- Reportar qué creatividades se generaron
- Mostrar resumen: ID original → ID nueva | marca | observación | qué se cambió
- Incluir link de la imagen generada para revisión rápida

## Resolución en lote

Para procesar múltiples observaciones:
1. Detectar todas las pendientes (Paso 1)
2. Agrupar por marca
3. Cargar identidad de marca una vez por marca (Paso 2)
4. Procesar cada observación (Paso 3)
5. Hacer PATCH por cada una (Paso 4)
6. Reportar resumen completo (Paso 5)

**Flujo recomendado**: Presentar al usuario las observaciones agrupadas por marca, procesar marca por marca, confirmar antes de hacer PATCH.

## Casos especiales

- **Observación ambigua**: Si no queda claro qué cambio pide el cliente, preguntar antes de modificar.
- **Observación que contradice contenido prohibido**: Priorizar contenido prohibido de la marca. Informar al usuario.
- **Observación positiva sin cambio** (ej: "me gusta"): Detectada en Paso 3 como "validación positiva" → se aprueba directamente sin duplicar.

## Conexión Supabase

Ver `skills/shared/SUPABASE.md` para URL, headers y encoding.
