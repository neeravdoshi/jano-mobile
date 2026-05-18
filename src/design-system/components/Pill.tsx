import clsx from "clsx";
import type { PropsWithChildren } from "react";

type PillProps = PropsWithChildren<{
  tone?: "neutral" | "success" | "warning" | "danger";
}>;

export function Pill({ children, tone = "neutral" }: PillProps) {
  return <span className={clsx("pill", `pill--${tone}`)}>{children}</span>;
}
