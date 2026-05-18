import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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

const MIN_SWIPE_THRESHOLD = 96;
const MAX_SWIPE_THRESHOLD = 144;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function StackPreviewCard({
  item,
  className,
  style
}: {
  item: AttentionItem;
  className: string;
  style: {
    scale: number;
    y: number;
    opacity: number;
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
  const [dragX, setDragX] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const activeItem = remainingItems[0];
  const secondItem = remainingItems[1];
  const thirdItem = remainingItems[2];
  const swipeThreshold = useMemo(() => {
    if (stageWidth <= 0) {
      return 120;
    }

    return clamp(stageWidth * 0.34, MIN_SWIPE_THRESHOLD, MAX_SWIPE_THRESHOLD);
  }, [stageWidth]);
  const revealProgress = Math.min(Math.abs(dragX) / swipeThreshold, 1);
  const leftProgress = dragX < 0 ? revealProgress : 0;
  const rightProgress = dragX > 0 ? revealProgress : 0;
  const rotate = clamp((dragX / swipeThreshold) * 5.5, -5.5, 5.5);
  const activeY = revealProgress * 4;
  const secondScale = 0.968 + revealProgress * 0.018;
  const secondY = 14 - revealProgress * 8;
  const secondOpacity = 0.92 + revealProgress * 0.08;
  const thirdScale = 0.942 + revealProgress * 0.014;
  const thirdY = 26 - revealProgress * 10;
  const thirdOpacity = 0.76 + revealProgress * 0.08;

  const countLabel = useMemo(
    () => `${items.length - remainingItems.length + 1} / ${items.length}`,
    [items.length, remainingItems.length]
  );

  useEffect(() => {
    const element = stageRef.current;
    if (!element) {
      return;
    }

    const updateWidth = () => {
      setStageWidth(element.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  function dismiss(direction: "left" | "right") {
    setExitDirection(direction);
    setRemainingItems((current) => {
      const next = current.slice(1);
      if (next.length === 0) {
        onEmpty?.();
      }
      return next;
    });
    setDragX(0);
  }

  if (!activeItem) {
    return null;
  }

  const ActiveIcon = toneIcon[activeItem.tone];

  return (
    <div className="attention-stack">
      <div className="attention-stack__stage" ref={stageRef}>
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
            dragElastic={0.08}
            dragMomentum={false}
            dragSnapToOrigin
            style={{ x: dragX, rotate, y: activeY, zIndex: 3 }}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              x: exitDirection === "left" ? -stageWidth - 80 : stageWidth + 80,
              rotate: exitDirection === "left" ? -10 : 10,
              y: 18
            }}
            transition={motionTokens.spring.sheet}
            onDrag={(_, info) => {
              setDragX(info.offset.x);
            }}
            onDragEnd={(_, info) => {
              if (info.offset.x <= -swipeThreshold) {
                dismiss("left");
                return;
              }

              if (info.offset.x >= swipeThreshold) {
                dismiss("right");
                return;
              }

              setDragX(0);
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
