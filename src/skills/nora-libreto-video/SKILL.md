# nora-libreto-video — Skill de libretos para videos cortos

> Última revisión: 2026-02-16 08:00 CLT

## Propósito

Generar libretos (guiones) de CONTENIDO para videos cortos. Esta skill produce SOLO textos y estructura narrativa. **No incluye instrucciones visuales, de animación ni de música** — eso lo resuelve la skill `nora-remotion-animacion`.

**Esta skill es 100% universal** — funciona para cualquier marca. La individualidad de cada video viene de los insumos de marca (ficha + textos aprobados), no de esta skill.

### Flujo completo
1. **Esta skill** → genera el libreto (textos, estructura, hook)
2. **Skill `nora-remotion-animacion`** → toma el libreto → mapea cada escena a templates existentes de EffectsBible → adapta identidad de marca → genera música con MusicGen
3. Si se necesitan imágenes → buscar en Supabase (estado `resultado_final` o `aprobado`)

---

## Contexto de mercado

- 91% de negocios usan video como herramienta de marketing (Wyzowl 2026)
- Short-form video genera el ROI más alto de cualquier formato de contenido (HubSpot 2026)
- 66% de consumidores prefieren short-form sobre long-form (Sprout Social)
- El sweet spot viral: 15-60 segundos
- La duración es flexible — depende del contenido y la música, no de un límite arbitrario

---

## 1. LA REGLA DE LOS 3 SEGUNDOS

> Si no atrapas en 3 segundos, perdiste. El 65% de viewers abandona antes del segundo 3.

### Tipos de hook (elegir UNO por video)

| # | Tipo | Mecanismo | Ejemplo genérico |
|---|------|-----------|-----------------|
| 1 | **Pregunta provocadora** | Activa curiosidad | "¿Sabías que el 80% de las empresas...?" |
| 2 | **Dato impactante** | Shock cognitivo | "Cada 8 segundos alguien pierde..." |
| 3 | **Declaración contraintuitiva** | Contradice creencia popular | "Lo que te dijeron sobre X está mal" |
| 4 | **Promesa directa** | Beneficio claro e inmediato | "En 15 segundos vas a saber cómo..." |
| 5 | **Escenario relatable** | El viewer se identifica | "Cuando llegas al trabajo y..." |
| 6 | **Visual disruptivo** | Movimiento, color, contraste extremo | Imagen inesperada + texto bold |
| 7 | **Enemigo común** | Une al viewer contra algo | "Estamos cansados de que..." |
| 8 | **Antes/después** | Contraste visual inmediato | Split screen transformación |

---

## 2. FRAMEWORKS DE ESTRUCTURA

### Framework A: HOOK → DOLOR → SOLUCIÓN → CTA
**El más probado para conversión directa.**

| Segmento | Duración | Función |
|----------|----------|---------|
| **HOOK** | 0-3s | Atrapar atención (ver tabla hooks) |
| **DOLOR** | 3-9s | Amplificar el problema que el viewer siente |
| **SOLUCIÓN** | 9-16s | Presentar la marca/producto como la respuesta |
| **CTA** | 16-20s | Acción clara y única |

**Cuándo usar:** Servicios, productos con problema claro, campañas de conversión.

### Framework B: HOOK → PROMESA → PRUEBA → CTA
**Para construir autoridad y confianza.**

| Segmento | Duración | Función |
|----------|----------|---------|
| **HOOK** | 0-3s | Atrapar con dato o pregunta |
| **PROMESA** | 3-8s | "Nosotros hacemos X para que tú logres Y" |
| **PRUEBA** | 8-16s | Número, testimonio, resultado visual, caso real |
| **CTA** | 16-20s | Acción clara |

**Cuándo usar:** Marcas con track record, lanzamientos, credibilidad.

### Framework C: ANTES → DESPUÉS → PUENTE (BAB)
**Para transformaciones visuales.**

| Segmento | Duración | Función |
|----------|----------|---------|
| **ANTES** | 0-7s | Mostrar el estado actual (problema, caos, limitación) |
| **DESPUÉS** | 7-14s | Mostrar el estado deseado (orden, éxito, solución) |
| **PUENTE** | 14-20s | "¿Cómo? Con [marca/producto]" + CTA |

**Cuándo usar:** Remodelaciones, salud, transformaciones, servicios con resultado tangible.

### Framework D: TENSIÓN → GIRO → RESOLUCIÓN
**Storytelling puro, máximo engagement.**

| Segmento | Duración | Función |
|----------|----------|---------|
| **TENSIÓN** | 0-7s | Plantear conflicto o situación que genera ansiedad/curiosidad |
| **GIRO** | 7-13s | Revelar algo inesperado que cambia la perspectiva |
| **RESOLUCIÓN** | 13-20s | La marca como el factor que hizo posible el giro + CTA |

**Cuándo usar:** Branding emocional, narrativas, diferenciación.

### Framework E: LISTA RÁPIDA (3 puntos)
**Para educación y valor inmediato.**

| Segmento | Duración | Función |
|----------|----------|---------|
| **HOOK** | 0-3s | "3 cosas que [tu audiencia] necesita saber" |
| **PUNTO 1** | 3-8s | Dato/consejo más fuerte |
| **PUNTO 2** | 8-13s | Dato/consejo complementario |
| **PUNTO 3 + CTA** | 13-20s | Tercer punto ligado a la marca + llamado a acción |

**Cuándo usar:** Tips, educación, posicionamiento como experto.

### Framework F: PREGUNTA → MITO → VERDAD → CTA
**Para destruir objeciones.**

| Segmento | Duración | Función |
|----------|----------|---------|
| **PREGUNTA** | 0-3s | "¿Es verdad que...?" / "¿Por qué dicen que...?" |
| **MITO** | 3-9s | Exponer la creencia falsa o limitante |
| **VERDAD** | 9-16s | Revelar la realidad (con la marca como prueba) |
| **CTA** | 16-20s | Acción clara |

**Cuándo usar:** Industrias con mitos, objeciones frecuentes, educación de mercado.

---

## 2b. TONO: OPORTUNIDAD, NO CRÍTICA

> **Regla fundamental:** El video debe hacer sentir al viewer que está en el camino correcto y que puede ir aún más lejos. NUNCA criticar ni señalar errores.

### Principios de tono

| ❌ Evitar | ✅ Preferir |
|-----------|------------|
| "El error más caro que cometen..." | "Lo que los líderes ya están haciendo..." |
| "¿Tu negocio está listo?" (implica que no) | "Lleva tu negocio al siguiente nivel" |
| "Lo que tu [profesional] no te dice" | "Lo que los mejores [profesionales] recomiendan" |
| "Estamos cansados de que..." | "Imagina un mundo donde..." |
| Señalar lo que falta | Reconocer lo logrado + invitar a crecer |
| "El problema es..." | "La oportunidad está en..." |

### El framework de tono CORRECTO
1. **Reconocer éxito** → "Ya lo estás haciendo bien"
2. **Mostrar oportunidad** → "Y ahora puedes ir más lejos"
3. **Elevar el estándar** → "Con [marca], el siguiente nivel"

### Fuente de tono real
Los textos aprobados en creatividades (`resultado_final` / `aprobado`) son la MEJOR referencia de tono. Sus `slogan_headline`, `subtitulo`, `cta` y `copy` ya pasaron validación de marca. **Leerlos ANTES de escribir cualquier línea del libreto** — el vocabulario, nivel de formalidad y ángulo emocional que usan es el que debe replicarse.

---

## 3. REGLAS DE TEXTO EN PANTALLA

| Regla | Detalle |
|-------|---------|
| **Máximo 8-10 palabras por pantalla** | Si no cabe en una línea mental, es demasiado |
| **Tiempo mínimo de lectura** | 1.5 segundos por frase corta, 2.5s por frase larga |
| **Una idea por pantalla** | Nunca dos conceptos compitiendo |

### Conteo de palabras por segmento (20s)

| Segmento | Palabras máx. | Frases máx. |
|----------|---------------|-------------|
| Hook (3s) | 6-8 | 1 |
| Desarrollo (12s) | 24-36 | 3-4 |
| CTA (5s) | 8-12 | 1-2 |
| **Total** | **38-56** | **6-8** |

> **Mínimo 6 escenas por video.** Un guión de 20s debe tener al menos 6 filas en la tabla segundo a segundo. Esto genera ritmo visual profesional con cambios frecuentes.

---

## 4. REGLAS DE RITMO

| Principio | Aplicación |
|-----------|------------|
| **Cambio cada 2-3 segundos** | Nuevo texto o concepto cada 2-3s |
| **Ritmo crescendo** | El video debe ACELERAR hacia el final |
| **Loop-friendly** | Si el último concepto conecta con el primero → replay |

---

## 5. ANATOMÍA DEL CTA

| Criterio | Bien | Mal |
|----------|------|-----|
| **Específico** | "Agenda tu hora aquí" | "Contáctanos" |
| **Una sola acción** | "Visita nuestro sitio" | "Síguenos, comenta y comparte" |
| **Urgencia** | "Solo esta semana" | "Cuando quieras" |

### CTAs por objetivo

| Objetivo | CTA sugerido |
|----------|-------------|
| Tráfico web | "Más info en [link]" / "Link en bio" |
| Seguimiento | "Síguenos para más" |
| Conversión | "Agenda ahora" / "Cotiza gratis" |
| Engagement | "¿Cuál prefieres? Comenta" |
| Awareness | Logo + tagline (sin CTA verbal) |

---

## 6. PROCESO DE GENERACIÓN

### Paso 1: Recopilar insumos de marca (LOS DOS PILARES)

El libreto se construye a partir de **dos fuentes reales**, no de imaginación:

#### Pilar 1: Ficha de marca (`marcas.ficha`)
```
SELECT ficha, contenido_prohibido FROM marcas WHERE marca = '[MARCA]'
```
La ficha contiene información objetiva: qué hace la marca, a quién le habla, tono, arquetipo, propuesta de valor, diferenciadores. Es el **brief real** de donde sale la estrategia del libreto.

**Datos clave a extraer de la ficha:**
- **Sitio web oficial** — buscar "Sitio web:" en la ficha. Usar esta URL exacta en el CTA del video, NUNCA inventar URLs.
- **Slogan oficial** — usar como referencia de tono
- **Segmento** — a quién le habla, cómo abordarlos
- **Oferta principal** — servicios/productos para el contenido

#### Pilar 2: Textos aprobados (`creatividades`)
```
SELECT slogan_headline, subtitulo, cta, copy FROM creatividades
WHERE marca = '[MARCA]' AND (condicion = 'resultado_final' OR condicion = 'aprobado')
ORDER BY created_at DESC
```
Estos textos ya fueron revisados y tienen visto bueno. Representan exactamente cómo la marca quiere hablarle a su audiencia. Son el **banco de tono real** — usar como inspiración directa, adaptar frases, respetar vocabulario.

#### Complementarios (si aplican)
- `contenido_prohibido` → qué evitar (obligatorio respetar)
- `inputs` → productos/servicios específicos con títulos y descripciones reales
- `requerimientos` → briefing puntual del cliente

> **El cóctel es simple:** ficha (información objetiva) + textos aprobados (tono validado) = libreto bien fundado. Todo lo demás es estructura y técnica narrativa.

### Paso 1b: Revisar videos existentes de la marca (OBLIGATORIO)
Antes de escribir un libreto nuevo, **SIEMPRE consultar videos previos** en Supabase:

```
SELECT id, concepto, copy, created_at FROM creatividades
WHERE marca = '[MARCA]' AND origen = 'video'
ORDER BY created_at DESC
```

El campo `concepto` es un JSON con toda la metadata del video:
```json
{
  "libreto": "texto completo del guión segundo a segundo",
  "framework": "B",
  "hook_tipo": 4,
  "templates": ["S01_RepeatScroll", "S02_SplitImageText", "..."],
  "fondo": "oscuro",
  "imagenes": ["marca_img_1.png", "marca_img_2.png"],
  "musica": "piano + strings, 26s",
  "duracion_s": 26.3,
  "escenas": 7
}
```

Con esta información:
- **NO repetir** el mismo framework del último video → elegir uno diferente
- **NO repetir** el mismo tipo de hook → rotar entre los 8 tipos
- **NO repetir** frases textuales ya usadas en libretos anteriores
- **Variar ángulo temático**: si el anterior fue "problema→solución", usar "lista rápida" o "antes→después"
- Esto es CRÍTICO cuando se generan múltiples videos en batch (ej. "hazme 5 videos")

### Paso 2: Elegir framework
Según el objetivo del video y la naturaleza de la marca. Si hay videos previos, elegir un framework DIFERENTE al último usado.

### Paso 3: Elegir tipo de hook
De la tabla de 8 hooks, el que mejor conecte con el dolor de la audiencia y el tono de la marca.

### Paso 4: Escribir el libreto
Formato de salida (obligatorio):

```
## LIBRETO VIDEO — [Marca] — [Título descriptivo]

**Framework:** [A/B/C/D/E/F] — [nombre]
**Hook:** [tipo de hook elegido]
**Duración:** [Xs]
**Objetivo:** [conversión/awareness/engagement/educación]
**Plataforma:** [TikTok/Reels/Shorts/Stories/Todas]

### GUIÓN SEGUNDO A SEGUNDO

| Segundo | Texto en pantalla |
|---------|-------------------|
| 0-3s | [texto exacto del hook] |
| 3-Xs | [texto exacto] |
| ... | ... |

### TEXTO TOTAL: [X palabras]
### FRASES TOTAL: [X]

### COPY DE PUBLICACIÓN
[Texto corto que acompaña al video cuando se publica en redes sociales. 1-3 líneas. Incluye el CTA y/o link si aplica. Este copy se graba en el campo `copy` de la creatividad en Supabase.]
```

> **Nota:** La columna "Visual" y la música las decide la skill de animación al mapear el libreto a templates. No incluir instrucciones visuales aquí.

### Paso 5: Validación
Checklist obligatorio antes de entregar:

- [ ] ¿El hook atrapa en ≤3 segundos?
- [ ] ¿Cada pantalla tiene ≤10 palabras?
- [ ] ¿El texto total es ≤56 palabras?
- [ ] ¿Hay cambio de texto cada 2-3 segundos?
- [ ] ¿El CTA es específico y único?
- [ ] ¿Respeta contenido_prohibido de la marca?
- [ ] ¿El tono coincide con el arquetipo de marca?
- [ ] ¿Funciona sin audio? (muchos ven en mudo)
- [ ] ¿El ritmo acelera hacia el final?

---

## 7. ADAPTACIÓN POR FORMATO

### Vertical 9:16 (TikTok, Reels, Stories) — PRIORITARIO
- Safe zone texto: evitar 150px arriba, 400px abajo (UI de plataforma)
- Texto centrado, grande

### Horizontal 16:9 (YouTube, Web, LinkedIn)
- Más espacio para textos largos

### Cuadrado 1:1 (Feed Instagram, Facebook)
- Máximo aprovechamiento de espacio

---

---

## 9. LO QUE NO HACE ESTA SKILL

- **No genera código Remotion** → skill `nora-remotion-animacion`
- **No elige templates visuales** → skill `nora-remotion-animacion`
- **No genera imágenes** → pipeline de creatividades + Supabase
- **No genera música** → MusicGen (lo coordina skill animación)
- **No define paleta de colores ni tipografía** → skill animación adapta la marca
- **No incluye notas de producción** → skill animación decide transiciones, ritmo visual, efectos

Esta skill es **PURA ESCRITURA**: textos, estructura narrativa y estrategia de contenido.

### Después de entregar el libreto
Se activa la skill `nora-remotion-animacion` que:
1. Lee el libreto
2. Mapea cada fila del guión a un Scene Template existente
3. Busca imágenes de marca en Supabase
4. Adapta colores/fonts de la marca
5. Genera música con MusicGen
6. Renderiza el video final

---

## Referencias metodológicas

- **PAS (Problem-Agitate-Solve)**: Eugene Schwartz, *Breakthrough Advertising*
- **AIDA**: E. St. Elmo Lewis (1898), adaptado a digital
- **BAB (Before-After-Bridge)**: Copywriting clásico de respuesta directa
- **Hook-first approach**: Validado por TikTok Creative Center, Meta Creative Hub
- **3-second rule**: Facebook/Meta internal research — 65% drop-off antes de 3s
- **Video ROI data**: Wyzowl State of Video Marketing 2026, HubSpot State of Marketing 2026
