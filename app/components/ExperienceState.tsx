"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { GatewayBrandLink } from "./GatewayBrandLink";
import { InstagramLink } from "./InstagramLink";

type ExperienceStateProps = {
  development: boolean;
  onReset?: () => void;
};

const FOREST_WORDS = ["Move", "Play", "Create", "Rest", "Connect"] as const;
const COAST_WORDS = [
  "A place to move.",
  "A place to create.",
  "A place to connect.",
  "A place to be human.",
] as const;

export function ExperienceState({
  development,
  onReset,
}: ExperienceStateProps) {
  const pageRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!pageRef.current) return;
    pageRef.current.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    document.documentElement.lang = "en";
    document.title = "Origen — The Experience";
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    const journey = journeyRef.current;
    if (!page || !journey) return;
    const scrollContainer = page;
    const scrollContent = journey;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let disposeAnimations = () => {};

    async function initialiseJourney() {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (disposed) return () => {};

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        wrapper: scrollContainer,
        content: scrollContent,
        duration: 1.35,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.82,
        touchMultiplier: 1.1,
      });

      const updateScroll = () => ScrollTrigger.update();
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", updateScroll);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const context = gsap.context(() => {
        ScrollTrigger.defaults({ scroller: scrollContainer });

        gsap.to(".experience-source-dot", {
          scale: 13,
          ease: "none",
          scrollTrigger: {
            trigger: "#experience-source",
            start: "top top",
            end: "bottom top",
            scrub: 1.3,
          },
        });

        gsap.to(".experience-source-mark", {
          scale: 2.7,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#experience-source",
            start: "35% top",
            end: "bottom top",
            scrub: 1.1,
          },
        });

        gsap.to(".experience-ocean-image", {
          scale: 1.16,
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: "#experience-ocean",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        gsap.utils
          .toArray<HTMLElement>(".experience-ocean-line")
          .forEach((line) => {
            gsap.fromTo(
              line,
              { opacity: 0, y: 42, filter: "blur(8px)" },
              {
                opacity: 1,
                y: -24,
                filter: "blur(0px)",
                ease: "none",
                scrollTrigger: {
                  trigger: line,
                  start: "top 82%",
                  end: "bottom 28%",
                  scrub: 1.2,
                },
              },
            );
          });

        gsap.to(".experience-rock-image", {
          scale: 1.2,
          xPercent: -3,
          ease: "none",
          scrollTrigger: {
            trigger: "#experience-rock",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        gsap.fromTo(
          ".experience-rock-question",
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "none",
            scrollTrigger: {
              trigger: ".experience-rock-question",
              start: "top 76%",
              end: "top 32%",
              scrub: 1.1,
            },
          },
        );

        gsap.fromTo(
          ".experience-emergence-light",
          { scaleX: 0.015, opacity: 0.45 },
          {
            scaleX: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "#experience-emergence",
              start: "top top",
              end: "bottom top",
              scrub: 1.4,
            },
          },
        );

        gsap.to(".experience-coast-image", {
          xPercent: -7,
          scale: 1.14,
          ease: "none",
          scrollTrigger: {
            trigger: "#experience-coast",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.6,
          },
        });

        gsap.utils
          .toArray<HTMLElement>(".experience-coast-statement")
          .forEach((statement) => {
            gsap.fromTo(
              statement,
              { opacity: 0, y: 58 },
              {
                opacity: 1,
                y: -36,
                ease: "none",
                scrollTrigger: {
                  trigger: statement,
                  start: "top 84%",
                  end: "bottom 24%",
                  scrub: 1.25,
                },
              },
            );
          });

        const cliffTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: "#experience-cliff",
            start: "top top",
            end: "+=170%",
            pin: ".experience-cliff-inner",
            scrub: 1.5,
          },
        });
        cliffTimeline
          .fromTo(
            ".experience-cliff-question",
            { opacity: 0, y: 34, filter: "blur(9px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.42 },
          )
          .to(".experience-cliff-question", {
            opacity: 0,
            y: -26,
            filter: "blur(7px)",
            duration: 0.28,
          }, "+=0.28");

        gsap.fromTo(
          ".experience-mist",
          { opacity: 0 },
          {
            opacity: 0.94,
            ease: "none",
            scrollTrigger: {
              trigger: "#experience-crossing",
              start: "top 70%",
              end: "bottom 35%",
              scrub: 1.5,
            },
          },
        );

        gsap.to(".experience-forest-image", {
          scale: 1.17,
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: "#experience-forest",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.7,
          },
        });

        gsap.utils
          .toArray<HTMLElement>(".experience-forest-word")
          .forEach((word, index) => {
            gsap.fromTo(
              word,
              { opacity: 0, x: index % 2 === 0 ? -40 : 40 },
              {
                opacity: 1,
                x: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: word,
                  start: "top 82%",
                  end: "bottom 28%",
                  scrub: 1.3,
                },
              },
            );
          });

        gsap.fromTo(
          ".experience-return-symbol",
          { opacity: 0, scale: 0.35 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "#experience-return",
              start: "top 72%",
              end: "center 42%",
              scrub: 1.35,
            },
          },
        );
      }, scrollContent);

      ScrollTrigger.refresh();

      return () => {
        context.revert();
        gsap.ticker.remove(tick);
        lenis.off("scroll", updateScroll);
        lenis.destroy();
      };
    }

    void initialiseJourney().then((cleanup) => {
      if (disposed) cleanup();
      else disposeAnimations = cleanup;
    });

    return () => {
      disposed = true;
      disposeAnimations();
    };
  }, []);

  return (
    <main ref={pageRef} className="experience-page" lang="en">
      <p className="sr-only" role="status" aria-live="polite">
        Access granted. The Origen experience is open.
      </p>

      <header className="experience-header">
        <GatewayBrandLink
          className="experience-brand"
          label="Origen — return to the access gateway"
        />
        <div className="experience-location">
          <span aria-hidden="true" />
          Liencres · Cantabria
        </div>
      </header>

      <div ref={journeyRef} className="experience-journey">
        <section
          id="experience-source"
          className="experience-scene experience-source"
          aria-labelledby="experience-source-title"
        >
          <div className="experience-scene-sticky">
            <div className="experience-source-mark" aria-hidden="true">
              <span className="experience-source-orbit" />
              <span className="experience-source-dot" />
            </div>
            <div className="experience-source-copy">
              <p>Origen</p>
              <h1 id="experience-source-title">Volviendo a la esencia.</h1>
            </div>
            <p className="experience-scroll-cue">Scroll to enter</p>
          </div>
        </section>

        <section
          id="experience-ocean"
          className="experience-scene experience-ocean"
          aria-labelledby="experience-ocean-title"
        >
          <div className="experience-scene-image experience-ocean-image" aria-hidden="true" />
          <div className="experience-particles" aria-hidden="true" />
          <h2 id="experience-ocean-title" className="sr-only">Under the Atlantic</h2>
          <div className="experience-ocean-copy">
            <p className="experience-ocean-line">Before the noise.</p>
            <p className="experience-ocean-line">Before the roles.</p>
            <p className="experience-ocean-line">
              Before everything we learned to become.
            </p>
          </div>
        </section>

        <section
          id="experience-rock"
          className="experience-scene experience-rock"
          aria-labelledby="experience-rock-title"
        >
          <div className="experience-scene-image experience-rock-image" aria-hidden="true" />
          <div className="experience-rock-overlay" aria-hidden="true" />
          <div className="experience-rock-copy">
            <p>Layer by layer.</p>
            <h2 id="experience-rock-title" className="experience-rock-question">
              What remains when everything unnecessary falls away?
            </h2>
          </div>
        </section>

        <section
          id="experience-emergence"
          className="experience-scene experience-emergence"
          aria-labelledby="experience-emergence-title"
        >
          <div className="experience-emergence-light" aria-hidden="true" />
          <div className="experience-emergence-copy">
            <h2 id="experience-emergence-title">Come back to what is essential.</h2>
            <p>Liencres · Cantabria</p>
          </div>
        </section>

        <section
          id="experience-coast"
          className="experience-scene experience-coast"
          aria-labelledby="experience-coast-title"
        >
          <div className="experience-scene-image experience-coast-image" aria-hidden="true" />
          <div className="experience-coast-shade" aria-hidden="true" />
          <h2 id="experience-coast-title" className="sr-only">Costa Quebrada</h2>
          <div className="experience-coast-copy">
            {COAST_WORDS.map((statement) => (
              <p key={statement} className="experience-coast-statement">
                {statement}
              </p>
            ))}
          </div>
        </section>

        <section id="experience-cliff" className="experience-cliff">
          <div className="experience-cliff-inner">
            <div className="experience-scene-image experience-cliff-image" aria-hidden="true" />
            <p className="experience-cliff-question">
              What happens when we give ourselves permission to simply be?
            </p>
          </div>
        </section>

        <section id="experience-crossing" className="experience-crossing" aria-label="From ocean to forest">
          <div className="experience-scene-image experience-crossing-coast" aria-hidden="true" />
          <div className="experience-scene-image experience-crossing-forest" aria-hidden="true" />
          <div className="experience-mist" aria-hidden="true" />
        </section>

        <section
          id="experience-forest"
          className="experience-scene experience-forest"
          aria-labelledby="experience-forest-title"
        >
          <div className="experience-scene-image experience-forest-image" aria-hidden="true" />
          <div className="experience-forest-shade" aria-hidden="true" />
          <h2 id="experience-forest-title" className="sr-only">The forest</h2>
          <div className="experience-forest-words">
            {FOREST_WORDS.map((word) => (
              <p key={word} className="experience-forest-word">{word}</p>
            ))}
          </div>
        </section>

        <section
          id="experience-return"
          className="experience-scene experience-return"
          aria-labelledby="experience-return-title"
        >
          <div className="experience-scene-image experience-return-forest" aria-hidden="true" />
          <div className="experience-return-shade" aria-hidden="true" />
          <div className="experience-return-content">
            <div className="experience-return-symbol" aria-hidden="true">
              <span />
            </div>
            <p>Origen</p>
            <h2 id="experience-return-title">
              Un espacio para que la esencia emerja.
            </h2>
            <blockquote>
              Returning to the origin is not going backwards. It is removing
              layers until what is essential can emerge.
            </blockquote>
            <nav className="experience-return-links" aria-label="Origen links">
              <a href="#experience-source">Return to the source</a>
              <a
                href="https://www.instagram.com/origen.liencres/"
                target="_blank"
                rel="noreferrer"
              >
                Follow the journey <span aria-hidden="true">↗</span>
              </a>
            </nav>
            <InstagramLink />
          </div>
        </section>
      </div>

      {development && onReset ? (
        <button
          className="session-reset experience-session-reset"
          type="button"
          onClick={onReset}
        >
          reset session
        </button>
      ) : null}
    </main>
  );
}
