---
name: nora-creatividad-universal
description: Generar imágenes genéricas de marca para la plataforma NORA. Imágenes minimalistas con máximo espacio libre, diseñadas para recibir cualquier texto después (avisos operativos, feriados, cortes de servicio, efemérides, comunicados). Calidad editorial profesional, identidad de marca intacta. Origen "universal" en la tabla creatividades.
id: nora-creatividad-universal
---

# Creatividad Universal — Imágenes genéricas de marca para NORA

> **Última revisión:** 2026-02-13 20:15 (GMT-3)

## Dependencias

### Pipeline de 3 pasos:
1. **Paso 1 — Concepto** (`nora-imagen-concepto`): define dirección compositiva (los motores creativos ayudan a elegir composiciones no obvias, aunque universales no tienen narrativa)
2. **Paso 2 — Esta skill** (universal): define composición minimalista, escribe campos, construye prompt
3. **Paso 3 — Prompt-master** (`nora-prompt-master`): se aplica como validación final — checklist (espacio libre 65-70%), frases probadas, negativos

Flujo: **Concepto → Universal (construye prompt) → Prompt-master (valida/optimiza) → Insertar en Supabase paso 4**

> **Nota**: Los 3 pasos se ejecutan en una sola corrida. No son procesos separados.

## Cuándo se activa

- **Automático**: todos los lunes a las 00:00 hrs — genera 3 creatividades universales por marca activa
- **Por pedido de Jorge**: cuando Jorge solicita lienzos universales para una marca específica

## Propósito

Generar imágenes **genéricas y reutilizables** para una marca. Estas imágenes no tienen un mensaje específico — son fondos/composiciones profesionales con la identidad visual de la marca, diseñadas para que después se les coloque **cualquier texto**: avisos operativos, feriados, cortes de servicio, felicitaciones, efemérides, comunicados internos, etc.

**La imagen es un lienzo de marca, no una pieza con concepto narrativo.**

## Idioma de trabajo

Ver `skills/shared/IDIOMA.md` para reglas de idioma español/inglés y `skills/shared/SUPABASE.md` para encoding y conexión. Ver `shared/SCHEMA.md` y `shared/PIPELINE.md` para esquema de tablas y flujo completo.

## Proceso completo

### Paso 1: Cargar identidad visual de marca

Cargar campos de marca desde Supabase (ver shared/SCHEMA.md tabla `marcas`): ficha, arquetipo, paleta_colores, look_and_feel, notas_generales, contenido_prohibido, logos.

Para imágenes universales, la **paleta de colores** y el **look and feel** son los campos más importantes. La ficha y el arquetipo son secundarios (no hay mensaje narrativo que transmitir).

### Paso 1b: Revisar universales anteriores de la marca

Consultar creatividades previas de la marca con `origen=universal`:

```
creatividades?marca=eq.{marca}&origen=eq.universal&select=id,prompt,gatillador,condicion
```

Revisar los prompts y gatilladores para identificar:
- **Composiciones ya usadas** — no repetir el mismo tipo (ej: si ya hay un fondo puro con curva decorativa, hacer una con elemento icónico o textura abstracta)
- **Elementos visuales ya usados** — no repetir el mismo objeto 3D o ícono (ej: si ya hay un estetoscopio, usar otro elemento del rubro)
- **Zonas ocupadas** — si las anteriores ponen el elemento en la esquina inferior derecha, variar a superior izquierda u otra zona
- **Orientación del degradado** — variar entre vertical, radial, diagonal

El objetivo es que la marca tenga un **set diverso de universales** donde cada una se sienta distinta y sirva para diferentes contextos.

### Paso 2: Definir la composición

Las imágenes universales se basan en **composiciones abstractas o minimalistas** que expresan la identidad visual de la marca sin contar una historia específica. Tipos de composición:

#### 2a. Filosofía compositiva

Las universales NO son fondos planos con un icono pegado en una esquina. Son **composiciones editoriales contundentes** con presencia visual fuerte, que simplemente dejan espacio generoso para texto. Piensa en portadas de revista, contraportadas publicitarias de lujo, headers de marca premium.

**Regla de tercios vertical**: Los elementos visuales se concentran en el **tercio inferior** del frame. Los **dos tercios superiores quedan libres** para texto. Esto no significa que el tercio inferior sea un borde decorativo — debe ser visualmente rico, elaborado, con profundidad y detalle editorial.

#### 2b. Tipos de composición (variar entre estos)

1. **Paisaje de marca** — El tercio inferior es una escena elaborada que representa el mundo de la marca: una superficie con objetos del rubro dispuestos como naturaleza muerta editorial (bodegón publicitario), con iluminación cinematográfica, profundidad de campo y calidad de catálogo premium. Los 2/3 superiores son fondo limpio de marca con gradiente sutil.

2. **Horizonte de elementos** — Una línea compositiva horizontal en el tercio inferior donde se alinean varios elementos del rubro (no uno solo) formando un skyline o franja visual. Pueden ser objetos reales, siluetas, formas 3D o una mezcla. El conjunto crea ritmo visual y riqueza sin ocupar más de 30-35% del frame.

3. **Superficie + atmósfera** — El tercio inferior es una superficie rica (mesa de trabajo, mostrador, piso con textura apropiada a la marca) con 1-3 objetos del rubro apoyados, y el fondo se desvanece hacia arriba en los colores de marca con bokeh, partículas sutiles o humo/neblina de color. Sensación cinematográfica.

4. **Objeto heroico en base** — Un solo objeto grande y espectacular del rubro (no un icono genérico — algo específico y reconocible) apoyado en la base del frame, fotografiado con iluminación dramática tipo producto premium. El objeto tiene presencia y contundencia pero no sube más allá del tercio inferior. Calidad de fotografía de producto de catálogo de lujo.

5. **Composición diagonal ascendente** — Elementos del rubro organizados en una diagonal que sube desde la esquina inferior izquierda hasta el centro del frame, creando dinamismo y movimiento. La mitad superior derecha queda completamente libre. Efecto de energía y progreso.

6. **Manos/fragmento humano + objeto** — Manos (solo manos, nunca cara) interactuando con un objeto del rubro en el tercio inferior: sosteniendo, presentando, trabajando. Agrega humanidad y escala sin que una persona sea protagonista. Calidad fotográfica de campaña publicitaria.

7. **Textura macro inmersiva** — El tercio inferior muestra una vista macro/close-up espectacular de un material o textura asociada al rubro (acero cepillado, fibra de carbono, cerámica, instrumental médico, tela técnica) que se desvanece gradualmente hacia los colores de marca en la mitad superior. Sensación táctil y premium.

#### 2c. Reglas de composición universal

- **Elementos visuales en el tercio inferior** — La zona rica y elaborada no debe superar el 30-35% inferior del frame. Los 2/3 superiores son espacio libre con fondo de marca.
- **El tercio inferior debe ser contundente** — No un borde decorativo tímido. Calidad editorial, detalle fotográfico, profundidad. Debe verse como la parte visible de una imagen premium que se extiende más allá del frame.
- **Sin personas mirando a cámara** — Solo manos o fragmentos si aplica.
- **Sin objetos que sugieran un mensaje temporal** — Evitar relojes, calendarios, estaciones. La imagen debe ser atemporal.
- **La identidad de marca debe ser inmediata** — Colores, atmósfera y objetos del rubro hacen que la marca sea reconocible sin texto.
- **Diversidad en el set** — Cada universal de una marca debe usar un tipo de composición diferente. No repetir.

#### 2d. Fondos: profundidad sí, líneas duras no

El fondo infinito no necesita ser un vacío plano — se permite y se valora una **sensación de profundidad y perspectiva** (desenfoque suave, gradientes atmosféricos, sensación de espacio tridimensional). Lo que se debe evitar son:
- **Líneas duras de piso-pared** visibles (juntas, esquinas marcadas, bordes rectos)
- **Soportes, rollos de papel o estructura de estudio** fotográfico
- **Geometría arquitectónica prominente** (columnas, paneles, marcos)

Un fondo con profundidad suave y transiciones graduales es preferible a un fondo completamente plano. La clave es que no haya bordes ni líneas geométricas que compitan con el texto que se pondrá encima.

#### 2e. Estilo de iconografía 3D

Cuando la composición incluya íconos o elementos 3D:
- Estilo **suave, redondeado, amigable** — formas orgánicas con volumen generoso, como objetos de diseño industrial pulido
- **⚠️ NO globos inflados**: las formas deben ser elegantes y suaves, NUNCA literalmente hinchadas como globos de helio (ver regla en prompt-master)
- Acabado **glossy con reflejos suaves** y bordes redondeados
- Formas **orgánicas, nunca angulares** — esquinas siempre curvas
- Detalles metálicos selectivos (bisagras, bordes) para mayor realismo
- Deben verse **amigables y cercanos**, no técnicos ni fríos
- Consultar `notas_generales` de la marca para colores específicos de la iconografía
- **Opcionales**: incluir íconos 3D solo si aportan a la composición. No forzarlos.

### Paso 3: Construir el prompt

Construir un prompt que genere una imagen **editorial y profesional pero intencionalmente vacía de mensaje**:

1. **Describir la composición elegida** — Posición de elementos, proporciones, zonas libres
2. **Aplicar paleta de marca agresivamente** — Colores dominantes, degradados exactos, temperatura de color
3. **Verificar contenido prohibido**
4. **Aplicar todas las reglas de prompt-master** (`skills/nora-prompt-master/SKILL.md`): estructura de 6 bloques, frases probadas, fondos según paleta, negativos, checklist de validación

**Rotación de fondos**: Consultar `paleta_colores` de la marca para ver TODAS las variantes de fondo documentadas. No usar siempre el default — rotar entre las opciones. Verificar qué fondos se usaron en las últimas universales de la marca para no repetir.

**Importante**: Ver nora-prompt-master para reglas de negativos.

**Reglas ESPECÍFICAS de universales** (además de prompt-master):
- **Composición basada en tercios**: el prompt DEBE incluir "all visual elements confined to the lower third of the frame"
- **65-70% espacio libre**: "the upper two-thirds of the frame is clean open space with brand gradient for text overlay" (más espacio que creatividades normales)
- **Contundencia del tercio inferior**: describir con detalle y riqueza los elementos, materiales, iluminación, profundidad de campo
- **Calidad**: "high-end editorial advertising photography, cinematic lighting, premium catalogue quality"
- **Sin elementos narrativos ni temporales** — la imagen es un contenedor visual, no cuenta una historia

### Paso 4: Insertar en Supabase

Insertar en tabla `creatividades` con **solo estos campos**:

- `marca`: nombre exacto de la marca
- `estado`: `"paso 4"`
- `origen`: `"universal"`
- `prompt`: prompt final en inglés
- `gatillador`: descripción en español de la composición y su propósito genérico
- `logo`: URLs de logos de la marca (copiar de `marcas.logos`)

**Todo lo demás queda null/vacío**: `url`, `concepto`, `slogan_headline`, `subtitulo`, `cta`, `copy`, `descripcion_corta`, `buyer_persona`, `dolor_anhelo`, `cambio_emocional`, `diferenciador`, `beneficios`, `objeciones_tipicas`, `link_ren_1`, `link_ren_2`, `condicion`, `observacion`. Estos campos se llenarán después según el uso específico que se le dé a la imagen.

### Paso 5: Validar

- Confirmar inserción correcta
- Verificar que no se violó contenido prohibido
- El pipeline procesará la imagen automáticamente

## Generación en lote

Para producir un set de universales por marca (recomendado: 3-5 variantes):
1. Cargar paleta y look & feel (Paso 1)
2. Diseñar N composiciones **distintas entre sí**: variar tipo (fondo puro, elemento icónico, textura abstracta, objeto 3D), variar zona donde va el elemento visual, variar orientación del degradado
3. Construir N prompts
4. Insertar todos
5. Reportar resumen: tipo de composición de cada una

## Diferencia con otras skills

| Aspecto | referencia / original | universal |
|---------|----------------------|-----------|
| Propósito | Pieza con concepto y mensaje específico | Lienzo genérico reutilizable |
| Espacio libre | 50-60% | **65-70%** (2/3 superiores) |
| Elementos visuales | Protagonistas con metáfora | Contundentes pero confinados al tercio inferior |
| Copy/headline | Calibrados al concepto | Placeholder — se definen después |
| Campo `origen` | `"referencia"` / `"original"` | `"universal"` |
| Personas | Permitidas como protagonistas | Solo parciales/ambientales, nunca protagonistas |
| Narrativa | Sí — cada pieza cuenta algo | No — la imagen es un contenedor visual |
