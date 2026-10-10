export type TransferType = 'own' | 'beneficiary' | 'upi';
export type TransferRail = 'IMPS' | 'NEFT' | 'RTGS';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface TransferDraft {
  transferType: TransferType;
  sourceAccountId: string;
  destinationId: string;
  rail: TransferRail;
  amount: string;
  note: string;
}

export interface TransferError {
  field: keyof TransferDraft;
  message: string;
}

export interface TransferReceipt {
  reference: string;
  amount: number;
  recipient: string;
  completedAt: string;
  rail: TransferRail | 'OWN ACCOUNT';
}
