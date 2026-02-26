---
name: nora-prompt-ltxvideo
description: Construcción de prompts para generación de video con LTX-Video 2 vía ComfyUI. Define estructura, mejores prácticas, vocabulario técnico y checklist de validación. Aplica para text-to-video e image-to-video con audio sincronizado.
id: nora-prompt-ltxvideo
---

# Prompt LTX-Video 2 — Guía de prompts para video AI

> **Última revisión:** 2026-02-20 02:00 CLT

## Cuándo se llama

Cada vez que se necesite escribir un prompt para LTX-Video 2:
- Generación text-to-video (texto a video desde cero)
- Generación image-to-video (animar una imagen existente)
- Videos UGC (estilo selfie/cámara en mano)
- Videos cinematográficos de marca
- Videos con diálogo sincronizado (Cartesia TTS + LTX audio branch)

## Idioma del prompt

**SIEMPRE en inglés.** LTX-Video 2 está entrenado en inglés.

## Estructura del prompt

Un buen prompt para LTX-Video 2 cubre **6 aspectos clave** en un párrafo fluido:

### 1. Establecer el plano (Shot)
Usar terminología cinematográfica que defina el género visual.

**Vocabulario útil:**
- Escalas: extreme close-up, close-up, medium close-up, medium shot, full shot, wide shot, establishing shot
- Géneros: cinematic, documentary, film noir, fashion editorial, arthouse, thriller, modern romance
- Estilización: stop-motion, 2D/3D animation, claymation, hand-drawn, comic book, cyberpunk, surreal, painterly, pixar style

### 2. Ambientar la escena (Scene)
Describir iluminación, paleta de color, texturas y atmósfera.

**Vocabulario útil:**
- Iluminación: warm golden light, soft amber, neon glow, natural sunlight, dramatic shadows, flickering candles, backlighting, rim light, high-key lighting
- Texturas: rough stone, smooth metal, worn fabric, glossy surfaces, wooden floor, polished concrete
- Paleta: vibrant, muted, monochromatic, high contrast, warm-toned, cool blue
- Atmósfera: fog, rain, dust particles, smoke, steam, mist, golden hour, soft shadows, reflections

### 3. Describir la acción (Action)
Escribir la acción central como una **secuencia natural** que fluya de inicio a fin. Usar **verbos en presente**.

**Ejemplo bueno:** "The woman picks up the coffee cup, takes a slow sip, then looks directly at the camera and smiles."
**Ejemplo malo:** "A woman drinking coffee and smiling."

### 4. Definir personaje(s) (Character)
Incluir edad, peinado, vestimenta y detalles distintivos. Expresar emociones a través de **señales físicas**, NO estados internos.

**✅ Correcto:** "Her face crumples, she takes a shaky breath, eyes glistening"
**❌ Incorrecto:** "She feels sad and confused"

### 5. Movimiento de cámara (Camera)
Especificar cuándo y cómo cambia la vista. Incluir qué se ve DESPUÉS del movimiento.

**Vocabulario útil:**
- Movimientos: follows, tracks, pans across, pans left/right, circles around, tilts upward/downward, pushes in, pulls back, dollys back, arcs left/right, cranes up
- Estabilización: handheld movement, handheld feel, static frame, locked-off shot
- Perspectiva: overhead view, over-the-shoulder, low angle, eye-level
- Efectos temporales: slow motion, time-lapse, continuous shot, freeze-frame, lingering shot

### 6. Describir el audio (Audio)
Descripciones claras de sonido ambiente, música y diálogo.

**Para diálogo:** Colocar texto entre comillas. Mencionar idioma y acento si es necesario.
**Para ambiente:** "Ambient coffeeshop noises", "dripping rain and wind blowing", "forest ambience with birds singing"
**Para voz:** "Energetic announcer", "resonant voice with gravitas", "quiet whisper", "robotic monotone"

## Reglas de construcción

### Obligatorias
1. **Un solo párrafo fluido** — NO usar bullets ni listas. El modelo necesita una escena cohesiva
2. **Verbos en presente** — "walks", "looks", "says", NO "walked", "looked"
3. **Detalle proporcional al plano** — Close-ups necesitan más detalle que planos abiertos
4. **4 a 8 oraciones descriptivas** — Cubrir todos los aspectos clave
5. **Emociones = señales físicas** — Postura, gestos, expresión facial. NUNCA etiquetas abstractas
6. **Movimiento de cámara relativo al sujeto** — "camera follows him as he walks" > "camera moves left"

### Prohibidas
1. **NO texto/logos** — LTX-2 no genera texto legible ni consistente
2. **NO física compleja** — Saltar, hacer malabarismo = artefactos. Bailar SÍ funciona
3. **NO sobrecarga de escena** — Demasiados personajes/acciones/objetos = pérdida de claridad
4. **NO iluminación contradictoria** — "warm sunset with cold fluorescent glow" confunde al modelo
5. **NO prompts excesivamente complejos** — Empezar simple, iterar agregando capas
6. **NO estados internos sin cues visuales** — "sad", "confused" solos no funcionan

## Fortalezas de LTX-Video 2

Usar estas fortalezas como ventaja en los prompts:

- **Composiciones cinematográficas** — Planos amplios, medios y cerrados con iluminación cuidada y DoF
- **Momentos humanos emotivos** — Expresiones de un solo sujeto, gestos sutiles, matices faciales
- **Atmósfera y ambientación** — Niebla, golden hour, sombras, lluvia, reflejos, texturas
- **Lenguaje de cámara claro** — "slow dolly in", "handheld tracking", "over-the-shoulder"
- **Estéticas estilizadas** — Noir, painterly, editorial, pixel art, surreal. Nombrar temprano en el prompt
- **Control de iluminación y mood** — Backlight, rim light, lámparas flickering anclan el tono
- **Voz y diálogo** — Personajes pueden hablar y cantar en varios idiomas
- **Lipsync con audio** — 30fps mejora sincronización labial vs 24fps

## Plantillas por caso de uso

### UGC (User Generated Content)
```
A [age] [ethnicity] [gender] talking directly to camera in a casual selfie-style video, [action/gesture], warm indoor lighting, [background description], authentic UGC style, natural skin tones, phone camera quality, vertical format, close-up face and shoulders
```

### Producto en escena
```
[Cinematic style] shot of [product description] on [surface/environment]. [Lighting description]. The camera [movement] revealing [details]. [Atmospheric elements]. [Audio description if applicable]
```

### Persona profesional (marca)
```
A [professional description] in [environment]. [Lighting]. [Action sequence with natural flow]. The camera [movement]. [Emotional cues through physical description]. [Ambient sound/music]
```

### Paisaje/Establecimiento
```
[Time of day] [location]. [Atmospheric conditions]. The camera [slow movement] across [scene elements]. [Lighting details]. [Natural sounds]. [Color palette description]
```

### Animación de imagen (img2video)
```
[Describe the scene already in the image]. [Add subtle motion: breathing, blinking, slight movement]. [Camera movement if any]. [Ambient sound]. [Keep description consistent with source image]
```

## Checklist pre-envío

Antes de enviar un prompt a ComfyUI, verificar:

- [ ] ¿Está en inglés?
- [ ] ¿Es un párrafo fluido (no bullets)?
- [ ] ¿Usa verbos en presente?
- [ ] ¿Tiene 4-8 oraciones?
- [ ] ¿Describe el plano/shot?
- [ ] ¿Ambientación clara (luz, color, textura)?
- [ ] ¿Acción secuencial de inicio a fin?
- [ ] ¿Personajes con detalles físicos (no abstractos)?
- [ ] ¿Movimiento de cámara especificado?
- [ ] ¿Audio descrito (si aplica)?
- [ ] ¿Sin texto/logos?
- [ ] ¿Sin física imposible?
- [ ] ¿Complejidad controlada (no sobrecargado)?

## Configuración técnica por defecto

| Parámetro | Valor |
|---|---|
| Modelo | `ltx-2-19b-dev_Q5_K_M.gguf` |
| Resolución | 480×854 (vertical) o 854×480 (horizontal) |
| FPS | 30 |
| Duración | 5 segundos |
| Audio (con voz) | Cartesia TTS WAV → ComfyUI input folder |
| Audio (sin) | Rama audio eliminada del workflow — 3x más rápido |
| Sampler | `res_multistep` |
| Steps | 8 |
| CFG | 1.0 |
| LoRAs | distilled (0.6) + detailer (0.8) |

## Tiempos de referencia (480p 30fps 5s, Q5)

| Modo | Tiempo |
|---|---|
| Text-to-video sin audio | ~1 min |
| Text-to-video con audio | ~3.5 min |
| Img-to-video sin audio | ~1 min |
| Img-to-video con audio | ~3.2 min |
| Upscale 480p → 720p | ~4.5 min |
| Pipeline completo (gen + upscale) | ~5.5-8 min |

## Iteración

LTX-Video 2 está diseñado para iteración rápida (~1 min sin audio en 480p). Estrategia:

1. **Empezar simple** — 2-3 oraciones, validar composición base
2. **Agregar capas** — Iluminación, texturas, movimiento de cámara
3. **Refinar detalles** — Expresiones, audio, efectos atmosféricos
4. **Cambiar seed** — Si la composición es buena pero el resultado no, solo cambiar noise_seed
