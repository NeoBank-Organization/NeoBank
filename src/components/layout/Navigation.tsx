/**
 * ============================================================================
 * COMPONENT: Navigation.tsx
 * DESCRIPTION: Navigation link list with active route highlighting for customer and admin modules.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R01 - Mubina HVR
 * EMAIL: mubina.hvr@gmail.com
 * ROLE: Frontend foundation, security and integration lead
 * PRD REQUIREMENTS: BNK-FR-07 (Security & Timeout), System Architecture Foundation
 * SPRINT DELIVERABLES: Sprint 1 (S1-01, S1-02, S1-03, S1-04) & Sprint 2 (S2-01, S2-02, S2-03, S2-04)
 * PRIMARY RESPONSIBILITIES: Shared shell, navigation, session timeout, virtual keyboard, common states, integration support
 * ============================================================================
 */

import React from 'react';

import { NavLink } from 'react-router-dom';

export const Navigation: React.FC = () => {
  return (
    <nav style={{ padding: '16px' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><NavLink to="/accounts" style={{ color: '#fff' }}>Accounts</NavLink></li>
        <li><NavLink to="/spend-insights" style={{ color: '#fff' }}>Spend Insights (AI)</NavLink></li>
        <li><NavLink to="/beneficiaries" style={{ color: '#fff' }}>Beneficiaries</NavLink></li>
        <li><NavLink to="/transfer" style={{ color: '#fff' }}>Fund Transfer</NavLink></li>
        <li><NavLink to="/scheduled-transfers" style={{ color: '#fff' }}>Scheduled Transfers</NavLink></li>
        <li><NavLink to="/statements" style={{ color: '#fff' }}>Statements</NavLink></li>
        <li><NavLink to="/loans" style={{ color: '#fff' }}>Loans & EMI</NavLink></li>
        <li><NavLink to="/admin" style={{ color: '#fff' }}>Branch Admin</NavLink></li>
      </ul>
    </nav>
  );
};
