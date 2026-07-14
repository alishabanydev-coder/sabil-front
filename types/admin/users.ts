export type AdminUserRecord = {
  id: string;
  username: string;
  email: string;
  showAsAnonymousInDonations: boolean;
  donationProjects: string[];
  donationCount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
};

export type DonationProjectOption = {
  _id: string;
  title: string;
};

export type UserDonationRecord = {
  id: string;
  donationProjectId: string;
  projectTitle: string;
  amount: number;
  currency: string;
  source: string;
  createdAt: string;
};

export type DonationSource = "manual" | "patreon" | "whatsapp";

export type AdminUserEditPanel = "profile" | "donations";
