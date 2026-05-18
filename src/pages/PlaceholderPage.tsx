import { Card } from "../design-system/components/Card";
import { SectionHeading } from "../design-system/components/SectionHeading";

type PlaceholderPageProps = {
  eyebrow: string;
  message: string;
  title: string;
};

export function PlaceholderPage({ eyebrow, message, title }: PlaceholderPageProps) {
  return (
    <div className="page-stack">
      <SectionHeading eyebrow={eyebrow} title={title} detail="Placeholder" />
      <Card>
        <p className="card__body">{message}</p>
      </Card>
    </div>
  );
}
