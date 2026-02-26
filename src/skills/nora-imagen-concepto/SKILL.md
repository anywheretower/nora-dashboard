---
name: nora-imagen-concepto
description: Ideación conceptual para creatividades de IMAGEN en NORA. Genera ideas, metáforas visuales, desplazamientos creativos y direcciones compositivas ANTES de construir el prompt. Primer paso en cualquier generación de imagen (referencia, original, universal, requerida, calendario, producto). Resuelve el QUÉ y POR QUÉ creativo. Para video ver nora-video-concepto.
id: nora-imagen-concepto
---

# Concepto de Imagen — Skill de ideación para creatividades de imagen en NORA

> **Última revisión:** 2026-02-23 01:33 CLT

## Rol

Esta skill se ejecuta ANTES de prompt-master. Mientras prompt-master resuelve la estructura técnica del prompt (6 bloques, frases probadas, checklist), esta skill resuelve:

- **Qué** imagen crear (concepto, metáfora, dirección visual)
- **Por qué** esa imagen funciona (impacto, emoción, sorpresa)
- **Desde dónde** se origina la idea (desplazamiento, analogía, tensión)

## Cuándo se activa

Siempre como PRIMER PASO al crear cualquier creatividad de imagen:

- **Text2img**: referencia, original, universal, requerida, calendario
- **Img2img**: producto, colaborador, interior, exterior, fachada (concepto define el entorno, NO el sujeto)

Flujo: **Concepto → Skill generación → Prompt-master → Inserción**

> Para concepto de video, ver `nora-video-concepto`.

Ver `shared/SCHEMA.md` para tablas, `shared/PIPELINE.md` para flujo completo, `shared/HERRAMIENTAS.md` para tools disponibles.

---

## Los 7 motores creativos

Usar al menos uno por creatividad. Rotar entre ellos para máxima diversidad.

### 1. Desplazamiento de rubro
Tomar una composición visual poderosa de un rubro ajeno y forzar la adaptación al rubro de la marca.
- Buscar referencias con etiqueta `desplazamiento-alto` en tabla `referencia`
- La fuerza está en la FRICCIÓN: cuanto más lejano el rubro original, más sorprendente el resultado
- Consultar `ficha` de la marca para entender su rubro → buscar imágenes de rubros opuestos
- Preguntar: "¿Qué composición de un rubro totalmente distinto podría funcionar para esta marca?"

### 2. Metáfora visual
Representar un concepto abstracto de la marca mediante un objeto o escena concreta.
- **World-in-object**: objeto cotidiano del rubro que contiene una escena dentro
- **Objeto-como-símbolo**: un elemento que representa algo mayor que sí mismo
- **Transformación**: un estado que muta en otro (el "antes" y "después" de la marca)
- Consultar `ficha` → identificar la promesa central de la marca
- Preguntar: "¿Qué OBJETO podría CONTENER o SIMBOLIZAR lo que esta marca promete?"

### 3. Tensión narrativa
Crear contraste entre dos estados para generar impacto emocional.
- Consultar `look_and_feel` de la marca → buscar la tensión narrativa central documentada
- Toda marca tiene un "sin nosotros" vs "con nosotros" — encontrar ese contraste
- Puede ser visual (split-screen, antes/después) o implícita (persona contemplando lo que dejó atrás)
- Preguntar: "¿Cómo se ve el mundo del cliente SIN esta marca vs CON ella?"

### 4. Emoción primaria
Partir de una emoción universal y construir la imagen alrededor de ella.
- 8 emociones publicitarias: **esperanza, orgullo, nostalgia, sorpresa, seguridad, libertad, conexión, superación**
- Elegir una que la marca no haya explorado recientemente (consultar creatividades anteriores)
- Consultar `arquetipo` de la marca → algunas emociones encajan mejor con ciertos arquetipos
- Preguntar: "¿Qué MOMENTO HUMANO encarna esta emoción para el buyer persona de esta marca?"

### 5. Inversión de expectativa
Hacer lo opuesto a lo que el rubro haría normalmente.
- Investigar qué es "lo típico" del rubro (consultar `ficha` y creatividades previas)
- Si todos muestran el producto → mostrar la AUSENCIA del producto y su efecto
- Si el rubro es siempre formal → probar cercanía y calidez
- Si todos usan los mismos fondos → explorar lo opuesto
- La sorpresa genera stopping power
- Preguntar: "¿Qué esperaría ver alguien en una publicidad de este rubro? Hacer lo contrario."

### 6. Analogía cross-dominio
Conectar el mundo de la marca con un mundo completamente distinto.
- Consultar `ficha` → identificar las actividades, procesos o valores centrales
- Buscar un dominio ajeno que comparta la misma esencia (precisión, cuidado, aventura, control, etc.)
- La conexión debe ser intuitiva: el espectador debe "pillarlo" en 3 segundos
- Preguntar: "¿A qué otro mundo se PARECE lo que hace esta marca?"

### 7. Storytelling en un frame
Contar una historia completa en una sola imagen estática.
- La imagen debe tener: protagonista + acción/gesto + contexto emocional
- El espectador debe poder imaginar el "antes" y el "después" de ese momento
- Consultar `ficha` → identificar el momento de transformación del cliente
- Preguntar: "¿Qué MOMENTO de la historia del cliente capturaría toda la promesa de marca?"

---

## Proceso de ideación (para cada creatividad)

### Paso 1: Cargar contexto
- Cargar campos de marca desde Supabase (ver `shared/SCHEMA.md` tabla `marcas`): ficha, arquetipo, paleta_colores, look_and_feel, notas_generales, contenido_prohibido
- Revisar últimas 5-10 creatividades de la marca para evitar repetición
- Identificar motores creativos, escenarios y registros NO explorados aún
- **Para producto/img2img**: el concepto define solo el ENTORNO (fondo, atmósfera, historia del espacio). El sujeto (producto, persona, fachada) ya existe en la imagen original.

### Paso 2: Elegir motor creativo
- Seleccionar 1-2 motores de los 7 anteriores
- Si es **referencia**: el motor se aplica SOBRE la composición de la referencia
- Si es **original/universal/calendario**: el motor guía desde cero
- Si es **requerida**: el motor se adapta al pedido del cliente (respetar su intención)
- Si es **producto/img2img**: el motor define el ENTORNO, no el sujeto

### Paso 3: Generar concepto
Formular en una frase: **[Motor] + [Sujeto/objeto] + [Emoción] + [Giro inesperado]**

Ejemplo: "Desplazamiento + maleta + descubrimiento + el paisaje del Maule está DENTRO de la maleta, no afuera"

### Paso 4: Validar impacto
Antes de pasar a prompt-master, el concepto debe superar estos 5 filtros:

1. **Stopping power**: ¿Detendría el scroll en 0.5 segundos?
2. **Memorabilidad**: ¿Se recuerda 5 minutos después de verla?
3. **Novedad**: ¿Es distinta a las últimas 5 creatividades de esta marca?
4. **Coherencia de marca**: ¿Respeta arquetipo, tono y prohibiciones?
5. **Espacio para texto**: ¿La composición deja aire para copy overlay?

Si falla en 2+ filtros, iterar el concepto antes de avanzar.

### Paso 5: Documentar dirección creativa
Antes de ir a prompt-master, escribir:
- **Concepto** (1-2 líneas): qué se ve en la imagen
- **Motor usado**: cuál de los 7
- **Emoción objetivo**: qué debe sentir quien la vea
- **Giro creativo**: qué la hace sorprendente o no obvia

---

## Catálogo de desplazamientos probados

Las conexiones exitosas entre rubros se documentan en `notas_generales` de cada marca, no aquí. Consultar ese campo para ver qué desplazamientos ya funcionaron para la marca específica.

**Tipos de desplazamiento que funcionan bien en general:**

| Tipo | Descripción |
|---|---|
| Rubro lejano → cercano | Tomar composición de un rubro totalmente ajeno y adaptarla |
| Producto premium → servicio | Usar estética de producto de lujo para dignificar un servicio |
| Editorial de moda → profesional | Elevar un trabajador/profesional con lenguaje de moda |
| Tecnología/fintech → rubro tradicional | Usar hologramas, interfaces, data viz para rubros no-tech |
| Naturaleza/paisaje → concepto abstracto | Usar escenas naturales como metáfora de procesos humanos |

Actualizar `notas_generales` de la marca cada vez que un desplazamiento nuevo funcione.

---

## Anti-patrones (qué NO hacer)

- **Literal = aburrido**: foto de la fachada del negocio con logo. NUNCA.
- **Obvio = ignorable**: la imagen más predecible del rubro. Sin sorpresa, sin stopping power.
- **Genérico = olvidable**: persona sonriendo con producto, sin historia ni tensión.
- **Saturado = confuso**: demasiados elementos compitiendo. Menos es más.
- **Desconectado = irrelevante**: metáfora tan rebuscada que nadie entiende la relación con la marca.

**Regla de oro**: La imagen debe ser lo suficientemente sorprendente para detener el scroll, pero lo suficientemente clara para que se entienda la marca en 3 segundos.

---

## Notas de evolución

Actualizar con cada sesión de feedback. Los desplazamientos exitosos, las metáforas que funcionaron, y las que no, alimentan esta skill continuamente.

## Última revisión: 2026-02-23 01:33 CLT
- Separada del concepto unificado: ahora solo imagen (video → nora-video-concepto)
- Agregado soporte para los 5 orígenes img2img (producto, colaborador, interior, exterior, fachada)
