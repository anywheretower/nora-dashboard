---
name: nora-creatividad-producto
description: Generar prompt de edición de imagen para creatividades de producto y colaborador en NORA. Transforma la instrucción breve del gatillador en un prompt completo para Qwen Image Edit 2511, manteniendo el producto o la persona original intacta. Aplica identidad visual de marca al entorno.
id: nora-creatividad-producto
---

# Paso 6 — Skill de prompt para edición de imagen (Qwen Image Edit 2511)

> **Última revisión:** 2026-02-20 19:05 (GMT-3)

## Cuándo se activa

- **Automático**: todos los días a las 02:00 hrs — revisa tabla `creatividades` buscando las que estén en `estado=paso 6`
- **Por pedido de Jorge**: cuando Jorge solicita procesar creatividades de producto específicas

## Qué detecta

Creatividades en `estado=paso 6`. El paso 6 es un **punto de decisión** donde se revisa el `origen` para determinar qué reglas aplicar:

- **`origen=Producto`** → mantener producto intacto, cambiar entorno
- **`origen=Colaborador`** → mantener persona intacta (rostro, ropa), cambiar entorno
- **`origen=Interior`** → PRESERVAR y LIMPIAR espacio interior: remover cables/basura/desorden, corregir exposición, elevar a nivel editorial de arquitectura
- **`origen=Exterior`** → PRESERVAR y LIMPIAR entorno exterior: remover cables/escombros, corregir cielo sobreexpuesto, elevar a nivel editorial
- **`origen=Fachada`** → PRESERVAR y LIMPIAR fachada: remover cables/basura, corregir exposición, elevar a nivel editorial de arquitectura

Todos usan **Qwen Image Edit 2511** (imagen a imagen) y al terminar pasan a `paso 7`.

> **NO aplica nora-prompt-master** — esta skill tiene su propio formato de prompt (≤600 chars, directo para Qwen Image Edit). Prompt-master es solo para text2img.

**Flujo de pasos**: paso 6 (esta skill escribe prompt) → paso 7 (NORA escribe prompt, comfy-img2img genera) → paso 8 (comfy genera 3:4) → paso 10 (comfy genera 16:9). Ver `shared/PIPELINE.md` para el flujo completo.

## Modelo destino

**Qwen Image Edit 2511** — edición de imagen, NO text-to-image. Recibe la imagen original + prompt de edición.

## Idioma de trabajo

Ver `skills/shared/IDIOMA.md` para reglas de idioma español/inglés y `skills/shared/SUPABASE.md` para encoding y conexión. Ver `shared/SCHEMA.md` y `shared/PIPELINE.md` para esquema de tablas y flujo completo.

---

## Proceso completo

### Paso 1: Seleccionar creatividades candidatas

```
creatividades?estado=eq.paso 6&origen=in.(Producto,Colaborador,Interior,Exterior,Fachada)&select=id,marca,url,gatillador,concepto,slogan_headline,subtitulo,cta,origen
```

### Paso 2: Cargar identidad visual de marca

Cargar campos de marca desde Supabase (ver shared/SCHEMA.md tabla `marcas`): ficha, arquetipo, paleta_colores, look_and_feel, notas_generales, contenido_prohibido, logos.

### Paso 2b: Cargar datos del producto (solo para Producto)

**Si `origen=Producto`**: Consultar tabla `inputs` para obtener la descripción completa del producto:

```
inputs?marca=eq.{marca}&categoria=eq.Producto&select=titulo,subtitulo,cta,descripccion
```

Buscar el input que corresponda al producto de la creatividad (por título o coincidencia con el `concepto`). El campo `descripccion` es CLAVE — contiene todos los detalles físicos del producto.

### Paso 3: Analizar la imagen (solo para Producto)

**Si `origen=Producto`**: Usar vision model para entender qué producto es exactamente. Cruzar lo que se ve con la `descripccion` de la tabla `inputs`. Extraer y confirmar:
- **Forma y estructura**: silueta, tamaño relativo, partes principales
- **Colores exactos**: color del cuerpo, mangos, piezas, acentos
- **Textos y etiquetas**: CADA texto visible (marca, modelo, especificaciones, advertencias) — transcribir literalmente
- **Logos y marcas**: posición, tamaño, colores del logo
- **Materiales y acabados**: metálico, plástico, goma, mate, brillante
- **Detalles distintivos**: botones, interruptores, indicadores, puertos, discos, cuchillas, mangueras

Todo esto DEBE aparecer en el prompt. Cuanto más precisa la descripción, menos deformación por parte de Qwen.

**Si `origen=Colaborador`**: NO analizar la imagen. Qwen no necesita descripción de la persona — tras muchas pruebas, funciona mejor sin ella. Solo se usa el `gatillador` + identidad de marca.

### Paso 4: Construir el prompt de edición

El prompt es una **descripción fluida en inglés**, sin secciones ni bullet points.

---

#### 4A: Reglas para PRODUCTO (`origen=Producto`)

**Reglas INQUEBRANTABLES:**
1. Mantener exactamente el mismo producto — misma forma, detalles, logos, etiquetas
2. No añadir accesorios ni elementos nuevos al producto
3. No modificar textos, marcas o etiquetas del producto
4. Iluminación profesional siempre — balance de blancos perfecto, sombras suaves, colores vibrantes

**Lo que SÍ se puede cambiar:**
- Presentación del producto: aspecto nuevo, sin imperfecciones, colores vibrantes
- Tamaño y posición del producto respecto del total de la imagen
- Fondo y entorno completo
- Elementos de contexto: espacios, entornos, arquitectura, decoración coherente
- Ángulo de presentación

**Estructura del prompt:**
1. Instrucción de preservación: "Keep exactly the same product from the original image..."
2. **Descripción EXHAUSTIVA del producto**: trasladar TODA la información del análisis visual + `descripccion` de tabla `inputs`. Incluir:
   - Nombre/modelo exacto del producto
   - Forma, estructura y partes principales
   - Colores exactos de cada parte (cuerpo, mango, acentos)
   - TODOS los textos visibles en etiquetas, logos, especificaciones — transcritos literalmente
   - Materiales y acabados (metálico, plástico, goma, etc.)
   - Detalles distintivos (botones, interruptores, discos, etc.)
3. Nuevo entorno: transformar creativamente el `gatillador`
4. Iluminación profesional
5. Paleta de entorno: inspirada en `paleta_colores` de la marca (solo para fondos, NO para el producto)
6. Detalles de escena: 3-5 elementos concretos
7. Espacio para texto overlay

**⚠️ REGLA DE LONGITUD**: El prompt de edición debe tener **≤600 caracteres**. Prompts de 700+ chars causan timeout/fallo silencioso en ComfyUI (Qwen se cuelga). Entre 500-600 funciona perfecto y permite incluir detalles del producto. Los detalles del producto (etiquetas, textos, colores de componentes) DEBEN ir en el prompt — son esenciales para que Qwen preserve el producto correctamente. Sin ellos, Qwen puede deformar etiquetas o cambiar colores.

**Plantilla base (≤700 chars, CON detalles del producto):**
```
[Acción] this exact [producto con modelo]. Preserve every detail: [color cuerpo] body with [etiquetas literales], [componente 2 + color], [componente 3 + color], [textos visibles]. [2-3 frases describiendo entorno: elementos, colores, atmósfera]. [1 frase de iluminación]. All text markings, logos and labels perfectly legible. Professional [tipo] photography, generous [zona] space for text overlay.
```

**Campo `concepto` (LARGO — sin límite):** Aquí va la descripción exhaustiva completa del producto para registro y referencia. El prompt es una versión condensada pero SIEMPRE incluye etiquetas, textos y colores clave.

---

#### 4B: Reglas para COLABORADOR (`origen=Colaborador`)

**Reglas INQUEBRANTABLES:**
1. Mantener exactamente la misma persona de la foto original — mismo rostro, facciones, peinado, cuerpo
2. Mantener exactamente la misma ropa, colores y estilo de vestimenta — no cambiar outfit, no añadir accesorios, no convertir uniforme en otro tipo de ropa
3. Iluminación profesional siempre — balance de blancos perfecto, sombras suaves, colores vibrantes

**Lo que SÍ se puede cambiar:**
- Tamaño de la persona respecto del total de la imagen (sin alterar rostro)
- Posición de la persona respecto del total de la imagen (sin alterar rostro)
- Fondo y entorno completo
- Elementos de contexto: muebles, paredes, cristales, elementos arquitectónicos y decorativos

**NO usar el `concepto`** para describir a la persona en el prompt. Qwen Image Edit preserva la persona automáticamente — describir sus rasgos puede causar alteraciones.

**Estructura del prompt:**
1. Instrucción de preservación: "Keep exactly the same person from the original image with the same clothing..."
2. Nuevo entorno: transformar creativamente el `gatillador`
3. Iluminación profesional
4. Paleta de entorno: inspirada en `paleta_colores` de la marca
5. Detalles de escena: 3-5 elementos concretos
6. Sensación emocional: profesional, limpio, moderno, acogedor
7. Cierre: sin cambiar expresión ni apariencia de la persona

**Plantilla base:**
```
Keep exactly the same person from the original image with the same clothing, appearance and expression. Place them in [creative expansion of gatillador scene], with professional studio lighting, perfect white balance, soft directional shadows and vibrant true-to-life colors. The environment uses tones inspired by [brand palette — hex colors], and includes details such as [3-5 scene elements]. The atmosphere feels professional, clean, modern and welcoming. [Negative space for text overlay]. Do not alter the person's face, hairstyle, body or outfit in any way.
```

---

#### 4C: Reglas para INTERIOR (`origen=Interior`)

**Filosofía: PRESERVAR y LIMPIAR.** No se inventa un entorno nuevo — se eleva la foto original a nivel editorial de revista de arquitectura/interiorismo.

**Campos de entrada:**
- **`concepto`**: describe lo que YA HAY en la imagen (contexto/referencia, no instrucción de cambio)
- **`gatillador`**: puede traer mejoras puntuales específicas, o puede ser genérico
- **La skill SIEMPRE mejora**: aunque el gatillador no pida nada específico, el resultado debe ser una imagen editorial profesional del lugar

**Reglas INQUEBRANTABLES:**
1. Mantener exactamente el mismo espacio interior — misma forma, distribución, arquitectura, texturas y materialidades
2. No añadir elementos nuevos al entorno — lo que no estaba, no aparece
3. Iluminación profesional — balance de blancos perfecto, sombras suaves, colores vibrantes
4. Si aparecen personas, no deformarlas

**Lo que SÍ se puede cambiar:**
- **Remover elementos que ensucian**: cables sueltos, basura, papeles desordenados, objetos fuera de lugar
- **Encuadre de cámara**: mejorar composición a nivel editorial/magazine de arquitectura profesional
- **Iluminación**: corregir exposición, equilibrar luces y sombras
- **Limpieza visual general**: manchas, imperfecciones de superficie, reflejos no deseados

**Plantilla base:**
```
Keep exactly the same interior space from the original image — same room layout, walls, architecture, textures and materials. Remove any visual clutter such as loose cables, trash, scattered papers or misplaced objects. [If gatillador has specific improvements, apply them here. If not, apply general editorial improvements: corrected exposure, cleaner surfaces, balanced lighting]. Professional interior/architectural photography framing — editorial magazine quality with perfect white balance, soft directional shadows and vibrant true-to-life colors. If any people are present, preserve them exactly without deformation. [Negative space for text overlay]. The space looks pristine, elevated to professional architecture photography standards while remaining completely faithful to the original.
```

---

#### 4D: Reglas para EXTERIOR (`origen=Exterior`)

**Filosofía: PRESERVAR y LIMPIAR.** No se reemplaza el paisaje ni el entorno — se limpia, se corrige la exposición y se eleva a nivel editorial.

**Campos de entrada:**
- **`concepto`**: describe lo que YA HAY en la imagen (contexto/referencia, no instrucción de cambio)
- **`gatillador`**: puede traer mejoras puntuales específicas, o puede ser genérico
- **La skill SIEMPRE mejora**: aunque el gatillador no pida nada específico, el resultado debe ser una imagen editorial profesional del entorno

**Reglas INQUEBRANTABLES:**
1. Mantener exactamente el mismo entorno exterior — misma forma, detalles, colores, paisaje
2. Mantener las mismas formas del paisaje y sus elementos distintivos — no añadir elementos nuevos
3. Iluminación profesional — balance de blancos perfecto, sombras suaves, colores vibrantes
4. Si aparecen personas, no deformarlas

**Lo que SÍ se puede cambiar:**
- **Remover elementos que ensucian**: cables eléctricos, basura, escombros, elementos antiestéticos
- **Cielo**: corregir exposición, eliminar sobreexposiciones, equilibrar con el paisaje
- **Encuadre de cámara**: mejorar composición para realzar el paisaje o entorno exterior
- **Limpieza visual general**: manchas, imperfecciones, elementos distractores

**Plantilla base:**
```
Keep exactly the same exterior environment and landscape from the original image — same forms, details, colors and distinctive elements. Remove any visual clutter such as loose cables, trash, debris or distracting objects. Correct sky exposure to avoid any blown-out highlights, balanced properly with the landscape. [If gatillador has specific improvements, apply them here. If not, apply general editorial improvements: corrected exposure, cleaner environment, better composition]. Professional landscape/architectural photography framing — editorial quality with perfect white balance, soft natural shadows and vibrant true-to-life colors. If any people are present, preserve them exactly without deformation. [Negative space for text overlay]. The environment looks pristine and elevated while remaining completely faithful to the original scene.
```

---

#### 4E: Reglas para FACHADA (`origen=Fachada`)

**Filosofía: PRESERVAR y LIMPIAR.** Se limpia la imagen de la fachada, se corrige la exposición y se eleva a calidad editorial de fotografía de arquitectura.

**Campos de entrada:**
- **`concepto`**: describe lo que YA HAY en la imagen (contexto/referencia, no instrucción de cambio)
- **`gatillador`**: puede traer mejoras puntuales específicas, o puede ser genérico
- **La skill SIEMPRE mejora**: aunque el gatillador no pida nada específico, el resultado debe ser una imagen editorial profesional de la fachada

**Reglas INQUEBRANTABLES:**
1. Mantener exactamente la misma fachada/edificio — misma forma, arquitectura, texturas, materialidades y TODOS los textos visibles (nombre del negocio, señalética, numeración, carteles)
2. No añadir elementos nuevos — preservar todo lo existente tal cual
3. Iluminación profesional — balance de blancos perfecto, sombras suaves, colores vibrantes
4. Si aparecen personas, no deformarlas

**Lo que SÍ se puede cambiar:**
- **Remover elementos que ensucian**: cables eléctricos, basura, papeles, escombros, objetos fuera de lugar
- **Cielo**: corregir exposición, eliminar sobreexposiciones, equilibrar con la fachada
- **Encuadre de cámara**: mejorar composición a nivel editorial de fotografía de arquitectura/magazine
- **Iluminación**: corregir exposición general, mejorar iluminación de la fachada
- **Limpieza visual general**: manchas en muros, imperfecciones, reflejos no deseados

**Plantilla base:**
```
Keep exactly the same building facade from the original image — same architecture, entrance, textures, materials and all existing signage, logos, texts and brand elements. Remove any visual clutter such as loose cables, trash, scattered papers, debris or misplaced objects. Correct sky exposure to avoid any blown-out highlights. [If gatillador has specific improvements, apply them here. If not, apply general editorial improvements: corrected exposure, cleaner surfaces, improved lighting]. Professional architectural photography framing — editorial magazine quality with perfect white balance, soft directional shadows and vibrant true-to-life colors. All existing signage, logos and brand identity remain perfectly preserved and legible. If any people are present, preserve them exactly without deformation. [Negative space for text overlay]. The facade looks pristine, elevated to professional architecture photography standards while remaining completely faithful to the original.
```

---

### Paso 5: Generar copy comercial

Escribir un párrafo en **español** (2-3 oraciones) con tono de marca:

**Para Producto:**
1. Mencionar el producto por nombre (`slogan_headline`)
2. Integrar el beneficio técnico principal (`subtitulo`)
3. Conectar con la propuesta de valor de la marca
4. Cerrar con idea de acción/confianza (inspirarse en `cta`)

**Para Colaborador:**
1. Presentar al colaborador por nombre (`slogan_headline`)
2. Integrar su especialidad o rol (`subtitulo`)
3. Conectar con los valores de la marca y el servicio que representa
4. Cerrar con confianza y cercanía

**Reglas del copy (ambos):**
- Tono coherente con el `arquetipo` de la marca
- No repetir frases genéricas — ser específico
- Respetar `contenido_prohibido` de la marca
- Ortografía impecable

### Paso 6: Obtener logo de la marca

Consultar el campo `logos` de la tabla `marcas` para la marca correspondiente, o copiar el `logo` de cualquier otra creatividad de la misma marca.

### Paso 7: Actualizar en Supabase

```javascript
{
  "prompt": "<prompt generado>",
  "copy": "<copy comercial>",
  "logo": "<logos de la marca>",
  "estado": "paso 7"
}
```

**Encoding**: Usar Node.js para escrituras (preservar UTF-8).

---

## Creatividad obligatoria

**Tu rol es MEJORAR la instrucción del gatillador**, no repetirla literalmente. Transforma instrucciones simples en escenas cinematográficas completas: materiales, texturas, iluminación, atmósfera, detalles que eleven la calidad publicitaria.

### Cuando el gatillador dice "sorpréndeme" / "decide tú" / "nora elige"

Consultar la sección **ESCENARIOS IMG2IMG** en el campo `notas_generales` de la marca en Supabase. Cada marca tiene sus propios escenarios documentados ahí. Seleccionar uno apropiado para el tipo de contenido, rotando para no repetir. Los escenarios marcados ✅ están validados con aprobación real.

## Reglas aprendidas de observaciones (OBLIGATORIAS)

Estas reglas son **universales** — aplican a todas las marcas. Para restricciones específicas de cada marca, consultar `contenido_prohibido` y `notas_generales` de la marca en Supabase.

1. **Espacio para texto es PRIORIDAD #1**: toda imagen debe tener al menos 30% de zona limpia (lisa, uniforme) para headline y copy. El tercio superior DEBE ser simple. **TRUCO PROBADO**: en vez de pedir "techo liso" (Qwen igual agrega luminarias), usar "camera angle slightly downward so the ceiling is barely visible, and what little shows is just pure flat white ambient glow" — si el techo no aparece, no hay luces que arruinar.

2. **Equipos técnicos/médicos = contexto coherente**: los equipos deben aparecer en el entorno donde se usan (ej: equipo médico → interior clínico, herramienta de obra → exterior/taller). Consultar `notas_generales` para entornos validados.

3. **No mezclar contextos**: materiales residenciales (madera, decoración hogareña) no van con equipos profesionales/médicos. Usar superficies y mobiliario coherentes con el rubro.

4. **EPP obligatorio si hay personas con herramientas**: guantes, antiparras, protectores auditivos, casco según rubro. Siempre ropa impecable. Consultar `contenido_prohibido` de la marca.

5. **Personas con herramientas = RIESGO**: Qwen puede alterar la forma de la herramienta si una persona la agarra. Preferir producto solo como héroe. Si se incluyen personas, que NO toquen directamente el producto.

6. **Bokeh natural, no gaussian pesado**: para colaboradores, usar "gentle shallow depth-of-field blur like f/2.8 natural lens bokeh — shapes remain recognizable in broad strokes". El blur extremo parece Photoshop malo.

7. **Sin decoraciones innecesarias para equipos técnicos**: no plantas, no mesas de apoyo, no arte. Solo el equipo en su espacio profesional limpio. Menos es más.

8. **Sillas con 2 brazos**: si se incluye mobiliario tipo silla/sillón, siempre especificar "armchair with two padded armrests on both sides".

9. **Variedad de iluminación**: explorar tanto interiores controlados como exteriores con luz natural, golden hour, cielos con nubes. No asumir que un rubro solo va con un tipo de luz — consultar `notas_generales` para variantes validadas.

10. **Longitud de prompt ≤600 caracteres**: Qwen Image Edit 2511 se cuelga/falla con prompts de 700+ chars. El sweet spot es 500-600 chars. Los detalles del producto (etiquetas, textos, colores de componentes) SIEMPRE deben ir en el prompt — son esenciales para preservar el producto. Sin ellos, Qwen puede deformar etiquetas o cambiar colores. Probado: 508 chars con detalles = OK, 707 chars = timeout.

11. **Vehículos en paisajes — dirección del camino**: cuando el producto es un vehículo y el entorno es un paisaje con carretera, especificar SIEMPRE que el camino va en la misma dirección que el vehículo enfrenta ("road runs in the same direction the bus/vehicle is facing"). Sin esto, Qwen posiciona el camino perpendicular y el vehículo queda atravesado.

12. **No rotar ni reposicionar el producto**: cambiar el ENTORNO para que se adapte al ángulo original del producto. Nunca pedir que el producto cambie de posición o ángulo — Qwen deforma.

13. **Pisos limpios sin efectos**: NO cintas LED, NO líneas luminosas, NO estética Tron/futurista en superficies. Pisos matte, concreto pulido, o superficie natural según contexto. Reflejos sutiles del producto OK.

14. **Confeti como alternativa a íconos 3D**: para entornos festivos/celebratorios, confeti en colores de marca es más natural que íconos flotantes. Especificar "scattered festive confetti in brand colors [...], dispersed loosely, some falling, some drifting — natural, not dense."

---

## Ejemplos

### Ejemplo Producto

**Input:** gatillador: "trozos de hormigón, chispas, entorno industrial" / concepto: "cortador de hormigón motorizado" / descripccion (de inputs): "Cortador de hormigón K3600 MkII, motor de 2 tiempos, disco de 350mm, carcasa amarilla con protector negro, etiqueta lateral '3600 MkII' en blanco, logo de marca en rojo sobre la carcasa superior, mango antivibración gris con gatillo naranja"

**Output:**
```
Keep exactly the same product from the original image — a K3600 MkII motorized concrete cutter: bright yellow main housing with black protective guard over the 350mm cutting disc, gray anti-vibration handle with orange trigger, the side label reading "3600 MkII" in white lettering, red brand logo on the upper housing, two-stroke engine compartment at the rear with black exhaust port. Present it in a dramatic industrial environment: the cutter sits on a freshly fractured concrete slab with large angular chunks of broken concrete scattered around its base. Hot orange sparks cascade from the right side of the disc, frozen in mid-flight, creating dynamic energy trails against the deep background [hex from paleta_colores]. The floor is dark wet epoxy with subtle accent reflections [hex from paleta_colores]. Professional cinematic low-key lighting with strong directional key light from the upper left, rim light tracing the machine's edges. The product occupies the center-left 40% of the frame with generous dark negative space on the right side for text overlay. The product remains the absolute hero — pristine, factory-new, with every label, logo, text marking and specification perfectly preserved, legible and unaltered.
```

**Nota**: Observa cómo el prompt transcribe literalmente "3600 MkII", describe el color de cada componente (carcasa amarilla, protector negro, mango gris, gatillo naranja), y menciona la posición exacta del logo. Este nivel de detalle es lo que previene deformaciones.

### Ejemplo Colaborador

**Input:** gatillador: "en ambiente de taller profesional herramientas en pared de fondo piso metálico con reflejos iluminación tipo showroom"

**Output:**
```
Keep exactly the same person from the original image with the same clothing, appearance and expression. Place them in a premium professional workshop environment: standing confidently in the center-left of the frame, surrounded by a meticulously organized tool wall in the background displaying rows of chrome wrenches, power drills, and impact drivers on dark pegboard panels. The floor is polished dark metal with mirror-like reflections catching overhead showroom lighting. The environment uses tones from [paleta_colores] with accent lighting tracing the tool wall edges and warm highlights on select tool handles. Clean directional key light from the upper right illuminates the person with a soft fill from the left. The atmosphere feels professional, organized, modern and premium. Generous negative space on the right side for text overlay. Do not alter the person's face, hairstyle, body or outfit in any way.
```

---

## Conexión Supabase

Ver `skills/shared/SUPABASE.md` para URL, headers y encoding.

---

## Notas

- Este skill NO genera imágenes — solo el prompt. n8n ejecuta Qwen Image Edit en `paso 7`.
- Iteración automática SÍ aplica a img2img — la skill iteración evalúa y puede duplicar con prompt mejorado.
- Para Producto: el `concepto` alimenta el prompt. Para Colaborador: el `concepto` NO se usa en el prompt.
- El `gatillador` es la instrucción creativa — siempre mejorarla, nunca copiarla literal.
- Los 5 orígenes (Producto, Colaborador, Interior, Exterior, Fachada) comparten el mismo flujo paso 6 → paso 7. Producto y Colaborador CAMBIAN el entorno. Interior, Exterior y Fachada PRESERVAN y LIMPIAN el existente (filosofía distinta).
- Los **escenarios para "sorpréndeme"** están en el campo `notas_generales` de cada marca en Supabase (sección "ESCENARIOS IMG2IMG"). Consultar y rotar.
