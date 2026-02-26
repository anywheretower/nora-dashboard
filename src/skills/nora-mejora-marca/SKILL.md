---
name: nora-mejora-marca
description: Mejorar la redacción de paleta_colores, look_and_feel, notas_generales y contenido_prohibido de una marca en NORA, basándose en el análisis visual de sus creatividades con resultado_final. Ingeniería inversa visual para que las instrucciones escritas reflejen lo que realmente funciona en las imágenes aprobadas.
id: nora-mejora-marca
---

# Mejora de Marca — Ingeniería inversa visual para NORA

> **Última revisión:** 2026-02-16 12:21 CLT

## Cuándo se activa

- **Automático**: todos los domingos a las 20:00 hrs (revisión semanal de campos visuales de todas las marcas activas)
- **Por acumulación**: cuando una marca junta 10+ nuevas creatividades con `condicion` en (`resultado_final`, `aprobado`) desde la última ejecución
- **Por pedido de Jorge**: cuando Jorge solicita explícitamente una mejora de campos visuales
- Después de una **sesión de feedback intensiva** de Jorge sobre una marca (múltiples observaciones o cambios de dirección)

## Propósito

Analizar las imágenes aprobadas (`condicion=resultado_final`) de una marca para extraer patrones visuales reales y reescribir los 4 campos clave que guían la generación de futuras imágenes: `paleta_colores`, `look_and_feel`, `notas_generales` y `contenido_prohibido`.

**El objetivo**: que las instrucciones escritas reflejen fielmente lo que funciona visualmente en las mejores piezas de la marca, para que las skills de generación (referencia, original, universal, requerida) produzcan imágenes consistentes y de alta calidad.

## Idioma de trabajo

Los 4 campos se escriben en **español**. Redacción clara, técnica pero comprensible, con instrucciones accionables para un modelo de generación de imagen.

Ver `skills/shared/SUPABASE.md` para encoding y conexión. Ver `skills/shared/IDIOMA.md` para reglas de idioma. Ver `shared/SCHEMA.md` y `shared/PIPELINE.md` para esquema de tablas y flujo completo.

## Proceso completo

### Paso 1: Cargar estado actual de la marca

Consultar tabla `marcas` para la marca objetivo:

```
marcas?marca=eq.{marca}&select=id,marca,ficha,arquetipo,paleta_colores,look_and_feel,notas_generales,contenido_prohibido
```

Leer los 4 campos actuales para saber qué hay hoy y qué necesita mejora.

### Paso 2: Obtener imágenes con resultado final

Consultar TODAS las creatividades validadas de la marca — el universo completo de piezas que funcionan:

```
creatividades?marca=eq.{marca}&condicion=in.(resultado_final,aprobado,favorita)&select=id,concepto,prompt,url,link_ren_1,link_ren_2,observacion,origen,tags&order=id.asc
```

**Universo de análisis** (de mayor a menor peso):

| Condición | Tipo | Peso | Por qué |
|---|---|---|---|
| `resultado_final` | imagen | Alto | La versión definitiva publicada |
| `aprobado` | imagen | Alto | Jorge validó que funciona |
| `favorita` | imagen | Máximo | Lo mejor de lo mejor |
| `resultado_final` | video | Alto | Videos publicados (link_ren_1/link_ren_2) |
| `aprobado` | video | Alto | Videos validados |

Para distinguir videos de imágenes: `origen=video` o presencia de `link_ren_1`/`link_ren_2` sin `url`.

**Para imágenes**: usar `url` (imagen generada) para análisis visual + `prompt` para entender qué instrucciones funcionaron.

**Para videos**: usar `link_ren_1` o `link_ren_2` para análisis visual de frames + análisis del código fuente TSX/composición si está disponible en el workspace (`remotion-nora/src/`). Los videos aportan info de paleta, tipografía en movimiento, ritmo visual, estilo de composición, transiciones y música.

**Incluir el campo `prompt`**: Los prompts aprobados contienen información valiosa sobre fondos, ángulos, composiciones y estilos que funcionaron. Analizar AMBOS (imagen + prompt) para capturar el rango completo.

**Mínimo recomendado**: 8-10 piezas (imágenes + videos) para un análisis significativo. Si hay menos de 5, advertir que el análisis puede no ser representativo.

### Paso 3a: Analizar videos aprobados

Para **cada video** con condición `resultado_final` o `aprobado`:

1. **Descargar/ver frames representativos** del video (inicio, mitad, cierre) desde `link_ren_1`/`link_ren_2`
2. **Si existe código TSX** en `remotion-nora/src/` para esa marca, leerlo para extraer:
   - Paletas usadas (constantes DARK_BG, TEAL, PURPLE, etc.)
   - Tipos de animación y transiciones
   - Duración y estructura de escenas
   - Tipografía y estilos de texto
3. **Analizar estos aspectos del video**:
   - **Paleta en movimiento**: ¿Los colores cambian entre escenas? ¿Hay degradados animados? ¿Cuáles funcionaron?
   - **Tipografía animada**: Estilo de entrada/salida del texto, tamaños, pesos, efectos (fade, slide, typewriter)
   - **Ritmo y duración**: ¿Videos cortos (15s) o medios (30s)? ¿Ritmo rápido o pausado? ¿Cuántas escenas?
   - **Transiciones**: ¿Cortes secos, fades, slides, wipes? ¿Glitch effects?
   - **Música/audio**: Estilo musical preferido, BPM, instrumentos, con/sin voz
   - **Formato**: ¿9:16 (stories/reels), 4:5 (feed), 16:9 (pantalla)?
   - **Estilo visual general**: ¿Motion graphics puros, slideshow con fotos, UGC simulado, mixto?
4. **Feedback de Jorge sobre videos**: Revisar observaciones en creatividades de video para detectar preferencias (ej: "más rápido", "menos texto", "otra música")

### Paso 3b: Analizar cada imagen

Para **cada imagen** aprobada, analizar con herramienta de visión estos aspectos:

1. **Paleta de color real** — Colores dominantes, secundarios, acentos. Temperatura (fría/cálida/mixta). Presencia de degradados y su dirección.
2. **Tipo de fondo** — Sinfín abstracto, entorno clínico/industrial, estudio, exterior, abstracto con textura, gradiente, etc. ¿Hay bordes visibles? ¿Hay estructura de estudio?
3. **Iluminación** — High-key/low-key, difusa/direccional, sombras suaves/duras, rim light, luz cenital, etc.
4. **Personas** — Etnia, vestimenta (colores, estilo), poses, cantidad, relación entre ellas.
5. **Elementos icónicos/objetos** — Estilo (3D glossy, flat, realista, holográfico), colores, escala, cantidad.
6. **Equipamiento/elementos del rubro** — Forma, realismo, integración con la escena, colores aplicados.
7. **Composición y espacio negativo** — Proporción de espacio libre, ubicación del protagonista, regla de tercios.
8. **Atmósfera/mood general** — Qué sensación transmite.
9. **Tipo de narrativa** — ¿La imagen cuenta una historia? ¿Hay contraste emocional (antes/después, dolor/recuperación, solo/acompañado, orden/caos)? ¿O es puramente descriptiva/product shot? ¿Hay tensión entre personajes o estados?

**Procesar en lotes**: Analizar 5-7 imágenes a la vez para eficiencia, no una por una.

### Paso 4: Sintetizar patrones

Después de analizar todas las imágenes, identificar:

**PATRONES CONSISTENTES** (aparecen en >60% de las imágenes):
- Estos son los rasgos definitorios del estilo visual de la marca
- Deben quedar como instrucciones firmes en los campos

**VARIACIONES EXITOSAS** (aparecen en varias pero no todas):
- Son opciones válidas que aportan diversidad
- Deben quedar como alternativas permitidas

**CATÁLOGO DE VARIANTES** — el repertorio completo de diversidad probada:
- **Registros visuales distintos**: ¿Cuántos estilos/mundos visuales diferentes tiene la marca? (ej: retrato editorial, fotomontaje surrealista, objeto hero sin personas, paisaje del rubro, concepto abstracto). Nombrar cada uno.
- **Fondos probados**: Listar TODOS los tipos de fondo que han funcionado, no solo los 2-3 más frecuentes. Incluir variantes menos comunes que aportan frescura.
- **Ángulos de cámara**: ¿Qué encuadres se han usado? (eye-level, top-down, aéreo, close-up, medium shot, wide-angle, front-facing, etc.)
- **Tipos de sujeto**: ¿Qué protagoniza las imágenes? (persona sola, grupo, manos sin cara, objeto simbólico, vehículo/equipo, paisaje, composición dividida, etc.)
- **Escalas y proporciones**: ¿Se usan objetos monumentales? ¿Miniaturas? ¿Escala real?
- **Tipos de narrativa**: Clasificar cada imagen aprobada en una o más categorías:
  - **Descriptiva**: Muestra algo tal como es (producto, equipo, persona posando)
  - **Aspiracional**: Inspira a un estado deseado (éxito, salud, control)
  - **Contrastiva**: Muestra dos estados opuestos (antes/después, orden/caos, dolor/recuperación, solo/acompañado)
  - **Emocional**: Provoca un sentimiento específico (calma, urgencia, nostalgia, esperanza)
  - **Metafórica**: Usa un objeto/escena como símbolo de algo más (rodilla de cristal = precisión mecánica del cuerpo, dominós = efecto cascada de riesgo). Para metafóricas, identificar los **temas metafóricos específicos** de la marca (protección, tiempo, libertad, conexión, crecimiento, etc.). Cada tema genera familias enteras de imágenes distintas y es una fuente clave de diversidad.

**CRUCE IMAGEN ↔ VIDEO** — aprendizajes que cruzan entre formatos:
- ¿Alguna paleta de video reveló combinaciones de color que no se usan en imágenes? → Agregarla a paleta_colores como opción
- ¿El estilo visual de un video (ej: motion graphics con íconos 3D) sugiere un registro visual nuevo para imágenes? → Agregarlo al catálogo
- ¿Las observaciones de Jorge en videos aplican también a imágenes? (ej: "menos texto", "más limpio") → Reflejarlas en notas_generales
- ¿Las imágenes aprobadas muestran escenas que serían buenos frames de video? → Notarlo en la sección de video
- **Principio**: imagen y video son expresiones de la MISMA marca. Lo que funciona en uno informa al otro.

> **Principio de diversidad**: El objetivo NO es encontrar "el estilo de la marca" sino documentar todo el RANGO de lo que funciona. Una marca con 3 registros y 3 fondos puede generar 9 combinaciones. Con 6 registros y 7 fondos puede generar 42. La diversidad es multiplicativa.

**CONTRASTE INHERENTE DEL RUBRO** — Identificar la tensión central que el producto/servicio resuelve:
- ¿Cuál es el "antes vs después" del rubro? (calor→frescura, riesgo→control, dolor→recuperación, desorden→orden)
- Este contraste es la fuente más rica de narrativas contrastivas y metafóricas
- Documentarlo explícitamente en look_and_feel como "Tensión narrativa central"
- Genera creatividades tipo: cápsulas de confort en desierto, escudos contra caos, bisagras antes/después
- Pregunta clave: *"Si tuvieras que mostrar el mundo SIN este producto vs CON él, ¿qué verías?"*

**ELEMENTOS PROBLEMÁTICOS** (cosas que no funcionan bien visualmente):
- Deben ir a contenido_prohibido o como advertencias en notas_generales

**Comparar con los campos actuales**:
- ¿Qué está bien pero es demasiado vago? → Precisar con datos del análisis
- ¿Qué falta completamente? → Agregar basándose en los patrones
- ¿Qué es incorrecto o contradice las imágenes exitosas? → Corregir
- ¿Qué está bien y no necesita cambio? → **Mantener INTACTO**
- ¿Qué limita artificialmente la diversidad? → Ampliar con variantes del catálogo

> **⚠️ REGLA CRÍTICA: NUNCA BORRAR APRENDIZAJES CONSOLIDADOS.** En marcas maduras (CSJ 22K chars, RedAgrupa 8K, Equos 7K), los campos actuales contienen reglas que se afinaron con decenas de iteraciones y feedback directo de Jorge. Esta skill SOLO puede:
> - **Agregar** nuevos patrones descubiertos
> - **Precisar** reglas vagas con datos concretos
> - **Corregir** info que contradiga evidencia visual clara
> - **Reorganizar** para mejor legibilidad (sin perder contenido)
> 
> NUNCA simplificar, resumir ni "limpiar" campos extensos. Cada línea existe por una razón. Si no entiendes por qué una regla está ahí, déjala. El largo del campo NO es un problema — la completitud es una virtud.

### Paso 5: Redactar los 4 campos mejorados

#### 5a. paleta_colores — LOS COLORES (universal, sin escenarios)

Este campo define SOLO los colores de la marca y las combinaciones de fondo posibles. No incluir escenarios concretos, composiciones ni detalles de iluminación — eso va en notas_generales.

Estructura recomendada:
```
Colores base:
- [Color 1] [hex]: Rol principal (dominante, uniformes, elementos principales)
- [Color 2] [hex]: Rol secundario (acentos, tipografía, contraste)
- [Color 3] [hex]: Rol terciario

Colores secundarios:
- [Color] [hex]: Función específica
(incluir cromados, metálicos, charcoal si aplica)

Combinaciones de fondo:
- Fondo oscuro: [hex] a [hex] — cuándo es oscuro (ej: composiciones dramáticas, producto hero)
- Fondo claro: [hex] a [hex] — cuándo es claro (ej: composiciones frescas, conceptuales)
- Degradados: dirección y tonos (ej: radial desde centro, diagonal, vertical)

Temperatura general: [fría/cálida/mixta], dominada por [eje de color].
```

**Principios de redacción**:
- Ser **específico con hexadecimales** y rangos (ej: #0099cc a #00A8A8)
- Indicar **rol de cada color** (para qué se usa, no dónde aparece en escenas concretas)
- Describir combinaciones de fondo como **posibilidades abiertas**, no como escenarios fijos
- Mantener este campo **universal** — debe permitir diversidad de interpretación
- NO incluir aquí: escenarios específicos, ángulos, tipos de composición, iluminación

#### 5b. look_and_feel — LA VIBRA (energía y mood, sin recetas)

Este campo define la **energía, la atmósfera y la personalidad visual** de la marca. Es lo que alguien sentiría al ver las imágenes sin saber qué marca es. No incluir recetas concretas de composición ni escenarios — eso va en notas_generales.

Estructura recomendada:
```
[Descripción de la estética general en 2-3 líneas — qué sensación transmite la marca visualmente]

Equilibrio central: [qué dos fuerzas se balancean] (ej: potencia + precisión, calidez + tecnología, cercanía + profesionalismo)

Tensión narrativa central: [el contraste inherente del rubro]
- Sin el producto/servicio: [qué se ve/siente]
- Con el producto/servicio: [qué se ve/siente]

Atmósfera: [adjetivos + descripción del mood general]
- Tipo de iluminación dominante (high-key/low-key, difusa/direccional)
- Nivel de dramatismo (contenido/intenso/sutil)
- Sensación general (calma, urgencia, confianza, calidez, robustez)

Narrativas que funcionan:
- [Listar TIPOS de narrativa sin detallar composiciones concretas]
- Ej: metafórica, aspiracional, contrastiva, emocional, descriptiva
```

**Principios**:
- Escribir como si describieras la **personalidad visual** de la marca a un director de arte
- Usar lenguaje **evocador pero técnico** — no recetas paso a paso
- Definir el **equilibrio emocional** (qué dos fuerzas conviven)
- Describir la **atmósfera** en términos de sensación, no de nodos o composiciones
- Mantener **abierto** — este campo inspira, no prescribe
- NO incluir aquí: registros visuales numerados, escenarios concretos, ángulos de cámara, tipos de sujeto — eso va en notas_generales
- **⚠️ Si el campo contiene secciones de video** (recursos visuales de video, acabados de objetos 3D para video, etc.), preservarlas intactas al reescribir la parte de imagen. Sin embargo, si el análisis de videos (Paso 3a) revela mejoras necesarias en la sección de video de look_and_feel, aplicarlas (ej: nueva paleta que funcionó, estilo de animación preferido).

#### 5c. notas_generales — LOS DETALLES (recetas concretas y combinaciones probadas)

Este es el campo más largo y detallado. Aquí van todos los ejemplos concretos, escenarios específicos, combinaciones probadas y reglas accionables. Es la "receta" que las skills de generación consultan para construir prompts.

Organizar por categorías claras:
```
Personas:
- [Reglas de etnia, vestimenta, colores de ropa, poses, cantidad, mirada]

Equipamiento/objetos del rubro:
- [Reglas de forma, realismo, colores, integración]

Iconografía:
- [Estilo según la marca: 3D/flat/industrial/etc., colores, acabado, cantidad máxima]

Escenarios y fondos detallados:
- [Escenarios concretos que funcionan — nombre descriptivo + descripción técnica]
- [Cuándo usar cada uno (producto, colaborador, original, universal)]
- [Escenarios validados con ID de creatividad si aplica]
- NOTA: los escenarios específicos viven AQUÍ, no en paleta_colores

Registros visuales probados:
- [Nombrar cada estilo visual distinto que ha funcionado]
- [Ej: "Retrato editorial", "Fotomontaje surrealista", "Producto hero sin personas"]
- [Describir brevemente qué se ve en cada uno]

Iluminación y fotografía:
- [Balance de blancos, tipo de luz, profundidad de campo, efectos permitidos]

Composición:
- [Espacio negativo, regla de tercios, repetición de elementos]

Ángulos de cámara y encuadres (catálogo probado):
- [Listar todos los ángulos que funcionan: eye-level, top-down, aéreo, low-angle, etc.]
- [Incluir tipo de plano: close-up, medium shot, full body, wide-angle, etc.]
- Usar para rotar y evitar monotonía

Tipos de sujeto (catálogo):
- [Persona sola / grupo / manos sin rostro / objeto simbólico hero / vehículo-equipo / paisaje del rubro / composición dividida / etc.]
- Rotar entre tipos para máxima diversidad

Regla de rotación:
- No repetir el mismo registro visual, fondo, ángulo ni tipo de sujeto en creatividades consecutivas
- Consultar las últimas 3-5 creatividades generadas antes de elegir combinación
```

**Principios**:
- Cada regla debe ser **accionable** — que un modelo de generación pueda seguirla
- Ser **específico con colores** (hexadecimales, no "colores de la marca")
- Incluir **lo que SÍ se permite** además de restricciones
- Organizar para **lectura rápida** por categoría
- Este campo ABSORBE todo lo concreto que antes estaba en paleta_colores o look_and_feel (escenarios, registros visuales, ángulos)
- **Maximizar diversidad**: las secciones de ángulos, sujetos y regla de rotación son obligatorias
- **⚠️ Sección de video**: `notas_generales` puede contener una sección `## INSTRUCCIONES DE VIDEO` con paletas de video, música, preferencias y observaciones de videos anteriores. Al reescribir notas_generales:
  - **Preservar** la estructura y contenido existente de la sección de video
  - **Agregar** nuevos aprendizajes del análisis de videos (Paso 3a): paletas validadas, feedback de Jorge, preferencias de música/ritmo
  - **Actualizar** info obsoleta si el feedback de Jorge la contradice
  - **No eliminar** contenido de video existente sin justificación clara
  - La sección de video siempre va al **final** del campo notas_generales

**Benchmark de nivel de detalle** — las marcas más avanzadas (CSJ: 22K chars, RedAgrupa: 8K, Equos: 7K) son el estándar a alcanzar. Al mejorar una marca menos desarrollada:

| Campo | Mínimo objetivo | Referencia (CSJ) |
|---|---|---|
| paleta_colores | 1500+ chars | 3300 chars |
| look_and_feel | 2000+ chars | 4400 chars |
| notas_generales | 7000+ chars (imagen) + sección video | 22700 chars |
| contenido_prohibido | 500+ chars | 2200 chars |

Si una marca tiene campos significativamente más cortos que el mínimo, es señal de que faltan registros, escenarios, ángulos o reglas. Usar las marcas avanzadas como modelo de profundidad (no copiar contenido — cada marca tiene su identidad propia).

#### 5d. contenido_prohibido

Lista separada por `|` (formato actual de la plataforma):
```
[Prohibición 1] | [Prohibición 2] | ...
```

**Principios**:
- Incluir prohibiciones **visuales** descubiertas en el análisis (no solo textuales/de contenido)
- Agregar: reflejos espejo, bordes de estudio, soportes de sinfín, mobiliario decorativo innecesario, etc. — según lo que se detecte como problemático
- Mantener las prohibiciones de contenido originales (comparar con competidores, promesas imposibles, etc.)
- **Prohibiciones anti-monotonía**: agregar reglas que prevengan repetición visual (ej: no más de 2 hologramas por imagen, no combinar persona + objeto monumental en la misma escena si ya se hizo recientemente)

### Paso 6: Presentar al usuario para revisión

**NO subir directo a Supabase.** Primero presentar los 4 campos propuestos al usuario mostrando:
- Qué cambió vs el original
- Por qué (basado en qué imágenes)
- Pedir confirmación antes de actualizar

### Paso 7: Actualizar en Supabase

Una vez aprobado, actualizar los 4 campos via PATCH:

```
PATCH marcas?id=eq.{id_marca}
{
  "paleta_colores": "...",
  "look_and_feel": "...",
  "notas_generales": "...",
  "contenido_prohibido": "..."
}
```

Confirmar que la actualización fue exitosa.

### Paso 8: Iterar con feedback de imágenes generadas (opcional pero recomendado)

Si se generan creatividades después de la mejora, revisar los resultados y buscar:

**Estilo de iconografía**: ¿Los íconos 3D se ven amigables e inflados o técnicos y fríos? Si el cliente prefiere un estilo específico (redondeado, glossy, tipo globo), documentarlo en `notas_generales` con una referencia concreta (ej: "Referencia de estilo: el corazón 3D inflado con detalle de ECG es el estándar").

**Fondos y profundidad**: El fondo infinito no necesita ser un vacío plano. Documentar en `notas_generales`:
- Si la marca tolera/prefiere sensación de profundidad (desenfoque, gradientes atmosféricos) → indicarlo
- Si líneas duras piso-pared arruinan la imagen → reforzar la prohibición
- Si geometría abstracta (ondas, formas geométricas) no encaja con la marca → prohibirla explícitamente

**Personas como fondo**: Si personas parciales/desenfocadas funcionan o no en universales, documentar la preferencia.

**Regla general**: Cada iteración con resultados reales aporta información valiosa. Actualizar `notas_generales` y `contenido_prohibido` con cada ronda de feedback. Los campos de marca son documentos vivos que mejoran con el uso.

### Paso 9: Validar coherencia con skills

Verificar que los campos actualizados no entren en contradicción con las reglas globales de las skills de generación:
- Sin ventanas/cortinas (global)
- Sin reflejos espejo salvo paleta lo indique (global)
- Superficies construidas lisas (global)
- Fondo sinfín = espacio abstracto infinito, NO estudio literal (global)
- Espacio negativo según tipo de skill (50-60% referencia/original, 65-70% universal)

Si hay conflicto, ajustar los campos de marca para ser coherentes.

## Notas importantes

- **No inventar**: Solo incluir en los campos lo que se observa realmente en las imágenes aprobadas. No agregar estilos que no existan en los resultado_final.
- **Respetar la identidad**: Los colores base de la marca no cambian (vienen del branding original). Lo que mejora es la descripción de cómo se aplican visualmente.
- **Progresivo**: Si la marca tiene pocas imágenes aprobadas (<5), hacer mejoras conservadoras. Con más imágenes, se puede ser más específico.
- **El espacio negativo no se evalúa aquí**: Las imágenes anteriores pueden no tener buen espacio negativo (eso lo resuelven las skills de generación con sus reglas). Lo que esta skill mejora es color, estilo, atmósfera y reglas de composición general.
