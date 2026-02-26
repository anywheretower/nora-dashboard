# Skill: nora-remotion-animacion
> Última revisión: 2026-02-24 11:00 CLT

Crear animaciones de video promocional en Remotion usando los patrones establecidos en EffectsBible. Esta skill toma un LIBRETO (generado por la skill nora-libreto-video) y lo traduce a código Remotion mapeando cada escena a templates existentes.

**Esta skill es 100% universal** — funciona para cualquier marca. La identidad visual se adapta leyendo los campos de marca en Supabase, incluyendo el apartado de instrucciones de video en `notas_generales`.

## Proyecto
- Path: `remotion-nora/`
- Composición horizontal: `src/EffectsBible.tsx` (1920×1080, 16:9)
- Composición vertical: `src/EffectsBibleVertical.tsx` (1080×1920, 9:16)
- 30fps, Montserrat font
- Colores: `DARK_BG=#1E2A2A`, `TEAL=#5ceaaf`, `PURPLE=#7b8bf0`

### Adaptación vertical (9:16)
- Textos deben ser **más grandes** que en horizontal (pantalla más angosta, 1080px)
- Textos largos: usar `flexWrap` + `maxWidth` (700-800px) + `lineHeight: 0.85`
- Quitar `whiteSpace: "nowrap"` para permitir salto de línea
- Imágenes/teléfonos más grandes para aprovechar espacio vertical
- Elementos dimensionados en px (bandHeight, etc.) adaptar de 1080→1920
- Centrar siempre con `translate(-50%, -50%)` en vez de `top: 42%`

---

## ESTÁNDAR VALIDADO — Extraído de 5 videos usados por clientes

> Fuente: #963 BAC (1035×1035), #988 RedAgrupa V2, #989 RedAgrupa V3, #804 Equos, #1212 Cemtra (todos 1080×1920 excepto BAC).
> Estos videos fueron publicados en redes y pantallas reales. Los valores aquí son el estándar obligatorio.

### E1. Tipografía — Tabla de tamaños por nivel jerárquico

| Nivel | Rango px | Weight | letterSpacing | Uso |
|-------|----------|--------|---------------|-----|
| **Hero/Hook** (cifras, 1-2 palabras shock) | 160-220px | 800-900 | 0 | "30K", "70%", "CURICÓ" |
| **Headline principal** (frase de 2-5 palabras) | 68-140px | 700-800 | 0-2 | "viaja mejor", "Los que saben eligen" |
| **Sub-headline** (segundo nivel, contexto) | 44-68px | 600-800 | 0-4 | "EL PRIMER CENTRO DE", bullets |
| **Labels/categorías** (sobre collages) | 42-56px | 700-800 | 2-4 | "TRAUMATOLOGÍA", "Seguros de carga" |
| **Botones/CTA** (texto dentro de pill) | 34-48px | 800 | 2 | "Agenda tu asesoría", "www.cemtra.cl" |
| **URL/ubicación** (datos terciarios) | 28-40px | 500-600 | 2 | "Talca · Región del Maule" |

**Regla:** NUNCA un headline bajo 68px ni un hero bajo 160px en vertical. El texto debe LLENAR la pantalla.

**Weight mínimo absoluto = 500.** No hay thin/light en ninguno de los 5 videos.

### E2. Interlineados — Máximo 1.15, ideal 0.85-1.05

| Tipo de texto | lineHeight | Referencia |
|---------------|-----------|------------|
| Headlines grandes (1-3 palabras) | **0.85-0.95** | Equos S05 (0.85), BAC S03/S11 (0.95), RA S04 (0.95) |
| Frases medianas (4-8 palabras) | **1.0-1.05** | BAC S04/S06, Cemtra S02/S06, RA S02/S05 |
| Stacks con flexWrap (frases largas) | **1.05-1.15** | Equos S01 (1.1), S04 (1.15) |

**Regla:** NUNCA lineHeight > 1.15. Interlineado compacto = impacto visual. Valores de 1.2+ desperdician espacio y reducen presencia.

### E3. Justificación — Patrón de alternancia

La justificación NO es uniforme dentro de un video. Los 5 videos alternan deliberadamente:

| Tipo de escena | Alineación estándar |
|----------------|---------------------|
| Escena solo texto (hook, dato, gradientWord) | **Centrado** |
| Imagen + texto superpuesto | **LEFT o RIGHT**, nunca centrado |
| Bullets / listas | **SIEMPRE LEFT** con punto circular |
| Labels sobre collage/panels | **Pegados al borde** (bottom-left o bottom-right) |
| CTA (botón + URL) | **Centrado**, agrupado en flex-column |
| Logo cierre | **Centrado** |

**Regla de alternancia:** Si S01 es centrado, al menos una de las 3 escenas siguientes debe ser LEFT o RIGHT. Nunca 4 escenas centradas consecutivas.

**Bullets obligatorios:** Punto circular de 14-16px en color primario de marca, gap 20px con el texto. Aparecen en BAC S03, Cemtra S02, RA V2 S05, RA V3 S05.

### E4. Efectos globales — Variaciones validadas

Los 5 videos usan combinaciones distintas de efectos. NO todos necesitan lo mismo:

| Efecto | Videos que lo usan | Cuándo aplicar |
|--------|-------------------|----------------|
| **GlitchWrapper RGB** (3 puntos, 6f cada uno) | Equos, RA V2 | Videos tech, corporativos, modernos |
| **FlickerOverlay** (10 puntos, patrón [0.15,0.9,0.1,0.95]) | BAC | Videos con mucha energía, viaje, dinamismo |
| **Neon flicker** (array binario local) | BAC S11, RA V3 S04 | Previo a zoom explosivo, reveal de marca |
| **Lens flare anamórfico** | Cemtra S01 | Hook con cifra grande, estilo cinematográfico |
| **Círculos decorativos** (rotación + pulso continuo) | RA V2 S05 | Escenas de bullets, fondo vacío que necesita movimiento |
| **Sin efecto global** | Cemtra, RA V3 | Videos con identidad visual fuerte que no necesita extra |

**Regla:** Elegir 1-2 efectos por video, no acumular todos. Si se usa GlitchWrapper, el video ya tiene identidad tech. Si no, compensar con efectos locales (partículas, flicker, lens flare).

### E5. Transiciones — 3 patrones validados

| Patrón | Videos | Implementación |
|--------|--------|----------------|
| **VenetianBlind + GlitchTransition alternados** | Equos, RA V2 | 5f cada una, entre cambios de sección |
| **VenetianBlind sola** | BAC | 8f, menos frecuente (2 en 30s) |
| **Corte directo con gap** | RA V3, Cemtra | Gaps de 0-6f (negro/fondo entre escenas) |

**Regla:** Elegir UN patrón de transición por video y mantenerlo. No mezclar transiciones explícitas (5f) con cortes directos en el mismo video.

### E6. Estructura narrativa — Arco validado

Los 5 videos siguen este arco con variaciones:

| Posición | Función | Duración | Templates típicos |
|----------|---------|----------|-------------------|
| **0-3s** (0-90f) | Hook: cifra shock, pregunta, o frase gancho | 75-85f | WaitParticles, ImpactZoom, WordReveal |
| **3-6s** (90-180f) | Contexto o dolor: el problema | 75-85f | Typewriter, SplitText, bullets |
| **6-10s** (180-300f) | Marca o solución: nombre + promesa | 85-95f | IntroducingStack, GradientWord, "Mejor confía en" |
| **10-16s** (300-480f) | Prueba: servicios, collage, imagen | 80-120f | TikTokCollage, ImageOverlay, FramedImage |
| **16-20s** (480-600f) | Diferenciador o frase motivacional | 70-90f | BoostEngagement, SplitImageText |
| **20-24s** (600-720f) | CTA: acción + URL + botón | 60-75f | GetItNow, AutoButton |
| **24-30s** (720-900f) | Logo solo, sin extras | 67-150f | FinalLogo |

**Regla:** Mínimo 6 escenas reales. El hook SIEMPRE es la primera escena. El logo SIEMPRE es la última. CTA va ANTES del logo, nunca fusionado con él.

### E7. Zoom explosivo — Técnica de cierre de sección

3 de 5 videos usan zoom scale 1→12-45 como transición entre secciones:

- **BAC S11:** scale 1→45 en 10f (IntroducingStack → cierre)
- **Cemtra S01:** scale 1→12 en 25f (30K hook → dato)
- **RA V3 S01/S04:** scale 1→45 en 15f (hook → typewriter, marca → imagen)

**Regla:** El zoom explosivo va SIEMPRE precedido de neon flicker (6-10 frames de parpadeo binario). La secuencia es: contenido visible → flicker → zoom → corte a siguiente escena.

### E8. Escena de cierre — Estándar validado

| Aspecto | Estándar | Rango real |
|---------|----------|------------|
| Contenido | SOLO logo, centrado | 5 de 5 videos |
| Tamaño logo | 600-800px (width o height) | BAC 650w, Cemtra 800w, Equos 500h, RA V2 700w, RA V3 600w |
| URL en cierre | NO — va en escena CTA previa | 3 de 5 (Equos y RA V3 aún lo incluyen) |
| Fondo | Color sólido (marca o blanco) | Nunca gradiente, nunca imagen |
| Spring entrada | damping 14, stiffness 100, scale 0.7→1 | Idéntico en los 5 |
| Fade out | NUNCA | Logo visible 100% hasta último frame |
| Duración | 67-150f | Promedio 120f |

### E9. Poster frame — Obligatorio

4 de 5 videos tienen poster frame (frame 0, durationInFrames=1). Estándar:
- Snapshot estático de la escena más atractiva (generalmente imagen+texto)
- Sin animaciones — todo opacity=1, sin springs
- Desplazar contenido real a from=1
- Elegir escena con imagen+texto visible, no escena solo texto

### E10. Botones/CTA — Patrón consistente

| Aspecto | Estándar |
|---------|----------|
| Forma | Pill (borderRadius 40-60) |
| Background | Color primario de marca (TEAL/ORANGE/RED) |
| Texto | 34-48px, weight 800, blanco, UNA línea |
| Padding | 14-20px vertical, 40-60px horizontal |
| Animación | Spring scale 0.5→1 |
| Pulse opcional | `1 + Math.sin(frame * 0.15) * 0.03` (Cemtra) |

### E11. Imágenes con texto — Técnica de overlay validada

Cuando una imagen ocupa el fondo completo con texto encima:

| Técnica | Implementación |
|---------|----------------|
| Gradiente direccional | `linear-gradient(to bottom, rgba(0,0,0,0.7-0.85), transparent)` desde el borde donde va el texto |
| Texto posición | En el extremo del gradiente (si gradiente desde arriba, texto arriba) |
| textShadow | `"0 2-4px 12-20px rgba(0,0,0,0.7-0.8)"` sobre imagen |
| Imagen drift | scale lento 1.0→1.06-1.12 durante toda la escena |
| Imagen entrada | spring 1.3→1.0 (zoom in → tamaño normal) |
| NUNCA | opacity reducida en la imagen — siempre 100% |

**Los 5 videos coinciden:** gradiente + textShadow, NUNCA opacity en imagen.

## Anatomía de una escena

Cada escena es un componente React funcional que usa:
```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
```

### Estructura base
```tsx
const MiEscena: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      {/* contenido */}
    </AbsoluteFill>
  );
};
```

Registrar en la composición:
```tsx
<Sequence name="XX - Nombre" from={FRAME_START} durationInFrames={DURACION}>
  <MiEscena />
</Sequence>
```

---

## CATÁLOGO DE SCENE TEMPLATES

Los 37 templates agrupados por categoría funcional. Cada template es reutilizable: cambiar textos, colores e imágenes manteniendo la animación intacta.

### A. SOLO TEXTO — Entradas animadas

| # | Template | Contenido | Animación entrada | Animación salida | Frames | Cuándo usarlo |
|---|----------|-----------|-------------------|------------------|--------|---------------|
| 01 | **WordReveal** | 3-5 palabras grandes | Stagger gris→blanco (4f entre palabras) + slide horizontal 100px | Shrink 1→0.25 en últimos 10f | 55 | Hook inicial, frases cortas de impacto |
| 02 | **ImpactZoom** | 1-2 palabras GRANDES en mayúscula | Letras caen individuales con spring (stagger 2f) sobre fondo gradiente 5 colores | Shrink scaleY 1→0.37 (banda horizontal) | 55 | Palabras de impacto, énfasis dramático |
| 06 | **GradientWord** | Secuencia de 3 palabras (aparece una, desaparece, aparece otra) | Spring scale 0.8→1 por palabra, gradiente teal→purple | Fade out entre palabras | 85 | Revelar concepto progresivamente ("hay un... secreto... ingrediente") |
| 07 | **IntroducingStack** | 1 palabra repetida en 5 filas (centro llena, resto outline) | Stagger vertical + sweep de bandas purple/green | Neon flicker doble + zoom 4500% | 95 | Presentaciones dramáticas, reveal de nombre/marca |
| 10 | **AllInOne** | 3 palabras grandes | Stagger gris→blanco | Zoom 1→2x en últimos 7f | 50 | Frases descriptivas cortas, propuesta de valor |
| 11 | **ToCreate** | 1-2 palabras con gradiente | Spring fade+scale, fondo transiciona blanco→oscuro | Slide out izquierda (cubic ease-in) | 60 | Transición temática, cambio de tono |
| 14 | **QuicklyTools** | 5 palabras (1ª en gradiente, resto gris→blanco) | Stagger 6f, primera palabra en gradiente teal→purple | Ninguna (corte directo) | 60 | Listas de features, frases largas con keyword destacada |
| 15 | **RepeatScroll** | 1 frase repetida 12 veces en scroll vertical | Scroll vertical continuo, opacidad varía por distancia al centro | Continuo (corte) | 60 | Énfasis por repetición, mantra, slogan |
| 24 | **GenerateMasterpiece** | 2 líneas de texto con gradiente verde→azul→púrpura | Spring scale 0.7→1 | Ninguna | 60 | CTA aspiracional, cierre motivacional |
| 26 | **EasyToUse** | 1 palabra grande centrada | Spring scale 0.6→1, rápido | Ninguna | 30 | Palabra suelta de transición, énfasis rápido |
| 32 | **GetItNow** | 2-3 palabras + 1 palabra en pill/botón blanco | Gris→blanco stagger + pill spring scale 0.5→1 | Ninguna | 60 | CTA final, call to action con botón |

### B. TEXTO + IMAGEN

| # | Template | Contenido | Animación | Frames | Cuándo usarlo |
|---|----------|-----------|-----------|--------|---------------|
| 03 | **SplitText** | Texto arriba + imagen vertical centro + texto abajo | Slide izq/der para textos, spring para imagen. Banda gradiente shrink. Fondo blanco→oscuro. Imagen sale slide izquierda | 90 | Presentar producto/creatividad con contexto textual |
| 33 | **SplitImageText** | Imagen mitad superior + 3 palabras mitad inferior | Imagen slide desde arriba, texto stagger slide desde abajo | 75 | Mostrar imagen de marca + frase descriptiva |
| 34 | **ImageOverlay** | Imagen fullscreen (opacity 0.45) + 2 palabras grandes + línea gradiente | Imagen spring 1.3→1 + drift lento, texto gris→blanco + slide, línea se dibuja progresivamente | 75 | Fondo ambiental con mensaje superpuesto, mood |
| 35 | **FramedImageTypewriter** | Imagen cuadrada enmarcada + texto typewriter con gradiente | Imagen spring 0.3→1 con glow pulsante, texto typewriter 0.45 chars/frame + partículas sutiles | 95 | Highlight de una creatividad específica con descripción |

### C. TEXTO + ELEMENTO VISUAL/ICONO

| # | Template | Contenido | Animación | Frames | Cuándo usarlo |
|---|----------|-----------|-----------|--------|---------------|
| 04 | **WaitParticles** | 1 palabra grande + "!" + partículas flotantes verdes | Letras caen con spring stagger 3f + partículas entran desde "cámara" (scale 10→1) | 85 | Interjección, llamar atención ("¡Espera!", "¡Atención!") |
| 13 | **ViewCounter** | 3 palabras + icono ojo SVG + counter animado | Texto entra zoom 3500%→1, counter cuenta de 0 a target | 65 | Mostrar métricas, números de impacto |
| 14b | **ClockIcon** | Reloj SVG animado (manecillas giran) | Spring scale 0.3→1 + rotación -15→5° | 50 | Representar tiempo, velocidad, urgencia |
| 20 | **MarqueeBands** | 2 textos alternados en 8 bandas horizontales scrolleando | Scroll horizontal continuo, bandas alternas blanco/negro | 60 | Energía, movimiento continuo, branding repetitivo |
| 31 | **BatteryTurbocharge** | 6 palabras + batería SVG que se carga (rojo→amarillo→verde) | Texto slide desde arriba stagger 4f, batería fade in + fill progresivo | 120 | Energía, potencia, "recargar", beneficio acumulativo |

### D. MOCKUPS Y DEMOS

| # | Template | Contenido | Animación | Frames | Cuándo usarlo |
|---|----------|-----------|-----------|--------|---------------|
| 09 | **Clapperboard** | Claqueta de cine con rayas B/W | Spring 0.1→1, tapa clap -30°, splash radial teal→purple | 45 | Intro de "producción", inicio de sección video |
| 19 | **AppEditor** | Layout de app (sidebar + content area + cursor flotante) | Spring scale 0.92→1, cursor sinusoidal, click bounce en frame 40 | 60-90 | Demostrar interfaz, herramienta, plataforma |
| 23 | **AppCreateVideo** | Igual que AppEditor con acento TEAL | Igual | 60-90 | Variante de demo de app |
| 25 | **VideoOnPhone** | Celular 700×1400 con imagen dentro + nav bar | Spring 0.6→1, notch + bottom nav | 30 | Mostrar resultado en celular, preview mobile |
| 27 | **AppVideoEditor** | Layout de app con acento PURPLE | Igual que AppEditor | 60-90 | Demo de editor de video |
| 29 | **AppAutomations** | Layout de app con acento TEAL | Igual | 60-90 | Demo de automatizaciones |
| 31b | **AppAudio** | Layout de app con acento PURPLE | Igual | 60-90 | Demo de selección de audio |

### E. INTERACTIVOS (cursor, toggle, botón)

| # | Template | Contenido | Animación | Frames | Cuándo usarlo |
|---|----------|-----------|-----------|--------|---------------|
| 18 | **GridClickReveal** | Grid 3×2 con imágenes reveladas por cursor | Cursor se mueve celda a celda (20f entre clicks), cada celda flicker al revelarse | 150 | Mostrar portafolio, múltiples creatividades |
| 23b | **AIToggle** | Texto + toggle switch (gris→verde) | Texto spring + slide, toggle transiciona color en f20-30, fade out + slide arriba | 60 | Activar feature, encender/apagar, "powered by AI" |
| 24b | **GenerateButton** | Botón verde "Generate" + spinner loading | Spring 0.5→1, click bounce f25, spinner aparece post-click | 60 | Acción de generar, loading state, "crear ahora" |
| 28 | **AutoButton** | Botón pill blanco + cursor + dots orbitando | Botón spring, cursor entra f35, click f50, botón blanco→verde con glow | 90 | CTA con interacción, "automatizar", botón que se activa |

### F. COLLAGES Y GRIDS DE IMÁGENES

| # | Template | Contenido | Animación | Frames | Cuándo usarlo |
|---|----------|-----------|-----------|--------|---------------|
| 17 | **TikTokCollage** | 3 paneles horizontales apilados con imágenes + texto overlay | Paneles slide desde derecha stagger 8f, flicker neon en f50-58 cambia a set 2 de imágenes | 134 | Mostrar múltiples creatividades/resultados, antes/después |
| 21 | **StatsCollage** | 3 paneles con imágenes de fondo + stats (valor + label) en gradiente | Paneles slide desde derecha stagger 8f, stats fade in | 90 | Métricas por categoría, resultados con contexto visual |
| 21b | **SamePiece** | Split vertical: número rojo izq + número verde der + "SAME PIECE" abajo | Spring entrada, flash intermitente en texto dorado | 55-60 | Comparación dramática, A vs B, contraste de resultados |
| 27b | **SocialCard** | Card blanca (video placeholder + likes/comments) + íconos sociales flotando | Card spring 0.7→1, íconos flotan sinusoidal con stagger | 60-90 | Redes sociales, engagement, preview de post |

### G. TYPEWRITER / TEXTO PROGRESIVO

| # | Template | Contenido | Animación | Frames | Cuándo usarlo |
|---|----------|-----------|-----------|--------|---------------|
| 19b | **RepurposeScript** | Texto con gradiente teal→purple + cursor | Typewriter 0.5 chars/frame, cursor blink 15f | 55 | Escribir mensaje, script, "repurpose", contenido generándose |
| 22 | **Typewriter** | Texto blanco grande + cursor TEAL | Typewriter 0.4 chars/frame, cursor blink 15f | 55 | Input de texto, dictado, "escribe aquí" |

### H. NOTIFICACIONES

| # | Template | Contenido | Animación | Frames | Cuándo usarlo |
|---|----------|-----------|-----------|--------|---------------|
| 29b | **MacNotification** | Notificación estilo macOS (icono + título + preview) esquina superior derecha | Spring slide desde derecha, fade out en f45-55 | 55 | Notificación, "te llegó", inbox, alerta |

### I. TEXTO CON ELEMENTOS DECORATIVOS

| # | Template | Contenido | Animación | Frames | Cuándo usarlo |
|---|----------|-----------|-----------|--------|---------------|
| 27c | **NewVideoEveryDay** | 7 palabras grandes + partículas verdes flotantes | Palabras spring stagger 3f desde arriba (-200px), partículas behind-camera | 90 | Frase larga con ambiente de partículas, energía |
| 29c | **ReceiveInbox** | 7 palabras con slide desde abajo + underline TEAL en última palabra | Stagger 4f fade+slide, línea se dibuja bajo keyword | 90 | Frase con keyword destacada por underline |
| 30 | **BoostEngagement** | 3 palabras + línea diagonal verde SVG | Stagger fade+slide, línea diagonal se dibuja bottom-right→top-left | 90 | Crecimiento, tendencia alcista, "boost" |

### J. TRANSICIONES (5 frames cada una)

| # | Template | Contenido | Animación | Frames | Cuándo usarlo |
|---|----------|-----------|-----------|--------|---------------|
| T1 | **VenetianBlind** | 10 barras verticales que se desvanecen left→right revelando hint de siguiente escena | Wipe progress staggerado por barra | 5 | Transición limpia entre escenas, corte suave |
| T2 | **GlitchTransition** | Aberración cromática RGB + partículas neón scatter | Offset crece/decrece + scatter + fade to dark | 5 | Transición tech/edgy, entre secciones contrastantes |

### K. LOGOS Y CIERRE

| # | Template | Contenido | Animación | Frames | Cuándo usarlo |
|---|----------|-----------|-----------|--------|---------------|
| 10b | **LogoSplash** | 7 formas orgánicas rotando → convergen → logo (cuadrado + texto) | Swirl rotation frame*3, circle verde central, logo spring | 50 | Intro de marca con energía, splash animado |
| 37 | **FinalLogo** | Logo (icono circular + texto) + 50 partículas teal/purple | Spring 0.7→1, partículas flotan suave, fade out en f120-150 | 150 | Cierre de video, pantalla final con logo |

### L. VIDEO MOCKUP

| # | Template | Contenido | Animación | Frames | Cuándo usarlo |
|---|----------|-----------|-----------|--------|---------------|
| 04b | **VideoMockup** | Rectángulo oscuro con play button central + gradiente inferior | Spring 0.15→0.85 + drift zoom lento | 60 | Placeholder de video, "mira el video", preview |

---

## REFERENCIA RÁPIDA DE SECUENCIAS

**Archivo:** `remotion-nora/CATALOGO.md` — contiene las 37 secuencias agrupadas por categoría con descripción, frames y cuándo usarlas. LEER ESTE ARCHIVO para elegir secuencias. Solo ir al TSX (`src/EffectsBibleVertical.tsx`) para copiar el código de la secuencia elegida.

---

## PROCESO: De libreto a video

### Paso 1: Recibir el libreto
El libreto viene de la skill `nora-libreto-video` con este formato:
- Framework (A-F)
- Guión segundo a segundo: Segundo | Texto en pantalla
- Texto total y conteo de frases

### Paso 2: Mapear escenas del libreto a templates

Para cada fila del guión segundo a segundo:

1. **Identificar el tipo de contenido**:
   - ¿Solo texto? → Categoría A
   - ¿Texto + imagen de marca? → Categoría B
   - ¿Texto + ícono/elemento? → Categoría C
   - ¿Demo de app? → Categoría D
   - ¿Interacción? → Categoría E
   - ¿Múltiples imágenes? → Categoría F
   - ¿Texto progresivo? → Categoría G

2. **Elegir template específico según la intención**:
   - Hook (0-3s) → WordReveal, ImpactZoom, WaitParticles
   - Dolor/problema → GradientWord, BoostEngagement, SamePiece
   - Solución/feature → SplitImageText, AppEditor, AIToggle
   - Prueba/métrica → ViewCounter, StatsCollage
   - CTA → GetItNow, AutoButton, GenerateButton
   - Logo final → FinalLogo, LogoSplash

3. **Calcular frames**: duración en segundos × 30 = frames

4. **Agregar transiciones**: VenetianBlind o GlitchTransition (5f) entre secciones temáticas

### Paso 2b: Revisar videos existentes y variar patrones (OBLIGATORIO)

Antes de mapear escenas, **SIEMPRE consultar videos previos** en Supabase:

```
SELECT id, concepto, copy, created_at FROM creatividades
WHERE marca = '[MARCA]' AND origen = 'video'
ORDER BY created_at DESC
```

El campo `concepto` es un JSON con metadata completa del video (ver estructura en skill libreto). Analizar:
- `templates` → elegir templates DIFERENTES a los ya usados
- `fondo` → rotar estilo de fondo (oscuro → claro → corporativo → gradiente)
- `hook_tipo` → NO repetir el mismo hook del video anterior
- `imagenes` → NO reutilizar las mismas imágenes

**Variación de fondos** (rotar entre videos):
1. Fondo oscuro (DARK_BG) — el estándar
2. Fondo blanco (#FFFFFF con texto oscuro)
3. Fondo color corporativo primario (con texto blanco)
4. Fondo gradiente marca (primario → secundario)

Esto es CRÍTICO cuando se generan múltiples videos en batch. Cada video debe verse notablemente distinto a pesar de usar la misma biblioteca de animaciones.

### Paso 3: Obtener assets

#### Imágenes de marca
Buscar en Supabase creatividades de la marca con condición `favorito`, `resultado_final` o `aprobado`:
```
SELECT id, link_ren_1, condicion, slogan_headline FROM creatividades
WHERE marca = '[MARCA]' AND condicion IN ('favorito', 'resultado_final', 'aprobado')
AND origen != 'video'
ORDER BY id DESC
```

**Descargar las imágenes** a `public/images/` y referenciar con `staticFile("images/nombre.png")`. Nombrar los archivos con el **ID de la creatividad**: `marca_ID.png` (ej: `equos_823.png`).

> ¿Por qué el ID? Porque facilita la referencia: "usa la imagen 23" es inequívoco. En el JSON de `concepto` del video, registrar los IDs de las creatividades usadas.

Reglas:
- **Imágenes SIEMPRE completas** — NUNCA pantallas divididas (split screen)
- **Preferir imágenes con rostros** visibles (personas mirando a cámara o perfil)
- **Cada imagen usada solo una vez** por video
- `objectFit: "cover"` + `overflow: "hidden"` siempre

#### Logo de marca
Buscar en tabla `marcas` campo `logos` (URLs separadas por pipe). Descargar la versión **blanca** para fondos oscuros a `public/images/logos/`

### Paso 4: Adaptar identidad de marca
Ver sección "ADAPTACIÓN DE MARCA" abajo.

### Paso 5: Generar música
Ver sección "MÚSICA (MusicGen)" abajo.

### Paso 6: Ensamblar composición
- Crear archivo TSX con todos los componentes
- Registrar en Sequences con frames calculados
- Envolver en GlitchWrapper si el estilo lo requiere
- Actualizar `durationInFrames` total en Root.tsx

### Paso 7: Combinar video + audio
**SIEMPRE entregar el video con música.** Después del render:
```bash
# Generar música con MusicGen
python musicgen-test.py "PROMPT_AQUI" DURACION_SEGUNDOS

# Combinar video + audio
ffmpeg -i out/video.mp4 -i public/music/test_track.wav -c:v copy -c:a aac -b:a 128k -map 0:v:0 -map 1:a:0 -shortest -y out/video_final.mp4
```
El audio es fundamental para validar que calza con el look and feel de la marca y el ritmo del contenido.

### Paso 8: Preview y render
```bash
npx remotion studio          # Preview
npx remotion render Comp out/video.mp4 --codec=h264 --concurrency=8
```

### Paso 9: Registrar video en Supabase (OBLIGATORIO)

Después de combinar video + audio, **SIEMPRE registrar** el video como creatividad:

1. **Subir el .mp4** a Supabase Storage (bucket `creatividades`):
```
PUT /storage/v1/object/creatividades/video_[marca]_[timestamp].mp4
```

2. **Crear registro en tabla `creatividades`** con:
- `marca` — nombre de la marca
- `origen` — `"video"`
- `concepto` — JSON con metadata completa:
  ```json
  {
    "libreto": "texto completo del guión segundo a segundo",
    "framework": "A",
    "hook_tipo": 3,
    "templates": ["S01_WordReveal", "S02_ImagePerson", "S03_GradientWord"],
    "fondo": "oscuro",
    "imagenes_ids": [823, 845, 867],
    "musica": "piano + strings, 26s",
    "duracion_s": 26.3,
    "escenas": 7,
    "orientacion": "vertical",
    "resolucion": "1080x1920"
  }
  ```
- `copy` — CTA principal o resumen de una línea del video
- `condicion` — `"para_revision"`
- `link_ren_1` — URL pública del video en Storage

Usar el script `upload-video.mjs` para automatizar upload + registro.

---

## ADAPTACIÓN DE MARCA

La identidad visual de cada marca se obtiene de **dos fuentes en Supabase**:

### Fuente 1: Apartado "Video" en notas_generales
Cada marca tiene (o debería tener) un apartado específico para video dentro de su campo `notas_generales`. Buscar la sección marcada como **"## Video"** o **"## Instrucciones de video"**.

```
SELECT notas_generales, paleta_colores, contenido_prohibido FROM marcas WHERE marca = '[MARCA]'
```

Este apartado define para esa marca específica:
- **Colores para video**: qué hex usar como DARK_BG, primario (TEAL), secundario (PURPLE)
- **Restricciones visuales**: qué evitar en los videos
- **Preferencias**: estilo de fondo preferido, tipo de música, elementos visuales que quieren o no
- **Observaciones**: feedback acumulado de videos anteriores

Si la marca NO tiene apartado de video en notas_generales, usar `paleta_colores` como fallback para extraer los colores.

### Fuente 2: paleta_colores (fallback)
Solo si no hay apartado de video en notas_generales.

### Mapeo de colores
```tsx
// Reemplazar las constantes globales:
const DARK_BG = "#1E2A2A";    // → color oscuro de la marca (fondo principal)
const TEAL = "#5ceaaf";        // → color primario de la marca (acentos, underlines, gradientes)
const PURPLE = "#7b8bf0";      // → color secundario de la marca (gradientes, partículas)
```

Reglas:
- `DARK_BG` debe ser oscuro (luminosidad < 25%) para que el texto blanco sea legible
- `TEAL` (primario) se usa en acentos, underlines, gradientes, partículas
- `PURPLE` (secundario) se usa en gradientes, partículas alternadas, acentos secundarios
- Los gradientes `linear-gradient(to right, TEAL, PURPLE)` se adaptan automáticamente
- Botones y toggles usan el color primario para el estado "activo"

### Textos
- Reemplazar TODOS los textos placeholder por el contenido del libreto
- Mantener la MISMA cantidad de palabras/caracteres para preservar el ritmo
- Si el texto es más largo, ajustar `fontSize` hacia abajo o usar `flexWrap`

### Font
- Por defecto: Montserrat. Para cambiar:
```tsx
import { loadFont } from "@remotion/google-fonts/NombreFuente";
const { fontFamily } = loadFont();
```

### Lo que NO se cambia
- Timing de animaciones (springs, stagger, durations)
- Patrones de entrada/salida
- Estructura de layout
- Efectos (glitch, partículas, flicker)

---

## MÚSICA (MusicGen)

### Cuándo generar música
- Después de definir el libreto y antes del render final
- La música debe coincidir con el ritmo y mood del video

### Cómo elegir estilo según el libreto

| Framework del libreto | Estilo musical | BPM sugerido |
|-----------------------|----------------|--------------|
| A (Hook-Dolor-Solución-CTA) | Electrónica tensa → triunfal | 120-140 |
| B (Hook-Promesa-Prueba-CTA) | Corporativa inspiracional | 100-120 |
| C (Antes-Después-Puente) | Ambient → upbeat | 90-130 |
| D (Tensión-Giro-Resolución) | Cinematográfica, builds | 80-120 |
| E (Lista rápida) | Pop/electrónica energética | 120-140 |
| F (Pregunta-Mito-Verdad) | Misterio → revelación | 100-120 |

### Prompt para MusicGen
Estructura: `[estilo] [mood] [instrumentos] [tempo] [duración]`

Ejemplo: `"upbeat electronic corporate, synth pads, driving beat, 120 bpm, 20 seconds"`

### Sincronización
- El beat drop debe coincidir con el cambio de sección (hook→dolor, dolor→solución)
- Los glitch transitions (5f = 0.17s) deben caer en silencios o hits percusivos
- El cierre (logo final) debe tener resolución musical

---

## CATÁLOGO DE PATRONES

### 1. ENTRADAS DE TEXTO

#### 1A. Word Reveal (gris→blanco)
Palabras aparecen con stagger, transicionan de gris (#505050) a blanco.
- **Usado en:** S01, S10, S14, S35
- **Parámetros:** stagger (4-6f), fadeDuration (4-5f), delay inicial (2f)
```tsx
const words = ["palabra1", "palabra2", "palabra3"];
const stagger = 5;
const fadeDuration = 4;
{words.map((word, i) => {
  const wordStart = 2 + i * stagger;
  const progress = interpolate(frame, [wordStart, wordStart + fadeDuration], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gray = Math.round(interpolate(progress, [0, 1], [80, 255]));
  return <span style={{ color: `rgb(${gray},${gray},${gray})` }}>{word}</span>;
})}
```

#### 1B. Fade + Slide direccional
Palabras entran con fade-in + slide desde una dirección (100-150px).
- **Usado en:** S32, S33, S34
- **Parámetros:** stagger 4f, fadeDuration 6f, slideDistance 100px
```tsx
const progress = interpolate(frame, [wordStart, wordStart + fadeDuration], [0, 1], ...);
const slideY = interpolate(progress, [0, 1], [100, 0]); // desde abajo
// o slideY = [-100, 0] desde arriba (S34)
```
- Tamaño texto: 120-140px, fontWeight 700, llena la pantalla
- Layout: flex-wrap con gap "10px 28px", padding "0 60px"

#### 1C. Letter-by-letter spring
Letras individuales caen/suben con spring staggerado.
- **Usado en:** S02, S07
- **Parámetros:** letterStagger 2f, preOffset 6f, spring damping 14
```tsx
const letters = "TEXTO".split("");
{letters.map((letter, i) => {
  const delay = i * letterStagger;
  const s = spring({ frame: Math.max(0, frame + preOffset - delay), fps,
    config: { damping: 14, stiffness: 200, mass: 0.5 } });
  const y = interpolate(s, [0, 1], [-300, 0]);
})}
```

#### 1D. Typewriter
Caracteres aparecen progresivamente con cursor parpadeante.
- **Usado en:** S18, S22
- **Parámetros:** charsPerFrame 0.4-0.5
```tsx
const visibleChars = Math.min(Math.floor(frame * charsPerFrame), text.length);
const displayText = text.slice(0, visibleChars);
// Cursor: blink cada 15 frames, color TEAL, 5-6px ancho, altura = fontSize
```

#### 1E. Texto gradiente
Texto con gradiente lineal (teal→purple o multi-stop).
- **Usado en:** S06, S11, S18, S24c
```tsx
style={{
  background: `linear-gradient(to right, ${TEAL}, ${PURPLE})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}
```
- Variante 5-stop (S02): `#6bcf9a, #7bb8e0 30%, #8b9cf0 60%, #9a8bea 80%, #8ea0f0`

---

### 2. SALIDAS / TRANSICIONES

#### 2A. Shrink (escala hacia abajo)
Elemento se encoge en últimos frames.
- **Usado en:** S01 (1→0.55 en 10f), S02 (1→0.37 en 8f)
```tsx
const shrinkStart = totalDuration - 10;
const scale = interpolate(frame, [shrinkStart, totalDuration - 1], [1, 0.55], ...);
```

#### 2B. Zoom 3500%
Texto se agranda enormemente hasta llenar pantalla de blanco.
- **Usado en:** S05, S07, S28
- **Parámetros:** 10-15 frames, scale 1→35
```tsx
const zoomStart = 70;
const textZoom = interpolate(frame, [zoomStart, zoomStart + 15], [1, 35], ...);
```

#### 2C. Slide out (ease-in cúbico)
Elemento se desliza fuera de pantalla con aceleración.
- **Usado en:** S03, S11
- **Parámetros:** 25 frames, slideX hasta -1200/-1400px
```tsx
const slideProgress = interpolate(frame, [65, 90], [0, 1], ...);
const eased = slideProgress * slideProgress * slideProgress;
const slideX = eased * -1200;
```

#### 2D. Venetian blind (5 frames)
Barras verticales con opacidad staggerada revelan siguiente escena.
- Barras: 10, ancho = 1920/10
- Wipe progress 0→1 en 5 frames, izquierda a derecha

#### 2E. Glitch (5 frames)
Aberración cromática + partículas scatter.
- 3 canales RGB con offset crece/decrece
- Partículas scatter con colores neón (#00ff88, #aa55ff, #ff3366)
- Fade a dark en último frame

---

### 3. EFECTOS AMBIENTALES

#### 3A. Partículas flotantes
Círculos con movimiento sinusoidal.
- **Usado en:** S05, S28, S36
- **Parámetros:** 20-28 partículas, colores #7ac8a0/#4efa90
```tsx
const px = pseudoRandom(i * 3 + 1) * 100;
const py = pseudoRandom(i * 3 + 2) * 100;
const size = (6 + pseudoRandom(i * 3 + 3) * 20) * 2;
const floatY = Math.sin(frame * speed * 0.08 + i) * 40;
const floatX = Math.cos(frame * speed * 0.06 + i * 2) * 30;
```
- Entrada "behind camera": scale 10→1 en 8 frames con stagger aleatorio

#### 3B. Neon flicker
Simula encendido de tubo fluorescente con arrays binarios.
- **Usado en:** S07, S16
```tsx
const flickerPattern = [0, 1, 0, 0, 1, 0, 1, 1, 0, 1];
const flicker = frame >= start && frame < start + pattern.length
  ? flickerPattern[frame - start] : 1;
```

#### 3C. Bandas de color sweep
Bandas horizontales de color que barren verticalmente.
- **Usado en:** S07 (purple + green bands)

#### 3D. Marquee scroll
Texto repetido scrolleando horizontal en bandas alternadas.
- **Usado en:** S20
- 8-10 bandas, colores alternados white/#111
- 10 copias del texto por banda para seamless scroll

---

### 4. ELEMENTOS INTERACTIVOS

#### 4A. Cursor con click
Cursor SVG que se mueve y hace click con bounce.
- **Usado en:** S17, S30
```tsx
<svg width="28" height="34" viewBox="0 0 28 34">
  <path d="M2 2 L2 26 L8 20 L14 30 L18 28 L12 18 L20 18 Z" fill="white" stroke="#333" strokeWidth="1.5" />
</svg>
// Click bounce: scale 1→0.75→1 en 3 frames
```

#### 4B. Toggle switch
Toggle pill que se activa con transición de color.
- **Usado en:** S24
- Dimensiones: 210×114, borderRadius 57, knob 90×90

#### 4C. Botón con glow
Botón pill que cambia de blanco a verde tras click del cursor.
- **Usado en:** S30
- Post-click: boxShadow con glow verde radiante

#### 4D. Counter animado
Número que cuenta de 0 a target.
- **Usado en:** S12
```tsx
const counterProgress = interpolate(frame, [20, 40], [0, 1], ...);
const currentCount = Math.round(counterProgress * targetCount);
```

---

### 5. ELEMENTOS VISUALES

#### 5A. Clapperboard
Claqueta de cine con animación de "clap".
- **Usado en:** S08

#### 5B. Phone mockup
Celular con bordes redondeados y contenido.
- **Usado en:** S25
- Dimensiones: 320×640, borderRadius 36, border 4px #333

#### 5C. App demo placeholder
Layout genérico de app con sidebar + content area + cursor.
- Componente reutilizable: `AppDemoPlaceholder`

#### 5D. Logo splash
Formas orgánicas rotando + convergiendo al centro → logo aparece.
- **Usado en:** S09

#### 5E. Batería con carga
SVG de batería que se llena con transición de color rojo→amarillo→verde.
- **Usado en:** S34

#### 5F. Grid de imágenes
Grid 3×2 con imágenes reales, reveal por click.
- **Usado en:** S17

#### 5G. Collage 3 paneles
3 paneles apilados verticalmente con imágenes + stats.
- **Usado en:** S21

---

### 6. SPRINGS (configuraciones probadas)

| Uso | damping | stiffness | mass |
|-----|---------|-----------|------|
| Entrada suave general | 14 | 100-120 | default |
| Entrada rápida/snappy | 12 | 150-180 | 0.5 |
| Entrada con rebote | 10 | 120 | 0.6 |
| Letras individuales | 14 | 200 | 0.5 |
| Escala desde lejos | 12 | 80-100 | 0.7-0.8 |

---

### 7. TIMING GUIDELINES

| Tipo de escena | Duración típica |
|----------------|-----------------|
| Texto simple (1-3 palabras) | 30-50 frames |
| Texto largo (frase completa) | 55-90 frames |
| Transición | 5 frames |
| Elemento interactivo | 60-90 frames |
| Collage/grid | 90-150 frames |
| Logo final | 120-150 frames |
| Idle después de animación | 15-20 frames |

---

### 8. REGLAS DE CONSISTENCIA

> **Las reglas E1-E11 del ESTÁNDAR VALIDADO (arriba) tienen prioridad sobre todo lo que sigue.** Si una regla aquí contradice el estándar, el estándar gana.

#### Técnicas (intocables)
1. **Font siempre Montserrat** via `@remotion/google-fonts`
2. **overflow: "hidden"** en escenas con partículas o elementos que salen del frame
3. **pseudoRandom(seed)** para posiciones deterministas (no Math.random)
4. **extrapolateLeft/Right: "clamp"** en TODOS los interpolate
5. **Escenas empiezan en frame 0 local** — Sequence maneja el offset global
6. **Sin useEffect ni state** — todo derivado de `frame` y `fps`
7. **Zoom explosivo = scale(12-45)** — siempre precedido de neon flicker (ver E7)
8. **Cubic ease-in para exits**: `progress³` para aceleración natural

#### Tipografía y layout (ver E1-E3 para valores exactos)
9. **Tamaños de texto según tabla E1** — hero 160-220px, headline 68-140px, sub 44-68px. NUNCA headline bajo 68px.
10. **lineHeight según tabla E2** — máximo 1.15, ideal 0.85-1.05. NUNCA 1.2+.
11. **Justificación según tabla E3** — alternar entre escenas, bullets SIEMPRE LEFT, imagen+texto NUNCA centrado.
12. **Weight mínimo 500** — sin thin/light. Headlines 700-900.
13. **Texto entra de a UNO** — stagger 4-6f entre palabras, typewriter, o reveal secuencial.
14. **Textos deben leerse COMPLETOS en reposo** — visible y legible entre fin de entrada e inicio de salida. `flexWrap: "wrap"` + padding 40px si necesario.
15. **Sin texto en mayúsculas** — NUNCA toUpperCase() ni ALL CAPS. Sentence case o title case. Excepción: labels de categoría sobre collage (ej: "TRAUMATOLOGÍA") con letterSpacing 2-4.

#### Imágenes
16. **NO pantallas divididas** — imágenes SIEMPRE completas, nunca split screen
17. **Imágenes SIN opacidad reducida** — overlay con gradiente direccional (ver E11), NUNCA opacity en la imagen
18. **Imagen sola = con ROSTRO** — personas mirando a cámara o perfil, no abstractas
19. **Escenas con imagen: imagen GRANDE** — mínimo 50% del área visible
20. **NO repetir imágenes** — cada imagen aparece UNA vez por video
21. **Glow sin borde** — `radial-gradient` + `blur()` en div separado, NUNCA `boxShadow`/`border` en imagen

#### Efectos y transiciones (ver E4-E5)
22. **Elegir 1-2 efectos globales por video** — GlitchWrapper O FlickerOverlay, no ambos. Compensar con efectos locales.
23. **Elegir UN patrón de transición** — VenetianBlind+GlitchTransition alternados, O VenetianBlind sola, O cortes directos con gap 3-6f. NO mezclar.
24. **Elementos decorativos = movimiento continuo** — Math.sin/cos con frame, nunca estáticos post-entrada.
25. **Degradés de texto para dolor** — `linear-gradient` rojo→naranja en texto para urgencia visual.

#### Templates y proceso
26. **COPIAR secuencias EXACTAS de EffectsBibleVertical.tsx** — regla MÁS IMPORTANTE. Copia literal frame-por-frame. Cambiar SOLO: dirección entrada/salida, alineación texto, colores de marca, posición en pantalla. NO tocar: springs, staggers, duraciones, layouts, tamaños fuente, partículas, flicker.
27. **Si no encuentras el template, DETENTE** — busca alternativo del catálogo, NUNCA crear desde cero.
28. **Referencia = CATALOGO.md** — NO leer TSX completo. Solo ir al TSX para copiar código del template elegido.
29. **Mínimo 6 escenas reales** — del catálogo de 37 templates.

#### Marca y contenido
30. **Logo REAL de la marca** — versión blanca para fondos oscuros, color para fondos claros.
31. **Vocabulario de marca** — leer textos aprobados para entender qué palabras USA. Nunca asumir.
32. **NO inventar datos** — solo números reales de la marca. Sin datos → sin template de stats.
33. **Respetar instrucciones de video de la marca** — sección "## INSTRUCCIONES DE VIDEO" de notas_generales tiene prioridad sobre reglas genéricas.
34. **Acentos = TEAL y PURPLE de la marca** — otros colores solo en elementos específicos.

#### Cierre (ver E8, E10)
35. **Logo cierre: mínimo 600px** — spring damping 14, stiffness 100, scale 0.7→1. Sin fadeOut NUNCA.
36. **Cierre = SOLO logo** — sin URL, sin partículas, sin texto. URL va en escena CTA previa.
37. **CTA previa al logo** — botón pill (E10) + URL agrupados en flex-column centrado.
38. **Botones: texto en UNA línea** — 34-48px weight 800, borderRadius 40-60.

#### Variación entre videos
39. **Variar fondo DENTRO del video** — alternar DARK_BG, blanco, color primario, grafito entre escenas.
40. **Rotación de paleta ENTRE videos** — consultar videos anteriores, usar paleta DIFERENTE.
41. **Diversidad de templates** — consultar `concepto.templates` de videos anteriores, cero repetición consecutiva.
42. **Contenido paralelo = collage/grid** — 3+ elementos del mismo nivel → TikTokCollage, StatsCollage, GridClickReveal. NUNCA aplanar a texto solo.

#### Producción
43. **Poster frame obligatorio** (ver E9) — frame 0, snapshot estático de escena atractiva con imagen+texto.
44. **SIEMPRE entregar con audio** — mezcla post-render con ffmpeg: `ffmpeg -i render.mp4 -i musica.wav -c:v copy -c:a aac -b:a 192k -map 0:v -map 1:a -shortest output.mp4`
45. **Música = duración exacta** — PRIMERO render, LUEGO MusicGen. Nunca loop.
46. **Música refleja personalidad** — consultar instrucciones de video de la marca.
47. **Duración flexible** — no comprimir por tiempo arbitrario.
48. **Limpieza post-aprobación** — eliminar TSX intermedios, solo conservar biblias + finales aprobados + en desarrollo.

---

### 9. GLITCH EFFECT (RGB Split)

El video usa un **GlitchWrapper** que envuelve toda la composición. En frames específicos, renderiza el contenido 3 veces con separación de canales RGB.

#### Constantes
```tsx
const GLITCH_FRAMES = [170, 440, 650, 825, 990, 1200, 1460, 1675, 1855, 2065];
const GLITCH_DURATION = 6;
const GLITCH_OFFSETS = [15, 30, 40, 32, 20, 10];
```

#### Reglas
- **Solo RGB displacement** — NO scan lines, NO shake, NO noise
- Offsets siguen curva ramp-up/ramp-down (15→40→10)
- ~7-8 segundos entre cada glitch point
- No colocar glitch en los primeros 3s ni en el logo final

---

### 10. IMÁGENES Y TEXTOS

#### Imágenes
- Descargar de Supabase (creatividades con condición `favorito`, `resultado_final` o `aprobado`)
- Guardar en `public/images/` con nombre `marca_ID.png` (ej: `equos_823.png`)
- Referenciar con `staticFile("images/marca_ID.png")`
- En el JSON de `concepto`, registrar los IDs usados: `"imagenes_ids": [823, 845, 867]`
- Usar `objectFit: "cover"` + `overflow: "hidden"`

#### Textos
- Vienen del libreto (skill nora-libreto-video)
- Mantener misma cantidad de palabras/caracteres para preservar ritmo visual

---

## PROCESO PARA CREAR NUEVA ESCENA

1. **Definir tipo**: ¿texto? ¿elemento visual? ¿interactivo? ¿transición?
2. **Elegir patrón de entrada** del catálogo (1A-1E)
3. **Elegir patrón de salida** si la escena lo necesita (2A-2E)
4. **Agregar efectos ambientales** si aplica (3A-3D)
5. **Configurar spring** según tabla del punto 6
6. **Definir duración** según tabla del punto 7
7. **Crear componente** siguiendo estructura base
8. **Registrar en Sequence** con nombre descriptivo y frame correcto
9. **Actualizar durationInFrames** en Root.tsx si cambia la duración total
10. **Preview en Studio** → render individual con `--frames` si Jorge no está en PC

## HERRAMIENTAS ÚTILES

```bash
# Render escena individual
npx remotion render EffectsBible out/test.mp4 --frames=START-END

# Render completo
npx remotion render EffectsBible out/output.mp4 --codec=h264 --concurrency=8

# Studio
npx remotion studio
```
