/**
 * ============================================================================
 * COMPONENT: AssistantChatWindow.tsx
 * DESCRIPTION: BNK-AI-05: Banking assistant with predefined responses,
 *              contextual navigation, and banking security safeguards.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R05 - Ramya N
 * ROLE: Transfer security & mock UPI owner
 * PRD REQUIREMENTS: BNK-FR-03, BNK-AI-05
 * SPRINT DELIVERABLES: S2-18, S2-19, S2-20
 * ============================================================================
 */

import React, { useState } from "react";
import { ArrowUp, Bot, UserRound } from "lucide-react";

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
      "Hello! I'm your NeoBank demo assistant. I can help you check your balance, view recent transactions, see FD rates, and find the right banking page.",
    card: {
      title: "How can I help?",
      description:
        "Choose a topic below or type your question. This demo uses predefined responses and does not connect to a live AI service.",
      items: [
        { label: "Balance", value: "View available balance" },
        { label: "Transactions", value: "View recent activity" },
        { label: "FD rates", value: "View indicative rates" },
        { label: "Transfers", value: "Get transfer guidance" },
      ],
    },
  },
];

const suggestions = [
  "What is my account balance?",
  "Show my last transactions",
  "What are the FD rates?",
  "How do I add a beneficiary?",
  "How do I transfer money?",
  "Why do I need OTP verification?",
];

const assistantAccount = {
  name: "Neo Millennium Savings",
  maskedAccountNumber: "···· 8172",
  availableBalance: "₹2,45,850.75",
};

const assistantRecentTransactions = [
  {
    name: "Priya Sharma",
    detail: "NeoBank ·· 6730",
    amount: "-₹12,500.00",
    date: "Today, 10:42 AM",
  },
  {
    name: "Rohan Properties",
    detail: "Horizon Bank ·· 1182",
    amount: "-₹42,000.00",
    date: "Yesterday",
  },
  {
    name: "Priya Sharma",
    detail: "NeoBank ·· 6730",
    amount: "-₹8,500.00",
    date: "06 Oct 2026",
  },
];

const assistantFdRates = [
  { tenure: "7–45 days", rate: "4.00% p.a." },
  { tenure: "46–90 days", rate: "4.50% p.a." },
  { tenure: "91–180 days", rate: "5.25% p.a." },
  { tenure: "181–365 days", rate: "6.10% p.a." },
];

const getResponse = (
  rawQuestion: string,
): Omit<ChatMessage, "id"> => {
  const question = rawQuestion.toLowerCase().trim();

  // 1. Security-sensitive requests
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

  // 2. Balance
  if (
    /\b(balance|available balance|account balance|how much money|my balance)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text: `Your ${assistantAccount.name} ${assistantAccount.maskedAccountNumber} has an available balance of ${assistantAccount.availableBalance}. This is simulated demo data.`,
      card: {
        title: "Account balance",
        description:
          "Read-only account information from the demo data source.",
        items: [
          {
            label: "Account",
            value: `${assistantAccount.name} ${assistantAccount.maskedAccountNumber}`,
          },
          {
            label: "Available balance",
            value: assistantAccount.availableBalance,
          },
        ],
        actionLabel: "Open accounts",
        actionPath: "/accounts",
      },
    };
  }

  // 3. Last transactions
  if (
    /\b(last transactions|recent transactions|transaction history|recent payments|last payments)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text: "Here are your most recent simulated transactions. Open Statements for the complete transaction view.",
      card: {
        title: "Recent transactions",
        description:
          "Read-only recent activity from the demo data source.",
        items: assistantRecentTransactions.map((transaction) => ({
          label: `${transaction.name} · ${transaction.date}`,
          value: `${transaction.amount} · ${transaction.detail}`,
        })),
        actionLabel: "Open statements",
        actionPath: "/statements",
      },
    };
  }

  // 4. FD rates
  if (
    /\b(fd rate|fd rates|fixed deposit rate|fixed deposit rates|fd interest|fixed deposit interest)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text: "These are simulated NeoBank FD rates for demonstration only. Open Loans to explore the FD-related product experience.",
      card: {
        title: "Fixed deposit rates",
        description:
          "Indicative demo rates. These are not a commitment or booking confirmation.",
        items: assistantFdRates.map((fd) => ({
          label: fd.tenure,
          value: fd.rate,
        })),
        actionLabel: "Open loans",
        actionPath: "/loans",
      },
    };
  }

  // 5. Direct transfer request — must be refused
 // 5. Direct transfer request — must be refused
const hasTransferVerb = /\b(send|transfer|pay|move|remit)\b/.test(question);

const hasMoneyAmount =
  /₹\s?\d/.test(question) ||
  /\b(rs\.?\s?\d|inr\s?\d|money|amount|fund|payment|rupees)\b/.test(
    question,
  );

const hasRecipient =
  /\b(to|for)\b/.test(question) ||
  /\b(priya|rohan|aarav|sanya)\b/.test(question);

const directTransferRequest =
  (hasTransferVerb && hasMoneyAmount) ||
  (hasTransferVerb && hasRecipient);

  const transferIntent =
    /\b(transfer|send money|make a payment|upi payment|money transfer)\b/.test(
      question,
    );

  if (directTransferRequest || transferIntent) {
    return {
      role: "assistant",
      text:
        "I can’t initiate, approve, or complete a transfer. Please use the Fund Transfer page, where you can review the details and complete the required verification steps.",
      refusal: true,
      card: {
        title: "Fund transfer",
        description:
          "The assistant is read-only. Confirmation, fraud checks, OTP verification, and UPI security controls remain in the transfer flow.",
        actionLabel: "Open fund transfer",
        actionPath: "/transfers",
      },
    };
  }

  // 6. Add beneficiary
  if (
    /\b(add|create|register|save|new)\b/.test(question) &&
    /\b(beneficiar(?:y|ies)|payee|recipient)\b/.test(question)
  ) {
    return {
      role: "assistant",
      text:
        "To add a beneficiary, open the Add Beneficiary page and enter the recipient's required details. Review the account number and IFSC carefully before submitting. New beneficiaries may have a safety activation period before transfers are allowed.",
      card: {
        title: "Add a beneficiary",
        description:
          "Follow the beneficiary registration form and verify the recipient's details.",
        actionLabel: "Add beneficiary",
        actionPath: "/beneficiaries/add",
      },
    };
  }

  // 7. Beneficiaries
  if (
    /\b(beneficiar(?:y|ies)|payee|recipient|ifsc)\b/.test(question)
  ) {
    return {
      role: "assistant",
      text:
        "Open Beneficiaries to view and manage saved recipients. Pending or inactive beneficiaries may not be eligible for transfers.",
      card: {
        title: "Beneficiary management",
        description:
          "Manage saved recipients and check their activation status.",
        actionLabel: "Open beneficiaries",
        actionPath: "/beneficiaries",
      },
    };
  }

  // 8. OTP
  if (
    /\b(otp|one[- ]time password|verification code|verify transfer|authentication)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text:
        "OTP verification is an additional security step used to confirm a transfer. In this project, verification is simulated. Never share a real OTP.",
      card: {
        title: "OTP verification",
        description:
          "The assistant cannot generate, retrieve, or verify an OTP.",
      },
    };
  }

  // 9. Fraud
  if (
    /\b(fraud|hold|risk score|suspicious|blocked transfer|transaction held|transfer held)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text:
        "A transfer may be held for additional review when risk checks identify a concern. I cannot approve a hold or override a risk decision.",
      card: {
        title: "Fraud protection",
        description:
          "The assistant explains the process but cannot change the transaction's risk status.",
        actionLabel: "Open fund transfer",
        actionPath: "/transfers",
      },
    };
  }

  // 10. Statements
  if (
    /\b(statement|bank statement|download statement|account statement)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text:
        "Open Statements to access the statement tools available in this demo.",
      card: {
        title: "Statements",
        description:
          "Use the statements page to explore available statement and download features.",
        actionLabel: "Open statements",
        actionPath: "/statements",
      },
    };
  }

  // 11. Loans
  if (
    /\b(loan|loans|emi|loan eligibility)\b/.test(question)
  ) {
    return {
      role: "assistant",
      text:
        "Open Loans to explore the available loan screens or use the EMI calculator. Any eligibility information is indicative only and is not a lending decision.",
      card: {
        title: "Loans and EMI",
        description:
          "Explore loan information and repayment calculations.",
        actionLabel: "Open loans",
        actionPath: "/loans",
      },
    };
  }

  // 12. Spend insights
  if (
    /\b(spend insights|spending|expenses|expense breakdown|categories)\b/.test(
      question,
    )
  ) {
    return {
      role: "assistant",
      text:
        "Open Spend Insights to explore the spending breakdown and explanations available in this demo.",
      card: {
        title: "Spend insights",
        description: "Explore the available spending analysis.",
        actionLabel: "Open spend insights",
        actionPath: "/accounts/spend-insights",
      },
    };
  }

  // 13. Greetings
  if (
    /\b(help|what can you do|features|hello|hi|hey)\b/.test(question)
  ) {
    return {
      role: "assistant",
      text:
        "I can help you check your balance, view recent transactions, see FD rates, add a beneficiary, transfer money, view statements, or understand OTP and fraud protection.",
      card: {
        title: "Available banking features",
        description:
          "Choose the relevant page to continue in the application.",
      },
    };
  }

  // 14. Unsupported questions
  return {
    role: "assistant",
    text:
      "I don't have a configured answer for that question in this demo yet. Try asking about your balance, recent transactions, FD rates, beneficiaries, transfers, statements, loans, or OTP verification.",
  };
};

export const AssistantChatWindow: React.FC<
  AssistantChatWindowProps
> = ({ onClose }) => {
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assistantUnavailable, setAssistantUnavailable] =
    useState(false);

  const sendMessage = (value: string) => {
    const question = value.trim();

    if (!question || isLoading || assistantUnavailable) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: question,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulated AI response delay.
    setTimeout(() => {
      if (assistantUnavailable) {
        setIsLoading(false);
        return;
      }

      const response = getResponse(question);

      setMessages((current) => [
        ...current,
        {
          ...response,
          id: Date.now() + 1,
        },
      ]);

      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
      {assistantUnavailable && (
        <div className="m-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          The Banking Assistant is currently unavailable. Please try again
          later or use the relevant NeoBank page directly.
        </div>
      )}

      <div
        className="flex-1 space-y-4 overflow-y-auto p-4"
        aria-live="polite"
        aria-label="Assistant conversation"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2.5 ${
              message.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
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
                message.role === "user" ? "text-right" : ""
              }`}
            >
              <div
                className={`inline-block rounded-2xl px-3.5 py-3 text-left text-xs leading-5 ${
                  message.role === "user"
                    ? "rounded-tr-sm bg-blue-600 text-white"
                    : "rounded-tl-sm border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {message.text}
              </div>

              {message.refusal && (
                <TransferRefusalBanner
                  message="The Banking Assistant cannot initiate, approve, or complete transfers. Use the official Fund Transfer flow for any payment."
                />
              )}

              {message.card && (
                <AssistantResponseCards {...message.card} />
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700">
              <Bot size={17} />
            </span>

            <div className="inline-block rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-3 text-xs text-slate-600">
              Assistant is checking the available demo information…
            </div>
          </div>
        )}
      </div>

      {messages.length === 1 && !isLoading && (
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

      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage(input);
        }}
        className="border-t border-slate-200 bg-white p-3"
      >
        <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <label htmlFor="assistant-message" className="sr-only">
            Ask the banking assistant
          </label>

          <textarea
            id="assistant-message"
            rows={1}
            maxLength={1000}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage(input);
              }
            }}
            disabled={isLoading || assistantUnavailable}
            placeholder="Ask a banking question..."
            className="max-h-24 min-h-9 flex-1 resize-y bg-transparent px-1 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading || assistantUnavailable}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp size={17} />
          </button>
        </div>

        <p className="mt-2 text-center text-[9px] text-slate-400">
          Demo assistant · Do not enter passwords, PINs, OTPs, or sensitive
          account details.
        </p>

        {onClose && (
          <button type="button" onClick={onClose} className="sr-only">
            Close assistant
          </button>
        )}
      </form>
    </div>
  );
};

export default AssistantChatWindow;