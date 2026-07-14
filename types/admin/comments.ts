export type CommentRecord = {
  id: string;
  _id: string;
  text: string;
  username: string;
  targetType: string;
  targetId: string | null;
  parentCommentId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CommentModalMode = "add" | "edit" | "reply";

export type CommentThreadTarget = {
  targetType: string;
  targetId: string | null;
  label: string;
};

export type ThreadComment = {
  _id: string;
  text: string;
  username: string;
  parentCommentId?: string | null;
  createdAt?: string | null;
  replies?: ThreadComment[];
};
