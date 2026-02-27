# PIPELINE.md — Flujo completo de estados NORA

> Mapa de todos los pasos, transiciones y scripts del pipeline de creatividades.

## Pipeline Text2Img (original, referencia, universal, requerido, calendario)

```
[Concepto] → [Skill generación] → [Prompt Master] → paso 4
                                                        │
                                              comfy-text2img.mjs
                                                        │
                                                      paso 5
                                                        │
                                            ┌───────────┴───────────┐
                                            │                       │
                                      [Iteración QA]         [Jorge revisa]
                                            │                       │
                                      ¿score ≥ 4.0?          ¿Aprobado?
                                            │                       │
                                     Sí → condicion=           condicion=
                                      para_revision →          aprobado /
                                      resultado_final          observado
```

### Detalle de pasos

| Paso | Estado | Qué ocurre | Quién actúa |
|---|---|---|---|
| 1-3 | — | Concepto + skill generación + prompt-master | NORA (skills) |
| 4 | `paso 4` | Prompt listo en Supabase, esperando imagen | — |
| 5 | `paso 5` | `comfy-text2img.mjs` genera imagen, sube URL | Script automático |
| — | `para_revision` | Iteración evalúa la imagen | Skill iteración |
| — | `aprobado` | Jorge aprueba | Jorge |
| — | `resultado_final` | Versión publicada final | Jorge |

---

## Pipeline Img2Img (Producto, Colaborador, Interior, Exterior, Fachada)

```
[Concepto] → [Skill producto] → paso 6
                                    │
                          NORA escribe prompt
                          de edición ≤600 chars
                                    │
                                  paso 7
                                    │
                          comfy-img2img.mjs
                           (SOLO ratio 3:4)
                                    │
                                  paso 8  ← imagen editada 3:4 lista
                                    │
                            [Revisión / Iteración]
```

### Detalle de pasos

| Paso | Estado | Qué ocurre | Quién actúa |
|---|---|---|---|
| 1-2 | — | Concepto + skill producto genera prompt de edición | NORA (skills) |
| 6 | `paso 6` | Prompt de edición listo, esperando ejecución | — |
| 7 | `paso 7` | NORA dispara `comfy-img2img.mjs --once` (3:4) | Script |
| 8 | `paso 8` | Imagen 3:4 generada y subida | `comfy-img2img.mjs` |
| — | `para_revision` / `aprobado` | Revisión igual que text2img | Iteración / Jorge |

> **IMPORTANTE**: `comfy-img2img.mjs` SOLO genera 3:4 (1104×1472). No tiene modo 16:9. Las imágenes 16:9 son territorio exclusivo de Pantalla (ver abajo).

---

## Pipeline Pantalla (imágenes y videos 16:9 para TV/pantallas)

Creatividades con `origen=Pantalla` se generan en paso 9 → paso 10 con scripts dedicados.

### 3 sub-flujos:

**A. Pantalla Imagen (text2img 16:9)**
```
paso 9 (prompt, sin url) → comfy-text2img-pantalla.mjs → paso 10 (1920×1080)
```

**B. Pantalla Colaborador (img2img 16:9, pad blanco)**
```
paso 9 (prompt + url) → comfy-img2img-pantalla.mjs → paso 10 (1920×1080)
```
Método: foto original → pad blanco (no crop) → Qwen rellena espacios. Intermedia en `link_ren_2`.

**C. Pantalla Video (TSX reframe 9:16→16:9)**
```
paso 9 (concepto con libreto) → duplicar TSX → Remotion render 16:9 → ffmpeg mix audio → subir MANUAL a Supabase → paso 10
```
⚠️ Sub-flujo C requiere subida MANUAL a Supabase Storage + actualización del registro.

### Detalle de pasos

| Paso | Estado | Qué ocurre | Script |
|---|---|---|---|
| 9 | `paso 9` | Creatividad Pantalla lista, esperando generación | — |
| 10 | `paso 10` | Imagen/video 16:9 generada y subida | Script dedicado por sub-flujo |

> Pantalla NO pasa por iteración — solo recibe observaciones de Jorge.

---

## Pipeline Video (Remotion motion graphics)

```
[Libreto] → [Voz Cartesia] → [Remotion animación] → render MP4 (sin audio)
                                                          │
                                                    ffmpeg: mezclar
                                                    audio + video
                                                          │
                                                    [Publicar video]
                                                          │
                                                    Sube a Supabase:
                                                    link_ren_1 (4:5)
                                                    link_ren_2 (16:9)
```

### Detalle

| Paso | Qué ocurre | Quién actúa |
|---|---|---|
| Libreto | Guión con escenas, textos, estructura | Skill libreto-video |
| Voz | WAV con narración (si aplica) | Skill voz-cartesia |
| Animación | TSX → render MP4 (⚠️ audio silente -91dB) | Skill remotion-animacion |
| Mix audio | ffmpeg mezcla música/voz + render | Skill publicar-video |
| Publicar | Adapta 9:16→4:5, sube ambos formatos, crea creatividad | Skill publicar-video |

> **REGLA CRÍTICA**: Remotion SIEMPRE sale en silencio. NUNCA subir el render directo. Mezclar audio con ffmpeg y verificar volumedetect > -20 dB.

---

## Pipeline Video AI (LTX-Video 2) — ⏸ EN DESARROLLO

```
[Prompt LTX] → ComfyUI LTX-Video 2 → video 480p
                                          │
                                    (opcional) upscale 720p
                                          │
                                    [Publicar video]
```

> Este pipeline aún no tiene flujo productivo validado. Se trabaja en la semana.

---

## Transiciones de `condicion`

```
null ──────────────> para_revision ──────> aprobado ──────> resultado_final
                         │                    │
                         │                    └──> observado
                         │                              │
                         │                         [se crea DUPLICADO
                         │                          con corrección,
                         │                          original queda "observado"]
                         │
                    [iteración evalúa]
                         │
                    score < 4.0 → se crea DUPLICADO con prompt mejorado
                    original → iteracion_resuelta (⚠️ no es valor actual en DB,
                                                    se usa condicion existente)
```

### Reglas de duplicación

- **NUNCA sobrescribir** una creatividad existente
- Iteración y observación SIEMPRE crean un registro nuevo (duplicado)
- El original queda con `observado` (preservado intacto para comparación)
- El duplicado arranca en `paso 4` (text2img) o `paso 6` (img2img) para regenerar imagen

---

## Scripts del pipeline

| Script | Función | Input → Output | Dimensiones |
|---|---|---|---|
| `comfy-text2img.mjs` | Texto → imagen (Qwen 2.5) | `paso 4` → `paso 5` | 1104×1472 (3:4) |
| `comfy-img2img.mjs` | Imagen → imagen (Qwen Image Edit) | `paso 7` → `paso 8` | 1104×1472 (3:4) SOLO |
| `comfy-text2img-pantalla.mjs` | Texto → imagen pantalla (Qwen 2.5) | `paso 9` → `paso 10` | 1920×1080 (16:9) |
| `comfy-img2img-pantalla.mjs` | Imagen → imagen pantalla (pad blanco) | `paso 9` → `paso 10` | 1920×1080 (16:9) |

> No existe `upload-video.mjs`. Los videos se suben manualmente a Supabase Storage.

### Uso

```bash
# Text2img: procesar todo en paso 4
node comfy-text2img.mjs --once

# Text2img: uno específico
node comfy-text2img.mjs --once --id=123

# Img2img: solo 3:4
node comfy-img2img.mjs --once
node comfy-img2img.mjs --once --id=123

# Pantalla texto a imagen 16:9
node comfy-text2img-pantalla.mjs --once
node comfy-text2img-pantalla.mjs --once --id=123

# Pantalla imagen a imagen 16:9 (pad blanco)
node comfy-img2img-pantalla.mjs --once
node comfy-img2img-pantalla.mjs --once --id=123
```

### ⚠️ Límite ComfyUI: máximo 4 imágenes por corrida
ComfyUI tiene VRAM leak que causa crash en la 5ta imagen. Ejecutar en tandas de 4 máximo, relanzar entre tandas para limpiar GPU.
