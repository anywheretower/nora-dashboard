---
name: nora-imagen-iteracion
description: Auto-evaluación y mejora iterativa de creatividades de IMAGEN en NORA. Analiza imágenes contra criterios técnicos, de marca y publicitarios; decide si pasan o necesitan otra vuelta. Si itera, DUPLICA la creatividad con prompt ajustado (nunca sobrescribe la original). La original queda con condición "iteracion_resuelta". Máximo 3 rondas. Para video ver nora-video-iteracion.
id: nora-imagen-iteracion
---

# Iteración de Imagen — Skill de auto-evaluación y mejora de creatividades de imagen para NORA

> **Última revisión: 2026-02-23 01:30 CLT**

> ⚠️ **REGLA FUNDAMENTAL: NUNCA sobrescribir la creatividad original.** Siempre DUPLICAR: crear nueva entrada con el prompt ajustado y marcar la original como `iteracion_resuelta`. Esto preserva el historial para comparación.

## Cuándo se activa

- **Automático**: todos los días a las 04:00 hrs — revisa creatividades en `condicion=para_revision` que sean nuevas (no iteraciones previas)
- **Por pedido de Jorge**: cuando Jorge solicita iterar creatividades específicas

### Filtros de activación (IMPORTANTE)
- Solo creatividades con `condicion=para_revision`
- **Excluir** las que ya tengan tag `iterado_r3` (agotaron sus rondas)
- **Excluir** las que vengan de una observación resuelta (su original tenía `condicion=observado`)
- **No re-iterar loops**: si una creatividad fue generada por esta misma skill (tiene tag `iterado_rN`), solo continuar si no ha llegado a ronda 3

### Qué hace
Actúa como **filtro de calidad antes de que Jorge las revise**. Evalúa la imagen, decide si cumple estándares, y si no, genera **2 versiones nuevas** con prompts ajustados distintos y devuelve a `paso 4` para regeneración.

**Diferencia con observación**: Observación resuelve feedback humano. Iteración es autocrítica automatizada.

## Dependencia

- **nora-prompt-master** (`skills/nora-prompt-master/SKILL.md`) — para modificar prompts según reglas probadas
- Requiere capacidad de **análisis de imagen** (vision model)

## Idioma de trabajo

Ver `skills/shared/IDIOMA.md` para reglas de idioma español/inglés y `skills/shared/SUPABASE.md` para encoding y conexión. Ver `shared/SCHEMA.md` y `shared/PIPELINE.md` para esquema de tablas y flujo completo.

---

## Proceso completo

### Paso 1: Seleccionar creatividades candidatas

Consultar creatividades en `para_revision`:

```
creatividades?condicion=eq.para_revision&select=id,marca,prompt,concepto,link_ren_1,link_ren_2,origen,tags,condicion
```

Filtrar por marca específica si se indica, o procesar todas las marcas activas.

**Filtrar**:
- Solo creatividades que NO tengan tag `iterado_r3` (ya agotaron sus rondas)
- Excluir `origen=input` (datos sin imagen)
- **Incluir todos los orígenes de imagen**: `original`, `referencia`, `universal`, `requerido`, `calendario`, `Producto`, `Colaborador`, `Interior`, `Exterior`, `Fachada`
- **Excluir**: `Pantalla` (no sujetas a iteración — solo reciben observaciones)
- Para orígenes de img2img (`Producto`, `Colaborador`, `Interior`, `Exterior`, `Fachada`) usar `comfy-img2img.mjs` en vez de `comfy-text2img.mjs` al regenerar (ver Paso 6b)
- **Excluir `origen=video`** → ver skill `nora-video-iteracion`

### Paso 2: Cargar contexto de marca

Cargar campos de marca desde Supabase (ver shared/SCHEMA.md tabla `marcas`): ficha, arquetipo, paleta_colores, look_and_feel, notas_generales, contenido_prohibido, logos.

### Paso 3: Evaluar la imagen

Analizar `link_ren_1` (o `link_ren_2` si existe) con el modelo de visión. Evaluar contra **3 dimensiones** con puntuación 1-5 cada una:

---

#### Dimensión A: Calidad Técnica (umbral: ≥3)

| Criterio | 1 (falla) | 3 (aceptable) | 5 (excelente) |
|---|---|---|---|
| **Anatomía** | Dedos extra, extremidades deformes, proporciones imposibles | Proporciones correctas, alguna rigidez menor | Naturalidad total, posturas creíbles |
| **Artefactos** | Texto ilegible generado, glitches visibles, objetos fusionados | Limpio, algún detalle menor | Impecable |
| **Balance de blancos** | Dominante de color obvia (amarillo, azul) | Colores fieles, neutral | Calibración perfecta, colores vivos |
| **Espacio negativo** | Sujeto >60% del frame, sin zona para texto | 40-50% sujeto, zona de texto identificable (alineado con prompt-master que permite hasta 50%) | 30-40% sujeto, amplias zonas limpias |
| **Fondo** | Ventanas, cortinas, arcos arquitectónicos, bordes de estudio | Fondo coherente, sin elementos no solicitados | Fondo exacto según paleta, seamless, sin arcos ni formas parasitarias |
| **Superficies** | Piso con grietas/texturas, línea divisoria piso-fondo visible | Superficies limpias, transición suave | Mate pulido levemente reflectante, transición sinfín perfecta |
| **Vestimenta** | Ropa sucia, manchada, arrugada | Ropa limpia, colores correctos | Impecable, planchada, colores exactos de marca — incluso en trabajadores manuales |
| **Naturalidad de gestos** | Pose rígida de stock, sonrisa forzada | Pose creíble, expresión aceptable | Gesto cotidiano natural, sonrisa genuina, postura relajada — se siente real |
| **⭐ Espacio para texto overlay (PESO 2x)** | Sujeto >60% del frame, zona superior ocupada con elementos que compiten, sin zona limpia para headline | Zona superior mayormente libre, ~30% del frame despejado | Zona superior del frame completamente limpia/simple, sin elementos que compitan, mínimo 30% del frame despejado para overlay. Fondo uniforme o gradiente suave en zona de texto |

**Promedio A** = media ponderada de los criterios. Vestimenta y Naturalidad solo aplican si hay personas; si no, excluir del promedio. **"Espacio para texto overlay" cuenta doble (peso 2x)** porque es PRIORIDAD #1 — una imagen espectacular sin espacio para texto no sirve.

---

#### Dimensión B: Coherencia de Marca (umbral: ≥3)

| Criterio | 1 (falla) | 3 (aceptable) | 5 (excelente) |
|---|---|---|---|
| **Paleta cromática** | Colores fuera de paleta, disonancia evidente | Colores reconocibles de marca, algún desvío | Hex exactos, armonía total |
| **Registro visual** | Registro que no existe en look_and_feel de la marca | Registro válido pero repetido vs recientes | Registro documentado + diferente a últimas 5 |
| **Contenido prohibido** | Viola una restricción explícita | No viola, pero está en zona gris | Claramente alejado de todo lo prohibido |
| **Tono emocional** | Contradice el arquetipo (ej: marca seria se ve infantil) | Coherente con arquetipo | Refuerza poderosamente el arquetipo |
| **Iconografía 3D** (si aplica) | Objetos parecen globos inflados, cartoon, poco elegantes | Formas suaves pero algo genéricas | Elegantes, pulidas, diseño industrial premium, detalles metálicos |
| **Composición de conjunto** (universales) | Un solo ícono aislado, composición vacía | 2+ elementos pero sin ritmo visual | Conjunto de 2-3 elementos en distintas escalas, ritmo visual dinámico |

**Promedio B** = media de los 4 criterios.

---

#### Dimensión C: Impacto Publicitario (umbral: ≥3)

Estos criterios elevan la creatividad de "correcta" a "memorable". Basados en principios publicitarios de efectividad:

| Criterio | 1 (débil) | 3 (funcional) | 5 (poderoso) |
|---|---|---|---|
| **Stopping Power** | La imagen es genérica, se pierde en un feed. No hay nada que detenga el scroll | Llama la atención pero no sorprende | Detiene el scroll: composición inesperada, contraste dramático, sujeto magnético |
| **Claridad de mensaje** | No se entiende qué comunica sin leer el copy | Se intuye el territorio temático | En <2 segundos se capta la idea central — la imagen cuenta la historia sola |
| **Tensión visual** | Imagen plana, equilibrio simétrico estático, sin dinamismo | Algún contraste o asimetría que genera interés | Tensión deliberada: escala inesperada, yuxtaposición, luz dramática, contraste textural |
| **Memorabilidad** | Vista una vez, olvidada. No tiene gancho visual | Imagen competente que se recuerda vagamente | Tiene un elemento ancla (detalle inusual, composición icónica, metáfora visual) que se queda en la mente |
| **Emocionalidad** | No provoca nada — imagen de stock genérica | Genera una respuesta emocional leve (agrado, interés) | Provoca una emoción clara: asombro, ternura, ambición, calma profunda, orgullo |
| **Novedad** | Se ha visto cien veces: el handshake corporativo, el doctor sonriente de stock | Tiene algún giro propio pero en territorio conocido | Ángulo fresco: perspectiva inusual, metáfora original, combinación que no se ha visto en el rubro |

**Promedio C** = media de los 6 criterios.

---

### Paso 4: Decidir

Calcular **score total** = (A + B + C) / 3

| Score total | Decisión |
|---|---|
| **≥ 4.0** | ✅ **PASA** — Marcar como lista para revisión humana |
| **2.5 – 3.9** | 🔄 **ITERAR** — Ajustar prompt y regenerar |
| **< 2.5** | 🔄 **ITERAR (profundo)** — Reescribir secciones mayores del prompt |

**Límite de rondas**: máximo 3. Trackear con tag:
- Ronda 1: agregar tag `iterado_r1`
- Ronda 2: cambiar a `iterado_r2`
- Ronda 3: cambiar a `iterado_r3` → pasa a revisión humana aunque no cumpla score (no se atora)

### Paso 5: Ajustar prompt (si itera)

Según los criterios que fallaron, aplicar correcciones **quirúrgicas**:

| Criterio que falló | Acción en el prompt |
|---|---|
| Anatomía | Agregar refuerzo: `anatomically perfect proportions, correct number of fingers` |
| Artefactos/texto generado | Reforzar: `No text, no logos, no typography` + simplificar elementos del prompt |
| Balance de blancos | Verificar que tenga `Perfect white balance daylight 5600K calibrated` |
| Espacio negativo | Ajustar porcentaje: `occupies no more than 35% of the frame` + `generous negative space` |
| Fondo incorrecto | Reescribir Bloque 5 con fondo exacto de `paleta_colores` |
| Paleta fuera | Agregar hex explícitos del fondo y acentos |
| Registro repetido | Cambiar Bloque 2 (concepto) a un registro diferente de `look_and_feel` |
| Stopping power bajo | Agregar contraste dramático, cambiar ángulo, intensificar iluminación |
| Claridad débil | Simplificar composición: menos elementos, sujeto más protagonista |
| Sin tensión visual | Agregar asimetría, luz direccional fuerte, escala inesperada |
| Baja memorabilidad | Introducir un detalle ancla: textura inusual, objeto simbólico, perspectiva forzada |
| Sin emoción | Reforzar expresiones humanas o carga simbólica del objeto |
| Falta novedad | Cambiar ángulo de cámara, proponer metáfora visual fresca |

**Regla**: consultar **prompt-master** para frases probadas. Ver nora-prompt-master para reglas de negativos.

### Paso 6: Actualizar en Supabase

#### Si PASA (score ≥ 4.0 o ronda 3 agotada):

No cambiar `estado` ni `condicion` — la creatividad ya tiene imagen y su `condicion=para_revision` la mantiene visible para Jorge.

```javascript
PATCH creatividades?id=eq.{id}
{
  "tags": "<tags existentes + iterado_rN + score:X.X>"
}
```

Solo se agregan tags con la ronda y el score para trazabilidad. Jorge la revisa como cualquier otra creatividad en `para_revision`.

#### Si ITERA:

**CREAR 2 NUEVAS ENTRADAS** — cada una con un enfoque distinto para resolver los criterios que fallaron. La original se conserva para comparar.

```javascript
// 1. INSERTAR versión A — corrección principal:
POST creatividades
{
  // Copiar TODOS los campos tal cual de la original
  // SOLO cambiar:
  "prompt": "<prompt ajustado versión A>",
  "estado": "paso 4",
  "condicion": null,
  "tags": "<tags existentes + iterado_rN>"
  // NO copiar: id, created_at, link_ren_1, link_ren_2
}

// 2. INSERTAR versión B — corrección alternativa (diferente ángulo, fondo, composición):
POST creatividades
{
  // Copiar TODOS los campos tal cual de la original
  // SOLO cambiar:
  "prompt": "<prompt ajustado versión B>",
  "estado": "paso 4",
  "condicion": null,
  "tags": "<tags existentes + iterado_rN>"
  // NO copiar: id, created_at, link_ren_1, link_ren_2
}

// 3. ACTUALIZAR la original:
PATCH creatividades?id=eq.{id_original}
{
  "condicion": "iteracion_resuelta"
}
```

**Diferenciación entre versiones A y B**: ambas resuelven los criterios que fallaron, pero varían en algún aspecto secundario (ángulo de cámara, variante de fondo, composición, iluminación). No son correcciones opuestas — son dos caminos válidos.

**Encoding**: Usar Node.js para escrituras.

### Paso 6b: Generar imagen con ComfyUI

Una vez creada la nueva creatividad en paso 4, ejecutar la generación de imagen inmediatamente.

**Seleccionar script según el `origen` de la creatividad:**

| Origen | Script | Tipo |
|--------|--------|------|
| `original`, `referencia`, `universal`, `requerido`, `calendario` | `comfy-text2img.mjs` | Texto a imagen 3:4 (Qwen 2.5) |
| `Producto`, `Colaborador`, `Interior`, `Exterior`, `Fachada` | `comfy-img2img.mjs` | Imagen a imagen 3:4 (Qwen Image Edit) |

> **Pantalla** (`origen=Pantalla`) NO pasa por iteración — solo recibe observaciones de Jorge.

#### Flujo text2img / img2img:

```bash
cd C:\Users\conta\.openclaw\workspace

# Para texto a imagen:
node comfy-text2img.mjs --once --id=<ID_NUEVA_CREATIVIDAD>

# Para imagen a imagen:
node comfy-img2img.mjs --once --id=<ID_NUEVA_CREATIVIDAD>
```

- `--once`: procesa y sale (no queda en polling)
- `--id=<ID>`: genera solo esa creatividad específica
- Al terminar, la creatividad pasa automáticamente a paso 5 (text2img) o paso 8/10 (img2img)
- **Notificar a Jorge inmediatamente** cuando ComfyUI termine
- Luego volver a Paso 3 para evaluar la nueva imagen (siguiente ronda de iteración)

### Paso 7: Log de aprendizaje

Después de cada lote, guardar resumen en `memory/iteracion-log.md`:

```markdown
## YYYY-MM-DD — Lote iteración

| ID | Marca | Rondas | Score final | Criterios fallados | Fix aplicado |
|---|---|---|---|---|---|
| 650 | [marca] | 2 | 3.8 | espacio negativo, novedad | Reducir sujeto 50%→35%, cambiar ángulo top-down |
```

Este log alimenta al prompt-master con el tiempo: si un criterio falla sistemáticamente, se ajustan las reglas base.

---

## Modos de ejecución

### Individual
```
Iterar creatividad #650
```

### Por marca
```
Iterar todas las creatividades pendientes de [marca]
```

### Lote completo
```
Iterar todas las creatividades en paso 4 con imagen
```

---

## Criterios avanzados de impacto (referencia para evaluación)

### Stopping Power — Técnicas que funcionan
- **Escala inesperada**: objeto cotidiano gigante o miniaturizado
- **Contraste cromático fuerte**: elemento saturado sobre fondo desaturado
- **Mirada directa**: persona mirando a cámara con expresión intensa
- **Espacio vacío dramático**: mucho aire + sujeto pequeño pero magnético
- **Perspectiva forzada**: ángulo que distorsiona la realidad cotidiana

### Memorabilidad — Lo que ancla
- **Detalle inusual**: algo que no "debería" estar ahí pero tiene sentido narrativo
- **Metáfora visual**: idea abstracta representada como imagen concreta
- **Composición icónica**: imagen que funciona como símbolo (silueta, forma reconocible)
- **Textura protagonista**: close-up extremo de material que invita a tocar

### Novedad — Por tipo de rubro
- **Salud**: evitar doctor-sonriente-de-stock; buscar momentos reales, luz de hospital poética, manos con historia
- **Industrial/herramientas**: evitar la foto corporativa de fábrica; buscar la belleza en la maquinaria, texturas metálicas, escala monumental
- **Servicios/asesoría**: evitar el handshake y la reunión de oficina; buscar metáforas de resultado, transformación, impacto
- **Transporte**: evitar la foto genérica de bus/flota; buscar paisajes de ruta, momentos del viajero, texturas de movimiento

---

## Conexión Supabase

Ver `skills/shared/SUPABASE.md` para URL, headers y encoding obligatorio con Node.js.

- **PATCH endpoint**: `/rest/v1/creatividades?id=eq.<id>`

---

## Notas de evolución

- Los umbrales (≥4.0 pasa, <2.5 itera profundo) pueden ajustarse según resultados reales.
- El log de aprendizaje es clave: patrones recurrentes → actualizar prompt-master.
- Dimensión C (impacto) es la más subjetiva — calibrar con feedback de Jorge sobre qué creatividades le gustan vs cuáles no.
