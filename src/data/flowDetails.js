// Maps flow box text → detail data for the sidebar
// Types: 'skill', 'script', 'step', 'input', 'info'

import {
  protocoloCard,
  nivel1Skills,
  nivel2Concepto,
  nivel2T2iSkills,
  nivel2Producto,
  nivel2PromptMaster,
  nivel3Skills,
  nivel4VideoConcepto,
  nivel4GridSkills,
  nivel4Remotion,
  nivel4PublicarVideo,
  nivel4LtxVideo,
  nivel5Skills,
} from './skills'
import { scripts } from './scripts'

// Build a lookup of all skills by id
const allSkills = [
  protocoloCard,
  ...nivel1Skills,
  nivel2Concepto,
  ...nivel2T2iSkills,
  nivel2Producto,
  nivel2PromptMaster,
  ...nivel3Skills,
  nivel4VideoConcepto,
  ...nivel4GridSkills,
  nivel4Remotion,
  nivel4PublicarVideo,
  nivel4LtxVideo,
  ...nivel5Skills,
]

const skillMap = {}
allSkills.forEach(s => { skillMap[s.id] = s })

const scriptMap = {}
scripts.forEach(s => { scriptMap[s.id] = s })

// Step info cards
const stepDetails = {
  'paso 4': {
    type: 'step',
    title: 'Paso 4 — Prompt Listo',
    icon: '📝',
    description: 'Prompt text2img listo en Supabase. La creatividad tiene prompt, copy, campos completos. Esperando ejecución de comfy-text2img.mjs',
    color: 'var(--flow-step-color)',
  },
  'paso 5': {
    type: 'step',
    title: 'Paso 5 — Imagen Generada',
    icon: '🖼️',
    description: 'Imagen 3:4 generada por ComfyUI y subida a Supabase Storage. Campo link_ren_2 actualizado con URL de la imagen.',
    color: 'var(--flow-step-color)',
  },
  'paso 6': {
    type: 'step',
    title: 'Paso 6 — Prompt Edición',
    icon: '✏️',
    description: 'Prompt de edición img2img listo (≤600 chars). La creatividad tiene imagen original (url) + prompt de edición. Esperando paso 7.',
    color: 'var(--flow-step-color)',
  },
  'paso 7': {
    type: 'step',
    title: 'Paso 7 — Edición 3:4',
    icon: '🔄',
    description: 'Disparada la edición img2img ratio 3:4. comfy-img2img.mjs descarga imagen original, aplica prompt de edición vía Qwen Image Edit.',
    color: 'var(--flow-step-color)',
  },
  'paso 8': {
    type: 'step',
    title: 'Paso 8 — Imagen Editada 3:4',
    icon: '✅',
    description: 'Imagen editada 3:4 generada y subida. Campo link_ren_1 actualizado. Lista para revisión.',
    color: 'var(--flow-step-color)',
  },
  'paso 9': {
    type: 'step',
    title: 'Paso 9 — Generación 16:9',
    icon: '📺',
    description: 'Disparada la generación 16:9 para pantallas. Scripts dedicados: comfy-text2img-pantalla (imagen) o comfy-img2img-pantalla (colaborador).',
    color: 'var(--flow-step-color)',
  },
  'paso 10': {
    type: 'step',
    title: 'Paso 10 — Imagen 16:9 Lista',
    icon: '🏁',
    description: 'Imagen 16:9 (1920×1080) generada y subida a Supabase Storage. Campo link_ren_1 actualizado. Lista para revisión.',
    color: 'var(--flow-step-color)',
  },
  '1920×1080': {
    type: 'step',
    title: 'Resolución 1920×1080',
    icon: '📐',
    description: 'Imagen generada en resolución real 1920×1080 (16:9) para pantallas y televisores. Script: comfy-text2img-pantalla.mjs.',
    color: 'var(--flow-step-color)',
  },
  'pad blanco 1920×1080': {
    type: 'step',
    title: 'Pad Blanco 1920×1080',
    icon: '📐',
    description: 'La foto original (1104×1472) se escala a 810×1080 manteniendo proporción y se centra en un lienzo blanco de 1920×1080. ~555px blancos a cada lado. Qwen Image Edit rellena los espacios blancos con el entorno del prompt, preservando la persona/producto intacta sin deformaciones.',
    color: 'var(--flow-step-color)',
  },
  'subir a Supabase': {
    type: 'step',
    title: 'Subir Video a Supabase',
    icon: '☁️',
    description: 'Paso MANUAL obligatorio para video pantalla. A diferencia de los scripts de imagen (que suben automáticamente), el video renderizado queda en disco local. Subir a Supabase Storage bucket creatividades y actualizar link_ren_1 + estado paso 10.',
    color: 'var(--flow-step-color)',
  },
  'duplicar TSX → Pantalla': {
    type: 'step',
    title: 'Reframe TSX 9:16 → 16:9',
    icon: '📐',
    description: 'Duplicar archivo TSX con sufijo Pantalla. Reframe inteligente: layout vertical → horizontal (texto+imagen lado a lado), fontSize -25%, maxWidth +50%, recalcular posiciones absolutas, 2 columnas para listas. Timing, efectos, colores, imágenes y audio: IDÉNTICOS al original.',
    color: 'var(--flow-step-color)',
  },
  'link_ren_2': {
    type: 'step',
    title: 'Imagen Intermedia (link_ren_2)',
    icon: '🖼️',
    description: 'Se guarda la imagen intermedia (persona centrada en lienzo blanco) en el campo link_ren_2 de Supabase. Permite verificar el input que recibe Qwen y diagnosticar problemas de deformación.',
    color: 'var(--flow-step-color)',
  },
  'para_revision': {
    type: 'step',
    title: 'Para Revisión',
    icon: '👁️',
    description: 'Creatividad lista para revisión. Pasa por iteración automática (score ≥4.0) y luego revisión de Jorge. Puede terminar en: aprobado, observado, o iteracion_resuelta.',
    color: 'var(--flow-step-color)',
  },
}

// Input info cards
const inputDetails = {
  'banco referencia': {
    type: 'input',
    title: 'Banco de Referencia',
    icon: '📸',
    description: 'Tabla `referencia` en Supabase. 139+ imágenes etiquetadas con 8 categorías (composición, técnica, sujeto, metáfora, elementos, emoción, paleta, rubro). 56 marcadas como desplazamiento-alto para creatividad cross-rubro.',
    color: 'var(--flow-input-color)',
  },
  'tabla calendario': {
    type: 'input',
    title: 'Tabla Calendario',
    icon: '📅',
    description: 'Tabla `calendario` en Supabase. Fechas por 3 niveles de herencia: nacionales (aplica a todas), por rubro, por marca específica. 33+ fechas cargadas.',
    color: 'var(--flow-input-color)',
  },
  'tabla requerimientos': {
    type: 'input',
    title: 'Tabla Requerimientos',
    icon: '📋',
    description: 'Tabla `requerimientos` en Supabase. Pedidos de clientes con: texto libre, url (imagen adjunta), url_ref (imagen del banco). 5 modalidades de generación.',
    color: 'var(--flow-input-color)',
  },
  'tabla inputs': {
    type: 'input',
    title: 'Tabla Inputs',
    icon: '📦',
    description: 'Tabla `inputs` en Supabase. Datos reales de productos/colaboradores: título, subtítulo, CTA, descripción, link, categoría (Producto/Colaborador/Interior/Exterior/Fachada).',
    color: 'var(--flow-input-color)',
  },
  'prompt existente': {
    type: 'input',
    title: 'Prompt Existente',
    icon: '♻️',
    description: 'Recicla el prompt de una creatividad existente aprobada y lo adapta a composición horizontal 16:9 para televisores en salas de espera.',
    color: 'var(--flow-input-color)',
  },
  'web_search': {
    type: 'input',
    title: 'Web Search (Brave API)',
    icon: '🌐',
    description: 'Búsqueda en internet (Brave API) para descubrir efemérides, feriados y fechas comerciales relevantes al rubro de cada marca en los próximos 15 días.',
    color: 'var(--flow-input-color)',
  },
  'sitio web cliente': {
    type: 'input',
    title: 'Sitio Web del Cliente',
    icon: '🌐',
    description: 'Página web del cliente. Se analiza para extraer identidad visual, propuesta de valor, servicios, tono de comunicación y público objetivo.',
    color: 'var(--flow-input-color)',
  },
  'ficha existente': {
    type: 'input',
    title: 'Ficha Existente',
    icon: '📄',
    description: 'Ficha de marca actual en Supabase. Se evalúa contra la estructura ideal de 13 secciones para identificar vacíos y oportunidades de mejora.',
    color: 'var(--flow-input-color)',
  },
  'creatividades aprobadas': {
    type: 'input',
    title: 'Creatividades Aprobadas',
    icon: '✅',
    description: 'Creatividades con condicion=resultado_final. Se analizan visualmente para extraer patrones que funcionan y mejorar las instrucciones escritas de marca (paleta, look&feel, notas, prohibido).',
    color: 'var(--flow-input-color)',
  },
  'creatividad t2i aprobada': {
    type: 'input',
    title: 'Creatividad T2I Aprobada',
    icon: '🖼️',
    description: 'Creatividad text-to-image con condicion=resultado_final. Se toma su prompt y se adapta la composición a formato horizontal 16:9 para pantallas TV.',
    color: 'var(--flow-input-color)',
  },
  'creatividad i2i aprobada': {
    type: 'input',
    title: 'Creatividad I2I Aprobada',
    icon: '👤',
    description: 'Creatividad img-to-image (colaborador/producto) con condicion=resultado_final. Se toma la foto original del sujeto y se adapta el prompt de edición a composición horizontal 16:9.',
    color: 'var(--flow-input-color)',
  },
  'foto original (url)': {
    type: 'input',
    title: 'Foto Original del Sujeto',
    icon: '📷',
    description: 'Imagen original del colaborador/producto (campo url de la creatividad origen). Qwen Image Edit preserva al sujeto intacto y edita solo el entorno adaptándolo a 16:9.',
    color: 'var(--flow-input-color)',
  },
  'creatividad video aprobada': {
    type: 'input',
    title: 'Creatividad Video Aprobada',
    icon: '🎬',
    description: 'Creatividad de video con condicion=resultado_final. Se identifica el archivo TSX de Remotion original para duplicarlo y adaptarlo a formato horizontal 1920×1080.',
    color: 'var(--flow-input-color)',
  },
  'archivo TSX Remotion': {
    type: 'input',
    title: 'Archivo TSX Remotion',
    icon: '📄',
    description: 'Código fuente del video en React/Remotion (.tsx). Se duplica con nuevas dimensiones 1920×1080 y se adaptan textos, posiciones, tamaños de fuente y animaciones al formato horizontal.',
    color: 'var(--flow-input-color)',
  },
}

// Info cards for non-skill items
const infoDetails = {
  'render MP4 (mudo)': {
    type: 'info',
    title: 'Render MP4 (Mudo)',
    icon: '🎬',
    description: 'Remotion renderiza el video como MP4 en silencio (-91 dB). El audio se mezcla después con ffmpeg en el paso de publicar-video. NUNCA subir el render directo sin mezclar audio.',
    color: 'var(--flow-script-color)',
  },
  'ComfyUI LTX-Video 2': {
    type: 'info',
    title: 'ComfyUI LTX-Video 2',
    icon: '🤖',
    description: 'Pipeline AI de generación de video con LTX-Video 2 vía ComfyUI. Soporta text-to-video e image-to-video con lipsync. Actualmente en desarrollo — se activará cuando el flujo esté validado.',
    color: 'var(--flow-script-color)',
  },
  'upscale 720p': {
    type: 'info',
    title: 'Upscale 720p',
    icon: '🔍',
    description: 'Paso de upscaling que escala el video generado por LTX-Video 2 a resolución 720p. Mejora la calidad visual del output antes de publicar.',
    color: 'var(--flow-script-color)',
  },
  'remotion render 16:9': {
    type: 'info',
    title: 'Remotion Render 16:9',
    icon: '🎬',
    description: 'Renderiza el archivo TSX duplicado en formato 1920×1080 horizontal. El render sale mudo (-91 dB). Se usa npx remotion render con las nuevas dimensiones.',
    color: 'var(--flow-script-color)',
  },
  'ffmpeg mix audio': {
    type: 'info',
    title: 'FFmpeg Mix Audio',
    icon: '🔊',
    description: 'Mezcla el audio original (voz + música) con el video renderizado mudo. Usa ffmpeg para combinar las pistas manteniendo sincronización.',
    color: 'var(--flow-script-color)',
  },
  'video-iteración': {
    type: 'info',
    title: 'Video Iteración (Pendiente)',
    icon: '🔄',
    description: 'Auto-evaluación de videos: ritmo, transiciones, timing, música, lipsync, coherencia visual. Criterios específicos de video. Pendiente — se crea junto con review de skills de video.',
    color: 'var(--flow-qa-color)',
  },
  'video-observación': {
    type: 'info',
    title: 'Video Observación (Pendiente)',
    icon: '👁️',
    description: 'Resuelve observaciones de Jorge en videos: modificar TSX, re-render, mezclar audio, subir versión corregida. Pendiente — se crea junto con review de skills de video.',
    color: 'var(--flow-qa-color)',
  },
}

// Skill mapping: flow box text → skill id
const skillTextMap = {
  'imagen-concepto': 'nora-imagen-concepto',
  'creatividad-referencia': 'nora-creatividad-referencia',
  'creatividad-original': 'nora-creatividad-original',
  'creatividad-universal': 'nora-creatividad-universal',
  'creatividad-calendario': 'nora-creatividad-calendario',
  'creatividad-requerida': 'nora-creatividad-requerida',
  'creatividad-pantalla': 'nora-creatividad-pantalla',
  'creatividad-producto': 'nora-creatividad-producto',
  'prompt-master': 'nora-prompt-master',
  'iteración': 'nora-imagen-iteracion',
  'imagen-iteración': 'nora-imagen-iteracion',
  'observación': 'nora-imagen-observacion',
  'imagen-observación': 'nora-imagen-observacion',
  'video-concepto': 'nora-video-concepto',
  'libreto-video': 'nora-libreto-video',
  'voz-cartesia': 'nora-voz-cartesia',
  'remotion-animacion': 'nora-remotion-animacion',
  'publicar-video': 'nora-publicar-video',
  'prompt-ltxvideo': 'nora-prompt-ltxvideo',
  'marca-nueva': 'nora-marca-nueva',
  'ficha-marca': 'nora-ficha-marca',
  'mejora-marca': 'nora-mejora-marca',
}

// Script mapping: flow box text patterns → script id
const scriptTextPatterns = [
  { pattern: 'comfy-text2img-pantalla', scriptId: 'comfy-text2img-pantalla' },
  { pattern: 'comfy-img2img-pantalla', scriptId: 'comfy-img2img-pantalla' },
  { pattern: 'comfy-text2img', scriptId: 'comfy-text2img' },
  { pattern: 'comfy-img2img', scriptId: 'comfy-img2img' },
]

/**
 * Look up the detail for a flow box by its text.
 * Returns { type, data } or null.
 */
export function getFlowDetail(boxText) {
  if (!boxText) return null

  const text = boxText.trim()

  // Check step details
  if (stepDetails[text]) {
    return stepDetails[text]
  }

  // Check input details
  if (inputDetails[text]) {
    return inputDetails[text]
  }

  // Check info details
  if (infoDetails[text]) {
    return infoDetails[text]
  }

  // Check skill mapping
  if (skillTextMap[text]) {
    const skill = skillMap[skillTextMap[text]]
    if (skill) {
      return { type: 'skill', data: skill }
    }
  }

  // Check script patterns (partial match for variants like "comfy-text2img --ratio=16:9")
  for (const { pattern, scriptId } of scriptTextPatterns) {
    if (text.includes(pattern)) {
      const script = scriptMap[scriptId]
      if (script) {
        return { type: 'script', data: script }
      }
    }
  }

  return null
}
