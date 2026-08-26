type ExperienceSculptureProps = {
  sourceCore?: boolean;
  variant: "source" | "return";
};

export function ExperienceSculpture({
  sourceCore = false,
  variant,
}: ExperienceSculptureProps) {
  return (
    <div
      className={`experience-sculpture experience-sculpture--${variant}`}
      aria-hidden="true"
    >
      <div className="experience-sculpture-rig">
        <span className="experience-sculpture-halo experience-sculpture-halo--wide" />
        <span className="experience-sculpture-halo experience-sculpture-halo--tight" />
        <span className="experience-sculpture-ring experience-sculpture-ring--back" />
        <span className="experience-sculpture-ring experience-sculpture-ring--middle" />
        <span className="experience-sculpture-ring experience-sculpture-ring--face" />
        <span className="experience-sculpture-rim" />
        <span className="experience-sculpture-core">
          {sourceCore ? <span className="experience-source-dot" /> : null}
        </span>
      </div>
    </div>
  );
}
