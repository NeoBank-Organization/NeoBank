export type LoanApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface LoanApplication {
  id: string;
  customerId: string;
  applicant: string;
  loanType: string;
  amount: number;
  purpose: string;
  tenureMonths: number;
  monthlyIncome: number;
  submittedAt: string;
  status: LoanApplicationStatus;
  rejectionReason?: string;
}

const STORAGE_KEY = "neobank.loanApplications";

export const getLoanApplications = (): LoanApplication[] => {
  const storedApplications = localStorage.getItem(STORAGE_KEY);
  if (!storedApplications) return [];

  const parsed: unknown = JSON.parse(storedApplications);
  if (
    !Array.isArray(parsed) ||
    !parsed.every(
      (application) =>
        typeof application?.id === "string" &&
        typeof application?.customerId === "string" &&
        typeof application?.applicant === "string" &&
        typeof application?.amount === "number" &&
        typeof application?.status === "string"
    )
  ) {
    throw new Error("Saved loan applications have an invalid format.");
  }

  return parsed as LoanApplication[];
};

const saveLoanApplications = (applications: LoanApplication[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
};

export const submitLoanApplication = (
  application: Omit<LoanApplication, "id" | "submittedAt" | "status">
): LoanApplication => {
  const applications = getLoanApplications();
  const newApplication: LoanApplication = {
    ...application,
    id: `LOAN-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    submittedAt: new Date().toISOString(),
    status: "SUBMITTED",
  };

  saveLoanApplications([...applications, newApplication]);
  return newApplication;
};

export const updateLoanApplicationStatus = (
  id: string,
  status: LoanApplicationStatus,
  rejectionReason?: string
): LoanApplication[] => {
  const applications = getLoanApplications();
  if (!applications.some((application) => application.id === id)) {
    throw new Error("Loan application was not found.");
  }

  const updatedApplications = applications.map((application) =>
    application.id === id
      ? { ...application, status, rejectionReason }
      : application
  );
  saveLoanApplications(updatedApplications);
  return updatedApplications;
};
