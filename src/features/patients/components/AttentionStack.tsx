import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue
} from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, TriangleAlert } from "lucide-react";

import { Button } from "../../../design-system/components/Button";
import { Pill } from "../../../design-system/components/Pill";
import { motionTokens } from "../../../design-system/motion";

export type AttentionItem = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  detail: string;
  cta: string;
  tone: "danger" | "warning" | "success";
};

type AttentionStackProps = {
  items: AttentionItem[];
  onEmpty?: () => void;
};

const toneIcon = {
  danger: TriangleAlert,
  warning: Clock3,
  success: CheckCircle2
} as const;

const SWIPE_THRESHOLD = 180;

function StackPreviewCard({
  item,
  className,
  style
}: {
  item: AttentionItem;
  className: string;
  style: {
    scale: MotionValue<number>;
    y: MotionValue<number>;
    opacity: MotionValue<number>;
    zIndex: number;
  };
}) {
  const PreviewIcon = toneIcon[item.tone];

  return (
    <motion.article
      className={`${className} attention-card--${item.tone}`}
      style={style}
      aria-hidden="true"
    >
      <div className="attention-card__preview-orb">
        <div className="attention-card__icon">
          <PreviewIcon size={18} />
        </div>
      </div>
      <div className="attention-card__preview-footer">
        <div className={`attention-card__preview-line attention-card__preview-line--${item.tone}`} />
        <div className="attention-card__preview-line attention-card__preview-line--muted" />
      </div>
    </motion.article>
  );
}

export function AttentionStack({ items, onEmpty }: AttentionStackProps) {
  const [remainingItems, setRemainingItems] = useState(items);
  const [exitDirection, setExitDirection] = useState<"left" | "right">("right");
  const activeItem = remainingItems[0];
  const secondItem = remainingItems[1];
  const thirdItem = remainingItems[2];
  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-180, 0, 180], [-7, 0, 7]);
  const lift = useTransform(dragX, [-180, 0, 180], [8, 0, 8]);
  const revealProgress = useTransform(dragX, [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD], [1, 0, 1]);
  const secondScale = useTransform(revealProgress, [0, 1], [0.958, 0.986]);
  const secondY = useTransform(revealProgress, [0, 1], [18, 8]);
  const secondOpacity = useTransform(revealProgress, [0, 1], [0.9, 1]);
  const thirdScale = useTransform(revealProgress, [0, 1], [0.928, 0.962]);
  const thirdY = useTransform(revealProgress, [0, 1], [34, 18]);
  const thirdOpacity = useTransform(revealProgress, [0, 1], [0.74, 0.86]);
  const leftProgress = useTransform(dragX, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const rightProgress = useTransform(dragX, [0, SWIPE_THRESHOLD], [0, 1]);

  const countLabel = useMemo(
    () => `${items.length - remainingItems.length + 1} / ${items.length}`,
    [items.length, remainingItems.length]
  );

  function dismiss(direction: "left" | "right") {
    setExitDirection(direction);
    setRemainingItems((current) => {
      const next = current.slice(1);
      if (next.length === 0) {
        onEmpty?.();
      }
      return next;
    });
    dragX.set(0);
  }

  if (!activeItem) {
    return null;
  }

  const ActiveIcon = toneIcon[activeItem.tone];

  return (
    <div className="attention-stack">
      <div className="attention-stack__stage">
        {thirdItem ? (
          <StackPreviewCard
            item={thirdItem}
            className="attention-card attention-card--ghost attention-card--ghost-2"
            style={{ scale: thirdScale, y: thirdY, opacity: thirdOpacity, zIndex: 1 }}
          />
        ) : null}
        {secondItem ? (
          <StackPreviewCard
            item={secondItem}
            className="attention-card attention-card--ghost attention-card--ghost-1"
            style={{ scale: secondScale, y: secondY, opacity: secondOpacity, zIndex: 2 }}
          />
        ) : null}

        <AnimatePresence initial={false} mode="sync">
          <motion.article
            key={activeItem.id}
            className={`attention-card attention-card--${activeItem.tone}`}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            dragSnapToOrigin
            style={{ x: dragX, rotate, y: lift, zIndex: 3 }}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              x: exitDirection === "left" ? -380 : 380,
              rotate: exitDirection === "left" ? -12 : 12,
              y: 18
            }}
            transition={motionTokens.spring.sheet}
            onDragEnd={(_, info) => {
              if (info.offset.x <= -SWIPE_THRESHOLD) {
                dismiss("left");
                return;
              }

              if (info.offset.x >= SWIPE_THRESHOLD) {
                dismiss("right");
              }
            }}
          >
            <div className="attention-card__header">
              <div className="attention-card__icon">
                <ActiveIcon size={18} />
              </div>
              <div className="attention-card__meta">
                <p className="card__eyebrow">{activeItem.eyebrow}</p>
                <span className="attention-card__count">{countLabel}</span>
              </div>
            </div>

            <div className="attention-card__copy">
              <h3 className="attention-card__title">{activeItem.title}</h3>
              <p className="attention-card__body">{activeItem.body}</p>
            </div>

            <div className="attention-card__footer">
              <Pill tone={activeItem.tone}>{activeItem.detail}</Pill>
              <Button className="attention-card__cta" size="sm">
                {activeItem.cta}
              </Button>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="attention-stack__actions">
        <motion.button
          className="attention-stack__tertiary"
          type="button"
          onClick={() => dismiss("left")}
        >
          <motion.span
            className="attention-stack__tertiary-fill attention-stack__tertiary-fill--left"
            style={{ scaleX: leftProgress }}
          />
          <ArrowLeft size={14} />
          Keep unread
        </motion.button>
        <motion.button
          className="attention-stack__tertiary attention-stack__tertiary--right"
          type="button"
          onClick={() => dismiss("right")}
        >
          <motion.span
            className="attention-stack__tertiary-fill attention-stack__tertiary-fill--right"
            style={{ scaleX: rightProgress }}
          />
          Mark as read
          <ArrowRight size={14} />
        </motion.button>
      </div>
    </div>
  );
}
