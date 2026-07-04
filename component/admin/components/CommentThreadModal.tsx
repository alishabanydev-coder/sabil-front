"use client";

import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createComment,
  deleteComment,
  fetchCommentThread,
  updateComment,
} from "../services/commentsApi";

export type ThreadComment = {
  _id: string;
  text: string;
  username: string;
  parentCommentId?: string | null;
  createdAt?: string | null;
  replies?: ThreadComment[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  targetType: string;
  targetId: string | null;
  targetLabel?: string;
  onThreadChanged?: () => void;
};

const modalStyle = {
  direction: "ltr",
  height: "auto",
  maxHeight: "85vh",
  width: { xs: "92%", sm: "70%", md: "55%" },
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
  overflow: "auto",
  gap: 1,
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

function CommentThreadItem({
  comment,
  depth = 0,
  editingCommentId,
  editText,
  replyingToId,
  replyText,
  replyUsername,
  isSubmitting,
  onEdit,
  onDelete,
  onReply,
  onEditTextChange,
  onSaveEdit,
  onCancelEdit,
  onReplyTextChange,
  onReplyUsernameChange,
  onSubmitReply,
  onCancelReply,
}: {
  comment: ThreadComment;
  depth?: number;
  editingCommentId: string | null;
  editText: string;
  replyingToId: string | null;
  replyText: string;
  replyUsername: string;
  isSubmitting: boolean;
  onEdit: (comment: ThreadComment) => void;
  onDelete: (comment: ThreadComment) => void;
  onReply: (comment: ThreadComment) => void;
  onEditTextChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onReplyTextChange: (value: string) => void;
  onReplyUsernameChange: (value: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
}) {
  const isEditing = editingCommentId === comment._id;
  const isReplying = replyingToId === comment._id;

  return (
    <Stack sx={{ gap: 1 }}>
      <Box
        sx={{
          border: "1px solid",
          borderColor: isEditing
            ? "primary.main"
            : isReplying
              ? "secondary.main"
              : "divider",
          borderRadius: 2,
          p: 1.5,
          ml: depth > 0 ? depth * 2 : 0,
          bgcolor: depth > 0 ? "action.hover" : "background.paper",
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
            {comment.username}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            {comment.createdAt
              ? new Date(comment.createdAt).toLocaleString()
              : ""}
          </Typography>
        </Stack>

        {isEditing ? null : (
          <Typography sx={{ fontSize: 14, whiteSpace: "pre-wrap", mb: 1 }}>
            {comment.text}
          </Typography>
        )}

        <Stack direction="row" sx={{ gap: 1 }}>
          <Button
            size="small"
            variant={isEditing ? "contained" : "outlined"}
            onClick={() => onEdit(comment)}
          >
            {isEditing ? "Cancel edit" : "Edit"}
          </Button>
          <Button
            size="small"
            variant={isReplying ? "outlined" : "contained"}
            onClick={() => onReply(comment)}
            disabled={isEditing}
          >
            {isReplying ? "Cancel reply" : "Reply"}
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => onDelete(comment)}
            disabled={isEditing}
          >
            Delete
          </Button>
        </Stack>

        {isEditing ? (
          <Stack sx={{ gap: 1.5, mt: 1.5 }}>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              Editing comment by {comment.username}
            </Typography>
            <TextField
              label="Text"
              value={editText}
              onChange={(event) => onEditTextChange(event.target.value)}
              fullWidth
              multiline
              minRows={2}
              autoFocus
            />
            <Stack direction="row" sx={{ gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                disabled={isSubmitting}
                onClick={onSaveEdit}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={onCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        ) : null}

        {isReplying ? (
          <Stack sx={{ gap: 1.5, mt: 1.5 }}>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              Replying to {comment.username}
            </Typography>
            <TextField
              label="Username"
              value={replyUsername}
              onChange={(event) => onReplyUsernameChange(event.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Reply"
              value={replyText}
              onChange={(event) => onReplyTextChange(event.target.value)}
              fullWidth
              multiline
              minRows={2}
              autoFocus
            />
            <Stack direction="row" sx={{ gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                disabled={isSubmitting}
                onClick={onSubmitReply}
              >
                {isSubmitting ? "Replying..." : "Send reply"}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={onCancelReply}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        ) : null}
      </Box>

      {comment.replies?.map((reply) => (
        <CommentThreadItem
          key={reply._id}
          comment={reply}
          depth={depth + 1}
          editingCommentId={editingCommentId}
          editText={editText}
          replyingToId={replyingToId}
          replyText={replyText}
          replyUsername={replyUsername}
          isSubmitting={isSubmitting}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
          onEditTextChange={onEditTextChange}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onReplyTextChange={onReplyTextChange}
          onReplyUsernameChange={onReplyUsernameChange}
          onSubmitReply={onSubmitReply}
          onCancelReply={onCancelReply}
        />
      ))}
    </Stack>
  );
}

export default function CommentThreadModal({
  open,
  onClose,
  targetType,
  targetId,
  targetLabel,
  onThreadChanged,
}: Props) {
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

  const resetActionState = () => {
    setEditingComment(null);
    setEditText("");
    setReplyingTo(null);
    setReplyText("");
    setReplyUsername("");
    setActionError("");
  };

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
  }, [loadThreadPage, open]);

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

  const handleClose = () => {
    resetActionState();
    onClose();
  };

  const handleStartEdit = (comment: ThreadComment) => {
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
  };

  const handleStartReply = (comment: ThreadComment) => {
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
  };

  const handleSaveEdit = async () => {
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
  };

  const handleSubmitReply = async () => {
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
  };

  const handleDelete = async (comment: ThreadComment) => {
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
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Stack ref={scrollRef} sx={modalStyle}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center", gap: 2 }}
        >
          <Box>
            <Typography variant="h6">Comment Thread</Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {targetLabel ||
                `${targetType}${targetId ? ` · ${targetId}` : ""}`}
            </Typography>
          </Box>
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
        </Stack>

        {loading ? (
          <Stack sx={{ alignItems: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Stack>
        ) : null}

        {!loading && errorMsg ? (
          <Typography color="error" variant="body2">
            {errorMsg}
          </Typography>
        ) : null}

        {!loading && !errorMsg && thread.length === 0 ? (
          <Typography sx={{ color: "text.secondary", py: 2 }}>
            No comments for this target yet.
          </Typography>
        ) : null}

        {!loading && !errorMsg
          ? thread.map((comment) => (
              <CommentThreadItem
                key={comment._id}
                comment={comment}
                editingCommentId={editingComment?._id ?? null}
                editText={editText}
                replyingToId={replyingTo?._id ?? null}
                replyText={replyText}
                replyUsername={replyUsername}
                isSubmitting={isSubmitting}
                onEdit={handleStartEdit}
                onDelete={handleDelete}
                onReply={handleStartReply}
                onEditTextChange={setEditText}
                onSaveEdit={() => void handleSaveEdit()}
                onCancelEdit={resetActionState}
                onReplyTextChange={setReplyText}
                onReplyUsernameChange={setReplyUsername}
                onSubmitReply={() => void handleSubmitReply()}
                onCancelReply={resetActionState}
              />
            ))
          : null}

        {loadingMore ? (
          <Stack sx={{ alignItems: "center", py: 2 }}>
            <CircularProgress size={22} />
          </Stack>
        ) : null}

        <Box ref={sentinelRef} sx={{ height: 1 }} />

        {actionError ? (
          <Typography color="error" variant="body2">
            {actionError}
          </Typography>
        ) : null}
      </Stack>
    </Modal>
  );
}
