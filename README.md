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

Copy `.env.example` to `.env.local` and set the six private access keys:

```env
ORIGEN_ACCESS_KEY=your-residency-key
ORIGEN_BROS_ACCESS_KEY=your-bros-key
ORIGEN_SPACE_ACCESS_KEY=your-space-key
ORIGEN_EXPERIENCE_ACCESS_KEY=your-experience-key
ORIGEN_HOSTS_ES_ACCESS_KEY=your-spanish-hosts-key
ORIGEN_HOSTS_EN_ACCESS_KEY=your-english-hosts-key
```

Do not prefix these variables with `NEXT_PUBLIC_`. Validation and cookie signing run only on the server. `ORIGEN_ACCESS_KEY` opens `/residency`; `ORIGEN_BROS_ACCESS_KEY` opens `/circulo-de-hombres`; `ORIGEN_SPACE_ACCESS_KEY` opens `/space`; and `ORIGEN_EXPERIENCE_ACCESS_KEY` opens `/experience`. The two `ORIGEN_HOSTS_…` keys open `/retreat-organizers-circle?lang=es` and `/retreat-organizers-circle?lang=en`, respectively. All keys ignore letter case and surrounding whitespace. Keep the configured values distinct.

The access cookie is HTTP-only, signed, same-site, scoped to the selected destination, and lasts for the current browser session. A session for one destination cannot open another protected destination. Both Hosts scopes authorize the same circle, including its language toggle. The Hosts password selects the initial language even if an older language preference exists.

Configure the same server-only variables in Vercel for the desired environments and redeploy before testing on the live domain. Local environment changes are ignored by Git and do not update Vercel or Sites runtime settings.

The Origen wordmark in the top-left corner securely clears the active session and returns to the opening gateway in development and production. Development builds also include the subtle `reset session` control.

## Public organiser pages

The public discovery pages (`/retiros-cantabria` and `/retreats-spain`) link to an organiser section in their own language. These routes need no password or new environment variables:

| Intent | Spanish | English |
| --- | --- | --- |
| Venue details and suitability | `/espacio-retiros-cantabria` | `/retreat-venue-spain` |
| Organiser process and enquiry checklist | `/organizar-retiro` | `/host-your-retreat` |
| Retreat formats and practices | `/espacio-retiros` | — |
| Self-directed creative stays | — | `/creative-residency-spain` |

Content and page metadata live in `app/lib/organizer-content.ts`; `OrganizerLanding` shares the Space porcelain styling, scroll reveals, host enquiry form and existing gateway-return logo. Each page has its own canonical URL, description and entity-linked structured data. Only genuine language equivalents receive reciprocal hreflang links. All six routes are included once in the sitemap. They do not change access to `/space`, `/experience`, `/residency` or the men's circle.

Enquiries use the existing host form and do not create bookings. Do not add pricing, services, grant funding or availability guarantees without confirmation from Origen.

## Private monthly organisers’ circle

`/retreat-organizers-circle` is the bilingual invitation to **Origen Hosts**, a monthly online peer circle for retreat venue owners and organisers. Its server guard requires one of the two Hosts keys; neither a query string nor another destination’s session grants access. It is excluded from the sitemap and public organiser navigation, with no-index metadata and crawler exclusions.

It reuses the Bros slate theme, fixed background and scroll reveals without changing Bros access. Both full-motion and reduced-motion gateways reveal the circle after their existing success transition. The top-right ES/EN control translates the whole page and persists the preference.

Meetings are on the first Tuesday of each month at 17:00 **Europe/Madrid** (mainland Spain local time, including daylight-saving changes). `app/lib/hosts-circle.ts` contains both translations, the proposed 90-minute flow and shared agreements. The joining section explicitly marks registration as not open yet, with a disabled form CTA until the owner supplies its destination. The footer Instagram icon remains a social link, not registration. No video-call link, price, confirmed start date or recurring automation is invented.

## Origen symbol

The symbol shown in the gateway is rendered from responsive CSS circles, using the official outer-circle, inner-circle, and centre-dot proportions. No raster image is displayed in the animated composition, so the mark remains sharp at every size and through the full zoom transition.

`public/origen-favicon.png` is the browser metadata icon. It is not used by the gateway artwork.

## Motion timing

All phase delays, durations, easing, error feedback, success timing, and reduced-motion values live in `app/lib/gateway-motion.ts`.

## Invitation page

After the successful circle transition, `OpenedState` reveals the Origen Residency invitation. Accommodation, map, Residency Google Forms application, Space application, and WhatsApp interest destinations are defined as constants at the top of `app/components/OpenedState.tsx` so they can be changed without touching the layout.

The Residency and Space invitations link to the protected `/story` and `/vision` editorial pages. Those editorial routes accept either a Residency- or Space-scoped session and return to the invitation that opened them. The separate Spanish-only `/circulo-de-hombres` page requires its own Bros-scoped signed cookie and includes the Google Forms application and private WhatsApp group destinations. The legacy `/bros` address redirects to it.

The `/experience` route is a separate cinematic journey through Atlantic water, Costa Quebrada rock and coastline, and the pine forest of Liencres. Its scroll animation uses GSAP ScrollTrigger with Lenis, reverses naturally when scrolling upward, and falls back to a simplified static sequence for reduced-motion visitors.

The unlocked invitation and editorial pages include an English/Spanish language control. English is the default, and the selected language is stored in the non-sensitive `origen_language` preference cookie so it remains consistent while navigating between pages. The password gateway itself remains unchanged.

`AccessGateway` accepts an optional `onOpened` callback and dispatches an `origen:opened` browser event after the circle zoom reaches its final black hold. The server response selects the authorized destination while the gateway keeps the same formation and zoom animations for all access keys.

Visitors without a valid session always begin at the black gateway frame. During the current browser session, returning to `/` redirects to the destination authorized by the signed cookie.
