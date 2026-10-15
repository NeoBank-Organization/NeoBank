/**
 * ============================================================================
 * COMPONENT: OTPStateHandlers.tsx
 * DESCRIPTION: Controls confirmation, PIN, OTP, expiry, and transaction result states.
 * ----------------------------------------------------------------------------
 * FEATURE OWNER: R05 - Ramya N
 * EMAIL: ramyan.s1814009@gmail.com
 * ROLE: Transfer security & mock UPI owner
 * PRD REQUIREMENTS: BNK-FR-03, BNK-AI-05
 * SPRINT DELIVERABLES: S1-16, S1-17, S1-18, S1-19, S2-18, S2-19, S2-20
 * ============================================================================
 */
import { useEffect, useState } from "react";
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
  simulatedOutcome?: TransactionStatus;
  onComplete?: (transaction: TransactionResultData) => void;
  onCancel?: () => void;
  onNewTransfer?: () => void;
}

type FlowStage = "CONFIRM" | "PIN" | "OTP" | "RESULT";

const DEMO_UPI_PIN = "1234";
const DEMO_OTP = "123456";
const MAX_ATTEMPTS = 3;
const DEMO_OTP_EXPIRY_SECONDS = 60;

const makeReference = () => `NB${Date.now().toString().slice(-10)}`;

export const OTPStateHandlers = ({
  recipient,
  amount,
  sourceAccount,
  note,
  method = "UPI",
  simulatedOutcome = "SUCCESS",
  onComplete,
  onCancel,
  onNewTransfer,
}: OTPStateHandlersProps) => {
  const [stage, setStage] = useState<FlowStage>("CONFIRM");
  const [pinError, setPinError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [pinAttemptsRemaining, setPinAttemptsRemaining] =
    useState(MAX_ATTEMPTS);
  const [otpAttemptsRemaining, setOtpAttemptsRemaining] =
    useState(MAX_ATTEMPTS);
  const [otpExpired, setOtpExpired] = useState(false);
  const [otpExpirySecondsRemaining, setOtpExpirySecondsRemaining] = useState(
    DEMO_OTP_EXPIRY_SECONDS,
  );
  const [transaction, setTransaction] =
    useState<TransactionResultData | null>(null);

  const resetFlow = () => {
    setStage("CONFIRM");
    setPinError("");
    setOtpError("");
    setPinAttemptsRemaining(MAX_ATTEMPTS);
    setOtpAttemptsRemaining(MAX_ATTEMPTS);
    setOtpExpired(false);
    setOtpExpirySecondsRemaining(DEMO_OTP_EXPIRY_SECONDS);
    setTransaction(null);
  };

  const cancelFlow = () => {
    resetFlow();
    onCancel?.();
  };

  const startNewTransfer = () => {
    resetFlow();
    onNewTransfer?.();
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

  const startSecurity = () => {
    setPinError("");
    setOtpError("");
    setPinAttemptsRemaining(MAX_ATTEMPTS);
    setOtpAttemptsRemaining(MAX_ATTEMPTS);
    setOtpExpired(false);
    setOtpExpirySecondsRemaining(DEMO_OTP_EXPIRY_SECONDS);
    setStage(method === "UPI" ? "PIN" : "OTP");
  };

  useEffect(() => {
    if (stage !== "OTP" || otpExpired) {
      return;
    }

    const countdown = setInterval(() => {
      setOtpExpirySecondsRemaining((seconds) => {
        if (seconds <= 1) {
          clearInterval(countdown);
          setOtpExpired(true);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [stage, otpExpired]);

  const handlePinVerify = (pin: string) => {
    if (pin !== DEMO_UPI_PIN) {
      const remaining = pinAttemptsRemaining - 1;
      setPinAttemptsRemaining(remaining);

      if (remaining <= 0) {
        setPinError("");
        finishTransaction(
          "HELD",
          "The transfer was held after three incorrect demo PIN attempts.",
        );
      } else {
        setPinError(
          `Incorrect demo PIN. Use 1234. ${remaining} attempt(s) remaining.`,
        );
      }

      return;
    }

    setPinError("");
    setStage("OTP");
  };

  const handleOtpVerify = (otp: string) => {
    if (otpExpired) {
      setOtpError("This demo OTP has expired. Please resend the OTP.");
      return;
    }

    if (otp !== DEMO_OTP) {
      const remaining = otpAttemptsRemaining - 1;
      setOtpAttemptsRemaining(remaining);

      if (remaining <= 0) {
        setOtpError("");
        finishTransaction(
          "HELD",
          "The transfer was held after three incorrect demo OTP attempts.",
        );
      } else {
        setOtpError(
          `Incorrect demo OTP. Use 123456. ${remaining} attempt(s) remaining.`,
        );
      }

      return;
    }

    setOtpError("");

    switch (simulatedOutcome) {
      case "SUCCESS":
        finishTransaction(
          "SUCCESS",
          "The simulated transfer completed successfully. No real funds were moved.",
        );
        break;

      case "FAILED":
        finishTransaction(
          "FAILED",
          "The simulated transfer failed. No real funds were moved.",
        );
        break;

      case "HELD":
        finishTransaction(
          "HELD",
          "The simulated security check has placed this transfer on hold. No real funds were moved.",
        );
        break;
    }
  };

  const handleResendOtp = () => {
    setOtpExpired(false);
    setOtpExpirySecondsRemaining(DEMO_OTP_EXPIRY_SECONDS);
    setOtpAttemptsRemaining(MAX_ATTEMPTS);
    setOtpError("");
  };

  if (stage === "RESULT" && transaction) {
    return (
      <TransactionResult
        status={transaction.status}
        transaction={transaction}
        onNewTransfer={startNewTransfer}
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
        attemptsRemaining={pinAttemptsRemaining}
        onVerify={handlePinVerify}
        onCancel={cancelFlow}
      />

      <OTPVerificationModal
        open={stage === "OTP"}
        recipient={recipient}
        error={otpError}
        attemptsRemaining={otpAttemptsRemaining}
        expired={otpExpired}
        expirySecondsRemaining={otpExpirySecondsRemaining}
        onVerify={handleOtpVerify}
        onCancel={cancelFlow}
        onResend={handleResendOtp}
      />
    </>
  );
};

export default OTPStateHandlers;