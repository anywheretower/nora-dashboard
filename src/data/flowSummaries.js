// Maps flow title identifiers to their summary data
// Used by FlowSummary component in the sidebar

export const flowSummaries = {
  // Section headers
  't2i': {
    label: 'Imagen Text-to-Image',
    icon: '🖼️',
    description: 'Pipeline completo de generación de imágenes desde texto. 6 orígenes distintos, todos pasan por prompt-master y comfy-text2img.mjs.',
    cronSkills: ['referencia', 'original', 'universal', 'calendario', 'requerida', 'pantalla', 'iteración img', 'observación img'],
    scriptIds: ['comfy-text2img'],
  },
  'i2i': {
    label: 'Imagen Img-to-Image',
    icon: '🔄',
    description: 'Pipeline de edición de imagen. Preserva el sujeto original (producto, colaborador, interior, exterior, fachada) y transforma el entorno.',
    cronSkills: ['producto', 'iteración img', 'observación img'],
    scriptIds: ['comfy-img2img'],
  },
  'video': {
    label: 'Video',
    icon: '🎬',
    description: 'Pipeline de video: concepto → libreto → voz TTS → animación Remotion → render MP4 → publicar.',
    cronSkills: [],
    scriptIds: ['upload-video', 'tg-notify', 'video-watcher'],
  },
  'marca': {
    label: 'Marca',
    icon: '🏛️',
    description: 'Gestión de identidad de marca. Onboarding, auditoría de ficha, mejora visual por ingeniería inversa.',
    cronSkills: ['ficha-marca', 'mejora-marca'],
    scriptIds: [],
  },
  'marca-nueva': {
    label: '🆕 Marca Nueva',
    icon: '🆕',
    description: 'Crea identidad completa desde cero para clientes nuevos: ficha, arquetipo, paleta, look&feel, notas, escenarios, prohibido, logos.',
    cronSkills: [],
    scriptIds: [],
  },
  'ficha-marca': {
    label: '📝 Ficha de Marca',
    icon: '📝',
    description: 'Audita y mejora ficha + arquetipo (texto). Evalúa contra estructura ideal, reescribe con insumos disponibles.',
    cronSkills: ['ficha-marca'],
    scriptIds: [],
  },
  'mejora-marca': {
    label: '🎨 Mejora Marca',
    icon: '🎨',
    description: 'Ingeniería inversa visual: analiza creatividades aprobadas para mejorar paleta, look&feel, notas generales y contenido prohibido.',
    cronSkills: ['mejora-marca'],
    scriptIds: [],
  },

  // Individual T2I flows
  'referencia': {
    label: '📸 Referencia',
    icon: '📸',
    description: 'Desde banco de imágenes (139+ refs etiquetadas). 3 creatividades por marca, selecciona refs no usadas.',
    cronSkills: ['referencia', 'iteración img', 'observación img'],
    scriptIds: ['comfy-text2img'],
  },
  'original': {
    label: '🎨 Original',
    icon: '🎨',
    description: 'Concepto 100% libre, sin imagen de referencia. 3 creatividades por marca.',
    cronSkills: ['original', 'iteración img', 'observación img'],
    scriptIds: ['comfy-text2img'],
  },
  'universal': {
    label: '🖼️ Universal',
    icon: '🖼️',
    description: 'Lienzos genéricos con 65-70% espacio libre para cualquier texto. 3 por marca.',
    cronSkills: ['universal', 'iteración img', 'observación img'],
    scriptIds: ['comfy-text2img'],
  },
  'calendario': {
    label: '📅 Calendario',
    icon: '📅',
    description: 'Proactiva por efemérides, feriados y fechas comerciales. Busca próximos 15 días.',
    cronSkills: ['calendario', 'iteración img', 'observación img'],
    scriptIds: ['comfy-text2img'],
  },
  'requerida': {
    label: '📋 Requerida',
    icon: '📋',
    description: 'Desde pedidos de clientes (tabla requerimientos). 5 modalidades de generación.',
    cronSkills: ['requerida', 'iteración img', 'observación img'],
    scriptIds: ['comfy-text2img'],
  },
  'pantalla': {
    label: '📺 Pantalla',
    icon: '📺',
    description: 'Versiones 16:9 para TVs en salas de espera. Recicla prompts existentes, sin iteración.',
    cronSkills: ['pantalla', 'observación img'],
    scriptIds: ['comfy-text2img'],
    scriptNote: 'Usa comfy-text2img.mjs --ratio=16:9',
  },

  // I2I individual
  'producto': {
    label: '🔄 Producto / Colaborador',
    icon: '🔄',
    description: 'Edición de imagen preservando el sujeto original. 5 orígenes (producto, colaborador, interior, exterior, fachada). Qwen Image Edit 2511.',
    cronSkills: ['producto', 'iteración img', 'observación img'],
    scriptIds: ['comfy-img2img'],
  },

  // Video individual
  'video-mg': {
    label: '🎬 Motion Graphics (Remotion)',
    icon: '🎬',
    description: 'Pipeline Motion Graphics: concepto → libreto → voz TTS → animación TSX → render MP4 (mudo) → publicar mezcla audio.',
    cronSkills: [],
    scriptIds: ['upload-video', 'tg-notify', 'video-watcher'],
  },
  'video-ai': {
    label: '⏸ Video AI (LTX-Video 2)',
    icon: '⏸',
    description: 'Pipeline AI de video con LTX-Video 2. Text/image-to-video con lipsync. En desarrollo.',
    cronSkills: [],
    scriptIds: [],
  },
}
