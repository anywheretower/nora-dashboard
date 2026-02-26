---
name: nora-creatividad-requerida
description: Generar creatividades de imagen a partir de requerimientos de clientes (tabla `requerimientos` de Supabase). Interpreta pedidos en texto libre, imágenes adjuntas del cliente (url) y/o referencias del banco interno (url_ref). Detecta automáticamente la modalidad del requerimiento y genera la creatividad adaptada. Pipeline text2img → comfy-text2img.mjs. Aplica para generación individual o en lote por marca.
id: nora-creatividad-requerida
---

# Creatividad Requerida - Skill de generación desde requerimientos de clientes para NORA

> **Última revisión:** 2026-02-23 00:20 (GMT-3) - creación inicial

## Dependencias

### Pipeline de 3 pasos:
1. **Paso 1 - Concepto** (`nora-imagen-concepto`): define la dirección creativa (QUÉ y POR QUÉ)
2. **Paso 2 - Esta skill** (requerida): interpreta el requerimiento del cliente, escribe copy/campos, construye prompt
3. **Paso 3 - Prompt-master** (`nora-prompt-master`): se aplica como validación final del prompt - estructura de 6 bloques, frases probadas, negativos, checklist

Flujo: **Concepto → Requerida (construye prompt) → Prompt-master (valida/optimiza) → Insertar en Supabase paso 4**

> **Nota**: Los 3 pasos se ejecutan en una sola corrida. No son procesos separados - NORA aplica concepto, construye el prompt según esta skill, valida con prompt-master, e inserta en Supabase.

## Idioma de trabajo

Ver `skills/shared/IDIOMA.md` para reglas de idioma español/inglés y `skills/shared/SUPABASE.md` para encoding y conexión. Ver `shared/SCHEMA.md` y `shared/PIPELINE.md` para esquema de tablas y flujo completo.

## Cuándo se activa

- **Automático**: todos los días a las 22:00 hrs - revisa tabla `requerimientos` buscando pendientes en cualquiera de las 5 modalidades, y los procesa
- **Por pedido de Jorge**: cuando Jorge solicita procesar requerimientos específicos

## Proceso completo

### Paso 1: Cargar identidad de marca

Cargar campos de marca desde Supabase (ver shared/SCHEMA.md tabla `marcas`): ficha, arquetipo, paleta_colores, look_and_feel, notas_generales, contenido_prohibido, logos.

### Paso 1b: Revisar creatividades anteriores con resultado final

Antes de interpretar requerimientos, consultar las creatividades previas de la marca que **ya están validadas** (campo `condicion` = `resultado_final` o `aprobado`):

```
creatividades?marca=eq.{marca}&condicion=in.(resultado_final,aprobado)&select=id,concepto,slogan_headline,subtitulo,cta,copy
```

De esta revisión extraer:
- **Conceptos ya usados** - para no repetirlos, o si se repite un territorio temático, darle un ángulo visual y editorial completamente distinto
- **Titulares y CTAs anteriores** - para variar formatos y estructuras (si los anteriores fueron afirmaciones, usar preguntas o declaraciones)
- **Tono editorial previo** - para asegurar diversidad en el contenido global de la marca

### Paso 2: Consultar requerimientos pendientes

Consultar tabla `requerimientos` filtrando por marca y estado pendiente:

```
requerimientos?marca=eq.{marca}&estado=eq.pendiente&select=id,requerimiento,url,url_ref
```

**Filtros obligatorios:**
- Ignorar requerimientos cuyo campo `requerimiento` sea exactamente `"test"` (case-insensitive)
- Procesar solo los que estén en estado pendiente

### Paso 3: Detectar modalidad del requerimiento

Cada requerimiento se clasifica automáticamente según los campos presentes:

| Modalidad | `requerimiento` (texto) | `url` (imagen cliente) | `url_ref` (referencia banco) | Descripción |
|---|---|---|---|---|
| **Solo texto** | ✅ | - | - | Cliente describe lo que quiere en palabras. Concepto nace 100% del texto. |
| **Texto + URL cliente** | ✅ | ✅ | - | Cliente adjunta imagen propia + descripción. La imagen guía la dirección visual. |
| **Texto + URL referencia** | ✅ | - | ✅ | Cliente describe + se asignó referencia del banco interno. Combinar ambas. |
| **Sorpréndeme** | - | - | ✅ | Solo hay referencia del banco, sin texto del cliente. Interpretar libremente la referencia adaptada a la marca. |
| **Completo** | ✅ | ✅ | ✅ | Tiene todo: texto del cliente, imagen adjunta y referencia del banco. Máxima información disponible. |

### Paso 4: Interpretar según modalidad

#### Modalidad: Solo texto
1. Leer el campo `requerimiento` como briefing del cliente
2. Extraer: qué quiere comunicar, qué elementos visuales sugiere, qué tono pide
3. Idear concepto creativo que responda al pedido usando los motores de `nora-imagen-concepto`
4. Construir prompt **desde cero** (como skill original) basándose en el briefing

#### Modalidad: Texto + URL cliente
1. Leer el campo `requerimiento` como briefing
2. Analizar la imagen en `url` - esta es una imagen que el cliente adjuntó como dirección visual
3. La imagen del cliente indica estilo, composición o elementos que quiere ver reflejados
4. Idear concepto que combine el briefing escrito + la dirección visual de la imagen del cliente
5. Construir prompt integrando elementos de la imagen del cliente adaptados a la marca

#### Modalidad: Texto + URL referencia
1. Leer el campo `requerimiento` como briefing
2. Usar la imagen en `url_ref` como referencia visual (igual que skill referencia)
3. Partir del prompt base de la referencia del banco y adaptarlo al briefing del cliente
4. Construir prompt combinando la referencia del banco + las instrucciones del cliente

#### Modalidad: Sorpréndeme (solo url_ref)
1. No hay texto del cliente - interpretar libremente
2. Usar la imagen en `url_ref` como punto de partida (como skill referencia)
3. Adaptar la referencia a la identidad de marca de forma creativa
4. Mayor libertad creativa: elegir ángulo editorial que mejor funcione para la marca

#### Modalidad: Completo (texto + url + url_ref)
1. Leer el campo `requerimiento` como briefing principal
2. Analizar `url` (imagen del cliente) como dirección visual del cliente
3. Usar `url_ref` (referencia del banco) como base compositiva/técnica
4. Triangular las 3 fuentes: lo que el cliente pide + lo que muestra + la referencia profesional
5. Construir prompt que honre las 3 fuentes, priorizando: briefing > imagen cliente > referencia banco

### Paso 5: Construir el prompt

Independiente de la modalidad, el prompt debe:

1. **Describir la escena completa** - Elementos visuales, posiciones, relaciones
2. **Integrar colores de marca** - Colores y degradados de fondo desde `paleta_colores`, escenarios desde `notas_generales`
3. **Aplicar la vibra de marca** - Atmósfera desde `look_and_feel`, arquetipo como guía de tono
4. **Honrar el requerimiento del cliente** - El pedido del cliente es la prioridad; la creatividad se adapta, no se ignora
5. **Verificar contra contenido prohibido**
6. **Aplicar todas las reglas de prompt-master** (`skills/nora-prompt-master/SKILL.md`): estructura de 6 bloques, frases probadas, fondos según paleta, negativos obligatorios, checklist de validación
7. **Resultado**: prompt en inglés + negativo en inglés, descriptivos, orientados a imagen

**Importante**: El negativo se genera según las reglas de `nora-prompt-master` y se usa en el workflow de ComfyUI (no se almacena en Supabase — el campo `negativo` no existe en la tabla creatividades).

### Paso 6: Insertar en Supabase

Insertar en tabla `creatividades` con **todos** estos campos obligatorios para paso 4:

**Estado y metadata:**
- `marca`: nombre exacto de la marca (texto, FK)
- `estado`: `"paso 4"` (exacto, así lo recoge el pipeline)
- `origen`: `"requerido"` (indica que se generó desde tabla requerimientos)

**Imagen:**
- `prompt`: prompt en inglés construido en paso 5 y validado con prompt-master
- `url`: URL de la referencia usada (campo `url_ref` del requerimiento) - si la modalidad incluye referencia del banco. Si no hay `url_ref`, dejar null.
- `gatillador`: instrucciones en español de lo que se quiere lograr. Incluir:
  - Resumen del requerimiento del cliente
  - Si hay `url_ref`: `"Se debe usar esta url: {url_ref}"` (para que ComfyUI use la referencia)
  - Si hay `url` (imagen del cliente): `"Imagen adjunta del cliente: {url}"` (como contexto, no como referencia de ComfyUI)

**Concepto y copy:**
- `concepto`: descripción breve del concepto creativo (1-2 líneas)
- `slogan_headline`: ver **Guía de textos creativos** más abajo
- `subtitulo`: ver **Guía de textos creativos** más abajo
- `cta`: ver **Guía de textos creativos** más abajo
- `copy`: ver **Guía de textos creativos** más abajo
- `descripcion_corta`: qué comunica la creatividad y por qué, mencionando que responde a un requerimiento del cliente

### Guía de textos creativos (slogan_headline, subtitulo, cta, copy)

Ver **`skills/shared/GUIA-TEXTOS.md`** para la guía completa: principios, campo por campo, diversidad editorial y validación de tono contra segmento.

**Estrategia** (extraer de la ficha de marca y adaptar a esta creatividad específica):
- `buyer_persona`: perfil del público objetivo al que apunta esta pieza
- `dolor_anhelo`: pain point + deseo del cliente que esta creatividad aborda
- `cambio_emocional`: transformación emocional "De X → a Y"
- `diferenciador`: qué hace diferente a la marca (relevante para esta pieza)
- `beneficios`: beneficios clave que comunica esta creatividad
- `objeciones_tipicas`: objeciones que esta pieza responde

**Assets:**
- `logo`: URLs de logos de la marca separados por `|` (copiar de tabla `marcas` campo `logos`)

**Dejar en null:** `link_ren_1`, `link_ren_2`, `condicion`, `observacion` (se llenan después por el pipeline o revisión).

### Paso 7: Actualizar estado del requerimiento

Después de insertar la creatividad exitosamente, actualizar el requerimiento en tabla `requerimientos`:

```
PATCH requerimientos?id=eq.{id}
{ "estado": "procesado" }
```

Esto evita que el mismo requerimiento se procese dos veces.

### Paso 8: Validar

- Confirmar que el registro se insertó correctamente en `creatividades`
- Confirmar que el requerimiento se marcó como procesado
- Verificar que no se violó contenido prohibido
- El pipeline n8n + ComfyUI procesará la imagen automáticamente via `comfy-text2img.mjs`

## Generación en lote

Para múltiples requerimientos de una marca:
1. Cargar identidad de marca una vez (Paso 1)
2. Revisar creatividades con resultado final (Paso 1b)
3. Consultar todos los requerimientos pendientes (Paso 2)
4. Filtrar los "test"
5. Clasificar cada uno por modalidad (Paso 3)
6. Interpretar y construir prompt para cada uno (Pasos 4-5)
7. Insertar todos en Supabase (Paso 6)
8. Marcar todos como procesados (Paso 7)
9. Reportar resumen: id del requerimiento, modalidad detectada, concepto generado

## Diferencia con otras skills de generación

| Aspecto | referencia | original | **requerida** |
|---|---|---|---|
| Punto de partida | Imagen del banco | Concepto propio | Pedido del cliente |
| Campo `origen` | `"referencia"` | `"original"` | `"requerido"` |
| Campo `url` en creatividad | URL referencia banco | null | URL referencia banco (si hay `url_ref`) o null |
| Quién decide el concepto | NORA elige referencia | NORA idea desde cero | El cliente guía, NORA interpreta |
| Modalidades | Una sola (siempre con referencia) | Una sola (siempre sin referencia) | 5 modalidades según campos presentes |
| Tabla fuente | `referencia` | - | `requerimientos` |
| Cuándo usar | Generación proactiva con banco | Generación proactiva sin banco | Cuando hay pedidos de clientes pendientes |
