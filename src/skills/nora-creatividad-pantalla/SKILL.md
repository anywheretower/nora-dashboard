---
name: nora-creatividad-pantalla
description: Generar creatividades 16:9 para pantallas/televisores en salas de espera. Detecta automáticamente el tipo de origen (imagen t2i, colaborador i2i, video Remotion) y ejecuta el pipeline correspondiente.
id: nora-creatividad-pantalla
---

# Pantalla — Creatividades 16:9 para televisores

> **Última revisión:** 2026-02-26 CLT

## Cuándo se activa

- **Automático**: cron por definir — procesa creatividades con `origen=Pantalla` en `paso 9`
- **Por pedido de Jorge**: cuando lo solicita explícitamente

## Qué es

Los clientes tienen televisores 16:9 en salas de espera. Esta skill genera versiones horizontales (16:9) a partir de creatividades existentes. Soporta **3 tipos de origen**, cada uno con un pipeline distinto.

## Detección automática del tipo

Toda creatividad Pantalla tiene un `gatillador` que referencia la creatividad origen (ej: "Pantalla 16:9 desde creatividad #888"). La skill detecta el tipo inspeccionando los campos de la creatividad en paso 9:

| Campo | Pantalla · Imagen | Pantalla · Colaborador | Pantalla · Video |
|---|---|---|---|
| `prompt` | ✅ prompt t2i | ✅ prompt edición | ❌ null |
| `url` | ❌ null | ✅ foto original | ❌ null |
| `concepto` | ❌ null | ❌ null | ✅ JSON libreto |

**Regla de detección:**
1. Si tiene `concepto` tipo JSON (con campo `libreto`) → **Video**
2. Si tiene `url` (foto original) → **Colaborador**
3. Si tiene `prompt` sin `url` ni `concepto` JSON → **Imagen**

## Exclusiones

- **NO sujetas a iteración** — la skill `nora-imagen-iteracion` excluye origen `Pantalla`
- **SÍ pueden recibir observaciones** — `nora-imagen-observacion` las procesa normalmente

## Idioma de trabajo

Ver `skills/shared/IDIOMA.md` para reglas de idioma español/inglés y `skills/shared/SUPABASE.md` para encoding y conexión.

---

## Proceso general

### Paso 1: Detectar creatividades pendientes

Consultar tabla `creatividades`:
```
estado=eq.paso 9&origen=eq.Pantalla&link_ren_1=is.null
```

Campos a traer: `id, marca, prompt, gatillador, slogan_headline, subtitulo, cta, url, concepto`

### Paso 2: Cargar identidad de marca

Cargar campos de marca desde Supabase (ver shared/SCHEMA.md tabla `marcas`): paleta_colores, look_and_feel, notas_generales, contenido_prohibido.

### Paso 3: Clasificar y ejecutar según tipo

Para cada creatividad, aplicar la regla de detección y seguir el sub-flujo correspondiente.

---

## Sub-flujo A: Pantalla · Imagen (text-to-image)

**Origen**: creatividad t2i aprobada (original, referencia, universal, calendario, requerida)
**Pipeline**: adaptar prompt → comfy-text2img --ratio=16:9

### A.1: Adaptar prompt a composición horizontal

1. **Leer el prompt existente** de la creatividad
2. **Ajustar composición** para formato apaisado (16:9):
   - Redistribuir elementos horizontalmente
   - Aprovechar el ancho extra para más contexto ambiental
   - Mantener espacio para texto (zona limpia) adaptado al formato horizontal
   - Si el prompt original tiene composición vertical explícita (ej: "tall", "vertical"), reescribir a horizontal
3. **Agregar directiva de formato**: asegurar que el prompt especifique composición horizontal/landscape/wide
4. **Mantener la esencia**: misma paleta, misma atmósfera, mismo concepto — solo cambia la composición
5. **Validar contra prompt-master** (`skills/nora-prompt-master/SKILL.md`): estructura de 6 bloques, negativos, checklist
6. **Escribir prompt adaptado** en el campo `prompt` de la creatividad (sobreescribe el original copiado)

### A.2: Generar imagen

```bash
cd C:\Users\conta\.openclaw\workspace
node comfy-text2img.mjs --once --id=<ID> --ratio=16:9
```

- `--ratio=16:9` fuerza el formato horizontal
- Al terminar: sube imagen a Supabase Storage, actualiza `link_ren_1`, pasa a **paso 10**

---

## Sub-flujo B: Pantalla · Colaborador (img-to-image)

**Origen**: creatividad i2i aprobada (Colaborador, Producto, Interior, Exterior, Fachada)
**Pipeline**: adaptar prompt edición → comfy-img2img --ratio=16:9

### B.1: Adaptar prompt de edición a composición horizontal

1. **Leer el prompt de edición** existente de la creatividad
2. **Adaptar composición** para 16:9:
   - Persona/producto se mantiene intacta (Qwen preserva el sujeto de la imagen `url`)
   - Expandir el entorno horizontalmente: más contexto lateral, más profundidad
   - Ajustar instrucciones de encuadre: "wide shot", "landscape composition", "horizontal frame"
   - Mantener la directiva de NO describir a la persona (Qwen la preserva automáticamente)
3. **Mantener ≤600 chars** — límite de Qwen Image Edit para prompts de edición
4. **Agregar directivas anti-artefactos** según lo aprendido:
   - "Seamless floor with no lines or edges visible"
   - "Camera angle slightly downward so ceiling barely visible"
   - "Do not add any text or watermarks"
5. **Escribir prompt adaptado** en el campo `prompt` de la creatividad

### B.2: Generar imagen

```bash
cd C:\Users\conta\.openclaw\workspace
node comfy-img2img.mjs --once --id=<ID> --ratio=16:9
```

- Usa la `url` de la creatividad como imagen de input
- Al terminar: sube imagen a Supabase Storage, actualiza `link_ren_1`, pasa a **paso 10**

---

## Sub-flujo C: Pantalla · Video (Remotion render)

**Origen**: creatividad video aprobada
**Pipeline**: identificar TSX → duplicar → adaptar a 1920×1080 → render → mix audio

### C.1: Identificar archivo TSX original

1. **Extraer ID de creatividad origen** del campo `gatillador` (ej: "Pantalla 16:9 desde creatividad #1344")
2. **Buscar el archivo TSX** en el proyecto Remotion:
   - Revisar `C:\Users\conta\.openclaw\workspace\remotion-nora\src\` 
   - El nombre del archivo suele coincidir con la marca + concepto (ej: `CsjRadiografia.tsx`)
   - Si no se encuentra automáticamente, consultar a Jorge
3. **Leer las dimensiones originales** del archivo TSX (normalmente 1080×1920 vertical o 1080×1080 cuadrado)

### C.2: Duplicar y adaptar a 16:9

1. **Duplicar el archivo TSX** con sufijo `_Pantalla` (ej: `CsjRadiografia_Pantalla.tsx`)
2. **Cambiar dimensiones** a 1920×1080
3. **Adaptar elementos visuales**:
   - Reposicionar textos para aprovechar el ancho horizontal
   - Ajustar tamaños de fuente (pueden ser más grandes en horizontal)
   - Reposicionar imágenes/overlays
   - Adaptar animaciones que dependan de coordenadas absolutas
   - Verificar que ningún elemento quede fuera de frame
4. **Registrar la composición** en el archivo de Remotion si es necesario

### C.3: Render

```bash
cd C:\Users\conta\.openclaw\workspace\remotion-nora
npx remotion render src/index.ts <NombreComposicion> out/<nombre>_pantalla.mp4 --width=1920 --height=1080
```

- El render sale **mudo** (-91 dB)

### C.4: Mix audio

```bash
ffmpeg -i out/<nombre>_pantalla.mp4 -i <audio_original> -c:v copy -c:a aac -map 0:v -map 1:a out/<nombre>_pantalla_final.mp4
```

- El audio viene del video original (misma voz, misma música)

### C.5: Subir y actualizar

1. Subir video final a Supabase Storage
2. Actualizar `link_ren_1` con la URL del video
3. Pasar a **paso 10**

**IMPORTANTE**: Este sub-flujo requiere intervención manual para adaptar el TSX. No es automático como los otros dos. Reportar a Jorge qué archivo se va a adaptar y esperar confirmación antes de renderizar.

---

## Procesamiento en lote

Si hay múltiples creatividades Pantalla pendientes:
1. **Clasificar** cada una por tipo (Imagen / Colaborador / Video)
2. **Agrupar por marca** dentro de cada tipo
3. **Ejecutar por tipo**: primero todas las de Imagen (comfy-text2img), luego Colaborador (comfy-img2img), luego Video (manual)
4. **Batch máximo 5** por tipo — reportar y esperar confirmación antes de seguir

**ComfyUI**: máximo 15 imágenes por corrida, relanzar entre marcas (ver protocolo en SOUL.md).

## Conexión Supabase

Ver `skills/shared/SUPABASE.md` para URL, headers y encoding.
