import type { CSSProperties } from "react";

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

export function ExperienceEnvironment({
  variant,
  className = "",
}: ExperienceEnvironmentProps) {
  return (
    <div
      className={`experience-world experience-world--${variant} ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="experience-world-scroll">
        <div className="experience-world-camera">
          <span className="experience-world-ambient" />
          <span className="experience-world-light" />

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
