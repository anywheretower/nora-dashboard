// Flow diagram data — 4-level structure
// Types: support (blue), gen (green), step (purple), script (orange), qa (amber), pub (red), input (cyan), video (purple-video), na (gray italic)

export const textToImageFlows = [
  {
    id: 'referencia',
    title: 'Referencia',
    subtitle: 'desde banco de imágenes (139+ refs etiquetadas)',
    note: 'Por definir · 4/marca · Selecciona ref por composición, técnica y desplazamiento creativo',
    levels: {
      activador: [{ type: 'support', text: 'imagen-concepto' }, { type: 'input', text: 'banco referencia' }],
      supabase: [{ type: 'gen', text: 'creatividad-referencia' }, { type: 'support', text: 'prompt-master' }, { type: 'step', text: 'paso 4' }],
      comfy: [{ type: 'script', text: 'comfy-text2img' }, { type: 'step', text: 'paso 5' }, { type: 'step', text: 'para_revision' }],
      qa: [{ type: 'qa', text: 'iteración' }, { type: 'qa', text: 'observación' }],
    },
  },
  {
    id: 'original',
    title: 'Original',
    subtitle: 'concepto 100% libre, sin imagen de referencia',
    note: 'Por definir · 3/marca · Prompt construido desde cero basado en identidad de marca',
    levels: {
      activador: [{ type: 'support', text: 'imagen-concepto' }],
      supabase: [{ type: 'gen', text: 'creatividad-original' }, { type: 'support', text: 'prompt-master' }, { type: 'step', text: 'paso 4' }],
      comfy: [{ type: 'script', text: 'comfy-text2img' }, { type: 'step', text: 'paso 5' }, { type: 'step', text: 'para_revision' }],
      qa: [{ type: 'qa', text: 'iteración' }, { type: 'qa', text: 'observación' }],
    },
  },
  {
    id: 'universal',
    title: 'Universal',
    subtitle: 'lienzos genéricos con 65-70% espacio libre para cualquier texto',
    note: 'Por definir · 3/marca · Composición minimalista, elementos en tercio inferior, máximo espacio para overlay',
    levels: {
      activador: [{ type: 'support', text: 'imagen-concepto' }],
      supabase: [{ type: 'gen', text: 'creatividad-universal' }, { type: 'support', text: 'prompt-master' }, { type: 'step', text: 'paso 4' }],
      comfy: [{ type: 'script', text: 'comfy-text2img' }, { type: 'step', text: 'paso 5' }, { type: 'step', text: 'para_revision' }],
      qa: [{ type: 'qa', text: 'iteración' }, { type: 'qa', text: 'observación' }],
    },
  },
  {
    id: 'calendario',
    title: 'Calendario',
    subtitle: 'proactiva por efemérides, feriados y fechas comerciales',
    note: 'Por definir · Busca fechas próximos 15 días · Copy temático vinculado a fecha + marca',
    levels: {
      activador: [{ type: 'input', text: 'web_search' }, { type: 'input', text: 'tabla calendario' }, { type: 'support', text: 'imagen-concepto' }],
      supabase: [{ type: 'gen', text: 'creatividad-calendario' }, { type: 'support', text: 'prompt-master' }, { type: 'step', text: 'paso 4' }],
      comfy: [{ type: 'script', text: 'comfy-text2img' }, { type: 'step', text: 'paso 5' }, { type: 'step', text: 'para_revision' }],
      qa: [{ type: 'qa', text: 'iteración' }, { type: 'qa', text: 'observación' }],
    },
  },
  {
    id: 'requerida',
    title: 'Requerida',
    subtitle: 'desde pedidos de clientes (5 modalidades)',
    note: 'Por definir · 5 modos: solo texto, texto+url, texto+ref, sorpréndeme, completo',
    levels: {
      activador: [{ type: 'input', text: 'tabla requerimientos' }, { type: 'support', text: 'imagen-concepto' }],
      supabase: [{ type: 'gen', text: 'creatividad-requerida' }, { type: 'support', text: 'prompt-master' }, { type: 'step', text: 'paso 4' }],
      comfy: [{ type: 'script', text: 'comfy-text2img' }, { type: 'step', text: 'paso 5' }, { type: 'step', text: 'para_revision' }],
      qa: [{ type: 'qa', text: 'iteración' }, { type: 'qa', text: 'observación' }],
    },
  },
]

export const pantallaFlow = {
  id: 'pantalla',
  title: 'Pantalla',
  subtitle: 'versiones 16:9 para TVs en salas de espera',
  note: 'Por definir · Sin concepto ni prompt-master (recicla) · Sin iteración · Solo observación',
  levels: {
    activador: [{ type: 'input', text: 'prompt existente' }],
    supabase: [{ type: 'gen', text: 'creatividad-pantalla' }, { type: 'step', text: 'paso 9' }],
    comfy: [{ type: 'script', text: 'comfy-text2img --ratio=16:9' }, { type: 'step', text: 'paso 10' }, { type: 'step', text: 'para_revision' }],
    qa: [{ type: 'qa', text: 'observación' }],
  },
}

export const imgToImgFlow = {
  id: 'producto',
  title: 'Producto / Colaborador / Interior / Exterior / Fachada',
  subtitle: 'edita imagen preservando el sujeto original',
  note: 'Por definir · Prompt ≤600 chars · 5 orígenes · Qwen Image Edit 2511 · Genera 3:4 y 16:9',
  levels: {
    activador: [{ type: 'input', text: 'tabla inputs' }, { type: 'support', text: 'imagen-concepto' }],
    supabase: [{ type: 'gen', text: 'creatividad-producto' }, { type: 'step', text: 'paso 6' }, { type: 'step', text: 'paso 7' }],
    comfy: [{ type: 'script', text: 'comfy-img2img (3:4)' }, { type: 'step', text: 'paso 8' }, { type: 'script', text: 'comfy-img2img (16:9)' }, { type: 'step', text: 'paso 10' }, { type: 'step', text: 'para_revision' }],
    qa: [{ type: 'qa', text: 'iteración' }, { type: 'qa', text: 'observación' }],
  },
}

export const videoMGFlow = {
  id: 'video-mg',
  title: 'Motion Graphics (Remotion)',
  note: 'Concepto, guión, voz TTS, animación TSX, render sale mudo, publicar mezcla audio ffmpeg, QA',
  levels: {
    activador: [{ type: 'support', text: 'video-concepto' }, { type: 'support', text: 'libreto-video' }, { type: 'support', text: 'voz-cartesia' }],
    supabase: [{ type: 'video', text: 'remotion-animacion' }],
    comfy: [{ type: 'script', text: 'render MP4 (mudo)' }, { type: 'pub', text: 'publicar-video' }],
    qa: [{ type: 'qa', text: 'video-iteración' }, { type: 'qa', text: 'video-observación' }],
  },
}

export const videoAIFlow = {
  id: 'video-ai',
  title: 'Video AI (LTX-Video 2)',
  paused: true,
  note: 'Pipeline AI separado — text/image-to-video con lipsync — pendiente validación',
  levels: {
    activador: [{ type: 'support', text: 'prompt-ltxvideo' }],
    supabase: [{ type: 'na', text: 'No aplica' }],
    comfy: [{ type: 'script', text: 'ComfyUI LTX-Video 2' }, { type: 'script', text: 'upscale 720p' }],
    qa: [{ type: 'pub', text: 'publicar-video' }],
  },
}

export const marcaFlows = [
  {
    id: 'marca-nueva',
    title: 'Marca Nueva',
    subtitle: 'crea identidad completa desde cero para clientes nuevos',
    note: 'Manual · Crea ficha, arquetipo, paleta, look and feel, notas, escenarios, prohibido, logos',
    levels: {
      activador: [{ type: 'input', text: 'web_search' }, { type: 'input', text: 'sitio web cliente' }],
      supabase: [{ type: 'pub', text: 'marca-nueva' }],
      comfy: [{ type: 'na', text: 'No aplica' }],
      qa: [{ type: 'na', text: 'No aplica' }],
    },
  },
  {
    id: 'ficha-marca',
    title: 'Ficha de Marca',
    subtitle: 'audita y mejora ficha + arquetipo (texto)',
    note: 'Por definir · Evalúa ficha contra estructura ideal, reescribe con insumos disponibles',
    levels: {
      activador: [{ type: 'input', text: 'web_search' }, { type: 'input', text: 'ficha existente' }],
      supabase: [{ type: 'support', text: 'ficha-marca' }],
      comfy: [{ type: 'na', text: 'No aplica' }],
      qa: [{ type: 'na', text: 'No aplica' }],
    },
  },
  {
    id: 'mejora-marca',
    title: 'Mejora Marca',
    subtitle: 'ingeniería inversa visual: paleta + look + notas + prohibido',
    note: 'Por definir · Analiza creatividades aprobadas para mejorar instrucciones escritas de marca',
    levels: {
      activador: [{ type: 'input', text: 'creatividades aprobadas' }],
      supabase: [{ type: 'support', text: 'mejora-marca' }],
      comfy: [{ type: 'na', text: 'No aplica' }],
      qa: [{ type: 'na', text: 'No aplica' }],
    },
  },
]

export const legend = [
  { text: 'input', type: 'input', label: 'fuente datos' },
  { text: 'soporte', type: 'support', label: 'skill apoyo' },
  { text: 'generación', type: 'gen', label: 'skill genera' },
  { text: 'paso N', type: 'step', label: 'estado Supabase' },
  { text: 'script', type: 'script', label: 'ejecución GPU' },
  { text: 'QA', type: 'qa', label: 'control calidad' },
  { text: 'pub', type: 'pub', label: 'publicación' },
]
