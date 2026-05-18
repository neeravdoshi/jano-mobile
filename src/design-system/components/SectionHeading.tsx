type SectionHeadingProps = {
  eyebrow?: string;
  title?: string;
  detail?: string;
};

export function SectionHeading({ detail, eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      {title || detail ? (
        <div className="section-heading__row">
          {title ? <h2>{title}</h2> : null}
          {detail ? <span className="section-heading__detail">{detail}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
