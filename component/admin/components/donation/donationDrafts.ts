export type SectionImageDraft = {
  url: string;
  file?: File;
};

export type SectionDraft = {
  id: string;
  header: string;
  text: string;
  images: SectionImageDraft[];
  order: number;
};

export type FaqDraft = {
  header: string;
  summary: string;
  order: number;
};

export type ProjectStepStatus =
  | "upcoming"
  | "in_progress"
  | "completed"
  | "skipped";

export type ProjectStepDraft = {
  id: string;
  label: string;
  status: ProjectStepStatus;
  spentAmount: number;
  order: number;
};

export type StaffMemberDraft = {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  order: number;
};

export type UpdateRefType = "Blog" | "BreakDown";
export type UpdateSource = "existing" | "new";

export type UpdateDraft = {
  id: string;
  refType: UpdateRefType;
  refId: string;
  source: UpdateSource;
  title: string;
  subHeader: string;
  content: string;
  images: string[];
  videoUrl: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  order: number;
};

export type UpdateRefPayload = {
  refType: UpdateRefType;
  refId: string;
  order: number;
};

export function mapSectionsFromApi(
  sections: Array<{
    id: string;
    header?: string | null;
    text?: string | null;
    images?: string[];
    order?: number;
  }> = []
): SectionDraft[] {
  return sections.map((section, index) => ({
    id: section.id,
    header: section.header ?? "",
    text: section.text ?? "",
    images: (section.images ?? []).map((url) => ({ url })),
    order: section.order ?? index,
  }));
}

export function mapFaqFromApi(
  faq: Array<{ header?: string; summary?: string; order?: number }> = []
): FaqDraft[] {
  return faq.map((item, index) => ({
    header: item.header ?? "",
    summary: item.summary ?? "",
    order: item.order ?? index,
  }));
}

export function mapStepsFromApi(
  steps: Array<{
    id?: string;
    label?: string;
    status?: ProjectStepStatus;
    spentAmount?: number;
    order?: number;
  }> = []
): ProjectStepDraft[] {
  return steps.map((step, index) => ({
    id: step.id || `step-${index}`,
    label: step.label ?? "",
    status: step.status ?? "upcoming",
    spentAmount: Number(step.spentAmount ?? 0),
    order: step.order ?? index,
  }));
}

export function mapStaffFromApi(
  staff: Array<{
    id?: string;
    name?: string;
    role?: string;
    photo?: string | null;
    bio?: string | null;
    order?: number;
  }> = []
): StaffMemberDraft[] {
  return staff.map((member, index) => ({
    id: member.id || `staff-${index}`,
    name: member.name ?? "",
    role: member.role ?? "",
    photo: member.photo ?? "",
    bio: member.bio ?? "",
    order: member.order ?? index,
  }));
}

export function mapUpdateRefsToPayload(updates: UpdateDraft[]): UpdateRefPayload[] {
  return updates
    .filter((update) => update.refId)
    .map((update, index) => ({
      refType: update.refType,
      refId: update.refId,
      order: update.order ?? index,
    }));
}

type HydrateBlog = {
  _id: string;
  title: string;
  subHeader?: string;
  content: string;
  image?: string[];
  videoUrl?: string;
  createdAt?: string;
};

type HydrateBreakdown = {
  _id: string;
  title: string;
  content: string;
  thumbnail?: string;
  videoUrl?: string;
  createdAt?: string;
};

export function hydrateUpdateRefs(
  updateRefs: UpdateRefPayload[] = [],
  blogs: HydrateBlog[] = [],
  breakdowns: HydrateBreakdown[] = []
): UpdateDraft[] {
  return updateRefs
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((ref, index) => {
      if (ref.refType === "Blog") {
        const blog = blogs.find((item) => item._id === String(ref.refId));
        if (!blog) {
          return {
            id: `missing-blog-${ref.refId}`,
            refType: "Blog" as const,
            refId: String(ref.refId),
            source: "existing" as const,
            title: "Missing blog",
            subHeader: "",
            content: "",
            images: [],
            videoUrl: "",
            authorName: "Sabeel Media Cast",
            authorAvatar: "/avatar1.webp",
            createdAt: new Date().toISOString(),
            order: ref.order ?? index,
          };
        }

        return {
          id: `blog-${blog._id}`,
          refType: "Blog",
          refId: blog._id,
          source: "existing",
          title: blog.title,
          subHeader: blog.subHeader ?? "",
          content: blog.content,
          images: blog.image ?? [],
          videoUrl: blog.videoUrl ?? "",
          authorName: "Sabeel Media Cast",
          authorAvatar: "/avatar1.webp",
          createdAt: blog.createdAt ?? new Date().toISOString(),
          order: ref.order ?? index,
        };
      }

      const breakdown = breakdowns.find((item) => item._id === String(ref.refId));
      if (!breakdown) {
        return {
          id: `missing-breakdown-${ref.refId}`,
          refType: "BreakDown" as const,
          refId: String(ref.refId),
          source: "existing" as const,
          title: "Missing breakdown",
          subHeader: "",
          content: "",
          images: [],
          videoUrl: "",
          authorName: "Sabeel Media Cast",
          authorAvatar: "/avatar1.webp",
          createdAt: new Date().toISOString(),
          order: ref.order ?? index,
        };
      }

      return {
        id: `breakdown-${breakdown._id}`,
        refType: "BreakDown",
        refId: breakdown._id,
        source: "existing",
        title: breakdown.title,
        subHeader: "",
        content: breakdown.content,
        images: breakdown.thumbnail ? [breakdown.thumbnail] : [],
        videoUrl: breakdown.videoUrl ?? "",
        authorName: "Sabeel Media Cast",
        authorAvatar: "/avatar1.webp",
        createdAt: breakdown.createdAt ?? new Date().toISOString(),
        order: ref.order ?? index,
      };
    });
}
