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
import {
  ThreadComment,
  useCommentThread,
} from "../hooks/useCommentThread";

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
  const {
    actionError,
    editText,
    editingCommentId,
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
    replyingToId,
    replyText,
    replyUsername,
    resetActionState,
    scrollRef,
    sentinelRef,
    setEditText,
    setReplyText,
    setReplyUsername,
    thread,
  } = useCommentThread({
    open,
    onClose,
    targetType,
    targetId,
    onThreadChanged,
  });

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
                editingCommentId={editingCommentId}
                editText={editText}
                replyingToId={replyingToId}
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

export type { ThreadComment };
