---
name: nora-publicar-video
description: Preparar y registrar videos aprobados en la plataforma NORA. Incluye adaptación de formato 9:16 → 4:5, render de ambas versiones, subida a Supabase Storage, y registro de creatividad con todos los campos correctos.
id: nora-publicar-video
---

# Skill: nora-publicar-video — Publicación de videos en NORA

> **Última revisión:** 2026-02-21 20:30 CLT

## Cuándo se usa

Cuando un video está **aprobado por Jorge** y debe quedar registrado correctamente en la plataforma NORA para publicación en redes sociales.

## Prerrequisitos

- Video aprobado en formato 9:16 (1080×1920) — archivo TSX en `remotion-nora/src/`
- Versión 4:5 (1080×1350) — archivo `{Original}Feed.tsx`
- Música generada con MusicGen (archivo WAV en `public/music/`)
- Copy de publicación definido (sale del libreto)

## Proceso completo

### Paso 1: Adaptar TSX de 9:16 → 4:5

Crear una copia del TSX original con las siguientes adaptaciones para 1080×1350:

**Reglas de adaptación (reframe inteligente, NO video nuevo):**

1. **Resolución**: 1080×1350 (4:5) — 570px menos de alto que 1080×1920
2. **Factor de escala vertical**: 1350/1920 ≈ 0.703 — usar como referencia para ajustes
3. **Textos**: reducir fontSize al ~85-90% del original. Mantener legibilidad
4. **Imágenes a pantalla completa**: mantener `objectFit: "cover"` — el crop natural se encarga
5. **Posiciones absolutas (top/bottom %)**: mantener porcentajes, el formato más cuadrado los adapta
6. **Gaps y paddings**: reducir proporcionalmente (~75% del original)
7. **Logo cierre**: mantener tamaño (el espacio es suficiente en 4:5)
8. **Elementos decorativos (círculos, partículas)**: ajustar posiciones para que no queden cortados
9. **maxWidth de textos**: puede mantenerse o reducir ligeramente si se sale del frame
10. **Timing/frames**: IDÉNTICOS al original — misma duración, mismas transiciones
11. **Efectos y animaciones**: IDÉNTICOS — mismos springs, staggers, interpolations
12. **Colores y paleta**: IDÉNTICOS
13. **Imágenes y logos**: MISMOS archivos

**Naming del archivo**: `{Original}Feed.tsx` (ej: `RedAgrupaVideo2Feed.tsx`)

**Composition en Root.tsx**: Registrar con `width={1080} height={1350}`

### Paso 2: Poster frame (OBLIGATORIO)

Agregar un frame estático al inicio del video para que el feed muestre una imagen atractiva como thumbnail.

**Implementación en el TSX (tanto original como Feed):**

1. Crear una `<Sequence from={0} durationInFrames={1}>` como primer hijo del componente
2. Contenido: snapshot estático de una escena atractiva del medio del video (ej: imagen con texto completo visible)
3. **Sin animaciones**: todo con `opacity: 1`, sin springs, sin interpolations — es un frame congelado
4. Desplazar todas las demás secuencias `+1 frame` (sumar 1 a todos los `from`)
5. Actualizar `durationInFrames` total del composition en `Root.tsx` (+1)
6. Aplicar a **ambas versiones** (9:16 y 4:5) con font sizes correspondientes

**Variabilidad**: cada video debe usar una creatividad/escena distinta como poster → feed diverso, no repetitivo.

**Ejemplo:**
```tsx
// Poster frame — snapshot estático de S04
<Sequence from={0} durationInFrames={1}>
  <AbsoluteFill style={{ backgroundColor: '#1E2A2A' }}>
    <Img src={staticFile('images/creatividad_123.png')} 
         style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
    <div style={{ position: 'absolute', bottom: '15%', left: '8%', 
                  color: 'white', fontSize: 48, fontWeight: 700 }}>
      Texto principal visible
    </div>
  </AbsoluteFill>
</Sequence>

// S01 ahora empieza en from={1} en vez de from={0}
<Sequence from={1} durationInFrames={90}>
  ...
</Sequence>
```

### Paso 3: Renderizar ambas versiones

```bash
# 9:16 (historia)
cd remotion-nora
npx remotion render {CompositionId} out/{marca}_video_{id}_916.mp4

# 4:5 (feed)  
npx remotion render {CompositionIdFeed} out/{marca}_video_{id}_45.mp4
```

### Paso 4: Mezclar música de fondo (OBLIGATORIO)

⚠️ **Remotion renderiza SIN audio real** — la pista de audio sale en silencio (-91 dB). SIEMPRE mezclar la música por separado con ffmpeg.

```bash
# Para cada versión (4:5 y 16:9):
ffmpeg -i video_sin_audio.mp4 -i public/music/{musica}.wav -c:v copy -c:a aac -b:a 192k -map 0:v -map 1:a -shortest video_con_audio.mp4 -y
```

**Verificar que el audio tiene volumen real antes de subir:**
```bash
ffmpeg -i video_con_audio.mp4 -af volumedetect -f null NUL
# mean_volume debe ser entre -20 dB y -5 dB
# Si mean_volume < -80 dB → el audio es silencio, algo falló
```

**Si el video ya existe con música** (ej: reutilizar audio de versión anterior):
```bash
# Extraer audio del video original:
ffmpeg -i video_original.mp4 -vn -c:a copy audio_extraido.aac -y
# Mezclar con el nuevo render:
ffmpeg -i nuevo_render.mp4 -i audio_extraido.aac -c:v copy -c:a aac -b:a 192k -map 0:v -map 1:a -shortest video_final.mp4 -y
```

### Paso 5: Subir a Supabase Storage

Bucket: `creatividades`
Carpeta: `creatividades/`

```
creatividades/{marca}_video_{id}_45.mp4   → para link_ren_1
creatividades/{marca}_video_{id}_916.mp4  → para link_ren_2
```

### Paso 6: Registrar creatividad en Supabase

**Campos OBLIGATORIOS:**

| Campo | Valor | Notas |
|-------|-------|-------|
| `created_at` | timestamp actual | Se genera automáticamente |
| `marca` | nombre de la marca | Exacto como aparece en tabla marcas |
| `concepto` | JSON del libreto | Ver estructura abajo |
| `copy` | texto de publicación | Para caption en redes sociales |
| `link_ren_1` | URL Supabase del video **4:5** | Para feed |
| `link_ren_2` | URL Supabase del video **9:16** | Para historia/reels |
| `condicion` | `"para_revision"` | Estado por defecto al subir |
| `origen` | `"video"` | Siempre "video" |

**Estructura del JSON en `concepto`:**

```json
{
  "libreto": "Nombre/tema del libreto",
  "framework": "A|B|C",
  "hook_tipo": 1-5,
  "templates": ["Template1", "Template2", ...],
  "paleta": "A|B|C",
  "duracion_s": 21.3,
  "escenas": 7,
  "orientacion": "vertical",
  "resolucion": "1080x1920",
  "fondo": "descripción del fondo musical",
  "imagenes_ids": [538, 537, 609],
  "musica": "nombre_archivo_musica.wav"
}
```

### Paso 7: Notificar

Confirmar por Telegram que el video quedó subido con ambos formatos y todos los campos.

## Campos que NO se usan en videos

- `estado` — no se usa, solo `condicion`
- `prompt` — no aplica
- `url` — no aplica (es para imágenes input)
- `observacion` — se usa después si hay correcciones
- `resultado_final` — no se usa en videos

## Conexión Supabase

Ver `skills/shared/SUPABASE.md` para URL, headers y encoding.
