# Origen access gateway

A responsive, cinematic password gateway built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and resolution-independent circle geometry.

## Installation

Use Node.js 22.13 or newer, then install and start the project:

```bash
npm install
npm run dev
```

The Sites production build is created with `npm run build`. Vercel uses the dedicated `npm run vercel-build` command through `vercel.json`, preserving its standard Next.js deployment flow.

## Environment

Copy `.env.example` to `.env.local` and set the private access key:

```env
ORIGEN_ACCESS_KEY=your-private-key
```

Do not prefix this variable with `NEXT_PUBLIC_`. Validation and cookie signing run only on the server. The access cookie is HTTP-only, signed, same-site, and lasts for the current browser session.

In development, authenticated sessions can be cleared with the subtle `reset session` control on the opened screen. The reset endpoint is unavailable in production.

## Origen symbol

The symbol shown in the gateway is rendered from responsive CSS circles, using the official outer-circle, inner-circle, and centre-dot proportions. No raster image is displayed in the animated composition, so the mark remains sharp at every size and through the full zoom transition.

`public/origen-symbol.png` remains only as the browser metadata icon. It is not used by the gateway artwork.

## Motion timing

All phase delays, durations, easing, error feedback, success timing, and reduced-motion values live in `app/lib/gateway-motion.ts`.

## Connecting the future site

`AccessGateway` accepts an optional `onOpened` callback when it is mounted from a client component. It also dispatches an `origen:opened` browser event after the circle zoom reaches its final black hold. Replace `OpenedState` with the future site shell, call a router transition from `onOpened`, or listen for that event.

The server-rendered page verifies the signed session cookie before rendering. A visitor who reloads after opening will skip the password form for the rest of that browser session.
