import { Card } from "../design-system/components/Card";
import { SectionHeading } from "../design-system/components/SectionHeading";
import { theme } from "../design-system/theme";

const typeScale = [
  "Title XL",
  "Title L",
  "Title M",
  "Body L",
  "Body M",
  "Body S",
  "Action S"
];

const palette = [
  ["Canvas", theme.colors.canvas],
  ["Surface", theme.colors.surface],
  ["Text", theme.colors.text],
  ["Muted", theme.colors.textMuted],
  ["Accent", theme.colors.accent],
  ["Danger", theme.colors.danger],
  ["Warning", theme.colors.warning],
  ["Info", theme.colors.info]
] as const;

export function SystemPage() {
  return (
    <div className="page-stack">
      <SectionHeading
        eyebrow="Mobile synthesis"
        title="Jano design system"
        detail="From Figma desktop source"
      />
      <Card className="stack">
        <p className="card__body">
          Primary font pair is carried forward from Figma: Figtree for display/body and Noto
          Sans as the supporting medical-content face.
        </p>
        <div className="type-ramp">
          {typeScale.map((item, index) => (
            <div key={item} className="type-ramp__row">
              <span className={`type-ramp__sample type-ramp__sample--${index}`}>
                {item} sample
              </span>
              <span className="type-ramp__label">{item}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="stack">
        <p className="card__body">
          Color tokens are adapted from the `Mode` collection in Figma into mobile surfaces and
          semantic states.
        </p>
        <div className="palette-grid">
          {palette.map(([label, value]) => (
            <div className="palette-chip" key={label}>
              <span className="palette-chip__swatch" style={{ background: value }} />
              <div>
                <p className="palette-chip__label">{label}</p>
                <p className="palette-chip__value">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
