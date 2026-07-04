export type PublicComment = {
  _id: string;
  text: string;
  username: string;
  avatar?: string;
  createdAt?: string;
  parentCommentId?: string | null;
};

export function fetchPublicComments(
  targetType: string,
  targetId: string,
  options?: { limit?: number; page?: number }
): Promise<{
  ok: boolean;
  message: string;
  comments: PublicComment[];
  page: number;
  limit: number;
  totalRoots: number;
  totalPages: number;
}>;

export function createPublicComment(body: {
  text: string;
  targetType: string;
  targetId: string;
  parentCommentId?: string;
}): Promise<{
  ok: boolean;
  message: string;
  comment: PublicComment | null;
}>;
