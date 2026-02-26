---
name: nora-creatividad-pantalla
description: Generar imágenes 16:9 para pantallas/televisores en salas de espera. Recicla prompts de creatividades existentes adaptándolos a composición horizontal. Texto a imagen vía ComfyUI/Qwen 2.5.
id: nora-creatividad-pantalla
---

# Pantalla — Creatividades 16:9 para televisores

> **Última revisión:** 2026-02-23 02:55 CLT

## Cuándo se activa

- **Automático**: todos los días a las **05:00 hrs** — procesa todas las creatividades con `origen=Pantalla` en `paso 9`
- **Por pedido de Jorge**: cuando lo solicita explícitamente
- 🕐 **Cron**: sí — diario 05:00

## Qué es

Los clientes tienen televisores 16:9 en salas de espera. Esta skill recicla contenido de creatividades existentes generando una versión horizontal (16:9) a partir del mismo prompt, adaptado a composición apaisada.

**No es img2img ni outpainting** — es texto a imagen desde cero en formato 16:9.

## Exclusiones

- **NO sujetas a iteración** — la skill `nora-imagen-iteracion` excluye origen `Pantalla`
- **SÍ pueden recibir observaciones** — `nora-imagen-observacion` las procesa normalmente

## Idioma de trabajo

Ver `skills/shared/IDIOMA.md` para reglas de idioma español/inglés y `skills/shared/SUPABASE.md` para encoding y conexión.

## Proceso

### Paso 1: Detectar creatividades pendientes

Consultar tabla `creatividades`:
```
estado=eq.paso 9&origen=eq.Pantalla&link_ren_1=is.null
```

Campos a traer: `id, marca, prompt, gatillador, slogan_headline, subtitulo, cta, url`

### Paso 2: Cargar identidad de marca

Cargar campos de marca desde Supabase (ver shared/SCHEMA.md tabla `marcas`): paleta_colores, look_and_feel, notas_generales, contenido_prohibido.

### Paso 3: Adaptar prompt a 16:9

El prompt ya viene de la creatividad original. Adaptarlo a composición horizontal:

1. **Leer el prompt existente** de la creatividad
2. **Ajustar composición** para formato apaisado (16:9):
   - Redistribuir elementos horizontalmente
   - Aprovechar el ancho extra para más contexto ambiental
   - Mantener espacio para texto (zona limpia) adaptado al formato horizontal
   - Si el prompt original tiene composición vertical explícita (ej: "tall", "vertical"), reescribir a horizontal
3. **Agregar directiva de formato**: asegurar que el prompt especifique composición horizontal/landscape/wide
4. **Mantener la esencia**: misma paleta, misma atmósfera, mismo concepto — solo cambia la composición
5. **Validar contra prompt-master** (`skills/nora-prompt-master/SKILL.md`): estructura de 6 bloques, negativos, checklist

### Paso 4: Generar imagen con ComfyUI

```bash
cd C:\Users\conta\.openclaw\workspace
node comfy-text2img.mjs --once --id=<ID> --ratio=16:9
```

- `--ratio=16:9` fuerza el formato horizontal
- Al terminar, el script sube la imagen a Supabase Storage y actualiza `link_ren_1`
- La creatividad pasa a **paso 10**

### Paso 5: Confirmar

- Reportar resultado a Jorge
- Incluir: ID, marca, link de imagen generada

## Procesamiento en lote

Si hay múltiples creatividades Pantalla pendientes:
1. Agrupar por marca
2. Cargar identidad de marca una vez
3. Adaptar y generar cada una
4. Reportar resumen completo

**Batch máximo 5** — reportar y esperar confirmación antes de seguir (ver protocolo en SOUL.md).

## Conexión Supabase

Ver `skills/shared/SUPABASE.md` para URL, headers y encoding.
