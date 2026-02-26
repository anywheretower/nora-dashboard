---
name: nora-ejecucion-pipeline
description: Protocolo obligatorio para ejecutar el pipeline de generación de creatividades. Define 2 etapas (Supabase + ComfyUI), orden, verificación, reportes y control. DEBE leerse antes de cualquier ejecución de pipeline.
activación: Siempre que se vaya a ejecutar el pipeline de creatividades (manual o cron)
cron: no — se invoca como protocolo previo a cualquier ejecución
revisión: 2026-02-23
---

# nora-ejecucion-pipeline — Protocolo de Ejecución

> **Esta skill NO genera nada.** Es un protocolo obligatorio que define CÓMO ejecutar las demás skills. Si no se sigue, la ejecución es inválida.

> **⚠️ OBLIGATORIO: Ejecutar siempre en una SESIÓN NUEVA** vía `/new` en Telegram. Ventana de tokens limpia. `pipeline-state.json` asegura continuidad si la sesión se reinicia.

## Por qué existe esta skill

El 23 de febrero de 2026 se ejecutó el pipeline para 6 marcas sin control: sub-agentes en paralelo, sin verificación, sin reporte. Se borraron 143 creatividades y se empezó de cero. **Esta skill existe para que eso no vuelva a pasar.**

---

## Arquitectura: 2 Etapas

El pipeline se divide en **2 etapas independientes**. No se mezclan. La ejecución es **100% autónoma** — Jorge solo recibe notificaciones de progreso y alertas de error.

### ETAPA 1 — Preparación (Supabase)
Escritura de texto: fichas, campos de marca, prompts. Rápido (~5 min/marca), sin GPU.

```
Marca 1: ficha → mejora → ref(3) → orig(3) → univ(3) → cal(N) → obs → ✅
Marca 2: ficha → mejora → ref(3) → orig(3) → univ(3) → cal(N) → obs → ✅
...
Marca N: ficha → mejora → ref(3) → orig(3) → univ(3) → cal(N) → obs → ✅
→ TODAS las marcas quedan con creatividades en paso 4 (prompt listo, sin imagen)
```

### ETAPA 2 — Generación (ComfyUI)
GPU genera imágenes desde los prompts. Lento (~25 min/marca), propenso a cuelgues.

```
Marca 1: comfy-text2img --id para cada ID en paso 4 → paso 5 ✅
Marca 2: comfy-text2img --id para cada ID en paso 4 → paso 5 ✅
...
Marca N: comfy-text2img --id para cada ID en paso 4 → paso 5 ✅
→ TODAS las marcas quedan en paso 5 para_revision
```

**La transición de Etapa 1 a Etapa 2 es automática.** No esperar OK de Jorge.

### Por qué 2 etapas

1. **Etapa 1 es rápida** — se pueden preparar todas las marcas seguidas sin cuello de botella
2. **Un cuelgue de ComfyUI no bloquea** la creación de prompts
3. **Menos exposición a fallos** — si ComfyUI se cae, todo lo de Etapa 1 ya está listo
4. **Jorge no necesita intervenir** — solo ve las creatividades terminadas en la plataforma

---

## Marcas activas (dinámico)

Las marcas a procesar se obtienen de Supabase al inicio del pipeline:

```sql
SELECT marca FROM marcas WHERE activa = true ORDER BY marca
```

**No hardcodear marcas.** Siempre consultar la tabla. Si Jorge especificó marcas concretas, usar solo esas.

---

## Reglas de Etapa 1 (Supabase)

### Regla #1: Una marca a la vez, en orden

- Se completan los 7 pasos de UNA marca antes de pasar a la siguiente.
- **NUNCA** se lanzan sub-agentes para múltiples marcas en paralelo.
- Al terminar una marca, notificar a Jorge y pasar automáticamente a la siguiente.

### Regla #2: 7 pasos en orden estricto

| Paso | Skill | Acción |
|------|-------|--------|
| 1 | ficha-marca | Auditar ficha. Solo PATCH si score < 4.0 |
| 2 | mejora-marca | Auditar campos visuales. Solo PATCH si hay mejoras concretas |
| 3 | referencia × 3 | Crear 3 creatividades con referencias del banco |
| 4 | original × 3 | Crear 3 creatividades sin referencia |
| 5 | universal × 3 | Crear 3 creatividades genéricas (65-70% espacio libre) |
| 6 | calendario × N | Crear creatividades para próximas fechas relevantes (depende de efemérides) |
| 7 | observaciones | Resolver creatividades con condicion=observado |

**Si un paso no produce resultados (0 efemérides, 0 observaciones), se salta silenciosamente.** No es error.

### Regla #3: Ejecución autónoma

El protocolo es **100% autónomo**. NORA ejecuta todos los pasos de todas las marcas sin pedir OK.

**Jorge solo recibe estos mensajes:**

| Evento | Mensaje |
|--------|---------|
| Etapa 1 de marca completada | `✅ Etapa 1 [MARCA] lista — N creatividades en paso 4` |
| Etapa 2 de marca completada | `✅ Imágenes [MARCA] listas — N en paso 5, ya en NORA` |
| Pipeline completo | `🏁 Pipeline completo — N marcas, N creatividades totales` |
| Error irrecuperable | `❌ Error en [Etapa] [Marca] — [descripción]. Necesito ayuda.` |

**Nada más.** No pedir OK, no mostrar colas, no reportar progreso intermedio.

### Regla #4: Verificar internamente antes de avanzar

Después de cada paso (silencioso, no se reporta a Jorge):

1. **Confirmar en Supabase** que los cambios se escribieron correctamente
2. **Contar registros**: ¿se crearon la cantidad exacta esperada?
3. **Verificar campos**: ¿estado, marca, origen, prompt son correctos?

Si algo falla → reportar error a Jorge, NO intentar arreglar solo.

### Regla #5: Un solo sub-agente activo

- **Máximo 1 sub-agente corriendo a la vez.** Sin excepciones.
- Timeout: **15 minutos** (solo escriben texto, no generan imágenes).
- Si no termina en 15 min → algo anda mal → reportar error.

---

## Reglas de Etapa 2 (ComfyUI)

### Regla #6: Auto-start de ComfyUI

Antes de iniciar Etapa 2, verificar si ComfyUI está corriendo:

```powershell
# Detectar si ComfyUI está corriendo
Get-Process python -ErrorAction SilentlyContinue

# Si NO está corriendo, lanzarlo:
Start-Process "C:\Users\conta\Downloads\ComfyUI_windows_portable_nvidia_cu128\ComfyUI_windows_portable\run_nvidia_gpu.bat"
# Esperar ~5 minutos para que cargue completamente
# Verificar que responde en http://localhost:8188
```

**Después de lanzar ComfyUI, esperar 5 minutos completos antes de enviar el primer prompt.** La carga inicial del servidor es lenta.

### Regla #7: Una marca a la vez en ComfyUI

- Se generan las imágenes de UNA marca antes de pasar a la siguiente.
- Usar `comfy-text2img.mjs --id=X` en loop de PowerShell.
- **NUNCA mezclar** generación de múltiples marcas.

### Regla #8: Verificar count ANTES de lanzar

Antes de ejecutar ComfyUI para una marca:

1. **Contar creatividades** de esa marca en paso 4
2. **Confirmar que el count coincide** con lo esperado
3. **Si hay discrepancia** → parar y resolver

### Regla #9: Primera carga de modelo es lenta — NO es error

La primera imagen de cada sesión de ComfyUI tarda **significativamente más** (~5-8 min) porque carga el modelo a GPU. Esto es **comportamiento normal**, no un cuelgue.

**Cómo diferenciar:**
- **Carga de modelo**: ComfyUI muestra progreso en el log ("Loading model...", barras de progreso). Puede tardar hasta 8 min. **No reiniciar.**
- **Cuelgue real**: Sin output nuevo en el log por 5+ minutos DESPUÉS de que el modelo ya cargó (ya generó al menos 1 imagen). **Ahí sí es problema.**

### Regla #10: Timeout ComfyUI — 5 minutos (post primera carga)

Si ComfyUI no produce output nuevo en **5 minutos** (después de haber generado al menos 1 imagen):

1. **Intentar reiniciar ComfyUI automáticamente:**
   ```powershell
   # Matar proceso python de ComfyUI
   Get-Process python | Where-Object { $_.MainWindowTitle -match "ComfyUI" -or $_.CommandLine -match "main.py" } | Stop-Process -Force
   # Esperar 10 segundos
   Start-Sleep 10
   # Relanzar
   Start-Process "C:\Users\conta\Downloads\ComfyUI_windows_portable_nvidia_cu128\ComfyUI_windows_portable\run_nvidia_gpu.bat"
   # Esperar 5 minutos para carga
   ```
2. **Relanzar desde el último ID que falló**
3. **Si después del reinicio sigue colgado** → reportar a Jorge (única excepción a la regla de no molestar)
4. Si todo falla → considerar reiniciar PC y reportar

**Prevención:** entre cada imagen, esperar 10 segundos.

### Regla #11: Monitoreo silencioso

- Se lanza desde sesión principal con `exec`, NO desde sub-agente
- Monitorear con `process log` periódicamente
- **NO enviar progreso intermedio a Jorge** — solo el mensaje final por marca
- Internamente: actualizar `pipeline-state.json` con progreso

---

## Reglas Transversales (ambas etapas)

### Regla #12: Palabra de parada — "CHOPICO"

Si Jorge envía **"chopico"** durante la ejecución (en cualquier combinación de mayúsculas/minúsculas):

1. **Detener inmediatamente** — no terminar el paso actual, parar ya
2. **Guardar punto exacto** en `pipeline-state.json` (etapa, marca, paso, último ID)
3. **Confirmar a Jorge:**
   ```
   ⏸️ Pipeline pausado en Etapa [X], [MARCA], paso [Y]
   Estado guardado. Para retomar: "retoma pipeline"
   ```
4. **No continuar** hasta que Jorge diga explícitamente "retoma pipeline", "sigue pipeline" o "continúa pipeline"

### Regla #13: No asumir alcance

- Si Jorge no especificó marcas → ejecutar **todas las marcas activas** (consulta Supabase)
- Si especificó una o varias → solo esas
- Si hay ambigüedad → **preguntar antes de iniciar** (única pregunta permitida)

### Regla #14: Archivo de estado `pipeline-state.json`

Actualizar después de cada paso y cada marca completada:

```json
{
  "fecha": "2026-02-23",
  "etapa": 1,
  "marcas_activas": ["Clínica San Javier", "Cemtra", "BAC", "Meser", "RTK", "RedAgrupa", "Equos"],
  "marcas_completadas": [
    { "marca": "Clínica San Javier", "etapa1_ids": [1135, 1144], "etapa2_ok": true, "hora_fin": "09:45" }
  ],
  "marca_actual": "Cemtra",
  "paso_actual": 4,
  "ultimo_id_antes": 1144,
  "pausado": false
}
```

**Al inicio de cualquier sesión:** si `pipeline-state.json` existe y `pausado == false` y hay marcas sin completar → **retomar automáticamente** desde el punto exacto. No preguntar, no esperar — continuar el trabajo.

### Regla #15: Registro de ejecución

Mantener registro en `memory/pipeline-ejecucion.md`:

```markdown
## [Fecha] — Pipeline

### ETAPA 1 (Supabase)
- CSJ: ficha ✅ mejora ✅ ref(3) #X-#Y ✅ orig(3) #X-#Y ✅ univ(3) #X-#Y ✅ cal(N) #X ✅ obs(N) ✅
- Cemtra: ...

### ETAPA 2 (ComfyUI)
- CSJ: 10/10 generadas [09:00-09:25] ✅
- Cemtra: 10/10 generadas [09:25-09:50] ✅
```

### Regla #16: Checklist pre-ejecución

Antes de ejecutar CUALQUIER pipeline:

- [ ] ¿Estoy en una **sesión nueva** (`/new` en Telegram)?
- [ ] ¿Leí `pipeline-state.json`? (por si es retomada de ejecución interrumpida)
- [ ] ¿Consulté marcas activas en Supabase? (`WHERE activa = true`)
- [ ] ¿No hay sub-agentes activos de otra tarea?
- [ ] ¿Sé el último ID de creatividad antes de empezar? (para rollback)

### Regla #17: Sesión nueva obligatoria

El pipeline **SIEMPRE se ejecuta en una sesión nueva** vía `/new` en Telegram:

- Jorge hace `/new`, da la instrucción "ejecuta pipeline" y se va a dormir
- Garantiza ventana de tokens completa (~200K disponibles)
- Evita contaminación de contexto de otras conversaciones
- Jorge NO necesita estar presente — solo ve los mensajes de avance al despertar
- Si la sesión se reinicia/compacta, `pipeline-state.json` permite retomar exactamente donde quedó

### Regla #18: Retomada automática

Si al iniciar una sesión NORA encuentra `pipeline-state.json` con un pipeline incompleto (`pausado == false`):

1. Leer el archivo para saber etapa, marca y paso actual
2. Verificar estado real en Supabase (no confiar solo en el JSON)
3. **Retomar automáticamente** desde el punto exacto
4. Notificar a Jorge: `🔄 Retomando pipeline desde Etapa [X], [MARCA], paso [Y]`
5. Continuar como si nada hubiera pasado

Si `pausado == true`: no retomar, esperar instrucción de Jorge.

---

## Qué NO hacer (lecciones aprendidas)

1. ❌ Lanzar sub-agentes para múltiples marcas en paralelo
2. ❌ Mezclar Etapa 1 y Etapa 2 (crear prompts y generar imágenes al mismo tiempo)
3. ❌ Reportar "todo listo" sin verificar en Supabase
4. ❌ Asumir que ComfyUI sigue corriendo cuando el sub-agente murió
5. ❌ Molestar a Jorge con progreso intermedio o pedir OK
6. ❌ Confundir la primera carga de modelo (~8 min) con un cuelgue
7. ❌ Ejecutar en la sesión principal (usar siempre sesión nueva)
8. ❌ Hardcodear lista de marcas (siempre consultar `WHERE activa = true`)

---

*Protocolo vivo. Se actualiza cada vez que se detecte un problema nuevo. Última actualización: 2026-02-23 — 18 reglas, ejecución 100% autónoma, 2 etapas, ComfyUI auto-start, palabra de parada, retomada automática, marcas dinámicas.*
