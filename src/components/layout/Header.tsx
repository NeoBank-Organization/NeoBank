/**
 * ============================================================================
 * COMPONENT: Header.tsx
 * DESCRIPTION: Top navigation bar with logo, user profile summary, security badge, and quick actions.
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

export const Header: React.FC = () => {
  return (
    <header style={{ height: '64px', background: '#0F172A', color: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontWeight: 'bold', fontSize: '20px' }}>NeoBank Portal</div>
      <div>Customer Session: Active</div>
    </header>
  );
};
