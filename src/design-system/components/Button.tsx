import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import clsx from "clsx";

import { motionTokens } from "../motion";

type ButtonVariant = "primary" | "secondary" | "ghost" | "critical";
type ButtonSize = "sm" | "md";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={{ scale: 0.985 }}
        transition={motionTokens.spring.soft}
        className={clsx("button", `button--${variant}`, `button--${size}`, className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
