import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";

import { motionTokens } from "../design-system/motion";

export type BottomNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  disabled?: boolean;
};

type BottomNavProps = {
  items: BottomNavItem[];
  centerAction: {
    label: string;
    icon: LucideIcon;
    onPress: () => void;
  };
};

export function BottomNav({ centerAction, items }: BottomNavProps) {
  const leftItems = items.slice(0, 2);
  const rightItems = items.slice(2);
  const CenterIcon = centerAction.icon;

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bottom-nav__group">
        {leftItems.map((item) => {
          const Icon = item.icon;
          if (item.disabled) {
            return (
              <span
                key={item.to}
                className="bottom-nav__item bottom-nav__item--disabled"
                aria-disabled="true"
              >
                <Icon size={19} strokeWidth={2} />
                <span>{item.label}</span>
              </span>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                clsx("bottom-nav__item", isActive && "bottom-nav__item--active")
              }
            >
              <Icon size={19} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <motion.button
        type="button"
        aria-label={centerAction.label}
        className="bottom-nav__center"
        whileTap={{ scale: 0.95 }}
        transition={motionTokens.spring.soft}
        onClick={centerAction.onPress}
      >
        <CenterIcon size={22} strokeWidth={2.25} />
      </motion.button>

      <div className="bottom-nav__group bottom-nav__group--right">
        {rightItems.map((item) => {
          const Icon = item.icon;
          if (item.disabled) {
            return (
              <span
                key={item.to}
                className="bottom-nav__item bottom-nav__item--disabled"
                aria-disabled="true"
              >
                <Icon size={19} strokeWidth={2} />
                <span>{item.label}</span>
              </span>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx("bottom-nav__item", isActive && "bottom-nav__item--active")
              }
            >
              <Icon size={19} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
