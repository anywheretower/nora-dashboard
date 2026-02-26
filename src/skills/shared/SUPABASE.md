# Conexión Supabase — Configuración centralizada

## Endpoint
- **URL**: `https://fddokyfilokacsjdgiwe.supabase.co`
- **REST base**: `https://fddokyfilokacsjdgiwe.supabase.co/rest/v1/`

## Headers obligatorios
```
Authorization: Bearer <service_role_key>
apikey: <service_role_key>
Content-Type: application/json
```

## Encoding — OBLIGATORIO Node.js

Para insertar o actualizar en Supabase, usar **Node.js** (no PowerShell) para garantizar UTF-8 correcto. PowerShell corrompe tildes y caracteres especiales del español.

**Método**: Escribir el JSON a archivo y enviarlo con Node.js vía `https.request`.

## Charset
Todos los campos de texto en español deben ser **UTF-8**. Verificar tildes, ñ, signos ¿? ¡! antes de enviar.
