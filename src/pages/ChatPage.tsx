import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ChevronLeft, Mic, Paperclip, Send, Shield, Sparkles } from "lucide-react";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

import { motionTokens } from "../design-system/motion";
import { Pill } from "../design-system/components/Pill";
import { patients } from "../fixtures/patients";
import { careTeam, chatMessages } from "../features/chat/data";
import type { ChatMessage, ChatSource } from "../features/chat/types";

function sourceLabel(source: ChatSource) {
  switch (source) {
    case "whatsapp":
      return "WhatsApp";
    case "sms":
      return "SMS";
    case "app":
      return "Patient app";
    case "system":
      return "System";
  }
}

function sourceTone(source: ChatSource) {
  switch (source) {
    case "whatsapp":
      return "success";
    case "sms":
      return "warning";
    case "app":
      return "neutral";
    case "system":
      return "neutral";
  }
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isIncoming = message.role === "patient";
  const isSystem = message.role === "system";
  const isInternal = message.role === "internal";

  if (isSystem) {
    return (
      <div className="chat-system-row">
        <span className="chat-system-pill">{message.body}</span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "chat-message-row",
        isIncoming ? "chat-message-row--incoming" : "chat-message-row--outgoing",
        isInternal && "chat-message-row--internal"
      )}
    >
      <article
        className={clsx(
          "chat-message",
          isIncoming ? "chat-message--incoming" : "chat-message--outgoing",
          isInternal && "chat-message--internal"
        )}
      >
        <div className="chat-message__meta">
          <div className="chat-message__author">
            <strong>{message.author}</strong>
            <span>{message.time}</span>
          </div>
          {!isInternal ? <Pill tone={sourceTone(message.source)}>{sourceLabel(message.source)}</Pill> : null}
        </div>
        <p className="chat-message__body">{message.body}</p>
        {message.meta ? <p className="chat-message__footer">{message.meta}</p> : null}
      </article>
    </div>
  );
}

export function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const patientId = (location.state as { patientId?: string } | null)?.patientId;
  const patient = patients.find((entry) => entry.id === patientId) ?? patients[0];
  const [draft, setDraft] = useState("");

  const groupedMessages = useMemo(() => {
    const groups: Array<{ label: string; messages: ChatMessage[] }> = [];

    for (const message of chatMessages) {
      const existing = groups.find((group) => group.label === message.dayLabel);

      if (existing) {
        existing.messages.push(message);
      } else {
        groups.push({ label: message.dayLabel, messages: [message] });
      }
    }

    return groups;
  }, []);

  return (
    <motion.div
      className="chat-page"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.spring.sheet}
    >
      <header className="subpage-header">
        <button className="subpage-header__back" type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>
        <div className="subpage-header__title-group">
          <h1 className="subpage-header__title">Chat</h1>
          <p className="subpage-header__subtitle">
            {patient.name} · MRN {patient.id.toUpperCase()}
          </p>
        </div>
      </header>

      <div className="chat-body">
        <section className="chat-context">
          <div>
            <p className="eyebrow">Shared care thread</p>
            <h2 className="chat-context__title">Patient-facing conversation</h2>
            <p className="chat-context__meta">
              The patient experiences this as a direct doctor chat. The full care team can see and respond.
            </p>
          </div>
          <div className="chat-context__signals">
            <span className="chat-context__signal">
              <Shield size={14} />
              Team visible
            </span>
            <span className="chat-context__signal">
              <Sparkles size={14} />
              Merged channels
            </span>
          </div>
          <div className="chat-context__team">
            {careTeam.map((member) => (
              <div key={member.name} className="chat-context__member">
                <strong>{member.name}</strong>
                <span>{member.role}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="chat-thread">
          {groupedMessages.map((group) => (
            <div className="chat-thread__group" key={group.label}>
              <div className="chat-thread__divider">
                <span>{group.label}</span>
              </div>
              <div className="chat-thread__messages">
                {group.messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      <div className="chat-composer">
        <div className="chat-composer__shell">
          <button type="button" className="chat-composer__icon" aria-label="Attach file">
            <Paperclip size={16} />
          </button>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Reply as Dr. Mehta"
            rows={1}
            aria-label="Reply message"
          />
          <button type="button" className="chat-composer__icon" aria-label="Dictate reply">
            <Mic size={16} />
          </button>
          <button type="button" className="chat-composer__send" aria-label="Send reply">
            <Send size={16} />
          </button>
        </div>
        <p className="chat-composer__hint">
          Replies are sent to the patient’s active channel and remain visible to the care team.
        </p>
      </div>
    </motion.div>
  );
}
