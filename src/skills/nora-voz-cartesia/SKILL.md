# Skill: nora-voz-cartesia — Generación de voces con Cartesia Sonic 3

> **Última revisión:** 2026-02-19 22:50 CLT

## Propósito

Generar locuciones de voz profesionales para la plataforma NORA usando Cartesia Sonic 3. Cubre: generación de audio TTS, control avanzado de emoción/velocidad/volumen, clonación de voces, y buenas prácticas para máxima calidad.

## Proveedor y modelo

- **Servicio**: Cartesia (cartesia.ai)
- **Modelo**: `sonic-3` (o snapshot `sonic-3-2026-01-12` para consistencia en producción)
- **API Version**: `2025-04-16` (la más reciente, habilita todas las funciones de Sonic 3)
- **Endpoint**: `https://api.cartesia.ai/tts/bytes` (POST → archivo de audio)
- **Idioma**: `es` (español — uno de los 42 idiomas soportados)
- **Latencia**: Sub-segundo, streaming disponible

## Credenciales

Ver `TOOLS.md` → sección "Cartesia TTS" para API key y voice IDs.
Ver `VOCES.md` para biblioteca completa de voces con asignaciones por marca.

---

## 1. Generación básica de audio

### Request mínimo

```json
{
  "model_id": "sonic-3",
  "transcript": "Texto a convertir en voz",
  "voice": { "mode": "id", "id": "<VOICE_ID>" },
  "language": "es",
  "output_format": { "container": "mp3", "bit_rate": 128000, "sample_rate": 44100 }
}
```

### Headers obligatorios

```
Cartesia-Version: 2025-04-16
X-API-Key: <API_KEY>
Content-Type: application/json
```

### Formatos de salida

| Container | Uso recomendado | Notas |
|-----------|----------------|-------|
| `mp3` | Publicación, Telegram, archivos finales | 128kbps, 44100Hz |
| `wav` | Edición, mezcla con ffmpeg | Sin compresión, más pesado |
| `raw` | Streaming en tiempo real | PCM, requiere post-procesamiento |

---

## 2. Controles avanzados (generation_config)

Sonic 3 ofrece control fino sobre velocidad, volumen y emoción. Se pasan en el campo `generation_config` del body.

### 2.1 Velocidad (speed)

```json
"generation_config": { "speed": 1.0 }
```

| Valor | Efecto | Uso |
|-------|--------|-----|
| 0.6 | Muy lento, deliberado | Locución solemne, reflexiva |
| 0.8 | Lento, pausado | Explicaciones técnicas, salud |
| 1.0 | Normal (default) | Uso general |
| 1.2 | Rápido, dinámico | Promociones, energía |
| 1.5 | Muy rápido | Disclaimers, urgencia |

**Recomendación por tipo de marca:**
- Salud (CSJ): 0.85-0.95 — transmite calma y confianza
- Industrial (RTK): 1.0-1.1 — firme y directo
- Servicios (Meser, Equos): 0.95-1.05 — profesional equilibrado
- Transporte (BAC): 1.0-1.1 — claro y energético
- Asesoría (RedAgrupa): 0.9-1.0 — cercano y pausado

### 2.2 Volumen (volume)

```json
"generation_config": { "volume": 1.0 }
```

| Valor | Efecto |
|-------|--------|
| 0.5 | Susurro, íntimo |
| 0.8 | Suave, conversacional |
| 1.0 | Normal (default) |
| 1.5 | Fuerte, impactante |
| 2.0 | Máximo volumen |

**Para videos**: usar 1.0-1.2 para que la voz destaque sobre la música de fondo.

### 2.3 Emoción (emotion) — Beta

```json
"generation_config": { "emotion": "confident" }
```

#### Emociones primarias (mejor rendimiento)
- `neutral` — voz base sin dirección emocional
- `angry` — intensidad, fuerza
- `excited` — entusiasmo, energía
- `content` — satisfacción, calma
- `sad` — melancolía, empatía
- `scared` — urgencia, alarma

#### Emociones secundarias útiles para publicidad
- `confident` — seguridad, autoridad → **RTK, Meser, Equos**
- `determined` — resolución, firmeza → **RTK**
- `enthusiastic` — efusividad → **BAC, Cemtra deportivo**
- `grateful` — agradecimiento → **CSJ, RedAgrupa**
- `affectionate` — cercanía, calidez → **CSJ, RedAgrupa**
- `calm` — serenidad → **CSJ**
- `proud` — orgullo → **Equos, RTK**
- `anticipation` — expectativa → **hooks de video**
- `mysterious` — intriga → **hooks tipo "¿Sabías que...?"**
- `triumphant` — victoria, logro → **cierres de video**

#### Emociones para momentos específicos del libreto
- **Hook**: `anticipation`, `mysterious`, `excited`
- **Dolor/Problema**: `sympathetic`, `concerned`, `frustrated`
- **Solución**: `confident`, `content`, `proud`
- **Prueba social**: `grateful`, `affectionate`
- **CTA**: `determined`, `enthusiastic`, `excited`
- **Cierre**: `content`, `triumphant`, `calm`

**⚠️ Nota**: Las emociones funcionan mejor con las voces pre-entrenadas etiquetadas como "Emotive" en Cartesia. Con voces clonadas, el efecto puede ser más sutil.

#### Catálogo completo de emociones disponibles
happy, excited, enthusiastic, elated, euphoric, triumphant, amazed, surprised, flirtatious, joking/comedic, curious, content, peaceful, serene, calm, grateful, affectionate, trust, sympathetic, anticipation, mysterious, angry, mad, outraged, frustrated, agitated, threatened, disgusted, contempt, envious, sarcastic, ironic, sad, dejected, melancholic, disappointed, hurt, guilty, bored, tired, rejected, nostalgic, wistful, apologetic, hesitant, insecure, confused, resigned, anxious, panicked, alarmed, scared, neutral, proud, confident, distant, skeptical, contemplative, determined.

---

## 3. Tags SSML inline (control dentro del texto)

Sonic 3 soporta tags SSML directamente en el transcript. Esto permite **cambiar emoción, velocidad y volumen MID-SENTENCE** — mucho más poderoso que los controles globales.

### 3.1 Velocidad inline

```
<speed ratio="1.3"/>Texto rápido aquí. <speed ratio="0.8"/>Y ahora más lento.
```

Rango: 0.6 a 1.5.

### 3.2 Volumen inline

```
<volume ratio="1.5"/>¡ESTO ES IMPORTANTE! <volume ratio="0.7"/>y esto es un detalle.
```

Rango: 0.5 a 2.0.

### 3.3 Emoción inline

```
<emotion value="excited"/>¡Más de treinta mil pacientes recuperados! <emotion value="calm"/>Confía en quienes realmente saben.
```

### 3.4 Pausas y silencios

```
Cemtra.<break time="800ms"/>El primer centro de medicina deportiva del Maule.
```

Formatos: `"1s"` (segundos) o `"500ms"` (milisegundos).
**Costo**: Los tags `<break>` cuentan como 1 carácter cada uno.

### 3.5 Deletreo de números/siglas

```
Llámanos al <spell>(071) 234-5678</spell>
```

Útil para: teléfonos, RUTs, códigos, direcciones.

### 3.6 Risa y no-verbales

```
[laughter] ¡Es increíble lo que logramos!
```

Actualmente solo `[laughter]` está disponible. En el futuro: suspiros, tos, etc.

---

## 4. Combinaciones SSML para publicidad

### 4.1 Hook impactante

```
<emotion value="mysterious"/><speed ratio="0.85"/>¿Sabías que...<break time="600ms"/><emotion value="excited"/><speed ratio="1.1"/>más de treinta mil pacientes ya se recuperaron con nosotros?
```

### 4.2 Dolor → Solución

```
<emotion value="sympathetic"/><speed ratio="0.9"/>Cuando una lesión te frena...<break time="400ms"/>todo cambia.<break time="600ms"/><emotion value="confident"/><speed ratio="1.0"/>Mejor confía en quienes llevan más de diez años devolviendo a deportistas al campo.
```

### 4.3 CTA enérgico

```
<emotion value="determined"/><speed ratio="1.1"/><volume ratio="1.2"/>Agenda tu evaluación hoy.<break time="300ms"/><emotion value="content"/><speed ratio="0.95"/>Cemtra, vuelve más fuerte.
```

### 4.4 Cierre institucional

```
<emotion value="calm"/><speed ratio="0.9"/><volume ratio="0.9"/>Clínica San Javier.<break time="500ms"/>Tecnología y diagnóstico<break time="300ms"/>al servicio de tu salud.
```

---

## 5. Clonación de voces

### 5.1 Requisitos del audio de referencia

| Aspecto | Recomendación |
|---------|---------------|
| **Duración** | 5-10 segundos (sweet spot). Más largo NO mejora el clon |
| **Calidad** | Micrófono de buena calidad, sin ruido de fondo |
| **Contenido** | Hablar con la energía y tono deseado (el clon imita el estilo) |
| **Idioma** | Hablar EN ESPAÑOL si la voz será para español |
| **Pausas** | Evitar pausas largas (el clon las reproduce) |
| **Velocidad** | Hablar a la velocidad deseada del clon |
| **Trimming** | Sin silencio al inicio/final, que no se corte la voz |
| **Formato** | WAV o MP3, mono o stereo |

### 5.2 Modos de clonación

| Modo | Descripción | Cuándo usar |
|------|-------------|-------------|
| **similarity** (default) | Máxima similitud con la voz original | Clonar una voz específica reconocible |
| **stability** | Más estable y consistente, menos similar | Voces para uso intensivo en producción |

### 5.3 Clonación via API

```
POST https://api.cartesia.ai/voices/clone
Content-Type: multipart/form-data

clip: <archivo de audio>
name: "Nombre de la voz"
language: "es"
description: "Descripción del perfil vocal"
```

### 5.4 Tips para mejores clones

1. **Grabar con el tono publicitario deseado** — no leer monótonamente
2. **Evitar reverberación** — grabar en espacio pequeño o tratado acústicamente
3. **Sin música de fondo** — el modelo la reproduce como ruido
4. **Hablar con claridad** — articulación limpia, sin muletillas
5. **Probar con frase estándar** antes de usar en producción
6. **Si el clon suena con ruido** → usar `enhance: true` en la API para denoising
7. **Clonar en el idioma destino** — un clon en inglés hablando español suena raro

---

## 6. Integración con videos

### 6.1 Generación de locución para video

1. Escribir el guión completo con tags SSML para énfasis, pausas y emociones
2. Generar audio como MP3 (128kbps, 44100Hz)
3. Verificar duración vs. duración del video
4. Mezclar con ffmpeg:

```bash
# Video + Música + Voz
ffmpeg -i video.mp4 -i musica.wav -i voz.mp3 \
  -filter_complex "[1:a]volume=0.25[music];[2:a]volume=1.0[voice];[music][voice]amix=inputs=2:duration=first" \
  -c:v copy -c:a aac -b:a 192k -shortest output.mp4
```

### 6.2 Niveles de mezcla recomendados

| Componente | Volume | Notas |
|-----------|--------|-------|
| Voz (locución) | 1.0 (100%) | Protagonista absoluta |
| Música de fondo | 0.20-0.30 | Ambiental, no compite |
| Efectos de sonido | 0.15-0.25 | Solo si aplica |

### 6.3 Sincronización voz-video

- Cada escena del libreto debe tener timing definido (frames inicio → fin)
- La locución debe coincidir con las transiciones visuales
- Usar `<break>` para sincronizar pausas con cambios de escena
- Generar segmentos por escena si la sincronización precisa es crítica

---

## 7. Perfiles vocales por tipo de marca

### 7.1 Marca industrial/técnica (RTK)
```json
{
  "generation_config": {
    "speed": 1.05,
    "volume": 1.1,
    "emotion": "confident"
  }
}
```
Voz masculina grave, firme, directa. Sin calidez excesiva.

### 7.2 Marca salud/bienestar (CSJ)
```json
{
  "generation_config": {
    "speed": 0.9,
    "volume": 1.0,
    "emotion": "calm"
  }
}
```
Voz femenina o masculina cálida, pausada, empática.

### 7.3 Marca servicios/seguros (Equos, Meser)
```json
{
  "generation_config": {
    "speed": 1.0,
    "volume": 1.0,
    "emotion": "content"
  }
}
```
Voz profesional equilibrada, transmite seguridad sin agresividad.

### 7.4 Marca transporte (BAC)
```json
{
  "generation_config": {
    "speed": 1.1,
    "volume": 1.1,
    "emotion": "enthusiastic"
  }
}
```
Voz energética, clara, con ritmo dinámico.

### 7.5 Marca cercanía/asesoría (RedAgrupa)
```json
{
  "generation_config": {
    "speed": 0.95,
    "volume": 1.0,
    "emotion": "affectionate"
  }
}
```
Voz cálida, cercana, como un amigo que te aconseja.

---

## 8. Diccionarios de pronunciación

Sonic 3 soporta diccionarios de pronunciación personalizados para corregir la pronunciación de marcas, nombres propios o términos técnicos.

```json
"pronunciation_dict_id": "<DICT_ID>"
```

**Casos de uso para NORA:**
- Pronunciación de nombres de marca: "RTK", "Equos", "ADOS-2"
- Términos médicos: "traumatología", "kinesiología"
- Abreviaciones: "Klgo.", "Dra."
- Direcciones locales: "Av. Chorrillos"

Se crean via API o el playground de Cartesia.

---

## 9. Checklist de calidad

Antes de entregar cualquier audio:

- [ ] ¿La emoción coincide con el momento del libreto?
- [ ] ¿Las pausas están en los lugares correctos (entre ideas, no mid-sentence)?
- [ ] ¿La velocidad es apropiada para la marca?
- [ ] ¿Los nombres propios y marcas se pronuncian correctamente?
- [ ] ¿La duración encaja con la escena/video destino?
- [ ] ¿El volumen es consistente (no hay picos ni caídas)?
- [ ] ¿Se usó `language: "es"` explícitamente?
- [ ] ¿La voz asignada corresponde a la marca según VOCES.md?

---

## 10. Optimización de costos

- Plan Creator: $5/mo → suficiente para ~100 generaciones cortas
- Los tags SSML (`<break>`, `<speed>`, etc.) cuentan como 1 carácter cada uno
- Eliminar espacios alrededor de tags para ahorrar caracteres
- Regenerar solo segmentos específicos si hay correcciones, no el audio completo
- Guardar audios generados en Supabase Storage para reutilización

---

## Referencias

- [Documentación Cartesia](https://docs.cartesia.ai)
- [SSML Tags](https://docs.cartesia.ai/build-with-cartesia/sonic-3/ssml-tags)
- [Volume, Speed, Emotion](https://docs.cartesia.ai/build-with-cartesia/sonic-3/volume-speed-emotion)
- [Clone Voices](https://docs.cartesia.ai/build-with-cartesia/capability-guides/clone-voices)
- [TTS Models](https://docs.cartesia.ai/build-with-cartesia/tts-models)
