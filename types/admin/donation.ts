export type AdminDonationProjectRecord = {
  _id: string;
  title: string;
  status?: string;
  goalAmount?: number;
  raisedAmount?: number;
  currency?: string;
  listOrder?: number | null;
  showOnDonationPage?: boolean;
};
