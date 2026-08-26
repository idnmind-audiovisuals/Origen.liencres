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

Copy `.env.example` to `.env.local` and set the three private access keys:

```env
ORIGEN_ACCESS_KEY=your-residency-key
ORIGEN_BROS_ACCESS_KEY=your-bros-key
ORIGEN_SPACE_ACCESS_KEY=your-space-key
```

Do not prefix these variables with `NEXT_PUBLIC_`. Validation and cookie signing run only on the server. `ORIGEN_ACCESS_KEY` opens `/residency`; `ORIGEN_BROS_ACCESS_KEY` opens `/bros`; and `ORIGEN_SPACE_ACCESS_KEY` opens `/space`. The access cookie is HTTP-only, signed, same-site, scoped to the selected destination, and lasts for the current browser session. A session for one destination cannot open another protected destination.

The Origen wordmark in the top-left corner securely clears the active session and returns to the opening gateway in development and production. Development builds also include the subtle `reset session` control.

## Origen symbol

The symbol shown in the gateway is rendered from responsive CSS circles, using the official outer-circle, inner-circle, and centre-dot proportions. No raster image is displayed in the animated composition, so the mark remains sharp at every size and through the full zoom transition.

`public/origen-favicon.png` is the browser metadata icon. It is not used by the gateway artwork.

## Motion timing

All phase delays, durations, easing, error feedback, success timing, and reduced-motion values live in `app/lib/gateway-motion.ts`.

## Invitation page

After the successful circle transition, `OpenedState` reveals the Origen Residency invitation. Accommodation, map, Typeform application, and WhatsApp interest destinations are defined as constants at the top of `app/components/OpenedState.tsx` so they can be changed without touching the layout.

The Residency and Space invitations link to the protected `/story` and `/vision` editorial pages. Those editorial routes accept either a Residency- or Space-scoped session and return to the invitation that opened them. The separate Spanish-only `/bros` page requires its own Bros-scoped signed cookie and includes the Google Forms application and private WhatsApp group destinations.

The unlocked invitation and editorial pages include an English/Spanish language control. English is the default, and the selected language is stored in the non-sensitive `origen_language` preference cookie so it remains consistent while navigating between pages. The password gateway itself remains unchanged.

`AccessGateway` accepts an optional `onOpened` callback and dispatches an `origen:opened` browser event after the circle zoom reaches its final black hold. The server response selects the authorized destination while the gateway keeps the same formation and zoom animations for both access keys.

Visitors without a valid session always begin at the black gateway frame. During the current browser session, returning to `/` redirects to the destination authorized by the signed cookie.
