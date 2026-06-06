# I.A.ma — Generador de Reportes Ejecutivos (beta)

Aplicación serverless: una página estática (`index.html`) que llama a una función
serverless (`api/analyze.js`) la cual protege tu API key de Anthropic.

```
iama-app/
├── index.html          ← la aplicación (frontend)
├── favicon.svg
├── api/
│   └── analyze.js      ← función serverless (proxy seguro a Anthropic)
├── package.json
├── vercel.json
├── .env.example
└── .gitignore
```

## Por qué esta arquitectura

La API key NUNCA debe estar en el navegador (cualquiera podría verla y gastar tu
cuenta). La función `api/analyze.js` corre en el servidor de Vercel, guarda la key
como variable de entorno secreta, y hace de intermediaria: el navegador le manda el
prompt, ella le añade la key y llama a Anthropic.

## Despliegue en Vercel (camino recomendado)

1. **Crea una cuenta** en https://vercel.com (gratis) y otra en
   https://console.anthropic.com para obtener tu API key.

2. **Sube el proyecto a GitHub.** Crea un repositorio y sube esta carpeta.
   (O usa la CLI de Vercel directamente: `npm i -g vercel` y luego `vercel`.)

3. **Importa el repo en Vercel:** New Project → selecciona tu repo → Deploy.
   Vercel detecta la carpeta `api/` automáticamente como funciones serverless.

4. **Configura la API key:** en el panel del proyecto, ve a
   Settings → Environment Variables y agrega:
   - Nombre: `ANTHROPIC_API_KEY`
   - Valor: tu key `sk-ant-...`
   Guarda y vuelve a desplegar (Deployments → Redeploy).

5. Listo. Tu página queda en `https://tu-proyecto.vercel.app`.
   Puedes conectar un dominio propio en Settings → Domains.

## Desarrollo local

```bash
npm i -g vercel
vercel dev          # corre frontend + funciones en http://localhost:3000
```
Crea un archivo `.env.local` con `ANTHROPIC_API_KEY=sk-ant-...` (no se sube a Git).

## Estado actual (beta)

- **Límite de uso:** 3 reportes gratis, contados en el navegador (localStorage).
  Es para validar el flujo, NO una barrera de seguridad. El conteo se reinicia si el
  usuario borra datos del navegador o usa otro dispositivo.
- **Pagos:** aún no integrados. El botón "Contratar" muestra un aviso.

## Próximos pasos (post-beta)

Para convertir esto en producto de pago real necesitarás:

1. **Cuentas de usuario** (login) — para que el límite viaje con la persona, no con
   el navegador. Opciones: Clerk, Auth0, Supabase Auth.
2. **Base de datos** — para guardar plan y consumo por usuario (Supabase, Postgres).
3. **Motor de pagos** — para México: Stripe, Mercado Pago o Conekta. El flujo:
   el usuario paga → el webhook del proveedor marca su cuenta como "pro" → el límite
   sube a 7/mes. El chequeo de límite debe moverse al servidor (a `api/analyze.js` o
   un endpoint nuevo), porque el del navegador es fácil de evadir.
4. **Rate limiting** en la función serverless para proteger tu costo de API.
