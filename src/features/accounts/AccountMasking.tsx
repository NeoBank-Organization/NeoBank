/**
 * ============================================================================
 * COMPONENT: AccountMasking.tsx
 * DESCRIPTION: Sensitive account number masking utility displaying masked digits by default
 *              (e.g., •••• •••• 4091) with interactive reveal toggle and clipboard copy.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R02 - Syd RJ
 * EMAIL: sydrj116@gmail.com
 * ROLE: Accounts feature owner
 * PRD REQUIREMENTS: BNK-FR-01 (Accounts), BNK-AI-02 (Spend Insights)
 * SPRINT DELIVERABLES: Sprint 1 (S1-05, S1-06, S1-07) & Sprint 2 (S2-05, S2-06, S2-07, S2-08)
 * PRIMARY RESPONSIBILITIES: Accounts dashboard, account details/tabs, loading/empty/error/refresh behavior, spend insights
 * ============================================================================
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';

export interface AccountMaskingProps {
  accountNumber: string;
  maskedAccountNumber?: string;
  label?: string;
  showLabel?: boolean;
  showCopy?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onToggleReveal?: (isRevealed: boolean) => void;
}

export const AccountMasking: React.FC<AccountMaskingProps> = ({
  accountNumber,
  maskedAccountNumber,
  label = 'Account Number',
  showLabel = false,
  showCopy = true,
  size = 'md',
  className = '',
  onToggleReveal,
}) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Normalize account numbers into clean 4-digit chunks
  const formatFullNumber = (num: string): string => {
    const clean = num.replace(/\s+/g, '');
    return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const getMaskedDisplay = (): string => {
    if (maskedAccountNumber && maskedAccountNumber.trim().length > 0) {
      return maskedAccountNumber;
    }
    const clean = accountNumber.replace(/\s+/g, '');
    const last4 = clean.slice(-4);
    if (clean.length <= 4) {
      return `•••• ${last4}`;
    }
    const groups = Math.max(1, Math.floor((clean.length - 4) / 4));
    const dots = Array(groups).fill('••••').join(' ');
    return `${dots} ${last4}`;
  };

  const displayText = isRevealed ? formatFullNumber(accountNumber) : getMaskedDisplay();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isRevealed;
    setIsRevealed(nextState);
    if (onToggleReveal) {
      onToggleReveal(nextState);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const rawNumber = accountNumber.replace(/\s+/g, '');
      await navigator.clipboard.writeText(rawNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback for non-secure contexts
      const textarea = document.createElement('textarea');
      textarea.value = accountNumber.replace(/\s+/g, '');
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const sizeClasses = {
    sm: {
      text: 'text-xs',
      btn: 'p-1',
      iconSize: 13,
      gap: 'gap-1.5',
    },
    md: {
      text: 'text-sm font-semibold',
      btn: 'p-1.5',
      iconSize: 15,
      gap: 'gap-2',
    },
    lg: {
      text: 'text-base font-bold',
      btn: 'p-2',
      iconSize: 17,
      gap: 'gap-2.5',
    },
  }[size];

  return (
    <div className={`inline-flex flex-col ${className}`}>
      {showLabel && (
        <span className="nb-account-mask-label mb-1">
          {label}
        </span>
      )}
      <div className={`nb-mask-container flex items-center ${sizeClasses.gap}`}>
        <span
          className={`nb-mask-text font-mono tracking-wider ${sizeClasses.text} ${
            isRevealed ? 'text-slate-900 font-bold' : 'text-slate-700'
          }`}
          data-testid="account-number-display"
        >
          {displayText}
        </span>

        <div className="flex items-center gap-1">
          {/* Reveal / Mask Toggle Button */}
          <button
            onClick={handleToggle}
            className="nb-mask-action-btn"
            title={isRevealed ? 'Mask account number' : 'Reveal account number'}
            aria-label={isRevealed ? 'Mask account number' : 'Reveal account number'}
            type="button"
          >
            {isRevealed ? (
              <EyeOff size={sizeClasses.iconSize} className="text-slate-600 hover:text-slate-900 transition-colors" />
            ) : (
              <Eye size={sizeClasses.iconSize} className="text-slate-600 hover:text-slate-900 transition-colors" />
            )}
          </button>

          {/* Copy Account Number Button */}
          {showCopy && (
            <button
              onClick={handleCopy}
              className="nb-mask-copy-btn relative"
              title={isCopied ? 'Copied!' : 'Copy account number'}
              aria-label="Copy account number"
              type="button"
            >
              {isCopied ? (
                <Check size={sizeClasses.iconSize} className="text-emerald-600" />
              ) : (
                <Copy size={sizeClasses.iconSize} className="text-slate-500 hover:text-slate-800 transition-colors" />
              )}
              {isCopied && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium px-1.5 py-0.5 rounded shadow whitespace-nowrap animate-fade-in z-20">
                  Copied!
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
