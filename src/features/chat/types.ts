export type ChatSource = "whatsapp" | "sms" | "app" | "system";

export type ChatAuthorRole = "patient" | "doctor" | "team" | "system" | "internal";

export type ChatMessage = {
  id: string;
  author: string;
  role: ChatAuthorRole;
  source: ChatSource;
  time: string;
  dayLabel: string;
  body: string;
  meta?: string;
};
