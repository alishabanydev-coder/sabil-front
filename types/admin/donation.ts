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

export type AdminDonationCommentRecord = {
  _id: string;
  text: string;
  username: string;
  avatar?: string;
  showInDonationPage?: boolean;
  donationPageOrder?: number | null;
};
