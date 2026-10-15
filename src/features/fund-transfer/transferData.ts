export interface TransferBeneficiary {
  id: string;
  name: string;
  nickname: string;
  bank: string;
  accountLast4: string;
  ifsc: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  addedDaysAgo: number;
}

export const transferBeneficiaries: TransferBeneficiary[] = [
  { id: 'ben-priya', name: 'Priya Sharma', nickname: 'Priya', bank: 'NeoBank', accountLast4: '6730', ifsc: 'NEOB0001042', status: 'ACTIVE', addedDaysAgo: 148 },
  { id: 'ben-rohan', name: 'Rohan Properties', nickname: 'Rohan Properties', bank: 'Horizon Bank', accountLast4: '1182', ifsc: 'HZBN0000291', status: 'ACTIVE', addedDaysAgo: 74 },
  { id: 'ben-aarav', name: 'Aarav Mehta', nickname: 'Aarav', bank: 'NeoBank', accountLast4: '9044', ifsc: 'NEOB0001042', status: 'PENDING', addedDaysAgo: 0 },
  { id: 'ben-sanya', name: 'Sanya Kapoor', nickname: 'Sanya', bank: 'Union Trust', accountLast4: '2219', ifsc: 'UNTR0001820', status: 'INACTIVE', addedDaysAgo: 210 },
];

export const transferLimits = {
  daily: 500_000,
  imps: 500_000,
  neft: 2_000_000,
  rtgsMinimum: 200_000,
  newBeneficiaryCoolingHours: 30,
};

export const recentTransfers = [
  { name: 'Priya Sharma', detail: 'NeoBank ·· 6730', amount: 12500, date: 'Today, 10:42 AM', status: 'Success' },
  { name: 'Rohan Properties', detail: 'Horizon Bank ·· 1182', amount: 42000, date: 'Yesterday', status: 'Success' },
  { name: 'Priya Sharma', detail: 'NeoBank ·· 6730', amount: 8500, date: '06 Oct 2026', status: 'Success' },
];

export const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 2,
}).format(amount);
