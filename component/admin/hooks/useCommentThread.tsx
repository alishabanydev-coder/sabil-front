import type { ThreadComment } from "@/types/admin";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createComment,
  deleteComment,
  fetchCommentThread,
  updateComment,
} from "../services/commentsApi";

type UseCommentThreadParams = {
  open: boolean;
  onClose: () => void;
  targetType: string;
  targetId: string | null;
  onThreadChanged?: () => void;
};

const THREAD_PAGE_SIZE = 10;

function mergeThreadPages(
  current: ThreadComment[],
  next: ThreadComment[]
): ThreadComment[] {
  const seen = new Set(current.map((comment) => comment._id));
  const merged = [...current];

  next.forEach((comment) => {
    if (seen.has(comment._id)) {
      return;
    }

    seen.add(comment._id);
    merged.push(comment);
  });

  return merged;
}

function readDefaultAdminUsername() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem("name") || "admin";
}

export const useCommentThread = ({
  open,
  onClose,
  targetType,
  targetId,
  onThreadChanged,
}: UseCommentThreadParams) => {
  const [thread, setThread] = useState<ThreadComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [actionError, setActionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMoreRef = useRef(false);
  const nextCursorRef = useRef<string | null>(null);
  const loadingMoreRef = useRef(false);

  const [editingComment, setEditingComment] = useState<ThreadComment | null>(
    null
  );
  const [editText, setEditText] = useState("");

  const [replyingTo, setReplyingTo] = useState<ThreadComment | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyUsername, setReplyUsername] = useState("");

  const resetActionState = useCallback(() => {
    setEditingComment(null);
    setEditText("");
    setReplyingTo(null);
    setReplyText("");
    setReplyUsername("");
    setActionError("");
  }, []);

  const loadThreadPage = useCallback(
    async (append: boolean) => {
      if (!targetType || (targetType !== "general" && !targetId)) {
        setThread([]);
        setHasMore(false);
        setNextCursor(null);
        hasMoreRef.current = false;
        nextCursorRef.current = null;
        return;
      }

      if (append) {
        if (
          !hasMoreRef.current ||
          !nextCursorRef.current ||
          loadingMoreRef.current
        ) {
          return;
        }

        loadingMoreRef.current = true;
        setLoadingMore(true);
      } else {
        setLoading(true);
        setErrorMsg("");
      }

      const result = await fetchCommentThread({
        targetType,
        targetId: targetId || "",
        limit: THREAD_PAGE_SIZE,
        cursor: append ? nextCursorRef.current ?? undefined : undefined,
      });

      if (!result.ok) {
        if (!append) {
          setThread([]);
          setErrorMsg(result.message);
        } else {
          setActionError(result.message);
        }

        if (append) {
          loadingMoreRef.current = false;
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
        return;
      }

      setThread((current) =>
        append ? mergeThreadPages(current, result.thread) : result.thread
      );
      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);
      hasMoreRef.current = result.hasMore;
      nextCursorRef.current = result.nextCursor;

      if (append) {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    },
    [targetId, targetType]
  );

  const loadMoreThread = useCallback(() => {
    void loadThreadPage(true);
  }, [loadThreadPage]);

  useEffect(() => {
    if (!open) {
      resetActionState();
      setThread([]);
      setHasMore(false);
      setNextCursor(null);
      hasMoreRef.current = false;
      nextCursorRef.current = null;
      loadingMoreRef.current = false;
      setLoadingMore(false);
      return;
    }

    void loadThreadPage(false);
  }, [loadThreadPage, open, resetActionState]);

  useEffect(() => {
    if (!open || !hasMore || loading || loadingMore) {
      return;
    }

    const root = scrollRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreThread();
        }
      },
      {
        root,
        rootMargin: "120px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, loadMoreThread, loading, loadingMore, open, thread.length]);

  const handleClose = useCallback(() => {
    resetActionState();
    onClose();
  }, [onClose, resetActionState]);

  const handleStartEdit = useCallback(
    (comment: ThreadComment) => {
      if (editingComment?._id === comment._id) {
        resetActionState();
        return;
      }

      setReplyingTo(null);
      setReplyText("");
      setReplyUsername("");
      setEditingComment(comment);
      setEditText(comment.text);
      setActionError("");
    },
    [editingComment?._id, resetActionState]
  );

  const handleStartReply = useCallback(
    (comment: ThreadComment) => {
      if (replyingTo?._id === comment._id) {
        resetActionState();
        return;
      }

      setEditingComment(null);
      setEditText("");
      setReplyingTo(comment);
      setReplyText("");
      setReplyUsername(readDefaultAdminUsername());
      setActionError("");
    },
    [replyingTo?._id, resetActionState]
  );

  const handleSaveEdit = useCallback(async () => {
    if (!editingComment) {
      return;
    }

    const normalizedText = editText.trim();

    if (!normalizedText) {
      setActionError("Text is required.");
      return;
    }

    setIsSubmitting(true);
    setActionError("");

    const result = await updateComment(editingComment._id, {
      text: normalizedText,
      username: editingComment.username,
      targetType,
      targetId: targetType === "general" ? null : targetId,
      parentCommentId: editingComment.parentCommentId || null,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setActionError(result.message);
      return;
    }

    resetActionState();
    await loadThreadPage(false);
    onThreadChanged?.();
  }, [
    editText,
    editingComment,
    loadThreadPage,
    onThreadChanged,
    resetActionState,
    targetId,
    targetType,
  ]);

  const handleSubmitReply = useCallback(async () => {
    if (!replyingTo) {
      return;
    }

    const normalizedText = replyText.trim();
    const normalizedUsername = replyUsername.trim();

    if (!normalizedText || !normalizedUsername) {
      setActionError("Text and username are required.");
      return;
    }

    setIsSubmitting(true);
    setActionError("");

    const result = await createComment({
      text: normalizedText,
      username: normalizedUsername,
      targetType,
      targetId: targetType === "general" ? null : targetId,
      parentCommentId: replyingTo._id,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setActionError(result.message);
      return;
    }

    resetActionState();
    await loadThreadPage(false);
    onThreadChanged?.();
  }, [
    loadThreadPage,
    onThreadChanged,
    replyingTo,
    replyText,
    replyUsername,
    resetActionState,
    targetId,
    targetType,
  ]);

  const handleDelete = useCallback(
    async (comment: ThreadComment) => {
      const shouldDelete = window.confirm(
        `Delete comment by "${comment.username}"?`
      );
      if (!shouldDelete) {
        return;
      }

      setIsSubmitting(true);
      setActionError("");

      const result = await deleteComment(comment._id);
      setIsSubmitting(false);

      if (!result.ok) {
        setActionError(result.message);
        return;
      }

      resetActionState();
      await loadThreadPage(false);
      onThreadChanged?.();
    },
    [loadThreadPage, onThreadChanged, resetActionState]
  );

  return {
    actionError,
    editText,
    editingCommentId: editingComment?._id ?? null,
    errorMsg,
    handleClose,
    handleDelete,
    handleSaveEdit,
    handleStartEdit,
    handleStartReply,
    handleSubmitReply,
    isSubmitting,
    loading,
    loadingMore,
    replyingToId: replyingTo?._id ?? null,
    replyText,
    replyUsername,
    resetActionState,
    scrollRef,
    sentinelRef,
    setEditText,
    setReplyText,
    setReplyUsername,
    thread,
  };
};
