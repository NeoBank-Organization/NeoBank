/**
 * ============================================================================
 * COMPONENT: BankingAssistantDrawer.tsx
 * DESCRIPTION: BNK-AI-05: Read-only AI Banking Assistant sliding drawer widget.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R05 - Ramya N
 * EMAIL: ramyan.s1814009@gmail.com
 * ROLE: Transfer security & mock UPI owner
 * PRD REQUIREMENTS: BNK-FR-03 (Transfer Security/OTP/UPI), BNK-AI-05 (Banking Assistant)
 * SPRINT DELIVERABLES: Sprint 1 (S1-16, S1-17, S1-18, S1-19) & Sprint 2 (S2-18, S2-19, S2-20)
 * PRIMARY RESPONSIBILITIES: Mock UPI, confirmation dialog, OTP modal/states, transaction result, banking assistant AI
 * ============================================================================
 */


import React, { useEffect } from "react";
import {
  Bot,
  ShieldCheck,
  X,
} from "lucide-react";

import { AssistantChatWindow } from "./AssistantChatWindow";

interface BankingAssistantDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const BankingAssistantDrawer: React.FC<
  BankingAssistantDrawerProps
> = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Close banking assistant"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-slate-950/40 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="banking-assistant-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Bot size={23} />
            </span>

            <div>
              <h2
                id="banking-assistant-title"
                className="text-sm font-bold text-slate-900"
              >
                NeoBank Assistant
              </h2>

              <p className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Demo mode
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={19} />
          </button>
        </header>

        <div className="flex items-start gap-2 border-b border-blue-100 bg-blue-50 px-4 py-3">
          <ShieldCheck
            size={15}
            className="mt-0.5 shrink-0 text-blue-700"
          />

          <p className="text-[10px] leading-4 text-blue-900">
            General guidance only. The assistant cannot move money,
            approve fraud holds, or bypass transaction verification.
          </p>
        </div>

        <AssistantChatWindow />
      </aside>
    </div>
  );
};

