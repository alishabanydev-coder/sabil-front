export const dummyDonationProject = {
  _id: "674a1b2c3d4e5f6789012345",
  title: "Al-Furqan — Season 1",
  slug: "al-furqan-season-1",
  poster: "/news2.png",
  videoUrl: "https://www.youtube.com/watch?v=LXb3EKJoInQ",
  shortDescription:
    "An animated series following a young student of the Quran as he learns, grows, and helps his friends discover the beauty of Islam.",

  goalAmount: 25000,
  raisedAmount: 14250,
  currency: "USD" as const,

  sections: [
    {
      id: "about",
      header: "What is this project?",
      text: "Al-Furqan is a family-friendly animation project produced by Sabeel Kids. Through engaging stories and memorable characters, children learn Quranic values, good manners, and confidence in their faith.",
      images: ["/news2.png", "/news1.png"],
      order: 0,
    },
    {
      id: "goals",
      header: "Our goals",
      text: "Your support helps us complete Season 1 — including animation, voice acting, music, and distribution so families worldwide can watch for free.",
      images: ["/news1.png"],
      order: 1,
    },
    {
      id: "why-donate",
      header: null,
      text: "Every contribution — large or small — moves production forward and keeps Islamic entertainment accessible to children who need it most.",
      images: null,
      order: 2,
    },
    {
      id: "gallery",
      header: "Behind the scenes",
      text: null,
      images: ["/news2.png", "/news1.png", "/banner.png"],
      order: 3,
    },
  ],

  faq: [
    {
      header: "Where does my donation go?",
      summary:
        "Funds go directly toward production costs: animation, sound, editing, and publishing Season 1 of Al-Furqan.",
      order: 0,
    },
    {
      header: "Can I donate in INR?",
      summary:
        "This campaign accepts USD. INR support may be added in a future update — check the donate button for available options.",
      order: 1,
    },
    {
      header: "Is my donation refundable?",
      summary:
        "Donations are generally non-refundable unless the campaign is cancelled before production begins. Contact us for special cases.",
      order: 2,
    },
  ],

  startDate: "2026-01-01T00:00:00.000Z",
  endDate: "2026-12-31T23:59:59.000Z",
  status: "ongoing" as const,

  projectId: null,
  updateRefs: [
    {
      refType: "Blog" as const,
      refId: "674a1b2c3d4e5f6789012346",
      order: 0,
    },
    {
      refType: "BreakDown" as const,
      refId: "674a1b2c3d4e5f6789012347",
      order: 1,
    },
  ],

  showOnDonationPage: true,
  listOrder: 1,

  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-03-01T00:00:00.000Z",
};
