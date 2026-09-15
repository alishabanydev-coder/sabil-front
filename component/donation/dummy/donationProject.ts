export const dummyDonationProject = {
  _id: "674a1b2c3d4e5f6789012345",
  title: "Al-Furqan — Season 1",
  slug: "al-furqan-season-1",
  poster: "/news2.webp",
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
      images: ["/news2.webp", "/news1.webp"],
      order: 0,
    },
    {
      id: "goals",
      header: "Our goals",
      text: "Your support helps us complete Season 1 — including animation, voice acting, music, and distribution so families worldwide can watch for free.",
      images: ["/news1.webp"],
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
      images: ["/news2.webp", "/news1.webp", "/banner.webp"],
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

  steps: [
    {
      id: "writing",
      label: "Writing",
      status: "completed" as const,
      spentAmount: 200,
      order: 0,
    },
    {
      id: "modeling",
      label: "Modeling",
      status: "completed" as const,
      spentAmount: 200,
      order: 1,
    },
    {
      id: "animating",
      label: "Animating",
      status: "in_progress" as const,
      spentAmount: 0,
      order: 2,
    },
    {
      id: "editing",
      label: "Editing",
      status: "upcoming" as const,
      spentAmount: 0,
      order: 3,
    },
  ],

  staff: [
    {
      id: "director",
      name: "Sabeel Studio",
      role: "Director",
      photo: "/avatar1.webp",
      bio: "Leads story, voice direction, and production.",
      order: 0,
    },
  ],

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

  updates: [
    {
      id: "674a1b2c3d4e5f6789012346",
      refType: "Blog" as const,
      order: 0,
      title: "Season 1 voice recording is underway!",
      subHeader: "A peek behind the mic with our cast",
      content:
        "Our voice actors have started recording dialogue for Episodes 1–3, and the energy in the studio has been incredible. Thank you for helping us reach this milestone — your donations made studio time, sound engineering, and rehearsal sessions possible.\n\nOver the past two weeks, the cast worked through more than forty pages of script. Each line is recorded multiple times so we can choose the take that best captures warmth, clarity, and the spirit of the characters children will grow to love. Our director sits with educators after every session to make sure pronunciation, pacing, and emotional tone stay faithful to the lessons we want families to take home.\n\nIn the mixing room, we are layering ambient sound, gentle music, and subtle effects that help young viewers stay immersed without overwhelming the dialogue. Episode 1 is nearly ready for an internal preview, and we hope to share a short behind-the-scenes clip with supporters very soon.\n\nWe could not do this without you. Every contribution — whether it funded a single recording hour or an entire week of post-production — is visible in the work happening right now. Please keep sharing the campaign with friends and family who believe in accessible Islamic media for children.",
      createdAt: "2026-06-20T10:00:00.000Z",
      authorName: "Sabeel Media Cast",
      authorAvatar: "/avatar1.webp",
      images: ["/news1.webp", "/news2.webp"],
      videoUrl: "https://www.youtube.com/watch?v=LXb3EKJoInQ",
    },
    {
      id: "674a1b2c3d4e5f6789012347",
      refType: "BreakDown" as const,
      order: 1,
      title: "How we storyboard each episode",
      content:
        "Every Al-Furqan episode begins as a storyboard sequence drawn by our animation team. Artists sketch key scenes frame by frame, directors review pacing and camera movement, and educators check that each lesson lands clearly for young viewers before anything moves into full production.\n\nFor a typical eight-minute episode, we produce between sixty and eighty storyboard panels. Each panel shows character placement, background details, and notes about dialogue timing. This stage is where we catch problems early — a joke that does not land, a visual that might confuse younger children, or a moment that needs more space for reflection.\n\nOnce the storyboard is approved, it is handed to the layout team, who build rough animatics. These low-detail previews let us hear the script alongside basic motion, which often reveals where scenes feel too rushed or too slow. Only after that review do we commit to the more expensive stages of animation, coloring, and compositing.\n\nSupporters who follow this campaign are helping fund exactly this kind of careful craft. Storyboarding is not a quick sketch; it is the blueprint that keeps the whole season coherent, beautiful, and meaningful for the families who will watch it.",
      createdAt: "2026-05-12T14:30:00.000Z",
      authorName: "Sabeel Media Cast",
      authorAvatar: "/avatar1.webp",
      images: ["/news2.webp"],
      videoUrl: "https://www.youtube.com/watch?v=LXb3EKJoInQ",
    },
  ],

  showOnDonationPage: true,
  listOrder: 1,

  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-03-01T00:00:00.000Z",
};
