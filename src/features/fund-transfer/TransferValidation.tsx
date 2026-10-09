import type { TransferDraft, TransferError } from './transfer.types';
import type { AccountSummary } from '../../types/account.types';
import { transferBeneficiaries, transferLimits } from './transferData';

export function validateTransfer(draft: TransferDraft, accounts: AccountSummary[]): TransferError[] {
  const errors: TransferError[] = [];
  const amount = Number(draft.amount);
  const source = accounts.find((account) => account.accountId === draft.sourceAccountId);

  if (!draft.sourceAccountId) errors.push({ field: 'sourceAccountId', message: 'Choose an account to send from.' });
  if (draft.transferType !== 'upi' && !draft.destinationId) errors.push({ field: 'destinationId', message: 'Choose a recipient.' });
  if (draft.transferType === 'upi' && !/^[-a-zA-Z0-9._]{2,}@[a-zA-Z]{2,}$/.test(draft.destinationId)) {
    errors.push({ field: 'destinationId', message: 'Enter a valid UPI ID, like name@bank.' });
  }
  if (!draft.amount || !Number.isFinite(amount) || amount <= 0) errors.push({ field: 'amount', message: 'Enter an amount greater than ₹0.' });
  if (amount > transferLimits.daily) errors.push({ field: 'amount', message: 'This exceeds your ₹5,00,000 daily transfer limit.' });
  if (draft.rail === 'IMPS' && amount > transferLimits.imps) errors.push({ field: 'amount', message: 'IMPS transfers are limited to ₹5,00,000.' });
  if (draft.rail === 'RTGS' && amount < transferLimits.rtgsMinimum) errors.push({ field: 'amount', message: 'RTGS is available for transfers of ₹2,00,000 or more.' });
  if (source && amount > source.availableBalance) errors.push({ field: 'amount', message: 'The amount is greater than your available balance.' });
  if (draft.transferType === 'own' && draft.sourceAccountId === draft.destinationId) errors.push({ field: 'destinationId', message: 'Choose a different destination account.' });

  const beneficiary = transferBeneficiaries.find((item) => item.id === draft.destinationId);
  if (beneficiary?.status !== undefined && beneficiary.status !== 'ACTIVE') {
    errors.push({ field: 'destinationId', message: beneficiary.status === 'PENDING' ? 'This beneficiary is still in the activation period.' : 'This beneficiary is inactive.' });
  }
  if (beneficiary && beneficiary.addedDaysAgo < 1) {
    errors.push({ field: 'destinationId', message: `New beneficiaries can receive transfers after the ${transferLimits.newBeneficiaryCoolingHours}-hour activation period.` });
  }
  return errors;
}
