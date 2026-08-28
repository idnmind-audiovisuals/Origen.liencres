type ExperienceSculptureProps = {
  variant: "source" | "return";
};

export function ExperienceSculpture({ variant }: ExperienceSculptureProps) {
  return (
    <div
      className={`experience-sculpture experience-sculpture--${variant}`}
      aria-hidden="true"
    >
      <div className="experience-sculpture-rig">
        <span className="experience-emblem-layer experience-emblem-layer--back" />
        <span className="experience-emblem-layer experience-emblem-layer--middle" />
        <span className="experience-emblem-layer experience-emblem-layer--face" />
        <span
          className={
            variant === "source"
              ? "experience-source-dot"
              : "experience-return-dot"
          }
        />
      </div>
    </div>
  );
}
