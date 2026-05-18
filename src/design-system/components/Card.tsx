import clsx from "clsx";
import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
  tone?: "default" | "soft" | "accent";
}>;

export function Card({ children, className, tone = "default" }: CardProps) {
  return <section className={clsx("card", `card--${tone}`, className)}>{children}</section>;
}
