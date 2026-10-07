/**
 * ============================================================================
 * COMPONENT: Sidebar.tsx
 * DESCRIPTION: Side navigation menu containing links to all core banking modules.
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

import { Navigation } from './Navigation';

export const Sidebar: React.FC = () => {
  return (
    <aside style={{ width: '240px', background: '#1E293B', color: '#fff', minHeight: 'calc(100vh - 64px)' }}>
      <Navigation />
    </aside>
  );
};
