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
                              (ratio 3:4)
                                    │
                                  paso 8  ← imagen editada 3:4 lista
                                    │
                          comfy-img2img.mjs
                              (ratio 16:9)
                                    │
                                  paso 10 ← imagen editada 16:9 lista
                                    │
                            [Revisión / Iteración]
```

### Detalle de pasos

| Paso | Estado | Qué ocurre | Quién actúa |
|---|---|---|---|
| 1-2 | — | Concepto + skill producto genera prompt de edición | NORA (skills) |
| 6 | `paso 6` | Prompt de edición listo, esperando ejecución | — |
| 7 | `paso 7` | n8n o NORA dispara comfy-img2img.mjs ratio 3:4 | Script |
| 8 | `paso 8` | Imagen 3:4 generada y subida | `comfy-img2img.mjs` |
| 9 | `paso 9` | Dispara comfy-img2img.mjs ratio 16:9 | Script |
| 10 | `paso 10` | Imagen 16:9 generada y subida | `comfy-img2img.mjs` |
| — | `para_revision` / `aprobado` | Revisión igual que text2img | Iteración / Jorge |

> **Nota**: Paso 9 es transitorio (no se persiste como estado). El script pasa directo de 8 a generar 16:9 y marca paso 10.

> **Excepción: Pantalla** — Creatividades con `origen=Pantalla` llegan a paso 9 con prompt copiado pero sin imagen. Se generan con `comfy-text2img.mjs --ratio=16:9` (text2img, NO img2img). Resultado va a `link_ren_1`, pasa a paso 10. No sujetas a iteración.

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
                         │                    └──> observado ──> observacion_resuelta
                         │                              │
                         │                         [se crea DUPLICADO
                         │                          con corrección]
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
- El original se marca con `observacion_resuelta` o se preserva intacto
- El duplicado arranca en `paso 4` (text2img) o `paso 6` (img2img) para regenerar imagen

---

## Scripts del pipeline

| Script | Función | Input | Output |
|---|---|---|---|
| `comfy-text2img.mjs` | Texto → imagen (Qwen 2.5) | `paso 4` | `paso 5` |
| `comfy-img2img.mjs` | Imagen → imagen (Qwen Image Edit) | `paso 7` → `paso 8` (3:4), `paso 9` → `paso 10` (16:9) |
| `upload-video.mjs` | Sube video a Supabase Storage | archivo local | URL en Storage |

### Uso

```bash
# Text2img: procesar todo en paso 4
node comfy-text2img.mjs --once

# Text2img: uno específico
node comfy-text2img.mjs --once --id=123

# Img2img: ratio 3:4
node comfy-img2img.mjs --once

# Img2img: ratio 16:9
node comfy-img2img.mjs --once --ratio=16:9

# Img2img: uno específico
node comfy-img2img.mjs --once --id=123
```
