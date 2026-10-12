/**
 * ============================================================================
 * COMPONENT: AssistantChatWindow.tsx
 * DESCRIPTION: BNK-AI-05: Banking assistant with predefined responses,
 *              contextual navigation, and banking security safeguards.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R05 - Ramya N
 * ROLE: Transfer security & mock UPI owner
 * PRD REQUIREMENTS: BNK-FR-03, BNK-AI-05
 * ============================================================================
 */

import React, { useState } from "react";
import {
  ArrowUp,
  Bot,
  UserRound,
} from "lucide-react";

import { AssistantResponseCards } from "./AssistantResponseCards";
import { TransferRefusalBanner } from "./TransferRefusalBanner";

interface AssistantChatWindowProps {
  onClose?: () => void;
}

type AssistantCardData = {
  title: string;
  description: string;
  items?: { label: string; value: string }[];
  actionLabel?: string;
  actionPath?: string;
};

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
  card?: AssistantCardData;
  refusal?: boolean;
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    text:
      "Hello! I'm your NeoBank demo assistant. I can explain banking features, guide you through transfers, and help you find the right page.",
    card: {
      title: "How can I help?",
      description:
        "Choose a topic below or type your question. This demo uses predefined responses and does not connect to a live AI service.",
      items: [
        {
          label: "Fund transfers",
          value: "Transfer guidance",
        },
        {
          label: "Security",
          value: "OTP and fraud protection",
        },
        {
          label: "Beneficiaries",
          value: "Add and manage recipients",
        },
        {
          label: "Accounts",
          value: "Account information",
        },
      ],
    },
  },
];

const suggestions = [
  "How do I add a beneficiary?",
  "How do I transfer money?",
  "Why do I need OTP verification?",
  "How do I view my statements?",
  "How do I check my account balance?",
  "How does fraud protection work?",
];

const getResponse = (
  rawQuestion: string,
): Omit<ChatMessage, "id"> => {
  const question = rawQuestion.toLowerCase().trim();

  // --------------------------------------------------
  // 1. Security-sensitive requests
  // --------------------------------------------------

  const credentialRequest =
    /\b(otp|one[- ]time password|upi pin|pin|password|cvv|passcode)\b/.test(
      question,
    ) &&
    /\b(tell|show|reveal|give|send|bypass|skip|disable|share|recover|guess|steal)\b/.test(
      question,
    );

  const securityBypassRequest =
    /\b(bypass|skip|disable|override|avoid)\b/.test(question) &&
    /\b(security|verification|otp|fraud|authentication|upi pin|hold|approval)\b/.test(
      question,
    );

  if (credentialRequest || securityBypassRequest) {
    return {
      role: "assistant",
      text:
        "I can't reveal security credentials or help bypass banking verification. Complete all required verification steps through the application's normal flow.",
      refusal: true,
    };
  }

  // --------------------------------------------------
  // 2. Add a beneficiary
  // --------------------------------------------------

  const addBeneficiaryIntent =
    /\b(add|create|register|save|new)\b/.test(question) &&
    /\b(beneficiar(?:y|ies)|payee|recipient)\b/.test(question);

  if (
    addBeneficiaryIntent ||
    /\bhow do i add a beneficiary\b/.test(question) ||
    /\bhow can i add a beneficiary\b/.test(question) ||
    /\badd beneficiary\b/.test(question) ||
    /\badd a payee\b/.test(question)
  ) {
    return {
      role: "assistant",
      text:
        "To add a beneficiary, open the Add Beneficiary page and enter the recipient's required details. Review the account number and IFSC carefully before submitting. New beneficiaries may have a safety activation or cooling period before transfers are allowed.",
      card: {
        title: "Add a beneficiary",
        description:
          "Follow the beneficiary registration form and verify the recipient's details. Transfers may be restricted until activation is complete.",
        items: [
          {
            label: "Step 1",
            value: "Open Add Beneficiary",
          },
          {
            label: "Step 2",
            value: "Enter recipient and bank details",
          },
          {
            label: "Step 3",
            value: "Review details and submit",
          },
          {
            label: "Security",
            value: "Observe the activation period",
          },
        ],
        actionLabel: "Add beneficiary",
        actionPath: "/beneficiaries/add",
      },
    };
  }

  // --------------------------------------------------
  // 3. View or manage beneficiaries
  // --------------------------------------------------

  if (
    /\b(beneficiar(?:y|ies)|payee|recipient|ifsc)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text:
        "Open Beneficiaries to view and manage saved recipients. You can also start the add-beneficiary process. Check the displayed status because pending or inactive beneficiaries may not be eligible for transfers.",
      card: {
        title: "Beneficiary management",
        description:
          "Manage saved recipients and check their activation status.",
        actionLabel: "Open beneficiaries",
        actionPath: "/beneficiaries",
      },
    };
  }

  // --------------------------------------------------
  // 4. Fund transfers
  // --------------------------------------------------

  const transferIntent =
    /\b(transfer|send|pay|move|payment|upi payment|money transfer)\b/.test(
      question,
    );

  if (
    transferIntent ||
    /\bhow do i send money\b/.test(question) ||
    /\bhow can i pay\b/.test(question)
  ) {
    return {
      role: "assistant",
      text:
        "You can start a simulated transfer from Fund Transfer. Choose the transfer type, enter the recipient and amount, review the details, and complete the verification steps displayed by the application. I cannot initiate a payment for you.",
      card: {
        title: "Fund transfer",
        description:
          "The assistant provides guidance only. Existing confirmation, fraud checks, OTP verification, and UPI security controls remain in charge of the transaction.",
        items: [
          {
            label: "Step 1",
            value: "Choose the transfer type",
          },
          {
            label: "Step 2",
            value: "Enter and review transfer details",
          },
          {
            label: "Step 3",
            value: "Complete required verification",
          },
        ],
        actionLabel: "Open fund transfer",
        actionPath: "/transfers",
      },
    };
  }

  // --------------------------------------------------
  // 5. OTP and verification
  // --------------------------------------------------

  if (
    /\b(otp|one[- ]time password|verification code|verify transfer|authentication)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text:
        "OTP verification is an additional security step used to confirm a transfer. In this project, verification is simulated. Follow the instructions in the verification modal and use only the demo code provided by the application. Never share a real OTP.",
      card: {
        title: "OTP verification",
        description:
          "The assistant cannot generate, retrieve, or verify an OTP. Your existing transfer-security components handle the verification process.",
        items: [
          {
            label: "Mode",
            value: "Simulated verification",
          },
          {
            label: "Action",
            value: "Follow the verification modal",
          },
          {
            label: "Security",
            value: "Never share your OTP",
          },
        ],
      },
    };
  }

  // --------------------------------------------------
  // 6. Fraud holds and suspicious transfers
  // --------------------------------------------------

  if (
    /\b(fraud|hold|risk score|suspicious|blocked transfer|transaction held|transfer held)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text:
        "A transfer may be held for additional review when the application's risk checks identify a concern. Read the fraud explanation shown in the transfer flow and follow the available review or verification options. I cannot approve a hold or override a risk decision.",
      card: {
        title: "Fraud protection",
        description:
          "The assistant explains the process but cannot change the transaction's risk status.",
        items: [
          {
            label: "Review",
            value: "Read the displayed risk explanation",
          },
          {
            label: "Next step",
            value: "Follow the available verification flow",
          },
          {
            label: "Restriction",
            value: "No hold bypass or manual approval",
          },
        ],
        actionLabel: "Open fund transfer",
        actionPath: "/transfers",
      },
    };
  }

  // --------------------------------------------------
  // 7. UPI
  // --------------------------------------------------

  if (
    /\b(upi|upi id|upi pin|pay using upi)\b/.test(question)
  ) {
    return {
      role: "assistant",
      text:
        "The UPI option is part of the application's simulated transfer experience. Select the appropriate transfer type, enter the requested details, and complete the UPI PIN or other verification steps presented by the application. Never enter a real UPI PIN into the assistant chat.",
      card: {
        title: "UPI payments",
        description:
          "Use the application's existing UPI flow. The assistant does not initiate payments or collect UPI credentials.",
        items: [
          {
            label: "Start",
            value: "Open Fund Transfer",
          },
          {
            label: "Security",
            value: "Keep your UPI PIN private",
          },
        ],
        actionLabel: "Open fund transfer",
        actionPath: "/transfers",
      },
    };
  }

  // --------------------------------------------------
  // 8. Statements and transaction history
  // --------------------------------------------------

  if (
    /\b(statement|transaction history|transaction list|bank statement|download statement|account statement)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text:
        "Open Statements to access the statement tools available in this demo. Select the available date range or download option if provided. The records displayed depend on the data implemented in the application.",
      card: {
        title: "Statements",
        description:
          "Use the statements page to explore available statement and download features.",
        actionLabel: "Open statements",
        actionPath: "/statements",
      },
    };
  }

  // --------------------------------------------------
  // 9. Account balance and account details
  // --------------------------------------------------

  if (
    /\b(balance|available balance|account balance|my account|account details|my accounts|account number)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text:
        "Open Accounts to inspect the account information displayed by the application. For accurate balances and account details, use the account page as the source of truth. I won't invent or expose account information in this chat.",
      card: {
        title: "Account information",
        description:
          "View your available account details in the banking application.",
        actionLabel: "Open accounts",
        actionPath: "/accounts",
      },
    };
  }

  // --------------------------------------------------
  // 10. Loans and EMI
  // --------------------------------------------------

  if (
    /\b(loan|loans|emi|equated monthly instalment|equated monthly installment|loan eligibility)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text:
        "Open Loans to explore the available loan screens or use the EMI calculator. Any eligibility information in this demo is indicative only and is not a lending decision.",
      card: {
        title: "Loans and EMI",
        description:
          "Explore loan information and repayment calculations.",
        actionLabel: "Open loans",
        actionPath: "/loans",
      },
    };
  }

  // --------------------------------------------------
  // 11. Spend insights
  // --------------------------------------------------

  if (
    /\b(spend insights|spending|expenses|expense breakdown|spending habits|categories)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text:
        "Open Spend Insights to explore the spending breakdown and explanations available in this demo. The information depends on the data implemented in the application.",
      card: {
        title: "Spend insights",
        description:
          "Explore the available spending analysis.",
        actionLabel: "Open spend insights",
        actionPath: "/accounts/spend-insights",
      },
    };
  }

  // --------------------------------------------------
  // 12. Help and greetings
  // --------------------------------------------------

  if (
    /\b(help|what can you do|features|hello|hi|hey|good morning|good afternoon)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text:
        "I can guide you through common NeoBank features. Ask me how to add a beneficiary, transfer money, view your account balance, access statements, explore loans, or understand OTP and fraud protection.",
      card: {
        title: "Available banking features",
        description:
          "Choose the relevant page to continue in the application.",
        items: [
          {
            label: "Beneficiaries",
            value: "Add and manage recipients",
          },
          {
            label: "Transfers",
            value: "Transfer guidance and security",
          },
          {
            label: "Accounts",
            value: "Account information",
          },
          {
            label: "Statements",
            value: "Statement tools",
          },
          {
            label: "Loans",
            value: "Loan pages and EMI calculator",
          },
        ],
      },
    };
  }

  // --------------------------------------------------
  // 13. Unknown questions
  // --------------------------------------------------

  return {
    role: "assistant",
    text:
      "I don't have a configured answer for that question in this demo yet. Try asking how to add a beneficiary, transfer money, check your balance, view statements, calculate EMI, or understand OTP verification and fraud holds.",
  };
};

export const AssistantChatWindow: React.FC<
  AssistantChatWindowProps
> = ({ onClose }) => {
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);

  const [input, setInput] = useState("");

  const sendMessage = (value: string) => {
    const question = value.trim();

    if (!question) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: question,
    };

    const response = getResponse(question);

    const assistantMessage: ChatMessage = {
      ...response,
      id: Date.now() + 1,
    };

    setMessages((current) => [
      ...current,
      userMessage,
      assistantMessage,
    ]);

    setInput("");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
      {/* Conversation messages */}
      <div
        className="flex-1 space-y-4 overflow-y-auto p-4"
        aria-live="polite"
        aria-label="Assistant conversation"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2.5 ${
              message.role === "user"
                ? "flex-row-reverse"
                : ""
            }`}
          >
            {/* Avatar */}
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "border border-blue-100 bg-white text-blue-700"
              }`}
            >
              {message.role === "user" ? (
                <UserRound size={16} />
              ) : (
                <Bot size={17} />
              )}
            </span>

            <div
              className={`min-w-0 max-w-[88%] ${
                message.role === "user"
                  ? "text-right"
                  : ""
              }`}
            >
              {/* Message bubble */}
              <div
                className={`inline-block rounded-2xl px-3.5 py-3 text-left text-xs leading-5 ${
                  message.role === "user"
                    ? "rounded-tr-sm bg-blue-600 text-white"
                    : "rounded-tl-sm border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {message.text}
              </div>

              {/* Security refusal */}
              {message.refusal && (
                <TransferRefusalBanner
                  message="Never share your OTP, UPI PIN, password, or other credentials. Complete verification only through the official application flow."
                />
              )}

              {/* Action and information card */}
              {message.card && (
                <AssistantResponseCards
                  {...message.card}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Suggested questions
          </p>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-[10px] text-slate-600 transition hover:border-blue-300 hover:text-blue-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message input */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage(input);
        }}
        className="border-t border-slate-200 bg-white p-3"
      >
        <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <label
            htmlFor="assistant-message"
            className="sr-only"
          >
            Ask the banking assistant
          </label>

          <textarea
            id="assistant-message"
            rows={1}
            maxLength={1000}
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask a banking question..."
            className="max-h-24 min-h-9 flex-1 resize-y bg-transparent px-1 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp size={17} />
          </button>
        </div>

        <p className="mt-2 text-center text-[9px] text-slate-400">
          Demo assistant · Do not enter passwords, PINs,
          OTPs, or sensitive account details.
        </p>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="sr-only"
          >
            Close assistant
          </button>
        )}
      </form>
    </div>
  );
};