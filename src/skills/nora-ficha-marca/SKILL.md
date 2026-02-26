---
name: nora-ficha-marca
description: Auditar y mejorar fichas de marca y arquetipos en NORA para marcas existentes. Evalúa fichas contra estructura ideal, reescribe con insumos disponibles (incluyendo investigación web), y aterriza arquetipos al rubro específico. NO toca campos visuales — eso es nora-mejora-marca. Guarda versiones históricas para comparar evolución.
id: nora-ficha-marca
---

# Ficha de Marca — Skill de estandarización y mejora

> **Última revisión:** 2026-02-22 22:54 CLT

> ⚠️ **ALCANCE**: Esta skill SOLO trabaja con `ficha` y `arquetipo`. NO modifica paleta_colores, look_and_feel, notas_generales ni contenido_prohibido — eso es responsabilidad de **nora-mejora-marca**. Para marcas nuevas (sin ficha ni campos visuales), usar **nora-marca-nueva**.

## Filosofía

Esta skill trabaja con dos campos que tienen naturalezas distintas:

- **`ficha`** — La **objetividad** de la marca. Información constatable, verificable, que el cliente podría entregar directamente: qué hace, cómo lo hace, qué vende, a quién, dónde opera, contacto, ofertas. Es el brief. Cambia con el tiempo (nuevos productos, nuevas ofertas, nuevos canales) y por eso **requiere versionamiento**.

- **`arquetipo`** — La **subjetividad** de la marca. La personalidad, el tono, la forma de hablar. Se pule con el desarrollo creativo, igual que look_and_feel o notas_generales. No requiere versionamiento — evoluciona naturalmente.

## Cuándo se activa

- **Automático**: todos los domingos a las 19:00 hrs (revisión semanal de fichas de todas las marcas activas)
- **Por cambio**: cuando hay info nueva que afecta la ficha (nuevo producto, nuevo servicio, cambio de contacto)
- **Por pedido de Jorge**: cuando Jorge solicita explícitamente una auditoría o mejora de ficha

### Modos de ejecución

- **Modo Auditoría**: evaluar ficha y/o arquetipo existentes, dar score y recomendaciones
- **Modo Mejora**: reescribir ficha y/o arquetipo con información actualizada

> Para crear ficha desde cero en marcas nuevas → usar **nora-marca-nueva**

## Herramientas

Esta skill usa activamente herramientas de investigación web:

- **`web_search`** (Brave API): buscar info actualizada de la marca, nuevos productos, noticias, competidores
- **`web_fetch`**: leer sitio web de la marca para extraer info actual (servicios, precios, equipo, ubicaciones)
- **`image`**: analizar screenshots o material visual si necesario

**Los sitios web de marcas son fuente potente de info actualizada.** Muchas marcas tienen webs con info más fresca que la ficha actual. SIEMPRE consultar el sitio web de la marca antes de reescribir la ficha.

Ver `shared/HERRAMIENTAS.md` para referencia completa de tools.

## Campos destino

- `ficha` — campo de texto en tabla `marcas`
- `arquetipo` — campo de texto en tabla `marcas`

## Idioma

Todo en **español** con ortografía impecable.

Ver `skills/shared/SUPABASE.md` para encoding y conexión. Ver `skills/shared/IDIOMA.md` para reglas de idioma. Ver `shared/SCHEMA.md` y `shared/PIPELINE.md` para esquema de tablas y flujo completo.

---

## Estructura estándar de FICHA (información objetiva)

La ficha es el **brief objetivo** de la marca. Todo lo que contiene debe ser constatable, verificable, o provenir directamente del cliente. Si alguna información no está disponible, marcar como `[pendiente — requiere insumo del cliente]`.

### 1. Identidad
- Nombre de marca
- Sitio(s) web
- Slogan oficial
- Descripción corta (1-2 líneas, para bios y presentaciones rápidas)

### 2. Elevator Pitch
Párrafo de 3-5 líneas que responde: ¿qué es, para quién, qué problema resuelve, por qué es diferente? Debe poder leerse en 20 segundos y generar interés.

### 3. Propuesta de Valor
- **Segmento**: a quién le habla (con detalle)
- **Propuesta de valor**: qué ofrece que nadie más ofrece igual
- **Diferenciadores**: 3-5 factores únicos vs competencia (concretos, no genéricos)

### 4. Productos y Servicios
Lo concreto que la marca vende, organizado por categoría. Cada uno con:
- Nombre del producto/servicio
- Descripción funcional (qué es)
- Beneficio clave (para qué le sirve al cliente)
- A quién va dirigido (si aplica segmentar)

**Este es el campo que más cambia en el tiempo** — nuevas ofertas, promociones, productos de temporada. El cliente puede actualizar esta sección periódicamente.

### 5. Problema del Cliente
3 dolores principales del público objetivo. Cada uno con:
- Descripción del dolor
- "Cómo suena" — verbatim realista de cómo el cliente expresa este dolor

### 6. Solución y Transformación
- **Antes** (sin la marca): estado del cliente
- **Después** (con la marca): estado transformado
- Formato que muestre el contraste de forma clara

### 7. Beneficios Clave
4-6 beneficios organizados en:
- **Tangibles**: resultados medibles, ahorro, acceso, velocidad
- **Intangibles**: tranquilidad, confianza, pertenencia, estatus

### 8. Públicos Objetivo
Segmentos definidos con:
- Perfil (quién es)
- Necesidad específica (qué busca)
- Cómo la marca responde a esa necesidad

### 9. CTAs (Llamadas a la Acción)
6-10 CTAs variados para diferentes contextos:
- CTAs de conversión directa (agendar, comprar, cotizar)
- CTAs de descubrimiento (conocer, explorar, ver)
- CTAs de contacto (llamar, escribir, visitar)

### 10. Infraestructura y Canales
- Ubicaciones físicas (dirección, horarios)
- Canales digitales (web, redes, WhatsApp, email)
- Canales de venta (online, presencial, mixto)

### 11. Valores y Cultura
3-5 valores con una línea de contexto que explique cómo se vive ese valor en la operación diaria.

### 12. Misión y Visión
- Misión: qué hace hoy y para quién
- Visión: dónde quiere estar en 5-10 años
(Si el cliente no tiene, se puede proponer en base a la ficha)

### 13. Metadata Operativa
Datos duros: sucursales, teléfonos, emails, horarios, convenios, registros legales, representaciones de marca.

---

## Estructura estándar de ARQUETIPO (personalidad subjetiva)

El arquetipo es la **personalidad** de la marca — cómo habla, cómo se siente, qué tono tiene. Es subjetivo y se pule con el tiempo a medida que se generan creatividades y se recibe feedback. No requiere versionamiento porque evoluciona naturalmente (igual que look_and_feel o notas_generales).

El arquetipo NO es un texto genérico de manual. Es una herramienta estratégica aterrizada al rubro específico. Estructura:

### A. Arquetipo y Justificación
- Nombre del arquetipo
- Por qué este arquetipo para esta marca (3-5 razones vinculadas al rubro, audiencia y personalidad)
- Qué otros arquetipos se descartaron y por qué

### B. Manifestación en Tono de Voz
Tabla con 5-8 situaciones reales de comunicación:

| Situación | Así SÍ (on-brand) | Así NO (off-brand) |
|---|---|---|
| Post de producto | ejemplo concreto | ejemplo concreto |
| Respuesta a reclamo | ejemplo concreto | ejemplo concreto |
| Copy publicitario | ejemplo concreto | ejemplo concreto |

### C. Personalidad de Marca
5 rasgos de personalidad derivados del arquetipo, cada uno con:
- El rasgo
- Cómo se expresa en la comunicación
- Un "pero" (el límite — para no caer en el extremo)

Ejemplo:
> **Cercano** — hablamos como alguien que entiende el día a día del cliente. **Pero** nunca caemos en lo coloquial o vulgar.

### D. Territorios de Contenido
5-7 territorios temáticos que la marca puede explorar coherentemente con su arquetipo:
- Nombre del territorio
- Tipo de contenido que genera
- Ejemplo de pieza

### E. Lo que la Marca NUNCA Dice
5-8 frases, tonos o enfoques que violan el arquetipo. Prohibiciones de tono explícitas.

---

## Proceso — Modo Auditoría

### Paso 1: Leer ficha y arquetipo actuales
```
marcas?marca=eq.<marca>&select=ficha,arquetipo
```

### Paso 2: Evaluar cada sección
Puntuar cada una de las 15 secciones de la ficha (1-5):

| Score | Significado |
|---|---|
| 5 | Completa, específica, bien redactada, lista para usar |
| 4 | Buena, algún detalle menor que mejorar |
| 3 | Presente pero genérica o incompleta |
| 2 | Muy superficial o con errores significativos |
| 1 | Ausente o completamente genérica |

### Paso 3: Evaluar arquetipo
- ¿Está aterrizado al rubro o es genérico de manual?
- ¿Tiene ejemplos de tono?
- ¿Tiene territorios de contenido?

### Paso 4: Entregar reporte
Score total, top 3 fortalezas, top 3 debilidades, recomendaciones priorizadas.

## Proceso — Modo Mejora

### Paso 1: Leer ficha actual + campos de marca
```
marcas?marca=eq.<marca>&select=ficha,arquetipo,paleta_colores,look_and_feel,notas_generales,contenido_prohibido
```

### Paso 2: Investigar fuentes actualizadas (OBLIGATORIO)

**SIEMPRE antes de reescribir**:

1. **Sitio web de la marca** (`web_fetch`): leer páginas principales (home, servicios, nosotros, contacto). Extraer info nueva: productos, precios, equipo, ubicaciones, slogan actual.
2. **`web_search`**: buscar "{marca}" para encontrar noticias recientes, cambios, nuevos productos
3. **Redes sociales** (`web_fetch` en perfiles públicos): tono actual, tipo de contenido, ofertas recientes

**Fuentes adicionales** (si aplica):
- Conversación directa con Jorge sobre cambios en la marca
- Creatividades aprobadas (para extraer tono y estilo que funciona)
- Documentos o PDFs proporcionados

**Comparar lo encontrado vs la ficha actual**: ¿hay info nueva? ¿productos descontinuados? ¿cambios de dirección? Todo esto alimenta la nueva versión.

### Paso 3: Guardar versión anterior (OBLIGATORIO — sistema de historial)

Antes de reescribir, **guardar la ficha y arquetipo actuales** como versión histórica.

**Archivo**: `memory/fichas-versiones/{marca}-v{N}-{fecha}.md`

Donde `{N}` es el número de versión incremental (v1, v2, v3...).

**Estructura del archivo de versión**:

```markdown
# {Marca} — Versión {N}
- **Fecha**: {fecha}
- **Motivo**: {por qué se activó la skill: auditoría periódica / info nueva del sitio web / pedido de Jorge / etc.}
- **Secciones modificadas**: {lista de secciones que cambiaron}
- **Fuentes consultadas**: {sitio web, redes, conversación, etc.}

## Ficha (al momento de esta versión)
{ficha completa tal como estaba en Supabase}

## Arquetipo (al momento de esta versión)
{arquetipo completo tal como estaba en Supabase}

## Changelog vs versión anterior
- {Sección X}: {qué cambió y por qué}
- {Sección Y}: {qué se agregó}
```

**Reglas del historial**:
- NUNCA borrar versiones anteriores — son el registro de evolución
- SIEMPRE guardar antes de escribir en Supabase
- Incluir changelog para que sea fácil comparar sin leer todo
- Si es la primera vez que se ejecuta la skill en una marca, la versión actual pasa a ser v1

### Paso 4: Reescribir ficha según estructura estándar
- Mantener toda la información valiosa de la ficha actual
- Reorganizar en las 13 secciones
- Completar secciones faltantes con la información disponible
- Marcar `[pendiente]` lo que requiera input del cliente

### Paso 5: Reescribir arquetipo aterrizado
- Identificar el arquetipo correcto (puede ser el mismo u otro)
- Escribir según la estructura de 5 bloques (A-E)
- Incluir ejemplos reales del rubro

### Paso 6: Presentar al usuario para validación
Mostrar la ficha completa y el arquetipo antes de escribir en Supabase.

### Paso 7: Actualizar en Supabase
```javascript
{
  "ficha": "<ficha reescrita>",
  "arquetipo": "<arquetipo aterrizado>"
}
```

**Encoding**: Usar Node.js para escrituras (preservar UTF-8).

---

## Referencia: Los 12 Arquetipos

| Arquetipo | Motivación core |
|---|---|
| El Inocente | Simplicidad, optimismo |
| El Explorador | Libertad, descubrimiento |
| El Sabio | Conocimiento, verdad |
| El Héroe | Superación, valentía |
| El Rebelde | Romper reglas, liberación |
| El Mago | Transformación, visión |
| El Ciudadano | Pertenencia, igualdad |
| El Amante | Conexión, sensualidad |
| El Bufón | Diversión, espontaneidad |
| El Cuidador | Protección, servicio |
| El Creador | Innovación, autoexpresión |
| El Gobernante | Control, estabilidad |

**Nota**: Cualquier arquetipo puede aplicar a cualquier rubro — lo importante es cómo se aterriza al contexto específico de la marca. Una marca puede tener un arquetipo primario + uno secundario que matiza el tono.

---

## Notas

- La ficha alimenta TODAS las demás skills — un cambio aquí impacta creatividades, copys, prompts
- Siempre presentar al usuario antes de escribir en Supabase
- El arquetipo aterrizado es más valioso que uno genérico — menos texto, más utilidad
- Priorizar información que sirva para generar contenido (dolores, transformación, tono) sobre información decorativa
- Ortografía impecable siempre — esto es material de marca profesional
- **Conexión con mejora-marca**: si la ficha cambia significativamente (nuevo posicionamiento, nuevos productos, nuevo segmento), considerar ejecutar nora-mejora-marca para que los campos visuales se alineen. Esta skill NO toca esos campos directamente
- **Versionamiento**: solo la ficha tiene versiones. El arquetipo, como look_and_feel y notas_generales, evoluciona sin respaldo porque se pule con la práctica creativa
