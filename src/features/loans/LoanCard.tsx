import React from "react";
import { ArrowRight, Building2, CreditCard, Send } from "lucide-react";

export type LoanType = "personal" | "home" | "vehicle";

export interface LoanProduct {
  id: number;
  type: LoanType;
  name: string;
  rate: string;
  indicativeRateValue: number;
  description: string;
}

interface LoanCardProps {
  loan: LoanProduct;
  onApply: (loan: LoanProduct) => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan, onApply }) => {
  const getIcon = () => {
    switch (loan.type) {
      case "personal":
        return <CreditCard className="h-5 w-5 text-blue-600" />;
      case "home":
        return <Building2 className="h-5 w-5 text-indigo-600" />;
      case "vehicle":
        return <Send className="h-5 w-5 text-amber-600" />;
    }
  };

  const getIconBg = () => {
    switch (loan.type) {
      case "personal":
        return "bg-blue-50";
      case "home":
        return "bg-indigo-50";
      case "vehicle":
        return "bg-amber-50";
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition hover:shadow-md">
      <div>
        <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${getIconBg()}`}>
          {getIcon()}
        </div>

        <h3 className="text-base font-medium text-slate-900">{loan.name}</h3>

        <p className="mt-2 text-xs font-semibold text-blue-600">{loan.rate}</p>

        <p className="mt-2 text-xs leading-relaxed text-slate-500">{loan.description}</p>
      </div>

      {/* <button
        type="button"
        onClick={() => onApply(loan)}
        className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 transition hover:text-blue-800"
      >
        Learn more
        <ArrowRight className="h-3.5 w-3.5" />
      </button> */}
    </div>
  );
};