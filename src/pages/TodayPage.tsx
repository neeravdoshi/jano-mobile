import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  FlaskConical,
  FileText,
  NotebookText,
  Pill as PillIcon,
  Plus,
  ScanText,
  SlidersHorizontal,
  Droplets,
  Search,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Card } from "../design-system/components/Card";
import { IconButton } from "../design-system/components/IconButton";
import { SectionHeading } from "../design-system/components/SectionHeading";
import { motionTokens } from "../design-system/motion";
import {
  AttentionStack,
  type AttentionItem
} from "../features/patients/components/AttentionStack";
import { patients } from "../fixtures/patients";

type QuickActionIconProps = {
  size?: number;
};

const QUICK_ICON_PRIMARY = "var(--color-danger)";
const QUICK_ICON_SECONDARY = "color-mix(in srgb, var(--color-danger) 40%, transparent)";

function QuickPillsIcon({ size = 18 }: QuickActionIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g opacity="0.4">
        <path fillRule="evenodd" clipRule="evenodd" d="M5.28662 9.40614C5.46416 9.18799 5.78665 9.15916 6.00007 9.34236L11.171 13.7808C11.3767 13.9574 11.4043 14.2656 11.2332 14.4758L9.40061 16.7281C8.74061 17.5381 7.81061 18.0481 6.77061 18.1481C6.64061 18.1581 6.51061 18.1681 6.38061 18.1681C5.49061 18.1681 4.62061 17.8581 3.92061 17.2681C2.26061 15.8981 2.02061 13.4281 3.38061 11.7481L5.28662 9.40614Z" fill={QUICK_ICON_SECONDARY} />
        <path fillRule="evenodd" clipRule="evenodd" d="M14.7307 10.1881L12.8056 12.5495C12.6277 12.7678 12.3046 12.7961 12.0914 12.612L6.92848 8.15555C6.72366 7.97876 6.69664 7.67111 6.86749 7.46132L8.71067 5.19807C9.38067 4.38807 10.3107 3.88807 11.3507 3.78807C12.3807 3.69807 13.4007 3.99807 14.2007 4.66807C15.8607 6.03807 16.1007 8.50807 14.7307 10.1881Z" fill={QUICK_ICON_SECONDARY} />
      </g>
      <path fillRule="evenodd" clipRule="evenodd" d="M19.3029 12.2355C19.5669 12.3832 19.5914 12.739 19.3784 12.9538L14.2894 18.086C14.0742 18.3029 13.7142 18.2782 13.5665 18.0107C13.2304 17.4016 13.0408 16.7031 13.0408 15.968C13.0408 13.618 14.9408 11.708 17.2708 11.708C18.0071 11.708 18.7006 11.8982 19.3029 12.2355Z" fill={QUICK_ICON_PRIMARY} />
      <path fillRule="evenodd" clipRule="evenodd" d="M21.5008 15.9681C21.5008 18.3181 19.6008 20.2281 17.2708 20.2281C16.6342 20.2281 16.0312 20.0878 15.4912 19.8283C15.2094 19.6929 15.1742 19.3233 15.3946 19.1014L20.3765 14.0854C20.6003 13.86 20.9766 13.8981 21.1101 14.1863C21.3623 14.7305 21.5008 15.3354 21.5008 15.9681Z" fill={QUICK_ICON_PRIMARY} />
    </svg>
  );
}

function QuickGraphLineIcon({ size = 18 }: QuickActionIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M16.218 2.5H7.784C4.623 2.5 2.5 4.723 2.5 8.03V15.97C2.5 19.277 4.623 21.5 7.784 21.5H16.217C19.377 21.5 21.5 19.277 21.5 15.97V8.03C21.5 4.723 19.378 2.5 16.218 2.5Z" fill={QUICK_ICON_SECONDARY} />
      <path fillRule="evenodd" clipRule="evenodd" d="M17.248 9.97789L14.336 13.7579C14.214 13.9159 14.034 14.0189 13.836 14.0439C13.637 14.0669 13.437 14.0139 13.28 13.8909L10.551 11.7549L8.163 14.8309C8.015 15.0209 7.794 15.1209 7.569 15.1209C7.409 15.1209 7.247 15.0689 7.11 14.9629C6.783 14.7079 6.724 14.2379 6.977 13.9109L9.827 10.2409C9.95 10.0829 10.13 9.98089 10.328 9.95689C10.523 9.93089 10.725 9.98789 10.882 10.1099L13.609 12.2439L16.061 9.06189C16.312 8.73589 16.782 8.67089 17.112 8.92589C17.44 9.17789 17.501 9.64989 17.248 9.97789Z" fill={QUICK_ICON_PRIMARY} />
    </svg>
  );
}

function QuickDocumentPencilIcon({ size = 18 }: QuickActionIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M11.6682 14.6304H6.9392C6.5242 14.6304 6.1892 14.2944 6.1892 13.8804C6.1892 13.4664 6.5242 13.1304 6.9392 13.1304H11.6682C12.0822 13.1304 12.4182 13.4664 12.4182 13.8804C12.4182 14.2944 12.0822 14.6304 11.6682 14.6304ZM6.9382 9.00236H9.4072C9.8212 9.00236 10.1572 9.33836 10.1572 9.75236C10.1572 10.1664 9.8212 10.5024 9.4072 10.5024H6.9382C6.5232 10.5024 6.1882 10.1664 6.1882 9.75236C6.1882 9.33836 6.5232 9.00236 6.9382 9.00236ZM14.9952 13.3664C15.8352 11.9074 17.7062 11.4044 19.1692 12.2464L19.9492 12.6974C19.9812 12.7154 20.0062 12.7404 20.0362 12.7604V9.09836C20.0362 8.85536 19.8432 8.66036 19.6022 8.66036H16.6402C14.8742 8.65036 13.4172 7.18836 13.4172 5.40536V2.26636C13.4172 2.02336 13.2242 1.81836 12.9732 1.81836H7.8202C5.4182 1.81836 3.4682 3.79636 3.4682 6.21336V16.7194C3.4682 19.2534 5.5142 21.3104 8.0232 21.3104H12.3572C12.3192 21.1964 12.2742 21.0854 12.2502 20.9664L12.1162 20.2974C11.9322 19.3654 12.0912 18.3984 12.5652 17.5734L14.9952 13.3664Z" fill={QUICK_ICON_SECONDARY} />
      <path fillRule="evenodd" clipRule="evenodd" d="M18.9916 15.7314L16.5636 19.9364C16.4216 20.1824 16.1946 20.3684 15.9276 20.4604L15.2526 20.6664L15.1186 19.9944C15.0636 19.7164 15.1116 19.4264 15.2536 19.1804L17.6816 14.9744C17.7386 14.8764 17.8426 14.8214 17.9476 14.8214C17.9996 14.8214 18.0526 14.8344 18.0996 14.8624L18.8796 15.3124C19.0256 15.3974 19.0756 15.5854 18.9916 15.7314ZM19.6296 14.0134L18.8486 13.5634C17.9896 13.0664 16.8816 13.3624 16.3836 14.2244L13.9536 18.4314C13.6306 18.9934 13.5216 19.6524 13.6476 20.2874L13.7816 20.9584C13.8656 21.3874 14.1326 21.7584 14.5116 21.9784C14.7446 22.1124 15.0076 22.1814 15.2706 22.1814C15.4346 22.1814 15.5986 22.1544 15.7576 22.1014L16.4086 21.8804C17.0216 21.6714 17.5386 21.2484 17.8626 20.6864L20.2916 16.4804C20.7876 15.6174 20.4906 14.5114 19.6296 14.0134Z" fill={QUICK_ICON_PRIMARY} />
      <path fillRule="evenodd" clipRule="evenodd" d="M11.6682 14.63H6.9392C6.5242 14.63 6.1892 14.294 6.1892 13.88C6.1892 13.466 6.5242 13.13 6.9392 13.13H11.6682C12.0822 13.13 12.4182 13.466 12.4182 13.88C12.4182 14.294 12.0822 14.63 11.6682 14.63ZM6.9382 9.00195H9.4072C9.8212 9.00195 10.1572 9.33795 10.1572 9.75195C10.1572 10.166 9.8212 10.502 9.4072 10.502H6.9382C6.5232 10.502 6.1882 10.166 6.1882 9.75195C6.1882 9.33795 6.5232 9.00195 6.9382 9.00195Z" fill={QUICK_ICON_PRIMARY} />
      <path fillRule="evenodd" clipRule="evenodd" d="M16.7683 7.2362C17.4413 7.2432 18.3763 7.2462 19.1693 7.2432C19.5753 7.2422 19.7813 6.7522 19.5003 6.4562C18.9913 5.9222 18.2823 5.1772 17.5703 4.4292C16.8553 3.6782 16.1373 2.9242 15.6153 2.3762C15.3263 2.0732 14.8223 2.2812 14.8223 2.7012V5.2702C14.8223 6.3482 15.7013 7.2362 16.7683 7.2362Z" fill={QUICK_ICON_PRIMARY} />
    </svg>
  );
}

function QuickNotebookIcon({ size = 18 }: QuickActionIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path opacity="0.4" d="M16.8458 21.5019H7.15379C5.69579 21.5019 4.50879 20.3169 4.50879 18.8619V6.70194C4.50879 5.81294 5.10679 5.04294 5.96279 4.82694L14.6948 2.56694C15.3448 2.39994 16.0208 2.53994 16.5498 2.94994C17.0798 3.36094 17.3838 3.98094 17.3838 4.65194V5.54859C17.3838 5.71428 17.2495 5.84859 17.0838 5.84859H8.07104C7.79504 5.84859 7.57104 6.07259 7.57104 6.34859C7.57104 6.62459 7.79504 6.84859 8.07104 6.84859H17.3604C17.3812 6.84859 17.402 6.8507 17.4223 6.85522C18.6041 7.11876 19.4908 8.17357 19.4908 9.43194V18.8619C19.4908 20.3169 18.3048 21.5019 16.8458 21.5019Z" fill={QUICK_ICON_SECONDARY} />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.54297 11.3223C9.12757 11.3223 8.79297 11.6585 8.79297 12.0723C8.79297 12.486 9.12757 12.8223 9.54297 12.8223H12.328C12.742 12.8223 13.078 12.4863 13.078 12.0723C13.078 11.6582 12.742 11.3223 12.328 11.3223H9.54297Z" fill={QUICK_ICON_PRIMARY} />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.54297 15.1323C9.1279 15.1323 8.79297 15.4672 8.79297 15.8823C8.79297 16.296 9.12757 16.6323 9.54297 16.6323H14.491C14.905 16.6323 15.241 16.2963 15.241 15.8823C15.241 15.4669 14.9047 15.1323 14.491 15.1323H9.54297Z" fill={QUICK_ICON_PRIMARY} />
    </svg>
  );
}

function QuickHeartRateIcon({ size = 18 }: QuickActionIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M16.97 2.6543H7.03C4.53 2.6543 2.5 4.6843 2.5 7.1843V12.6443C2.5 15.1443 4.53 17.1743 7.03 17.1743H16.97C19.47 17.1743 21.5 15.1443 21.5 12.6443V7.1843C21.5 4.6843 19.47 2.6543 16.97 2.6543Z" fill={QUICK_ICON_SECONDARY} />
      <path fillRule="evenodd" clipRule="evenodd" d="M18.01 10.3738C18.01 10.7938 17.68 11.1238 17.26 11.1238H15.1C14.83 11.1238 14.59 10.9838 14.45 10.7638L14.35 10.5938L13.13 13.3038C13.01 13.5738 12.74 13.7438 12.45 13.7438H12.41C12.1 13.7338 11.84 13.5238 11.74 13.2338L10.5 9.53383L10.14 10.6138C10.04 10.9238 9.74998 11.1238 9.42998 11.1238H6.72998C6.31998 11.1238 5.97998 10.7938 5.97998 10.3738C5.97998 9.96383 6.31998 9.62383 6.72998 9.62383H8.88998L9.78998 6.93383C9.88998 6.63383 10.18 6.42383 10.5 6.42383C10.82 6.42383 11.11 6.63383 11.21 6.93383L12.55 10.9438L13.58 8.66383C13.69 8.41383 13.94 8.24383 14.22 8.22383C14.51 8.20383 14.76 8.35383 14.9 8.59383L15.52 9.62383H17.26C17.68 9.62383 18.01 9.96383 18.01 10.3738Z" fill={QUICK_ICON_PRIMARY} />
      <path fillRule="evenodd" clipRule="evenodd" d="M16.9427 19.8458H15.3897L14.9597 17.1748H13.4297L13.8697 19.8448L10.1297 19.8458L10.5597 17.1748H9.03971L8.60971 19.8448L7.05371 19.8458C6.63971 19.8458 6.30371 20.1818 6.30371 20.5958C6.30371 21.0098 6.63971 21.3458 7.05371 21.3458H16.9427C17.3567 21.3458 17.6927 21.0098 17.6927 20.5958C17.6927 20.1818 17.3567 19.8458 16.9427 19.8458Z" fill={QUICK_ICON_PRIMARY} />
    </svg>
  );
}

function QuickChatIcon({ size = 18 }: QuickActionIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 25 25" fill="none" aria-hidden="true">
      <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M12.4508 14.1673C11.8808 14.1673 11.4208 13.7073 11.4208 13.1373C11.4208 12.5673 11.8808 12.0973 12.4508 12.0973C13.0208 12.0973 13.4908 12.5673 13.4908 13.1373C13.4908 13.7073 13.0208 14.1673 12.4508 14.1673ZM7.77078 14.1673C7.20078 14.1673 6.73078 13.7073 6.73078 13.1373C6.73078 12.5673 7.20078 12.0973 7.77078 12.0973C8.34078 12.0973 8.80078 12.5673 8.80078 13.1373C8.80078 13.7073 8.34078 14.1673 7.77078 14.1673ZM14.1808 7.01733H6.35078C4.53078 7.01733 3.05078 8.49733 3.05078 10.3173V15.6673C3.05078 17.4773 4.53078 18.9573 6.35078 18.9573H7.17078C7.55078 18.9573 7.91078 19.1073 8.18078 19.3773L9.28078 20.4773C9.54078 20.7373 9.89078 20.8873 10.2608 20.8873C10.6308 20.8873 10.9808 20.7373 11.2508 20.4773L12.3508 19.3773C12.6108 19.1073 12.9708 18.9573 13.3508 18.9573H14.1808C15.9908 18.9573 17.4708 17.4773 17.4708 15.6673V10.3173C17.4708 8.49733 15.9908 7.01733 14.1808 7.01733Z" fill={QUICK_ICON_SECONDARY} />
      <path fillRule="evenodd" clipRule="evenodd" d="M12.4508 14.1674C11.8808 14.1674 11.4208 13.7074 11.4208 13.1374C11.4208 12.5674 11.8808 12.0974 12.4508 12.0974C13.0208 12.0974 13.4908 12.5674 13.4908 13.1374C13.4908 13.7074 13.0208 14.1674 12.4508 14.1674ZM7.77077 14.1674C7.20077 14.1674 6.73077 13.7074 6.73077 13.1374C6.73077 12.5674 7.20077 12.0974 7.77077 12.0974C8.34077 12.0974 8.80077 12.5674 8.80077 13.1374C8.80077 13.7074 8.34077 14.1674 7.77077 14.1674Z" fill={QUICK_ICON_PRIMARY} />
      <path fillRule="evenodd" clipRule="evenodd" d="M18.2608 3.19727H10.4308C8.94759 3.19727 7.68753 4.17898 7.28291 5.52692C7.24623 5.64913 7.3414 5.76727 7.469 5.76727H14.1808C16.6808 5.76727 18.7208 7.80727 18.7208 10.3173V14.8679C18.7208 14.9892 18.8282 15.083 18.9469 15.058C20.4352 14.7451 21.5508 13.4182 21.5508 11.8373V6.48727C21.5508 4.67727 20.0708 3.19727 18.2608 3.19727Z" fill={QUICK_ICON_PRIMARY} />
    </svg>
  );
}

const quickActions = [
  { icon: QuickDocumentPencilIcon, label: "Prescription", to: "/prescriptions" },
  { icon: QuickPillsIcon, label: "Medications", to: "/medications" },
  { icon: QuickNotebookIcon, label: "Notes", to: "/notes" },
  { icon: QuickGraphLineIcon, label: "Reports", to: "/trends" },
  { icon: QuickHeartRateIcon, label: "Dialysis", to: "/dialysis" },
  { icon: QuickChatIcon, label: "Chat", to: "/chat" },
] as const;

const attentionItems: AttentionItem[] = [
  {
    id: "high-potassium",
    eyebrow: "Urgent lab alert",
    title: "High potassium: 5.3 mEq/L",
    body: "Latest pathology value is elevated and needs confirmation before prescription changes.",
    detail: "Elevated 1 hr ago",
    cta: "View trends",
    tone: "danger"
  },
  {
    id: "dialysis-missed",
    eyebrow: "Care gap",
    title: "Missed dialysis session",
    body: "Yesterday's MHD attendance is unconfirmed and follow-up is pending with the patient.",
    detail: "12 Apr 2026",
    cta: "Open outreach",
    tone: "warning"
  },
  {
    id: "prescription-review",
    eyebrow: "Prescription",
    title: "Refill needs dosage review",
    body: "Insulin glargine refill was requested, but recent fasting sugars and dialysis logs suggest a dose review first.",
    detail: "2 meds pending",
    cta: "Review Rx",
    tone: "success"
  }
];

type TimelineEntryBase = {
  id: string;
  date: string;
  category: string;
  icon: LucideIcon;
  title: string;
  meta: string;
};

type TimelineEntry =
  | (TimelineEntryBase & {
      variant: "consult";
      summary: string;
      bullets: string[];
      prescription?: { title: string; subtitle: string };
    })
  | (TimelineEntryBase & {
      variant: "session";
      summary: string;
      metrics: Array<{ label: string; value: string }>;
    })
  | (TimelineEntryBase & {
      variant: "report";
      summary: string;
      attachments: Array<{ title: string; subtitle: string }>;
    })
  | (TimelineEntryBase & {
      variant: "medication";
      summary: string;
      medication: {
        name: string;
        detail: string;
        schedule: string;
        change: string;
      };
    })
  | (TimelineEntryBase & {
      variant: "procedure";
      summary: string;
      notes: string[];
      attachment: { title: string; subtitle: string };
    })
  | (TimelineEntryBase & {
      variant: "note";
      bullets: string[];
    });

const timelineEntries: TimelineEntry[] = [
  {
    id: "consult-08-apr",
    date: "08 Apr 2026",
    category: "OPD consult",
    variant: "consult",
    title: "OPD consultation",
    meta: "Dr. Mehta · Nephrology",
    summary: "Reviewed dry-weight trend and tightened BP guidance for the coming week.",
    bullets: ["Repeat home BP log in 7 days"],
    prescription: {
      title: "Consult prescription",
      subtitle: "BP meds + renal diet advice"
    },
    icon: FileText
  },
  {
    id: "dialysis-05-apr",
    date: "05 Apr 2026",
    category: "Dialysis",
    variant: "session",
    title: "MHD dialysis session",
    meta: "4 hr session · Good tolerance",
    summary: "Session completed without escalation and tolerance remained stable.",
    metrics: [
      { label: "Duration", value: "4 hr" },
      { label: "Pre BP", value: "140/90" }
    ],
    icon: Droplets
  },
  {
    id: "pathology-02-apr",
    date: "02 Apr 2026",
    category: "Pathology",
    variant: "report",
    title: "KFT lab uploaded",
    meta: "Creatinine, GFR, K+, P+",
    summary: "Renal panel and comparison trend were added to the chart.",
    attachments: [
      { title: "KFT panel", subtitle: "4 parameters flagged" },
      { title: "Trend sheet", subtitle: "3-month comparison" }
    ],
    icon: FlaskConical
  },
  {
    id: "medication-28-mar",
    date: "28 Mar 2026",
    category: "Medication",
    variant: "medication",
    title: "Insulin changed",
    meta: "Dose updated after sugar review",
    summary: "Basal insulin was reduced after recurring morning lows.",
    medication: {
      name: "Insulin glargine",
      detail: "10 IU",
      schedule: "Nightly · SC",
      change: "Reduced from 14 IU"
    },
    icon: PillIcon
  },
  {
    id: "dialysis-review-18-mar",
    date: "18 Mar 2026",
    category: "Care note",
    variant: "note",
    title: "Dialysis regimen reviewed",
    meta: "Nephrology + dialysis unit",
    bullets: ["Dry weight revised after 2-week review", "Monitor post-session cramps closely"],
    icon: NotebookText
  },
  {
    id: "procedure-15-mar",
    date: "15 Mar 2026",
    category: "Procedure",
    variant: "procedure",
    title: "Catheter surgery",
    meta: "Post-op care attached",
    summary: "Permanent catheter surgery completed and post-op instructions were filed.",
    notes: ["Wound review advised in 48 hr"],
    attachment: {
      title: "Post-op care plan",
      subtitle: "Wound care and review schedule"
    },
    icon: ScanText
  },
  {
    id: "medication-03-mar",
    date: "03 Mar 2026",
    category: "Medication",
    variant: "medication",
    title: "Amlodipine paused",
    meta: "Low BP during MHD · Dr. Smith · Cardiology",
    summary: "Amlodipine temporarily held after blood pressure dropped during MHD week. Review scheduled when pressure stabilises.",
    medication: {
      name: "Amlodipine",
      detail: "5 mg",
      schedule: "Once daily · Oral",
      change: "Paused"
    },
    icon: PillIcon
  },
  {
    id: "medication-12-jan",
    date: "12 Jan 2026",
    category: "Medication",
    variant: "medication",
    title: "EPO therapy started",
    meta: "Anaemia management · Dr. Girish · Nephrology",
    summary: "Erythropoietin alfa started for dialysis-related anaemia. Haemoglobin target set at 10–11 g/dL.",
    medication: {
      name: "Erythropoietin alfa",
      detail: "4000 IU",
      schedule: "3x / week · SC",
      change: "New start"
    },
    icon: PillIcon
  },
  {
    id: "medication-03-jan",
    date: "03 Jan 2026",
    category: "Medication",
    variant: "medication",
    title: "Amlodipine added",
    meta: "BP control · Dr. Smith · Cardiology",
    summary: "Amlodipine added after home BP logs showed persistent hypertension between dialysis sessions.",
    medication: {
      name: "Amlodipine",
      detail: "5 mg",
      schedule: "Once daily · Oral",
      change: "New start"
    },
    icon: PillIcon
  },
  {
    id: "medication-24-sep",
    date: "24 Sep 2025",
    category: "Medication",
    variant: "medication",
    title: "Metformin discontinued",
    meta: "Dialysis initiation · Dr. Patel · Endocrinology",
    summary: "Metformin stopped at dialysis initiation — contraindicated in dialysis-dependent CKD due to lactic acidosis risk. Diabetes plan to be revised.",
    medication: {
      name: "Metformin",
      detail: "500 mg",
      schedule: "Twice daily · Oral",
      change: "Stopped"
    },
    icon: PillIcon
  },
  {
    id: "session-24-sep",
    date: "24 Sep 2025",
    category: "Dialysis",
    variant: "session",
    title: "Dialysis initiated",
    meta: "First supervised MHD session",
    summary: "First session completed under close observation with mild fatigue but no intradialytic hypotension.",
    metrics: [
      { label: "Duration", value: "3 hr" },
      { label: "UF", value: "1.2 L" },
      { label: "Post BP", value: "132/84" }
    ],
    icon: Droplets
  },
  {
    id: "procedure-18-sep",
    date: "18 Sep 2025",
    category: "Procedure",
    variant: "procedure",
    title: "Dialysis access placed",
    meta: "Temporary catheter insertion",
    summary: "Temporary dialysis access was inserted after counseling on urgent initiation and access care.",
    notes: ["Consent documented", "Access-site care explained to family"],
    attachment: {
      title: "Access care instructions",
      subtitle: "Red flags, hygiene, review steps"
    },
    icon: ScanText
  },
  {
    id: "medication-03-sep",
    date: "03 Sep 2025",
    category: "Medication",
    variant: "medication",
    title: "Phosphate binder started",
    meta: "Dialysis prep · Dr. Mehta · Nephrology",
    summary: "Calcium acetate started to control phosphorus levels ahead of dialysis initiation.",
    medication: {
      name: "Calcium acetate",
      detail: "667 mg",
      schedule: "With meals · Oral",
      change: "New start"
    },
    icon: PillIcon
  },
  {
    id: "treatment-plan-03-sep",
    date: "03 Sep 2025",
    category: "Care note",
    variant: "note",
    title: "Treatment plan finalized",
    meta: "Nephrology treatment conference",
    bullets: ["Hemodialysis advised three times weekly", "Access placement scheduled after counseling"],
    icon: NotebookText
  },
  {
    id: "medication-20-aug",
    date: "20 Aug 2025",
    category: "Medication",
    variant: "medication",
    title: "CKD medications started",
    meta: "Initial renal regimen · Dr. Mehta · Nephrology",
    summary: "Torsemide and sodium bicarbonate started for volume control and metabolic acidosis management.",
    medication: {
      name: "Torsemide + sodium bicarbonate",
      detail: "20 mg / 650 mg",
      schedule: "Morning / Twice daily · Oral",
      change: "New start"
    },
    icon: PillIcon
  },
  {
    id: "medication-20-aug-metformin",
    date: "20 Aug 2025",
    category: "Medication",
    variant: "medication",
    title: "Metformin started",
    meta: "Pre-dialysis diabetes management · Dr. Patel · Endocrinology",
    summary: "Metformin added for blood sugar control while still in the pre-dialysis CKD phase, pending endocrine follow-up.",
    medication: {
      name: "Metformin",
      detail: "500 mg",
      schedule: "Twice daily · Oral",
      change: "New start"
    },
    icon: PillIcon
  },
  {
    id: "workup-review-12-aug",
    date: "12 Aug 2025",
    category: "OPD consult",
    variant: "consult",
    title: "CKD workup review",
    meta: "Dr. Mehta · Nephrology",
    summary: "Follow-up labs confirmed progression and dialysis planning was discussed with family.",
    bullets: ["Repeat anemia and iron profile ordered"],
    prescription: {
      title: "Workup follow-up prescription",
      subtitle: "Labs + supportive medication plan"
    },
    icon: FileText
  },
  {
    id: "followup-tests-29-jul",
    date: "29 Jul 2025",
    category: "Pathology",
    variant: "report",
    title: "Specialized workup ordered",
    meta: "Iron profile, viral markers, calcium-phosphorus",
    summary: "Extended workup was added after baseline renal impairment was confirmed.",
    attachments: [
      { title: "Follow-up lab order", subtitle: "Iron profile · PTH · Viral markers" },
      { title: "Imaging request", subtitle: "Renal ultrasound + access assessment" }
    ],
    icon: FlaskConical
  },
  {
    id: "baseline-report-25-jul",
    date: "25 Jul 2025",
    category: "Pathology",
    variant: "report",
    title: "Baseline reports uploaded",
    meta: "Creatinine 5.8 · eGFR 11 · Hb 8.9",
    summary: "Initial outside reports were added and marked for urgent nephrology review.",
    attachments: [
      { title: "Outside lab bundle", subtitle: "CBC, KFT, urine protein" },
      { title: "Referral note", subtitle: "Primary physician summary" }
    ],
    icon: FlaskConical
  },
  {
    id: "first-consult-22-jul",
    date: "22 Jul 2025",
    category: "OPD consult",
    variant: "consult",
    title: "First nephrology visit",
    meta: "Relationship begins · Dr. Mehta",
    summary: "Patient presented with fatigue, swelling, and reduced urine output with outside reports suggesting advanced kidney disease.",
    bullets: ["Baseline renal workup advised"],
    icon: FileText
  }
];

function TimelineAttachment({
  title,
  subtitle,
  wide = false
}: {
  title: string;
  subtitle: string;
  wide?: boolean;
}) {
  return (
      <div className={`timeline-card__attachment${wide ? " timeline-card__attachment--wide" : ""}`}>
      <div className="timeline-card__attachment-copy">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <span className="timeline-card__attachment-link" aria-hidden="true">
        <ArrowUpRight size={13} />
      </span>
    </div>
  );
}

function renderTimelineCard(entry: TimelineEntry) {
  switch (entry.variant) {
    case "consult":
      return (
        <Card className="timeline-card timeline-card--consult">
          <div className="timeline-card__header">
            <div className="timeline-card__icon">
              <entry.icon size={16} />
            </div>
            <div className="timeline-card__heading-group">
              <h3 className="timeline-card__title">{entry.title}</h3>
              <p className="timeline-card__meta">{entry.meta}</p>
            </div>
          </div>
          <p className="timeline-card__body">{entry.summary}</p>
          <ul className="timeline-card__bullets">
            {entry.bullets.slice(0, 1).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {entry.prescription ? (
            <TimelineAttachment
              title={entry.prescription.title}
              subtitle={entry.prescription.subtitle}
              wide
            />
          ) : null}
        </Card>
      );
    case "session":
      return (
        <Card className="timeline-card timeline-card--session">
          <div className="timeline-card__header">
            <div className="timeline-card__icon">
              <entry.icon size={16} />
            </div>
            <div className="timeline-card__heading-group">
              <h3 className="timeline-card__title">{entry.title}</h3>
              <p className="timeline-card__meta">{entry.meta}</p>
            </div>
          </div>
          <div className="timeline-card__metrics">
            {entry.metrics.slice(0, 2).map((metric) => (
              <div className="timeline-card__metric" key={metric.label}>
                <span className="timeline-card__metric-label">{metric.label}</span>
                <strong className="timeline-card__metric-value">{metric.value}</strong>
              </div>
            ))}
          </div>
          <p className="timeline-card__body">{entry.summary}</p>
        </Card>
      );
    case "report":
      return (
        <Card className="timeline-card timeline-card--report">
          <div className="timeline-card__header">
            <div className="timeline-card__icon">
              <entry.icon size={16} />
            </div>
            <div className="timeline-card__heading-group">
              <h3 className="timeline-card__title">{entry.title}</h3>
              <p className="timeline-card__meta">{entry.meta}</p>
            </div>
          </div>
          <p className="timeline-card__body">{entry.summary}</p>
          <div className="timeline-card__attachments">
            {entry.attachments.slice(0, 1).map((attachment) => (
              <TimelineAttachment
                key={attachment.title}
                title={attachment.title}
                subtitle={attachment.subtitle}
              />
            ))}
          </div>
        </Card>
      );
    case "medication":
      return (
        <Card className="timeline-card timeline-card--medication">
          <div className="timeline-card__header">
            <div className="timeline-card__icon">
              <entry.icon size={16} />
            </div>
            <div className="timeline-card__heading-group">
              <h3 className="timeline-card__title">{entry.title}</h3>
              <p className="timeline-card__meta">{entry.meta}</p>
            </div>
          </div>
          <div className="timeline-card__med-row">
            <div className="timeline-card__med-copy">
              <strong>{entry.medication.name}</strong>
              <span>
                {entry.medication.detail} · {entry.medication.schedule}
              </span>
            </div>
            <span className="timeline-card__med-badge">{entry.medication.change}</span>
          </div>
          <p className="timeline-card__body">{entry.summary}</p>
        </Card>
      );
    case "procedure":
      return (
        <Card className="timeline-card timeline-card--procedure">
          <div className="timeline-card__header">
            <div className="timeline-card__icon">
              <entry.icon size={16} />
            </div>
            <div className="timeline-card__heading-group">
              <h3 className="timeline-card__title">{entry.title}</h3>
              <p className="timeline-card__meta">{entry.meta}</p>
            </div>
          </div>
          <p className="timeline-card__body">{entry.summary}</p>
          <ul className="timeline-card__bullets">
            {entry.notes.slice(0, 1).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <TimelineAttachment
            title={entry.attachment.title}
            subtitle={entry.attachment.subtitle}
            wide
          />
        </Card>
      );
    case "note":
      return (
        <Card className="timeline-card timeline-card--note">
          <div className="timeline-card__header">
            <div className="timeline-card__icon">
              <entry.icon size={16} />
            </div>
            <div className="timeline-card__heading-group">
              <h3 className="timeline-card__title">{entry.title}</h3>
              <p className="timeline-card__meta">{entry.meta}</p>
            </div>
          </div>
          <ul className="timeline-card__bullets timeline-card__bullets--spacious">
            {entry.bullets.slice(0, 2).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      );
  }
}

function getTimelineSearchText(entry: TimelineEntry) {
  const shared = [entry.date, entry.category, entry.title, entry.meta];

  switch (entry.variant) {
    case "consult":
      return [
        ...shared,
        entry.summary,
        ...entry.bullets,
        entry.prescription?.title ?? "",
        entry.prescription?.subtitle ?? ""
      ].join(" ");
    case "session":
      return [
        ...shared,
        entry.summary,
        ...entry.metrics.flatMap((metric) => [metric.label, metric.value])
      ].join(" ");
    case "report":
      return [
        ...shared,
        entry.summary,
        ...entry.attachments.flatMap((attachment) => [attachment.title, attachment.subtitle])
      ].join(" ");
    case "medication":
      return [
        ...shared,
        entry.summary,
        entry.medication.name,
        entry.medication.detail,
        entry.medication.schedule,
        entry.medication.change
      ].join(" ");
    case "procedure":
      return [
        ...shared,
        entry.summary,
        ...entry.notes,
        entry.attachment.title,
        entry.attachment.subtitle
      ].join(" ");
    case "note":
      return [...shared, ...entry.bullets].join(" ");
  }
}

export function TodayPage() {
  const navigate = useNavigate();
  const [attentionDismissed, setAttentionDismissed] = useState(false);
  const [timelineQuery, setTimelineQuery] = useState("");
  const featuredPatient = patients[0];
  const normalizedTimelineQuery = timelineQuery.trim().toLowerCase();
  const filteredTimelineEntries = useMemo(() => {
    if (!normalizedTimelineQuery) {
      return timelineEntries;
    }

    return timelineEntries.filter((entry) =>
      getTimelineSearchText(entry).toLowerCase().includes(normalizedTimelineQuery)
    );
  }, [normalizedTimelineQuery]);

  return (
    <motion.div
      className="page-stack"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.spring.sheet}
    >
      <AnimatePresence initial={false}>
        {!attentionDismissed ? (
          <motion.div
            key="attention-block"
            className="page-section"
            layout
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={motionTokens.spring.sheet}
          >
          <SectionHeading eyebrow="Needs attention" />
          <AttentionStack items={attentionItems} onEmpty={() => setAttentionDismissed(true)} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.section className="page-section" layout transition={motionTokens.spring.sheet}>
        <SectionHeading eyebrow="Quick access" />
        <div className="quick-grid">
          <button
            className="quick-action quick-action--add"
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("jano:quick-action"))}
          >
            <Plus className="quick-action__icon" size={28} />
            <span className="quick-action__label">Add</span>
          </button>
          {quickActions.map(({ icon: Icon, label, to }) => (
            <button
              className="quick-action"
              key={label}
              type="button"
              onClick={
                to
                  ? () =>
                      navigate(to, {
                        state:
                          label === "Reports" ||
                          label === "Medications" ||
                          label === "Notes" ||
                          label === "Chat" ||
                          label === "Prescription" ||
                          label === "Dialysis"
                            ? { patientId: featuredPatient.id }
                            : undefined
                      })
                  : undefined
              }
            >
              <Icon size={28} />
              <span className="quick-action__label">{label}</span>
            </button>
          ))}
        </div>
      </motion.section>

      <motion.section className="page-section" transition={motionTokens.spring.sheet}>
        <SectionHeading eyebrow="Clinical Record" />
        <div className="timeline-toolbar">
          <label className="timeline-toolbar__search">
            <Search size={16} />
            <input
              type="text"
              value={timelineQuery}
              onChange={(event) => setTimelineQuery(event.target.value)}
              aria-label="Search timeline"
              placeholder="Search history"
            />
          </label>
          <IconButton icon={SlidersHorizontal} label="Filter timeline" />
        </div>
        <div className="timeline-list">
          {filteredTimelineEntries.map((entry) => (
            <div className="timeline-entry" key={entry.id}>
              <div className="timeline-entry__rail">
                <span className="timeline-entry__dot" />
                <span className="timeline-entry__line" />
              </div>
              <div className="timeline-entry__content">
                <div className="timeline-entry__stamp">
                  <p className="timeline-entry__date">{entry.date}</p>
                  <span className={`timeline-entry__category timeline-entry__category--${entry.variant}`}>
                    {entry.category}
                  </span>
                </div>
                {renderTimelineCard(entry)}
              </div>
            </div>
          ))}
          {filteredTimelineEntries.length === 0 ? (
            <Card className="timeline-card timeline-card--empty">
              <div className="timeline-card__heading-group">
                <h3 className="timeline-card__title">No matching records</h3>
                <p className="timeline-card__meta">
                  Try a diagnosis, medication, procedure, or lab term.
                </p>
              </div>
            </Card>
          ) : null}
        </div>
      </motion.section>
    </motion.div>
  );
}
