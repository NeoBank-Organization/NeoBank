/**
 * ============================================================================
 * COMPONENT: AppLayout.tsx
 * DESCRIPTION: Shared application shell wrapping header, sidebar navigation, idle timer, and content outlet.
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
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <Header />
      <div className="layout-body" style={{ display: 'flex' }}>
        <Sidebar />
        <main className="main-content" style={{ flex: 1, padding: '24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
