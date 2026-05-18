import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

import { motionTokens } from "../motion";

type IconButtonProps = HTMLMotionProps<"button"> & {
  icon: LucideIcon;
  label: string;
};

export function IconButton({
  icon: Icon,
  label,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <motion.button
      aria-label={label}
      title={label}
      type={type}
      whileTap={{ scale: 0.96 }}
      transition={motionTokens.spring.soft}
      className={clsx("icon-button", className)}
      {...props}
    >
      <Icon size={18} />
    </motion.button>
  );
}
