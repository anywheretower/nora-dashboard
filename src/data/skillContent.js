// Import all SKILL.md files as raw text using Vite's ?raw
import calendarioMd from '../skills/nora-creatividad-calendario/SKILL.md?raw'
import originalMd from '../skills/nora-creatividad-original/SKILL.md?raw'
import pantallaMd from '../skills/nora-creatividad-pantalla/SKILL.md?raw'
import productoMd from '../skills/nora-creatividad-producto/SKILL.md?raw'
import referenciaMd from '../skills/nora-creatividad-referencia/SKILL.md?raw'
import requeridaMd from '../skills/nora-creatividad-requerida/SKILL.md?raw'
import universalMd from '../skills/nora-creatividad-universal/SKILL.md?raw'
import ejecucionMd from '../skills/nora-ejecucion-pipeline/SKILL.md?raw'
import fichaMd from '../skills/nora-ficha-marca/SKILL.md?raw'
import imagenConceptoMd from '../skills/nora-imagen-concepto/SKILL.md?raw'
import iteracionMd from '../skills/nora-imagen-iteracion/SKILL.md?raw'
import observacionMd from '../skills/nora-imagen-observacion/SKILL.md?raw'
import libretoMd from '../skills/nora-libreto-video/SKILL.md?raw'
import marcaNuevaMd from '../skills/nora-marca-nueva/SKILL.md?raw'
import mejoraMarcaMd from '../skills/nora-mejora-marca/SKILL.md?raw'
import ltxVideoMd from '../skills/nora-prompt-ltxvideo/SKILL.md?raw'
import promptMasterMd from '../skills/nora-prompt-master/SKILL.md?raw'
import publicarVideoMd from '../skills/nora-publicar-video/SKILL.md?raw'
import remotionMd from '../skills/nora-remotion-animacion/SKILL.md?raw'
import videoConceptoMd from '../skills/nora-video-concepto/SKILL.md?raw'
import vozCartesiaMd from '../skills/nora-voz-cartesia/SKILL.md?raw'

// Shared files
import guiaTextosMd from '../skills/shared/GUIA-TEXTOS.md?raw'
import supabaseMd from '../skills/shared/SUPABASE.md?raw'
import idiomaMd from '../skills/shared/IDIOMA.md?raw'
import schemaMd from '../skills/shared/SCHEMA.md?raw'
import pipelineMd from '../skills/shared/PIPELINE.md?raw'
import herramientasMd from '../skills/shared/HERRAMIENTAS.md?raw'

const skillContent = {
  'nora-creatividad-calendario': calendarioMd,
  'nora-creatividad-original': originalMd,
  'nora-creatividad-pantalla': pantallaMd,
  'nora-creatividad-producto': productoMd,
  'nora-creatividad-referencia': referenciaMd,
  'nora-creatividad-requerida': requeridaMd,
  'nora-creatividad-universal': universalMd,
  'nora-ejecucion-pipeline': ejecucionMd,
  'nora-ficha-marca': fichaMd,
  'nora-imagen-concepto': imagenConceptoMd,
  'nora-imagen-iteracion': iteracionMd,
  'nora-imagen-observacion': observacionMd,
  'nora-libreto-video': libretoMd,
  'nora-marca-nueva': marcaNuevaMd,
  'nora-mejora-marca': mejoraMarcaMd,
  'nora-prompt-ltxvideo': ltxVideoMd,
  'nora-prompt-master': promptMasterMd,
  'nora-publicar-video': publicarVideoMd,
  'nora-remotion-animacion': remotionMd,
  'nora-video-concepto': videoConceptoMd,
  'nora-voz-cartesia': vozCartesiaMd,
  'shared_GUIA-TEXTOS_md': guiaTextosMd,
  'shared_SUPABASE_md': supabaseMd,
  'shared_IDIOMA_md': idiomaMd,
  'shared_SCHEMA_md': schemaMd,
  'shared_PIPELINE_md': pipelineMd,
  'shared_HERRAMIENTAS_md': herramientasMd,
}

export default skillContent
