type ExperienceSculptureProps = {
  variant: "source" | "return";
};

export function ExperienceSculpture({ variant }: ExperienceSculptureProps) {
  if (variant === "source") {
    return (
      <div
        className="experience-sculpture experience-sculpture--source"
        aria-hidden="true"
      >
        <div className="experience-sculpture-rig">
          <span className="experience-emblem-layer experience-emblem-layer--back" />
          <span className="experience-emblem-layer experience-emblem-layer--middle" />
          <span className="experience-emblem-layer experience-emblem-layer--face" />
          <span className="experience-emblem-core" />
          <span className="experience-source-dot" />
        </div>
      </div>
    );
  }

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
        <span className="experience-sculpture-core" />
      </div>
    </div>
  );
}
