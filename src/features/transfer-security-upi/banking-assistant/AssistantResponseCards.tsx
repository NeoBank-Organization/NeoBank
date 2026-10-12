/**
 * ============================================================================
 * COMPONENT: AssistantResponseCards.tsx
 * DESCRIPTION: BNK-AI-05: Assistant chat response bubble formatting text and links.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R05 - Ramya N
 * EMAIL: ramyan.s1814009@gmail.com
 * ROLE: Transfer security & mock UPI owner
 * PRD REQUIREMENTS: BNK-FR-03 (Transfer Security/OTP/UPI), BNK-AI-05 (Banking Assistant)
 * SPRINT DELIVERABLES: Sprint 1 (S1-16, S1-17, S1-18, S1-19) & Sprint 2 (S2-18, S2-19, S2-20)
 * PRIMARY RESPONSIBILITIES: Mock UPI, confirmation dialog, OTP modal/states, transaction result, banking assistant AI
 * ============================================================================
 */


import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface AssistantCardItem {
  label: string;
  value: string;
}

interface AssistantResponseCardsProps {
  title: string;
  description: string;
  items?: AssistantCardItem[];
  actionLabel?: string;
  actionPath?: string;
}

export const AssistantResponseCards: React.FC<
  AssistantResponseCardsProps
> = ({
  title,
  description,
  items = [],
  actionLabel,
  actionPath,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-blue-100 bg-white">
      <div className="flex items-start gap-3 bg-blue-50/70 p-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
          <ShieldCheck size={18} />
        </span>

        <div>
          <h4 className="text-sm font-semibold text-slate-800">
            {title}
          </h4>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            {description}
          </p>
        </div>
      </div>

      {items.length > 0 && (
        <div className="divide-y divide-slate-100 px-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-start justify-between gap-3 py-3"
            >
              <span className="text-xs text-slate-500">
                {item.label}
              </span>
              <span className="text-right text-xs font-medium text-slate-800">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {actionLabel && actionPath && (
        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={() => navigate(actionPath)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 hover:text-blue-900"
          >
            {actionLabel}
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
