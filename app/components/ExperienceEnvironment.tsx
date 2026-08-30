import type { CSSProperties } from "react";
import {
  ExperienceNaturalWorld,
  type NaturalWorldVariant,
} from "./ExperienceNaturalWorld";

type ExperienceEnvironmentVariant =
  | "ocean"
  | "rock"
  | "emergence"
  | "coast"
  | "cliff"
  | "crossing"
  | "forest"
  | "return";

type ExperienceEnvironmentProps = {
  variant: ExperienceEnvironmentVariant;
  className?: string;
};

const FAR_FORMS = Array.from({ length: 5 }, (_, index) => index);
const MID_FORMS = Array.from({ length: 7 }, (_, index) => index);
const NEAR_FORMS = Array.from({ length: 6 }, (_, index) => index);
const LINES = Array.from({ length: 8 }, (_, index) => index);
const PARTICLES = Array.from({ length: 16 }, (_, index) => index);
const SEA_STACKS = Array.from({ length: 7 }, (_, index) => index);
const ROCK_STRATA = Array.from({ length: 9 }, (_, index) => index);
const CANOPY_FORMS = Array.from({ length: 12 }, (_, index) => index);
const FOREST_BRANCHES = Array.from({ length: 14 }, (_, index) => index);

function indexedStyle(index: number): CSSProperties {
  return {
    "--i": index,
    "--line-inset": `${index * 4.2}%`,
    "--line-alpha": Math.max(0.05, 0.19 - index * 0.014),
    "--rock-line-alpha": Math.max(0.06, 0.28 - index * 0.022),
    "--light-line-alpha": Math.max(0.05, 0.16 - index * 0.012),
    "--line-z": `${index * 18}px`,
  } as CSSProperties;
}

function formStyle(index: number, depth: number): CSSProperties {
  const turn = -28 + ((index * 31 + depth * 9) % 58);

  return {
    "--i": index,
    "--x": `${8 + ((index * 29 + depth * 17) % 86)}%`,
    "--y": `${12 + ((index * 37 + depth * 23) % 76)}%`,
    "--z": `${-220 + depth * 150 + (index % 4) * 42}px`,
    "--turn": `${turn}deg`,
    "--lean": `${turn * 0.2}deg`,
    "--light-x": `${38 + index * 2}%`,
    "--form-opacity": 0.18 + index * 0.045,
    "--form-blur": `${index * 0.25}px`,
    "--coast-x": `${-4 + index * 19}%`,
    "--coast-y": `${52 + index * 4}%`,
    "--forest-x": `${-3 + index * 18.5}%`,
    "--crossing-x": `${-2 + index * 18}%`,
  } as CSSProperties;
}

function particleStyle(index: number): CSSProperties {
  return {
    "--i": index,
    "--x": `${4 + ((index * 43) % 92)}%`,
    "--y": `${5 + ((index * 31) % 88)}%`,
    "--z": `${60 + (index % 5) * 44}px`,
    "--delay": `${(index % 8) * -0.72}s`,
  } as CSSProperties;
}

function seaStackStyle(index: number): CSSProperties {
  const turn = -18 + ((index * 13) % 34);

  return {
    "--i": index,
    "--stack-x": `${10 + ((index * 17) % 78)}%`,
    "--stack-y": `${56 + ((index * 7) % 25)}%`,
    "--stack-z": `${-110 + (index % 4) * 78}px`,
    "--stack-width": `${42 + (index % 3) * 22}px`,
    "--stack-height": `${94 + ((index * 31) % 126)}px`,
    "--stack-turn": `${turn}deg`,
    "--stack-lean": `${turn * 0.22}deg`,
  } as CSSProperties;
}

function strataStyle(index: number): CSSProperties {
  return {
    "--i": index,
    "--strata-y": `${48 + index * 4.4}%`,
    "--strata-z": `${-90 + index * 24}px`,
    "--strata-turn": `${-16 + index * 1.4}deg`,
  } as CSSProperties;
}

function canopyStyle(index: number): CSSProperties {
  return {
    "--i": index,
    "--canopy-x": `${-3 + ((index * 23) % 108)}%`,
    "--canopy-y": `${-8 + ((index * 17) % 42)}%`,
    "--canopy-z": `${-130 + (index % 5) * 74}px`,
    "--canopy-size": `${150 + (index % 4) * 72}px`,
    "--canopy-turn": `${-24 + (index % 8) * 7}deg`,
  } as CSSProperties;
}

function branchStyle(index: number): CSSProperties {
  const fromLeft = index % 2 === 0;

  return {
    "--i": index,
    "--branch-left": fromLeft ? "-9%" : `${48 + ((index * 11) % 34)}%`,
    "--branch-top": `${-2 + ((index * 13) % 46)}%`,
    "--branch-z": `${-50 + (index % 5) * 58}px`,
    "--branch-width": `${42 + ((index * 17) % 38)}%`,
    "--branch-turn": `${fromLeft ? -8 + (index % 4) * 7 : 188 - (index % 4) * 8}deg`,
    "--twig-turn": `${22 + (index % 5) * 4}deg`,
  } as CSSProperties;
}

export function ExperienceEnvironment({
  variant,
  className = "",
}: ExperienceEnvironmentProps) {
  const hasCoastGeometry = ["coast", "cliff", "crossing"].includes(variant);
  const hasForestGeometry = ["forest", "return", "crossing"].includes(variant);
  const hasNaturalWorld = [
    "ocean",
    "coast",
    "cliff",
    "crossing",
    "forest",
    "return",
  ].includes(variant);

  return (
    <div
      className={`experience-world experience-world--${variant} ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="experience-world-scroll">
        <div className="experience-world-camera">
          <span className="experience-world-ambient" />
          <span className="experience-world-light" />

          {hasNaturalWorld ? (
            <ExperienceNaturalWorld variant={variant as NaturalWorldVariant} />
          ) : null}

          {hasCoastGeometry ? (
            <div className="experience-coast-geometry">
              <span className="experience-tidal-surface" />
              <div className="experience-rock-strata">
                {ROCK_STRATA.map((index) => (
                  <span key={index} style={strataStyle(index)} />
                ))}
              </div>
              <div className="experience-sea-stacks">
                {SEA_STACKS.map((index) => (
                  <span key={index} style={seaStackStyle(index)} />
                ))}
              </div>
            </div>
          ) : null}

          {hasForestGeometry ? (
            <div className="experience-forest-geometry">
              <span className="experience-forest-path" />
              <div className="experience-forest-canopy">
                {CANOPY_FORMS.map((index) => (
                  <span key={index} style={canopyStyle(index)} />
                ))}
              </div>
              <div className="experience-forest-branches">
                {FOREST_BRANCHES.map((index) => (
                  <span key={index} style={branchStyle(index)} />
                ))}
              </div>
            </div>
          ) : null}

          <div className="experience-world-depth experience-world-depth--far">
            <span className="experience-world-plane" />
            {FAR_FORMS.map((index) => (
              <span
                key={`far-${index}`}
                className="experience-world-form"
                style={formStyle(index, 0)}
              />
            ))}
          </div>

          <div className="experience-world-depth experience-world-depth--mid">
            {MID_FORMS.map((index) => (
              <span
                key={`mid-${index}`}
                className="experience-world-form"
                style={formStyle(index, 1)}
              />
            ))}
            <div className="experience-world-lines">
              {LINES.map((index) => (
                <span key={index} style={indexedStyle(index)} />
              ))}
            </div>
          </div>

          <div className="experience-world-depth experience-world-depth--near">
            {NEAR_FORMS.map((index) => (
              <span
                key={`near-${index}`}
                className="experience-world-form"
                style={formStyle(index, 2)}
              />
            ))}
            <div className="experience-world-particles">
              {PARTICLES.map((index) => (
                <span key={index} style={particleStyle(index)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
