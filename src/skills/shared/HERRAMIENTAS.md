# HERRAMIENTAS.md — Tools disponibles para skills NORA

> Referencia rápida de herramientas que las skills pueden usar.

## Investigación web

| Herramienta | Uso | Ejemplo |
|---|---|---|
| `web_search` | Buscar en internet (Brave API) | Buscar marca, competidores, rubro, tendencias |
| `web_fetch` | Leer contenido de una URL | Extraer info de sitio web, redes sociales, artículos |
| `image` | Analizar una imagen con visión AI | Analizar logos, screenshots, creatividades existentes |

## Supabase

| Herramienta | Uso |
|---|---|
| `exec` (Node.js fetch) | Leer y escribir en Supabase REST API |

Ver `shared/SCHEMA.md` para tablas y campos.
Ver `shared/SUPABASE.md` para conexión y encoding.

## Generación de contenido

| Herramienta | Uso |
|---|---|
| `exec` (comfy-text2img.mjs) | Generar imagen desde texto (Qwen 2.5) |
| `exec` (comfy-img2img.mjs) | Editar imagen existente (Qwen Image Edit) |
| `exec` (Remotion render) | Renderizar video motion graphics |
| `exec` (ffmpeg) | Mezclar audio, convertir formatos, extraer frames |
| `tts` / Cartesia API | Generar voz sintetizada |

## Comunicación

| Herramienta | Uso |
|---|---|
| `message` | Enviar mensajes/archivos a Jorge via Telegram |
| Telegram Bot API | Enviar videos/imágenes directamente (scripts ComfyUI) |

## Archivos

| Herramienta | Uso |
|---|---|
| `read` / `write` / `edit` | Leer, crear, editar archivos locales |
| `exec` | Comandos de sistema (ffmpeg, node, etc.) |
| `browser` | Abrir páginas en navegador local |

## Regla general

**Usar siempre las herramientas antes de preguntar a Jorge.** Si la información se puede obtener buscando en web o leyendo archivos, hacerlo primero. Llegar con propuestas, no con preguntas.
