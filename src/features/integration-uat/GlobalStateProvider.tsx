/**
 * ============================================================================
 * COMPONENT: GlobalStateProvider.tsx
 * DESCRIPTION: Global shared state context holding customer profile, active theme, and mock data.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R09 - Thejashree Y K
 * EMAIL: thejashreeyk918@gmail.com
 * ROLE: Integration / UX states / UAT owner
 * PRD REQUIREMENTS: Cross-Module Integration, UX Consistency, PRD UAT Validation
 * SPRINT DELIVERABLES: Sprint 1 (S1-31, S1-32) & Sprint 2 (S2-26, S2-27, S2-28)
 * PRIMARY RESPONSIBILITIES: Cross-module integration, shared UX-state checks, regression, UAT scenario support
 * ============================================================================
 */

import React, { createContext, useContext } from 'react';

const GlobalStateContext = createContext<any>(null);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <GlobalStateContext.Provider value={{}}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
