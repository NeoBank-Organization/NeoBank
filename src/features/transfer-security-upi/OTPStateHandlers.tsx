/**
 * ============================================================================
 * COMPONENT: OTPStateHandlers.tsx
 * DESCRIPTION: Controls confirmation, PIN, OTP, and transaction result states.
 * FEATURE OWNER: R05 - Ramya N
 * EMAIL: ramyan.s1814009@gmail.com
 * ROLE: Transfer security & mock UPI owner
 * PRD REQUIREMENTS: BNK-FR-03, BNK-AI-05
 * SPRINT DELIVERABLES: S1-16, S1-17, S1-18, S1-19, S2-18, S2-19, S2-20
 * ============================================================================
 */

import { useState } from "react";
import { TransferConfirmationDialog } from "./TransferConfirmationDialog";
import { UPIPinModal } from "./UPIPinModal";
import { OTPVerificationModal } from "./OTPVerificationModal";
import {
  TransactionResult,
  type TransactionResultData,
  type TransactionStatus,
} from "./TransactionResult";

export type TransferMethod = "UPI" | "BANK" | "OWN_ACCOUNT";

export interface OTPStateHandlersProps {
  recipient: string;
  amount: number;
  sourceAccount?: string;
  note?: string;
  method?: TransferMethod;
  onComplete?: (transaction: TransactionResultData) => void;
  onCancel?: () => void;
}

type FlowStage = "CONFIRM" | "PIN" | "OTP" | "RESULT";

const DEMO_UPI_PIN = "1234";
const DEMO_OTP = "123456";
const MAX_ATTEMPTS = 3;

const makeReference = () =>
  `NB${Date.now().toString().slice(-10)}`;

export const OTPStateHandlers = ({
  recipient,
  amount,
  sourceAccount,
  note,
  method = "UPI",
  onComplete,
  onCancel,
}: OTPStateHandlersProps) => {
  const [stage, setStage] = useState<FlowStage>("CONFIRM");
  const [pinError, setPinError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState(MAX_ATTEMPTS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [transaction, setTransaction] =
    useState<TransactionResultData | null>(null);

  const resetFlow = () => {
    setStage("CONFIRM");
    setPinError("");
    setOtpError("");
    setAttemptsRemaining(MAX_ATTEMPTS);
    setIsVerifying(false);
    setTransaction(null);
  };

  const cancelFlow = () => {
    resetFlow();
    onCancel?.();
  };

  const startSecurity = () => {
    setPinError("");
    setOtpError("");
    setAttemptsRemaining(MAX_ATTEMPTS);
    setStage(method === "UPI" ? "PIN" : "OTP");
  };

  const handlePinVerify = (pin: string) => {
    if (pin !== DEMO_UPI_PIN) {
      setPinError("Incorrect demo PIN. Please enter 1234.");
      return;
    }

    setPinError("");
    setStage("OTP");
  };

  const handleOtpVerify = (otp: string) => {
    if (isVerifying) return;

    if (otp !== DEMO_OTP) {
      const nextAttempts = attemptsRemaining - 1;
      setAttemptsRemaining(nextAttempts);

      if (nextAttempts <= 0) {
        finishTransaction("HELD", "Too many incorrect OTP attempts. Transfer held by demo security.");
      } else {
        setOtpError("Incorrect demo OTP. Please try again.");
      }
      return;
    }

    setOtpError("");
    setIsVerifying(true);

    // Simulate processing without calling a real banking service.
    const status: TransactionStatus =
      amount > 50000 ? "HELD" : "SUCCESS";

    const message =
      status === "HELD"
        ? "This high-value transfer was held by the demo security rule."
        : "The simulated transfer has completed.";

    finishTransaction(status, message);
    setIsVerifying(false);
  };

  const finishTransaction = (
    status: TransactionStatus,
    message: string,
  ) => {
    const result: TransactionResultData = {
      reference: makeReference(),
      amount,
      recipient,
      completedAt: new Date().toLocaleString(),
      method,
      status,
      message,
    };

    setTransaction(result);
    setStage("RESULT");
    onComplete?.(result);
  };

  const handleRetry = () => {
    setOtpError("");
    setPinError("");
    setAttemptsRemaining(MAX_ATTEMPTS);
    setStage(method === "UPI" ? "PIN" : "OTP");
  };

  if (stage === "RESULT" && transaction) {
    return (
      <TransactionResult
        status={transaction.status}
        transaction={transaction}
        onNewTransfer={resetFlow}
        onRetry={transaction.status === "FAILED" ? handleRetry : undefined}
      />
    );
  }

  return (
    <>
      <TransferConfirmationDialog
        open={stage === "CONFIRM"}
        recipient={recipient}
        amount={amount}
        sourceAccount={sourceAccount}
        note={note}
        onConfirm={startSecurity}
        onCancel={cancelFlow}
      />

      <UPIPinModal
        open={stage === "PIN"}
        error={pinError}
        isVerifying={isVerifying}
        onVerify={handlePinVerify}
        onCancel={cancelFlow}
      />

      <OTPVerificationModal
        open={stage === "OTP"}
        recipient={recipient}
        error={otpError}
        attemptsRemaining={attemptsRemaining}
        isVerifying={isVerifying}
        onVerify={handleOtpVerify}
        onCancel={cancelFlow}
        onResend={() => setOtpError("Demo OTP reset. Use 123456 to continue.")}
      />
    </>
  );
};

export default OTPStateHandlers;