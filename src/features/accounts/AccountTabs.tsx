/**
 * ============================================================================
 * COMPONENT: AccountTabs.tsx
 * DESCRIPTION: Tab switcher for Account Overview, Transactions history, and Account Info/Limits.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R02 - Syd RJ
 * EMAIL: sydrj116@gmail.com
 * ROLE: Accounts feature owner
 * PRD REQUIREMENTS: BNK-FR-01 (Accounts), BNK-AI-02 (Spend Insights)
 * SPRINT DELIVERABLES: Sprint 1 (S1-05, S1-06, S1-07) & Sprint 2 (S2-05, S2-06, S2-07, S2-08)
 * PRIMARY RESPONSIBILITIES: Accounts dashboard, account details/tabs, loading/empty/error/refresh behavior, spend insights
 * ============================================================================
 */

import React from 'react';
import { LayoutDashboard, ArrowLeftRight, ShieldCheck } from 'lucide-react';

export type AccountTabKey = 'overview' | 'transactions' | 'info';

export interface AccountTabsProps {
  activeTab: AccountTabKey;
  onTabChange: (tab: AccountTabKey) => void;
  transactionCount?: number;
  className?: string;
}

export const AccountTabs: React.FC<AccountTabsProps> = ({
  activeTab,
  onTabChange,
  transactionCount,
  className = '',
}) => {
  const tabs: Array<{
    id: AccountTabKey;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    description: string;
  }> = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard size={17} />,
      description: 'Account balance & highlights',
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: <ArrowLeftRight size={17} />,
      badge: transactionCount !== undefined ? transactionCount : undefined,
      description: 'Activity & transaction history',
    },
    {
      id: 'info',
      label: 'Account Info/Limits',
      icon: <ShieldCheck size={17} />,
      description: 'IFSC, branch, limits & security',
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Account details navigation"
      className={`nb-tabs-nav-bar flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`account-tab-${tab.id}`}
            aria-controls={`account-tabpanel-${tab.id}`}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            type="button"
            className={`nb-tab-btn flex items-center gap-2.5 px-4 py-3 text-sm font-semibold rounded-t-lg transition-all duration-150 border-b-2 whitespace-nowrap ${
              isActive
                ? 'nb-tab-btn-active text-blue-600 border-blue-600 bg-blue-50/50 shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
