# Origen Liencres web

A responsive, cinematic home built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and resolution-independent circle geometry. The opening animation reveals the public home directly; it does not ask for a password.

## Installation

Use Node.js 22.13 or newer, then install and start the project:

```bash
npm install
npm run dev
```

The Sites production build is created with `npm run build`. Vercel uses the dedicated `npm run vercel-build` command through `vercel.json`, preserving its standard Next.js deployment flow.

## Environment

Copy `.env.example` to `.env.local` and configure only the private destinations that remain in use:

```env
ORIGEN_ACCESS_KEY=your-residency-key
ORIGEN_BROS_ACCESS_KEY=your-bros-key
ORIGEN_SPACE_ACCESS_KEY=your-space-key
ORIGEN_EXPERIENCE_ACCESS_KEY=your-experience-key
ORIGEN_HOSTS_ES_ACCESS_KEY=your-spanish-hosts-key
ORIGEN_HOSTS_EN_ACCESS_KEY=your-english-hosts-key
```

Do not prefix these variables with `NEXT_PUBLIC_`. Validation and cookie signing run only on the server. `/space`, `/experience`, `/retirobros` and the bilingual organisers’ circle remain private. `/circulo-de-hombres` and `/residency` are now public home-menu destinations; their former keys may remain configured without affecting public navigation.

Private-route access cookies remain HTTP-only, signed, same-site and destination-scoped. A session for one private destination cannot open another.

Configure the same server-only variables in Vercel for the desired environments and redeploy before testing on the live domain. Local environment changes are ignored by Git and do not update Vercel or Sites runtime settings.

The Origen wordmark on internal pages returns to the public home.

## Public organiser pages

The public discovery pages (`/retiros-cantabria` and `/retreats-spain`) link to an organiser section in their own language. These routes need no password or new environment variables:

| Intent | Spanish | English |
| --- | --- | --- |
| Venue details and suitability | `/espacio-retiros-cantabria` | `/retreat-venue-spain` |
| Organiser process and enquiry checklist | `/organizar-retiro` | `/host-your-retreat` |
| Retreat formats and practices | `/espacio-retiros` | — |
| Self-directed creative stays | — | `/creative-residency-spain` |

Content and page metadata live in `app/lib/organizer-content.ts`; `OrganizerLanding` shares the Space porcelain styling, scroll reveals, host enquiry form and existing home-return logo. Each page has its own canonical URL, description and entity-linked structured data. Only genuine language equivalents receive reciprocal hreflang links. All six routes are included once in the sitemap.

Enquiries use the existing host form and do not create bookings. Do not add pricing, services, grant funding or availability guarantees without confirmation from Origen.

## Private monthly organisers’ circle

`/retreat-organizers-circle` is the bilingual invitation to **Retreat Hosts**, a monthly online peer circle for retreat venue owners and organisers. Its server guard requires one of the two Hosts keys; neither a query string nor another destination’s session grants access. It is excluded from the sitemap and public organiser navigation, with no-index metadata and crawler exclusions.

It reuses the Bros slate theme, fixed background and scroll reveals. The top-right ES/EN control translates the whole page and persists the preference.

Meetings are on the first Tuesday of each month at 17:00 **Europe/Madrid** (mainland Spain local time, including daylight-saving changes). `app/lib/hosts-circle.ts` contains both translations, the proposed 90-minute flow and shared agreements. The joining section explicitly marks registration as not open yet, with a disabled form CTA until the owner supplies its destination. The footer Instagram icon remains a social link, not registration. No video-call link, price, confirmed start date or recurring automation is invented.

## Origen symbol

The symbol shown in the gateway is rendered from responsive CSS circles, using the official outer-circle, inner-circle, and centre-dot proportions. No raster image is displayed in the animated composition, so the mark remains sharp at every size and through the full zoom transition.

`public/origen-favicon.png` is the browser metadata icon. It is not used by the gateway artwork.

## Home and motion timing

The home menu links to the men’s circle, women’s circle, residencies, retreats and events. `app/components/HomeNavigation.tsx` owns the destinations. Formation delays, durations, easing and reduced-motion values live in `app/lib/gateway-motion.ts`.

## Invitation page

`OpenedState` presents the public Origen Residency invitation. Accommodation, map, Residency Google Forms application, Space application, and WhatsApp interest destinations are defined as constants at the top of `app/components/OpenedState.tsx` so they can be changed without touching the layout.

The Residency and Space invitations link to the protected `/story` and `/vision` editorial pages. The public Spanish-only `/circulo-de-hombres` page includes the Google Forms application and private WhatsApp group destinations. The legacy `/bros` address redirects to it.

The `/experience` route is a separate cinematic journey through Atlantic water, Costa Quebrada rock and coastline, and the pine forest of Liencres. Its scroll animation uses GSAP ScrollTrigger with Lenis, reverses naturally when scrolling upward, and falls back to a simplified static sequence for reduced-motion visitors.

The residency and editorial pages include an English/Spanish language control. The selected language is stored in the non-sensitive `origen_language` preference cookie. Every visitor returning to `/` sees the public animated home, even if a private-route cookie exists.
