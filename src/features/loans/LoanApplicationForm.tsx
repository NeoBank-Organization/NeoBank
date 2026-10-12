/**
 * ============================================================================
 * COMPONENT: LoanApplicationForm.tsx
 * DESCRIPTION: Validated loan application form with submission and status tracking.
 * ============================================================================
 */

import React, { FormEvent, useEffect, useState } from "react";
import { LoanApplicationDetails } from "./LoanApplicationDetails";
import { LoanStatusTracker } from "./LoanStatusTracker";
import {
  getLoanApplications,
  LoanApplication,
  submitLoanApplication,
} from "./loanService";

interface LoanFormValues {
  applicant: string;
  loanType: string;
  amount: string;
  purpose: string;
  tenureMonths: string;
  monthlyIncome: string;
}

const initialValues: LoanFormValues = {
  applicant: "",
  loanType: "",
  amount: "",
  purpose: "",
  tenureMonths: "",
  monthlyIncome: "",
};

export const LoanApplicationForm: React.FC = () => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof LoanFormValues, string>>>({});
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [myApplications, setMyApplications] = useState<LoanApplication[]>([]);

  useEffect(() => {
    try {
      const userData = sessionStorage.getItem("user");
      const user = userData ? JSON.parse(userData) as { id?: string } : {};
      setMyApplications(
        getLoanApplications().filter(
          (savedApplication) => savedApplication.customerId === user.id
        )
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Saved loan applications could not be loaded."
      );
    }
  }, []);

  const updateField = (field: keyof LoanFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    const nextErrors: Partial<Record<keyof LoanFormValues, string>> = {};
    const amount = Number(values.amount);
    const tenureMonths = Number(values.tenureMonths);
    const monthlyIncome = Number(values.monthlyIncome);

    if (!values.applicant.trim()) nextErrors.applicant = "Enter the applicant name.";
    if (!values.loanType) nextErrors.loanType = "Choose a loan type.";
    if (!Number.isFinite(amount) || amount <= 0) {
      nextErrors.amount = "Enter a loan amount greater than zero.";
    }
    if (!values.purpose.trim()) nextErrors.purpose = "Enter the loan purpose.";
    if (!Number.isInteger(tenureMonths) || tenureMonths < 1 || tenureMonths > 360) {
      nextErrors.tenureMonths = "Enter a tenure from 1 to 360 months.";
    }
    if (!Number.isFinite(monthlyIncome) || monthlyIncome <= 0) {
      nextErrors.monthlyIncome = "Enter a monthly income greater than zero.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    let customerId = "customer";
    try {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        const user: unknown = JSON.parse(userData);
        if (
          typeof user === "object" &&
          user !== null &&
          "id" in user &&
          typeof user.id === "string"
        ) {
          customerId = user.id;
        }
      }

      const submittedApplication = submitLoanApplication({
        customerId,
        applicant: values.applicant.trim(),
        loanType: values.loanType,
        amount,
        purpose: values.purpose.trim(),
        tenureMonths,
        monthlyIncome,
      });
      setApplication(submittedApplication);
      setMyApplications((current) => [...current, submittedApplication]);
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "The loan application could not be submitted."
      );
    }
  };

  if (isSubmitted && application) {
    return (
      <section className="mx-auto max-w-4xl space-y-6">
        <header>
          <p className="text-sm font-medium text-blue-700">Loan application</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Application submitted
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Reference: {application.id}
          </p>
        </header>
        <LoanStatusTracker status={application.status} />
        <LoanApplicationDetails application={application} />
        <button
          type="button"
          onClick={() => {
            setValues(initialValues);
            setApplication(null);
            setIsSubmitted(false);
            setErrors({});
          }}
          className="rounded-lg border border-blue-700 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
        >
          Apply for another loan
        </button>
      </section>
    );
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-sm font-medium text-blue-700">Loans</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Apply for a loan
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Complete the details below to submit your application.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="loan-applicant" className="text-sm font-medium text-slate-700">
            Applicant name
          </label>
          <input
            id="loan-applicant"
            value={values.applicant}
            onChange={(event) => updateField("applicant", event.target.value)}
            className={inputClass}
            autoComplete="name"
            aria-invalid={Boolean(errors.applicant)}
            aria-describedby={errors.applicant ? "loan-applicant-error" : undefined}
          />
          {errors.applicant && <p id="loan-applicant-error" className="mt-1 text-sm text-red-700">{errors.applicant}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="loan-type" className="text-sm font-medium text-slate-700">
              Loan type
            </label>
            <select
              id="loan-type"
              value={values.loanType}
              onChange={(event) => updateField("loanType", event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.loanType)}
            >
              <option value="">Select loan type</option>
              <option value="Personal">Personal</option>
              <option value="Home">Home</option>
              <option value="Education">Education</option>
              <option value="Vehicle">Vehicle</option>
            </select>
            {errors.loanType && <p className="mt-1 text-sm text-red-700">{errors.loanType}</p>}
          </div>

          <div>
            <label htmlFor="loan-amount" className="text-sm font-medium text-slate-700">
              Requested amount (INR)
            </label>
            <input
              id="loan-amount"
              type="number"
              min="1"
              step="0.01"
              value={values.amount}
              onChange={(event) => updateField("amount", event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.amount)}
            />
            {errors.amount && <p className="mt-1 text-sm text-red-700">{errors.amount}</p>}
          </div>

          <div>
            <label htmlFor="loan-tenure" className="text-sm font-medium text-slate-700">
              Tenure (months)
            </label>
            <input
              id="loan-tenure"
              type="number"
              min="1"
              max="360"
              step="1"
              value={values.tenureMonths}
              onChange={(event) => updateField("tenureMonths", event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.tenureMonths)}
            />
            {errors.tenureMonths && <p className="mt-1 text-sm text-red-700">{errors.tenureMonths}</p>}
          </div>

          <div>
            <label htmlFor="loan-income" className="text-sm font-medium text-slate-700">
              Monthly income (INR)
            </label>
            <input
              id="loan-income"
              type="number"
              min="1"
              step="0.01"
              value={values.monthlyIncome}
              onChange={(event) => updateField("monthlyIncome", event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.monthlyIncome)}
            />
            {errors.monthlyIncome && <p className="mt-1 text-sm text-red-700">{errors.monthlyIncome}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="loan-purpose" className="text-sm font-medium text-slate-700">
            Loan purpose
          </label>
          <textarea
            id="loan-purpose"
            rows={3}
            value={values.purpose}
            onChange={(event) => updateField("purpose", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.purpose)}
          />
          {errors.purpose && <p className="mt-1 text-sm text-red-700">{errors.purpose}</p>}
        </div>

        {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}

        <button
          type="submit"
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit application
        </button>
      </form>

      {myApplications.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Your loan applications
          </h2>
          {myApplications.map((savedApplication) => (
            <article
              key={savedApplication.id}
              className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-900">
                  {savedApplication.loanType} loan
                </h3>
                <span className="text-xs text-slate-500">
                  Reference: {savedApplication.id}
                </span>
              </div>
              <LoanStatusTracker
                status={savedApplication.status}
                rejectionReason={savedApplication.rejectionReason}
              />
              <LoanApplicationDetails application={savedApplication} />
            </article>
          ))}
        </section>
      )}
    </section>
  );
};
