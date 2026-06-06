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

## Despliegue en Vercel (camino recomendado)

1. **Crea una cuenta** en https://vercel.com (gratis) y otra en
   https://console.anthropic.com para obtener tu API key.

2. **Importa el repo en Vercel:** New Project → selecciona tu repo → Deploy.
   Vercel detecta la carpeta `api/` automáticamente como funciones serverless.

3. **Configura la API key:** en el panel del proyecto, ve a
   Settings → Environment Variables y agrega:
   - Nombre: `ANTHROPIC_API_KEY`
   - Valor: tu key `sk-ant-...`
   Guarda y vuelve a desplegar (Deployments → Redeploy).

4. Listo. La página queda en `https://tu-proyecto.vercel.app`.
   Puedes conectar un dominio propio en Settings → Domains.

## Desarrollo local

```bash
npm i -g vercel
vercel dev          # corre frontend + funciones en http://localhost:3000
```

## Estado actual (beta)

- **Límite de uso:** 3 reportes gratis, contados en el navegador (localStorage).
  Es para validar el flujo.
- **Pagos:** aún no integrados. El botón "Contratar" muestra un aviso.

## Próximos pasos (post-beta)

1. **Cuentas de usuario** (login) — para que el límite viaje con la persona, no con
   el navegador. Opciones: Clerk, Auth0, Supabase Auth.
2. **Base de datos** — para guardar plan y consumo por usuario (Supabase, Postgres).
3. **Motor de pagos** — para México: Stripe, Mercado Pago o Conekta. El flujo:
   el usuario paga → el webhook del proveedor marca su cuenta como "pro" → el límite
   sube a 7/mes. El chequeo de límite debe moverse al servidor (a `api/analyze.js` o
   un endpoint nuevo), porque el del navegador es fácil de evadir.
4. **Rate limiting** en la función serverless para proteger tu costo de API.
