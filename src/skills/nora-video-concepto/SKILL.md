---
name: nora-video-concepto
description: Ideación conceptual para creatividades de VIDEO en NORA. Genera dirección narrativa, arco emocional, estructura de escenas y ritmo ANTES de construir el libreto. Primer paso en cualquier generación de video. Resuelve el QUÉ y POR QUÉ narrativo. Para imagen ver nora-imagen-concepto.
id: nora-video-concepto
---

# Concepto de Video — Skill de ideación para creatividades de video en NORA

> **Última revisión:** 2026-02-23 01:33 CLT

## Rol

Esta skill se ejecuta ANTES del libreto. Mientras el libreto resuelve la estructura técnica (escenas, duración, transiciones), esta skill resuelve:

- **Qué** historia contar (narrativa, arco, mensaje central)
- **Por qué** esa historia funciona (impacto emocional, conexión con marca)
- **Desde dónde** se origina la idea (motor creativo, tensión, analogía)

## Cuándo se llama

Siempre como PRIMER PASO al crear cualquier video:

- **Videos Remotion**: motion graphics, tipografía animada, secuencias con imágenes
- **Videos LTX**: text-to-video, image-to-video con lipsync, UGC-style

Flujo: **Concepto → Libreto → Producción (Remotion/LTX) → Publicar**

Ver `shared/SCHEMA.md` para tablas, `shared/PIPELINE.md` para flujo completo.

---

## Los 7 motores creativos

Los mismos 7 motores de imagen aplican a video, pero el output es **narrativo** en vez de compositivo.

### 1. Desplazamiento de rubro
Tomar un formato o estilo de video de otro rubro y adaptarlo.
- Ejemplo: estética de documental de cocina para una marca industrial
- La fricción genera interés: "¿Por qué una marca de herramientas tiene un video que parece de vinos?"
- Preguntar: "¿Qué formato de video de otro rubro sorprendería en este contexto?"

### 2. Metáfora visual (en movimiento)
Representar un concepto abstracto mediante una transformación visual en el tiempo.
- **Metamorfosis**: objeto que se transforma en otro a lo largo del video
- **Revelación progresiva**: la metáfora se arma pieza a pieza, se entiende al final
- **Bucle narrativo**: el video cierra donde empieza pero con un significado nuevo
- Preguntar: "¿Qué TRANSFORMACIÓN visual podría representar la promesa de esta marca?"

### 3. Tensión narrativa
Crear un arco de contraste emocional con resolución.
- Consultar `look_and_feel` de la marca → tensión narrativa central
- Estructura clásica: **problema → tensión → resolución (marca)**
- El video funciona mejor que la imagen para esto porque tiene TIEMPO
- Preguntar: "¿Cómo se ve el viaje del cliente desde el dolor hasta la solución?"

### 4. Emoción primaria
Partir de una emoción y construir el arco del video alrededor de ella.
- El video puede ESCALAR la emoción: arrancar sutil y terminar intenso
- 8 emociones: esperanza, orgullo, nostalgia, sorpresa, seguridad, libertad, conexión, superación
- La música y el ritmo refuerzan la emoción (coordinar con voz-cartesia y música)
- Preguntar: "¿Qué recorrido emocional quiero que haga el espectador en 20-30 segundos?"

### 5. Inversión de expectativa
Hacer lo opuesto a lo que un video del rubro haría normalmente.
- Si todos hacen videos corporativos → hacer algo íntimo/personal
- Si todos son rápidos → hacer algo slow/contemplativo
- Si todos muestran el producto → mostrar el efecto del producto en las personas
- Preguntar: "¿Qué formato de video esperaría alguien de este rubro? Hacer lo contrario."

### 6. Analogía cross-dominio
Conectar visualmente dos mundos que comparten esencia.
- En video se puede hacer un **montaje paralelo**: escenas alternas de ambos mundos
- La conexión se revela gradualmente — más poderoso que en imagen estática
- Preguntar: "¿Qué dos mundos puedo intercalar para que el espectador descubra la conexión?"

### 7. Storytelling (con principio, medio y fin)
El video tiene la ventaja del tiempo — puede contar una historia real.
- **Micro-historia**: un personaje, un momento, un cambio (15-30 segundos)
- **Testimonio implícito**: sin voz en off, solo imágenes que cuentan la experiencia
- **Día en la vida**: seguir al cliente/usuario a lo largo de un momento
- Preguntar: "¿Qué micro-historia de 20 segundos encapsularía toda la marca?"

---

## Proceso de ideación (para cada video)

### Paso 1: Cargar contexto
- Cargar campos de marca desde Supabase (ver `shared/SCHEMA.md` tabla `marcas`): ficha, arquetipo, paleta_colores, look_and_feel, notas_generales, contenido_prohibido
- Revisar videos anteriores de la marca para evitar repetición de formato/narrativa
- Identificar qué motores creativos y estilos NO se han explorado aún

### Paso 2: Definir formato de video
Antes del motor creativo, decidir el formato:

| Formato | Duración | Herramienta | Cuándo usar |
|---|---|---|---|
| **Motion graphics** | 15-30s | Remotion | Datos, servicios, procesos, conceptos abstractos |
| **Slideshow editorial** | 15-25s | Remotion | Cuando hay buenas imágenes aprobadas de la marca |
| **UGC / talking head** | 5-15s | LTX i2v + Cartesia | Testimonios, tips, contenido cercano/personal |
| **Escena cinematográfica** | 5s | LTX t2v/i2v | Paisajes, ambientes, momentos emocionales |
| **Híbrido** | 20-40s | Remotion + LTX | Combina motion graphics con clips generados |

### Paso 3: Elegir motor creativo
- Seleccionar 1-2 motores de los 7
- El motor define la NARRATIVA, no la composición de un frame individual
- Para UGC: el motor puede ser simplemente "storytelling" con un guión natural
- Para motion graphics: el motor guía la secuencia visual y las transiciones

### Paso 4: Generar concepto narrativo
Formular: **[Motor] + [Formato] + [Arco emocional] + [Giro/cierre]**

Ejemplo: "Tensión narrativa + slideshow editorial + de lo caótico a lo ordenado + cierre con logo emergiendo de la calma"

### Paso 5: Definir arco emocional
Todo video debe tener un recorrido emocional, aunque sea de 15 segundos:

| Segundos | Fase | Emoción |
|---|---|---|
| 0-5 | **Gancho** | Curiosidad, sorpresa, intriga |
| 5-15 | **Desarrollo** | Conexión, comprensión, tensión |
| 15-25 | **Resolución** | Satisfacción, confianza, aspiración |
| 25-30 | **Cierre** | Recuerdo (logo + CTA) |

### Paso 6: Validar impacto
Antes de pasar al libreto, el concepto debe superar:

1. **Hook en 2 segundos**: ¿Los primeros 2 segundos detienen el scroll?
2. **Arco claro**: ¿Tiene principio, desarrollo y cierre?
3. **Novedad**: ¿Es distinto a los últimos videos de esta marca?
4. **Coherencia de marca**: ¿Respeta arquetipo, tono y prohibiciones?
5. **Viabilidad técnica**: ¿Se puede producir con las herramientas disponibles (Remotion/LTX)?

### Paso 7: Documentar dirección creativa
Antes de ir al libreto, escribir:
- **Concepto narrativo** (2-3 líneas): qué historia cuenta el video
- **Motor usado**: cuál de los 7
- **Formato**: motion graphics / slideshow / UGC / escena / híbrido
- **Arco emocional**: de qué emoción a qué emoción
- **Giro creativo**: qué lo hace sorprendente
- **Duración estimada**: cuántos segundos
- **Herramienta principal**: Remotion / LTX / híbrido

---

## Anti-patrones (qué NO hacer)

- **Video-catálogo**: slideshow de productos sin narrativa ni emoción
- **Texto animado sin más**: letras que aparecen y desaparecen sin dirección visual
- **Copia de template genérico**: formato que podría ser de cualquier marca
- **Exceso de escenas**: más de 8-10 escenas en 30 segundos = confusión visual
- **Sin arco**: video plano donde todo pasa al mismo nivel emocional
- **Hook débil**: los primeros 2 segundos no dicen nada — ya perdiste al espectador

---

## Notas de evolución

Actualizar con cada video producido. Los formatos exitosos, las narrativas que conectaron, y las que no, alimentan esta skill continuamente.
