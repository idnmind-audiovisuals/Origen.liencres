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

## Invitation page

After the successful circle transition, `OpenedState` reveals the Spain Residency invitation. Accommodation, map, Typeform application, and WhatsApp interest destinations are defined as constants at the top of `app/components/OpenedState.tsx` so they can be changed without touching the layout.

The invitation links to protected `/story` and `/vision` editorial pages. Both routes, along with `/residency`, verify the signed access cookie on the server and redirect unauthenticated visitors to the gateway.

The unlocked invitation and editorial pages include an English/Spanish language control. English is the default, and the selected language is stored in the non-sensitive `origen_language` preference cookie so it remains consistent while navigating between pages. The password gateway itself remains unchanged.

`AccessGateway` still accepts an optional `onOpened` callback and dispatches an `origen:opened` browser event after the circle zoom reaches its final black hold, allowing a future route transition or additional site shell to be connected later.

The signed HTTP-only session cookie is still created after successful validation for future protected routes. The gateway intentionally starts from its black opening frame on every page entry, so a reload never bypasses the cinematic animation or password form.
