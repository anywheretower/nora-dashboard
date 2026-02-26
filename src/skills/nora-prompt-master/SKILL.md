---
name: nora-prompt-master
description: Paso FINAL obligatorio del pipeline de imagen. Recibe el prompt borrador de la skill de generación, lo optimiza, valida contra checklist y lo deja listo para ComfyUI. Define estructura de 6 bloques, reglas base, frases probadas, negativos obligatorios y checklist de validación.
id: nora-prompt-master
---

# Prompt Master — Guía centralizada de prompts para NORA

> **Última revisión:** 2026-02-22 23:06 CLT

## Cuándo se activa

Se activa **como guía integrada** dentro de cada skill de generación text-to-image. No se ejecuta de forma independiente — cada skill de imagen (referencia, original, universal, requerida, calendario) aplica estas reglas en su paso de construcción de prompt.

**NO aplica a img2img** (Producto, Colaborador, Interior, Exterior, Fachada — tienen su propio formato ≤600 chars en nora-creatividad-producto).

## Rol en el pipeline

**Prompt-master es la guía centralizada** para construcción de prompts text-to-image (Qwen 2.5). Todas las skills de generación aplican estas reglas como parte de su proceso.

### Aplica a:
- **Text-to-image** (orígenes: `original`, `referencia`, `universal`, `requerido`, `calendario`) → estructura completa de 6 bloques, 600-1500 chars
- **Iteración y observación** → al modificar prompts de text2img, re-validar contra estas reglas

### NO aplica a:
- **Image-to-image** (orígenes: `Producto`, `Colaborador`, `Interior`, `Exterior`, `Fachada`) → tienen su propio formato en `nora-creatividad-producto`, con límite ≤600 chars y estructura diferente

### Cómo se usa:
Las skills de generación aplican estas reglas como parte integrada de su proceso — no es un paso separado. Cuando una skill construye un prompt, consulta prompt-master para: estructura, frases probadas, reglas de negativos, checklist de validación.

## Idioma del prompt

**Siempre en inglés.** Es lo que recibe el modelo de imagen (Qwen 2.5 texto-a-imagen).

---

## Paso 0: Chequeo de diversidad (ANTES de construir el prompt)

Antes de escribir cualquier prompt, consultar las últimas 5 creatividades de la marca:

```
creatividades?marca=eq.{marca}&order=id.desc&limit=5&select=id,concepto,prompt,origen
```

Analizar en los prompts recientes:
- **Registro visual** usado (retrato, conceptual, objeto hero, escena familiar, etc.)
- **Tipo de fondo** (sinfín, industrial, interior, exterior, degradado)
- **Ángulo de cámara** (eye-level, top-down, close-up, wide, aéreo)
- **Tipo de sujeto** (persona sola, grupo, manos, objeto, vehículo, paisaje)
- **Tipo de narrativa** (descriptiva, aspiracional, contrastiva, emocional, metafórica)

**Regla**: Elegir combinación diferente a las últimas 3-5 creatividades. Consultar los campos de marca para ver todas las opciones disponibles:
- `look_and_feel` → tensión narrativa central, tipos de narrativa que funcionan, atmósfera
- `paleta_colores` → colores base, combinaciones de fondo (claro/oscuro, degradados)
- `notas_generales` → registros visuales, escenarios concretos, ángulos de cámara, tipos de sujeto

Si la marca tiene 6 registros y 7 fondos, hay 42+ combinaciones posibles. Usar esa riqueza.

---

## Estructura de prompt: 6 bloques

Todo prompt debe fluir en este orden lógico. No usar headers ni separadores — es un párrafo continuo, pero mentalmente construido en bloques:

### Bloque 1: Calidad y formato
Abrir con las instrucciones técnicas de calidad.

**Frase estándar de apertura:**
```
High-end editorial advertising photography, cinematic lighting, premium catalogue quality. Vertical format. Perfect white balance daylight 5600K calibrated.
```

### Bloque 2: Concepto principal
Qué es especial o imposible en esta imagen. La idea central.
- Describir el sujeto/objeto protagonista con detalle
- Incluir la metáfora visual si aplica
- Definir materiales, texturas, acabados

### Bloque 3: Composición espacial
Dónde está cada cosa. Usar capas de profundidad:
- **Foreground**: lo que está más cerca de cámara
- **Midground**: sujeto principal o elementos intermedios
- **Background**: fondo, atmósfera, degradados

**Siempre especificar:**
- Posición del sujeto (tercio izquierdo, centro-inferior, etc.)
- Porcentaje del frame que ocupa (máx 40-50% para creatividades con copy, 30-35% para universales)
- Zonas libres explícitas: "Generous negative space on the right side and upper area for text overlay"

### Bloque 4: Interacción y narrativa
Cómo los elementos se relacionan entre sí:
- Si hay personas: qué hacen, cómo interactúan, qué expresiones tienen
- Si hay objetos: cómo se conectan visualmente, qué historia cuentan
- Relación entre foreground, midground y background

**Tipo de narrativa** (elegir uno, rotar entre creatividades):
- **Descriptiva**: muestra algo tal como es
- **Aspiracional**: inspira a un estado deseado
- **Contrastiva**: dos estados opuestos (usar la tensión narrativa central de la marca: calor→frescura, riesgo→control, dolor→recuperación)
- **Emocional**: provoca un sentimiento específico (calma, esperanza, conexión familiar)
- **Metafórica**: objeto/escena como símbolo — explorar los temas metafóricos de la marca (protección, tiempo, libertad, crecimiento, etc.)

### Decisión de fondo: plano vs con elementos

**Antes de escribir el Bloque 5, decidir qué tipo de fondo conviene:**

| Situación | Fondo recomendado |
|---|---|
| Persona sola, retrato editorial | Fondo plano / gradiente limpio — maximiza aire y elegancia |
| Escena con interacción (2+ personas) | Fondo con elementos sutiles bokeh — contextualiza |
| Universal (lienzo) | Gradiente vibrante — los colores deben detener el scroll |
| Objeto hero / still life | Superficie + void — dejar que el objeto brille |
| Metáfora conceptual compleja | Fondo plano — no competir con la metáfora |

**Regla**: si hay duda, fondo plano. Menos es más. Un fondo con elementos que no suman, resta.

### Ángulo de cámara: ser EXPLÍCITO

Siempre especificar el ángulo exacto en el prompt. Si hay imagen de referencia, replicar el ángulo de la referencia fielmente.

```
Shot from eye-level / low-angle hero shot / top-down cenital / 45-degree three-quarter view / extreme close-up macro
```

**Cuando la referencia es cenital, el prompt DEBE decir cenital.** No dejarlo implícito — Qwen elegirá otro ángulo y se pierde la metáfora visual.

### Bloque 5: Iluminación, color y efectos
Estilo visual, paleta, efectos de composite:
- **Dirección de luz**: "Soft diffused lighting from above and slightly left"
- **Sombras integradas**: "creating gentle shadows" / "integrated shadows"
- **Profundidad de campo**: "Shallow depth of field with [sujeto] in sharp focus"
- **Paleta de marca**: hex exactos del campo `paleta_colores`
- **Fondo/escenario**: colores de fondo desde `paleta_colores`, escenarios concretos desde `notas_generales`. Rotar entre todas las variantes.
- **Degradados**: dirección y tonos específicos
- **Bokeh/partículas**: si aplica como midground atmosférico

### Bloque 6: Negativos y restricciones
Cerrar con todo lo que NO debe aparecer:
```
No text, no logos, no typography, no watermarks. No windows, no curtains.
```
Plus cualquier restricción específica de la marca (desde `contenido_prohibido`).

---

## Largo óptimo del prompt

El text encoder es Qwen 2.5 VL 7B (context window 128K tokens), pero más largo ≠ mejor. Con prompts excesivamente largos la atención se diluye y el modelo ignora instrucciones tardías. El sweet spot está entre **150-350 tokens** (~600-1500 caracteres).

| Tipo de creatividad | Caracteres | Palabras aprox. |
|---|---|---|
| Personas/escenas complejas | 1000-1400 | 180-260 |
| Conceptuales/surrealistas | 900-1300 | 160-230 |
| Universales (lienzos) | 600-1000 | 120-180 |
| Ajustes de observación | similar al original | — |

- Prompts bajo 600 caracteres pierden control sobre la composición.
- Prompts sobre 1500 caracteres saturan la atención del modelo — las instrucciones del final se ignoran.
- **Priorizar**: poner las instrucciones más importantes (sujeto, composición, espacio para texto) en la primera mitad del prompt.

---

## Reglas base (siempre aplican)

### Espacio negativo funcional
- El protagonista ocupa **máximo 40-50%** del frame (creatividades con copy)
- Universales: elementos concentrados en **un tercio del frame** (inferior O superior, según la composición), dejando 65-70% de espacio libre para texto
- Indicar explícitamente las zonas libres en el prompt

### Sin texto en la imagen
```
No text, no logos, no typography, no watermarks.
```

### Sin ventanas ni cortinas
No mencionar ventanas ni cortinas (ni como negativo). En vez de eso, describir siempre el entorno como espacio cerrado abstracto:
```
Enclosed abstract space with [describir paredes/fondo que SÍ quieres]
```
Aplica a TODAS las marcas, siempre.

### Balance de blancos
```
Perfect white balance daylight 5600K calibrated.
```
Agregado a todas las marcas. Fundamental para colores vivos y fieles.

### Superficies construidas
Suelos, muros, mesas en entornos de estudio: **perfectamente lisos, sin textura**. Transición suave tipo sinfín entre piso y fondo — NUNCA línea divisoria visible.
```
Smooth matte polished surface with subtle reflections, seamless curved transition into background. No visible horizon line, no floor-wall seam.
```

### Curva sinfín (solución ganadora)
La transición curva entre suelo y muro/fondo es un recurso clave — da dinamismo y elegancia vs horizontes rectos. Preferir siempre curva suave sobre ángulos rectos en la unión piso-fondo.
```
Smooth curved seamless transition where floor gently curves upward into background wall, creating an elegant infinite cove with no visible seam or hard angle.
```

### Pantallas de dispositivos
Cuando se muestra un smartphone o tablet con interfaz visible, usar diseños **genéricos y universales** que comuniquen el concepto sin copiar apps reales ni comprometer interfaces específicas.
```
Generic minimalist interface showing [calendario/mapa/dashboard] with clean geometric elements in brand colors.
```

### Lens flares / god rays = PROHIBIDO
NUNCA usar "lens flare", "god rays", "light beam", "glow" ni "sparkle" en ningún prompt. Siempre se ven baratos y artificiales. La iluminación debe ser limpia y uniforme. Aplica a TODAS las marcas.

### Accesorios en colores de marca
Maletas, bolsos, mochilas y accesorios visibles deben estar siempre en **colores de la paleta de marca**. NUNCA café, marrón ni colores genéricos. Consultar `paleta_colores` de la marca.

### Colaborador: NO describir a la persona
En creatividades con `origen=Colaborador`, NO describir rasgos físicos de la persona en el prompt. Qwen Image Edit preserva la persona automáticamente — describir sus rasgos puede causar alteraciones. Solo describir el entorno.

### Personas tocando herramientas = riesgo deformación
Qwen puede alterar la forma de herramientas/objetos si una persona los agarra directamente. Preferir producto solo como héroe. Si se incluyen personas, que NO toquen directamente el producto.

### Bokeh natural, no gaussiano extremo
Para fondos con desenfoque, usar bokeh natural tipo lente:
```
Gentle shallow depth-of-field blur like f/2.8 natural lens bokeh — shapes remain recognizable in broad strokes.
```
NUNCA blur gaussiano extremo — parece Photoshop malo.

### Qwen siempre pone luminarias → truco de ángulo
Qwen tiende a agregar luminarias en techos. La solución probada:
```
Camera angle slightly downward so the ceiling is barely visible, and what little shows is just pure flat white ambient glow.
```
Si el techo no aparece, no hay luces que arruinar.

### Espacio para texto = PRIORIDAD #1
Toda imagen debe tener al menos 30% de zona limpia (lisa, uniforme) para headline y copy. El tercio superior DEBE ser simple. Esta es la regla más importante — una imagen espectacular sin espacio para texto no sirve.

### Sillas con 2 brazos explícitos
Si se incluye mobiliario tipo silla o sillón, siempre especificar:
```
Armchair with two padded armrests on both sides.
```

### Superficies orgánicas
Piel humana, ropa, objetos reales: **toda su riqueza de textura**.
```
Ultra realistic skin textures with professional makeup session quality.
```

---

## Fondos y escenarios

Consultar **dos campos** de la tabla `marcas`:
- `paleta_colores` → colores base, degradados y combinaciones de fondo (claro/oscuro)
- `notas_generales` → escenarios concretos, registros visuales, fondos detallados con contexto de uso

### Fondo sinfín (default seguro para cualquier marca)
```
Background: infinite abstract void, seamless curved surface where floor transitions smoothly into background, boundless continuous space filling the entire frame.
```

### Reglas generales de fondos
- El fondo sinfín NO es un estudio literal — es un espacio abstracto infinito sin bordes ni soportes.
- Transición curva suave entre piso y fondo (curva sinfín) — nunca línea divisoria visible.
- Pisos mojados/reflectantes solo si `notas_generales` de la marca lo especifica explícitamente.
- Gradientes: especificar dirección y hex exactos según `paleta_colores`.
- Escenarios concretos (hangar, taller, exterior, etc.): consultar `notas_generales`.
- Rotar entre TODAS las variantes documentadas en la marca — no usar siempre el default.

---

## Personas

### Etnia
```
Chilean ethnicity
```
Siempre. Si hay varias personas, diversas en edad y género.

### Diferenciación en grupos
Cuando hay 2+ personas en la misma escena, SIEMPRE deben ser **visiblemente distintas** entre sí:
- Variar altura, rango etario, complexión, largo/estilo de cabello, estilo de ropa
- NUNCA dos personas que parezcan la misma (ni hombres ni mujeres entre sí)
- Describir explícitamente las diferencias en el prompt: "one taller with short hair, the other shorter with long curly hair"

### Anatomía
```
Anatomically perfect proportions — correct number of fingers, natural arm positions, realistic body posture, natural poses with proper leg and torso alignment.
```
Reforzar especialmente en escenas con personas sentadas o interactuando.

### Vestimenta
Consultar `notas_generales` de la marca. Regla general:
- Nunca logos ni textos en la ropa
- Colores según la paleta de la marca
- **SIEMPRE ropa limpia e impecable**, incluso trabajadores manuales (mecánicos, obreros, técnicos). Sin manchas, sin grasa, sin suciedad. Pueden ser trabajadores pero con vestimenta impecable.
- Trabajadores: uniformes del rubro en colores de marca, siempre limpios y planchados
- Pacientes/clientes: ropa casual en neutros o colores de acento

### Expresiones y naturalidad
```
Calm, confident expression / warm genuine smile / thoughtful focused gaze
```
Nunca poses forzadas ni exageradas.

**Priorizar gestos naturales**: la naturalidad de las expresiones y posturas es un diferenciador enorme. Una sonrisa creíble, una postura relajada pero profesional, un gesto cotidiano — esto conecta más que poses de estudio. Describir poses específicas y realistas en vez de genéricas.

---

## Iconografía y elementos visuales (universales y conceptuales)

El estilo de iconografía varía según la marca. **No existe un estilo único universal.** Antes de construir el prompt, consultar `notas_generales` de la marca para determinar:
- ¿Estilo 3D glossy, industrial metálico, flat minimalista, realista fotográfico?
- ¿Acabado suave/orgánico o duro/técnico?
- ¿Colores saturados o neutros?

**Regla general (aplica a todas las marcas):**
- Los elementos nunca deben parecer globos inflados — proporciones elegantes y creíbles
- Las proporciones deben ser coherentes con el rubro (herramientas industriales ≠ íconos de salud)

### Conjuntos > objetos solos
Para universales, **nunca un solo ícono aislado**. Siempre armar un pequeño conjunto de 2-3 elementos relacionados en distintos tamaños. Esto genera dinamismo visual y composición más rica.
```
A curated arrangement of 2-3 related [tema] elements at varying scales — one dominant, one medium, one small accent — creating visual rhythm and depth.
```

### Detalles y acabados
Consultar `notas_generales` de la marca para acabados específicos (metálicos, cromados, mate, glossy, etc.). Si no hay indicación, usar acabados coherentes con el rubro.

---

## Frases probadas con Qwen 2.5

### Las que funcionan bien ✅

**Calidad:**
- `High-end editorial advertising photography, cinematic lighting, premium catalogue quality`
- `Professional commercial photography with commercial retouching`
- `Photorealistic skin textures with professional makeup session quality`

**Composición:**
- `The main subject occupies no more than 40% of the frame`
- `Generous negative space on the right side and upper area for text overlay`
- `Positioned in the lower-left third of the frame`
- `All visual elements confined to one third of the frame` (universales — puede ser tercio inferior O superior)
- `The remaining two-thirds of the frame is clean open space for text overlay` (universales)

**Iluminación:**
- `Soft diffused lighting from above and slightly left, creating gentle shadows`
- `Unified lighting from [dirección] creating integrated shadows`
- `Shallow depth of field with [sujeto] in sharp focus`
- `Subtle [color] bokeh in background`
- `Dramatic rim lighting in cool [color] tones from behind`

**Fondos:**
- `Infinite abstract void where floor curves seamlessly into wall`
- `No visible horizon, no edges, no studio equipment`
- `Smooth gradient from [color] at [posición] to [color] at [posición]`

**Materiales:**
- `Glossy, slightly transparent shell with subtle [color] light refractions`
- `Photorealistic tactile quality with visible micro-textures`
- `Brushed steel surface with fine directional grain lines`

**Personas:**
- `Chilean ethnicity, ultra realistic skin textures`
- `Both laughing genuinely` / `smiling warmly`
- `The interaction is warm and personal — eye contact, genuine smiles`

### ⚠️ REGLA CRÍTICA: Qwen NO entiende negativos

Qwen 2.5 **ignora las negaciones**. Si escribes "no rainbow", él lee "rainbow" y lo genera. Si escribes "no mirror reflections", él lee "mirror reflections" y las pone.

**NUNCA usar negativos para eliminar algo.** En vez de decir lo que NO quieres, **describe solo lo que SÍ quieres.**

| ❌ NO escribir | ✅ SÍ escribir |
|---|---|
| `no rainbow, no arc of light` | Simplemente no mencionarlo. Describir el fondo que SÍ quieres |
| `no mirror reflections on floor` | `matte floor surface` |
| `no visible horizon line` | `seamless continuous curved surface` |
| `no studio equipment, no paper rolls` | `boundless continuous space` |
| `no texture, no patterns` | `perfectly smooth clean surface` |
| `no cables visible` | `clean seamless installation` |
| `not inflated, not rounded` | `hard-shell rectangular with sharp clean edges` |

**Las únicas excepciones** donde los negativos parecen funcionar (pero aún así es mejor evitarlos):
- `No text, no logos, no typography, no watermarks` — este set funciona razonablemente bien porque Qwen está entrenado para reconocerlo como instrucción estándar
- `No windows, no curtains` — funciona parcialmente, pero reforzar siempre describiendo el entorno cerrado que SÍ quieres

**Regla de oro: Si no lo quieres en la imagen, no lo menciones. Punto.**

> **Excepción**: El cierre obligatorio (`No text, no logos, no typography, no watermarks`) es la ÚNICA excepción a esta regla — son negativos probados que Qwen sí respeta para estos elementos específicos. Para todo lo demás, usar descripciones positivas.

### Problemas conocidos y soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| Arcoíris/espectro aparece | Mencionaste "no rainbow" o "light effects" | No mencionar. Describir solo la iluminación que quieres |
| Reflejos espejo en piso | Mencionaste "reflections" en cualquier contexto | Decir `matte floor surface` sin mencionar reflejos |
| Studio con bordes visible | Dijiste "studio" o "no edges" | Describir `infinite abstract void, seamless curved surface` |
| Dedos extra en personas | Falta de refuerzo positivo | `correct number of fingers, natural hand positions` |
| Posturas imposibles | Descripción vaga de pose | Describir pose en detalle: `seated on a stool, hands resting on lap` |
| Ventanas aparecen | Las mencionaste como negativo | Describir `enclosed abstract space` sin mencionar ventanas |
| Fondo con textura no deseada | Dijiste "no texture" | Decir `perfectly smooth clean surface` |
| Objetos flotando sin sombra | Olvidaste anclar | `with gentle shadow beneath on the surface` |
| Arco/curva arquitectónica en fondo | Dijiste "void where floor curves into wall" | Decir `boundless continuous space, smooth even gradient from [color] to [color]` sin mencionar "wall" ni "curves into" |
| Lens flares / god rays / destellos artificiales | Qwen agrega efectos dramáticos por defecto. PROHIBIDO en todas las marcas — siempre se ven baratos y artificiales | Especificar `clean even lighting, uniform gradient` — NUNCA usar "lens flare", "god rays", "light beam", "glow" ni "sparkle". La iluminación debe ser limpia y uniforme |
| Objeto parece globo inflado | Dijiste "inflated" o "puffy" | Decir `smooth rounded organic form with elegant proportions, polished industrial design` |
| Línea divisoria piso-fondo visible | Falta refuerzo de transición | `seamless curved transition, no visible seam between floor and background` |
| Códigos hex (#336666) aparecen como texto | Pusiste códigos hex en el prompt | NUNCA usar # antes de códigos de color. Escribir `teal 336666` o `deep blue 002284` sin el símbolo #. Qwen interpreta #texto como label visible |

---

## Cierre obligatorio del prompt

Estos son los únicos negativos que se incluyen al final (son estándar reconocido por Qwen):
```
No text, no logos, no typography, no watermarks.
```

**Para todo lo demás, usar descripciones positivas en vez de negativos:**

| En vez de... | Escribir... |
|---|---|
| "No windows, no curtains" | `Enclosed abstract space` + describir las paredes/fondo que SÍ quieres |
| "No mirror reflections" | `matte floor surface` |
| "No visible horizon" | `seamless curved surface where floor transitions smoothly into background` |
| "No studio equipment" | `boundless continuous space` |
| "No logos on clothing" | Describir la ropa con colores específicos sin mencionar logos |

Recordar: **si no lo quieres, no lo menciones.**

---

## Checklist de validación (antes de insertar)

### ✅ Estructura
- [ ] ¿Tiene los 6 bloques en orden lógico?
- [ ] ¿Está entre 120-260 palabras?
- [ ] ¿Es un texto fluido (sin listas ni headers)?

### ✅ Composición
- [ ] ¿Especifica foreground / midground / background?
- [ ] ¿Define posición del sujeto (tercio, zona)?
- [ ] ¿Indica porcentaje del frame que ocupa?
- [ ] ¿Pide espacio negativo explícitamente?

### ✅ Identidad de marca
- [ ] ¿Usa hex exactos de la paleta?
- [ ] ¿Los colores de fondo coinciden con `paleta_colores` y el escenario con `notas_generales`?
- [ ] ¿No viola `contenido_prohibido`?
- [ ] ¿Incluye balance de blancos 5600K?

### ✅ Iluminación
- [ ] ¿Especifica dirección de luz?
- [ ] ¿Menciona sombras integradas?
- [ ] ¿Indica profundidad de campo?

### ✅ Negativos y restricciones
- [ ] ¿Incluye "No text, no logos, no typography, no watermarks"?
- [ ] ¿Describe entorno cerrado con descripción positiva (en vez de "No windows, no curtains")?
- [ ] ¿Restricciones adicionales resueltas con descripciones positivas (no negativos)?

### ✅ Diversidad
- [ ] ¿Se revisaron las últimas 3-5 creatividades de la marca?
- [ ] ¿El registro visual es diferente al de las últimas?
- [ ] ¿El fondo/escenario es diferente?
- [ ] ¿El ángulo de cámara varía?
- [ ] ¿El tipo de narrativa rota?

### ✅ Personas (si aplica)
- [ ] ¿Especifica etnia chilena?
- [ ] ¿Describe vestimenta según marca?
- [ ] ¿Refuerza anatomía correcta?
- [ ] ¿Expresiones definidas?
- [ ] ¿Si hay grupo, personas visiblemente distintas (altura, edad, cabello)?

### ✅ Objetos y accesorios
- [ ] ¿Accesorios visibles (maletas, bolsos) en colores de marca?
- [ ] ¿Pantallas de dispositivos con interfaz genérica/universal?
- [ ] ¿Íconos 3D solo si aportan a la composición?
- [ ] ¿Transición piso-fondo con curva suave (no ángulo recto)?

---

## Notas de evolución

Este archivo se actualiza cada vez que descubrimos algo nuevo que funciona o falla con Qwen 2.5. Mantenerlo como fuente de verdad para todas las skills de creatividad.
