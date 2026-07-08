"use client";

import {
  fetchCurrentUser,
  getStoredUserToken,
} from "@/component/auth/services/userAuthApi";
import {
  createPublicComment,
  fetchPublicComments,
} from "@/component/donation/services/commentsPublicApi";
import { deleteComment } from "@/component/admin/services/commentsApi";
import {
  Avatar,
  Button,
  IconButton,
  Pagination,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AltchaWidget, {
  type AltchaWidgetHandle,
} from "@/component/auth/AltchaWidget";
import { type DonationUpdate } from "./UpdateCard";

type DonationProject = {
  _id: string;
  title: string;
  slug: string;
  poster: string;
  shortDescription: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  currency?: "USD" | "INR" | string;
  videoUrl?: string | null;
  faq?: {
    header: string;
    summary: string;
    order: number;
  }[];
  sections?: {
    id: string;
    header: string;
    text: string;
    images: string[];
    order: number;
  }[];
  updates?: DonationUpdate[];
};

type PublicComment = {
  _id: string;
  text: string;
  username: string;
  avatar?: string;
  createdAt?: string;
  parentCommentId?: string | null;
};

function groupCommentsByParent(comments: PublicComment[]) {
  const repliesByParent = new Map<string, PublicComment[]>();
  const roots: PublicComment[] = [];

  comments.forEach((comment) => {
    if (comment.parentCommentId) {
      const siblings = repliesByParent.get(comment.parentCommentId) ?? [];
      siblings.push(comment);
      repliesByParent.set(comment.parentCommentId, siblings);
      return;
    }

    roots.push(comment);
  });

  const sortNewestFirst = (a: PublicComment, b: PublicComment) =>
    new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
  const sortOldestFirst = (a: PublicComment, b: PublicComment) =>
    new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();

  roots.sort(sortNewestFirst);
  repliesByParent.forEach((replies) => replies.sort(sortOldestFirst));

  return { roots, repliesByParent };
}

const PUBLIC_COMMENT_PAGE_SIZE = 10;

function readIsAdminSession() {
  if (typeof window === "undefined") {
    return false;
  }

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  return Boolean(token) && (role === "admin" || role === "super_admin");
}

type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  avatar?: string | null;
  showAsAnonymousInDonations?: boolean;
};

function getPublicCommentAuthorLabel(user: AuthUser | null) {
  if (!user) {
    return "Anonymous";
  }

  return user.showAsAnonymousInDonations ? "Anonymous" : user.displayName;
}

const CommentSection = ({
  setValue,
  projectData,
}: {
  setValue: (value: number) => void;
  projectData: DonationProject;
}) => {
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState("");
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );
  const altchaRef = useRef<AltchaWidgetHandle>(null);
  const replyAltchaRef = useRef<AltchaWidgetHandle>(null);
  const [altchaVerified, setAltchaVerified] = useState(false);
  const [replyAltchaVerified, setReplyAltchaVerified] = useState(false);

  const canPostComment =
    Boolean(commentText.trim()) && altchaVerified && !isSubmitting;
  const canPostReply =
    Boolean(replyText.trim()) && replyAltchaVerified && !isReplySubmitting;

  const currentUserLabel = getPublicCommentAuthorLabel(currentUser);
  const showCurrentUserEmail = Boolean(
    currentUser && !currentUser.showAsAnonymousInDonations
  );

  const { roots, repliesByParent } = useMemo(
    () => groupCommentsByParent(comments),
    [comments]
  );

  const signInHref = `/sign-in?returnUrl=${encodeURIComponent(
    `/donation/${projectData.slug}`
  )}`;

  const loadComments = useCallback(
    async (targetPage = 1) => {
      if (!projectData?._id) {
        setComments([]);
        setPage(1);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg("");

      const result = await fetchPublicComments(
        "projectDonation",
        projectData._id,
        { page: targetPage, limit: PUBLIC_COMMENT_PAGE_SIZE }
      );

      if (!result.ok) {
        setComments([]);
        setPage(1);
        setTotalPages(1);
        setErrorMsg(result.message);
        setLoading(false);
        return;
      }

      setComments(result.comments);
      setPage(result.page);
      setTotalPages(result.totalPages);
      setLoading(false);
    },
    [projectData._id]
  );

  const loadCurrentUser = useCallback(async () => {
    if (!getStoredUserToken()) {
      setCurrentUser(null);
      return;
    }

    const result = await fetchCurrentUser();
    setCurrentUser(result.ok ? result.user : null);
  }, []);

  useEffect(() => {
    if (!projectData?._id) {
      return;
    }

    void loadComments(page);
    void loadCurrentUser();
    setIsAdmin(readIsAdminSession());
  }, [loadComments, loadCurrentUser, page, projectData?._id]);

  const handleSubmitComment = async () => {
    const normalizedText = commentText.trim();
    if (!normalizedText) {
      setSubmitError("Comment text is required.");
      return;
    }

    if (!currentUser) {
      setSubmitError("Sign in to post a comment.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const altcha = await altchaRef.current?.getPayload();
      if (!altcha) {
        setSubmitError("Security verification failed. Please try again.");
        setAltchaVerified(false);
        altchaRef.current?.reset();
        return;
      }

      const result = await createPublicComment({
        text: normalizedText,
        targetType: "projectDonation",
        targetId: projectData._id,
        altcha,
      });

      if (!result.ok || !result.comment) {
        setSubmitError(result.message);
        setAltchaVerified(false);
        altchaRef.current?.reset();
        return;
      }

      setCommentText("");
      setAltchaVerified(false);
      altchaRef.current?.reset();
      setPage(1);
      void loadComments(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartReply = (commentId: string) => {
    setReplyingToId((current) => (current === commentId ? null : commentId));
    setReplyText("");
    setReplyError("");
    setReplyAltchaVerified(false);
    replyAltchaRef.current?.reset();
  };

  const handleSubmitReply = async (parentCommentId: string) => {
    const normalizedText = replyText.trim();
    if (!normalizedText) {
      setReplyError("Reply text is required.");
      return;
    }

    if (!currentUser) {
      setReplyError("Sign in to post a reply.");
      return;
    }

    setReplyError("");
    setIsReplySubmitting(true);

    try {
      const altcha = await replyAltchaRef.current?.getPayload();
      if (!altcha) {
        setReplyError("Security verification failed. Please try again.");
        setReplyAltchaVerified(false);
        replyAltchaRef.current?.reset();
        return;
      }

      const result = await createPublicComment({
        text: normalizedText,
        targetType: "projectDonation",
        targetId: projectData._id,
        parentCommentId,
        altcha,
      });

      if (!result.ok || !result.comment) {
        setReplyError(result.message);
        setReplyAltchaVerified(false);
        replyAltchaRef.current?.reset();
        return;
      }

      setReplyText("");
      setReplyingToId(null);
      setReplyAltchaVerified(false);
      replyAltchaRef.current?.reset();
      void loadComments(page);
    } finally {
      setIsReplySubmitting(false);
    }
  };

  const handleDeleteComment = async (comment: PublicComment) => {
    if (!isAdmin || deletingCommentId) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete comment by "${comment.username}"?`
    );
    if (!shouldDelete) {
      return;
    }

    setDeletingCommentId(comment._id);
    setErrorMsg("");

    try {
      const result = await deleteComment(comment._id);
      if (!result.ok) {
        setErrorMsg(result.message);
        return;
      }

      if (replyingToId === comment._id) {
        setReplyingToId(null);
        setReplyText("");
        setReplyError("");
        setReplyAltchaVerified(false);
        replyAltchaRef.current?.reset();
      }

      setComments((current) =>
        current
          .filter((item) => item._id !== comment._id)
          .map((item) =>
            item.parentCommentId === comment._id
              ? { ...item, parentCommentId: null }
              : item
          )
      );
      void loadComments(page);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const renderComment = (comment: PublicComment, depth = 0) => {
    const replies = repliesByParent.get(comment._id) ?? [];
    const isReplying = replyingToId === comment._id;
    const isNested = depth > 0;

    return (
      <Stack key={comment._id} sx={{ gap: 1 }}>
        <Stack
          sx={{
            gap: 1,
            p: { xs: 1.5, md: 2 },
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            ...(isNested
              ? {
                  ml: { xs: depth * 2, md: depth * 3 },
                  pl: { xs: 1.5 + depth, md: 2 + depth },
                  borderLeft: "3px solid",
                  borderLeftColor: "primary.light",
                }
              : {}),
          }}
        >
          <Stack
            direction="row"
            sx={{
              gap: 1.5,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack
              direction="row"
              sx={{ gap: 1.5, alignItems: "center", minWidth: 0 }}
            >
              <Avatar
                src={comment.avatar || undefined}
                alt={comment.username}
                sx={{
                  width: { xs: 28, sm: 32, md: 36, lg: 40 },
                  height: { xs: 28, sm: 32, md: 36, lg: 40 },
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: 10, sm: 12, md: 14, lg: 16 },
                }}
              >
                {comment.username}
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ alignItems: "center", flexShrink: 0 }}>
              <Tooltip title={currentUser ? "Reply" : "Sign in to reply"}>
                <span>
                  <IconButton
                    size="small"
                    aria-label={`Reply to ${comment.username}`}
                    onClick={() => {
                      if (!currentUser) {
                        window.location.href = signInHref;
                        return;
                      }
                      handleStartReply(comment._id);
                    }}
                    disabled={Boolean(deletingCommentId)}
                    sx={{
                      color: isReplying ? "primary.main" : "text.secondary",
                      p: { xs: 0.5, md: 0.75 },
                    }}
                  >
                    <ReplyOutlinedIcon
                      sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }}
                    />
                  </IconButton>
                </span>
              </Tooltip>
              {isAdmin ? (
                <Tooltip title="Delete comment">
                  <span>
                    <IconButton
                      size="small"
                      aria-label={`Delete comment by ${comment.username}`}
                      onClick={() => void handleDeleteComment(comment)}
                      disabled={deletingCommentId === comment._id}
                      sx={{
                        color: "error.main",
                        p: { xs: 0.5, md: 0.75 },
                      }}
                    >
                      <DeleteForeverOutlinedIcon
                        sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : null}
            </Stack>
          </Stack>
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: 10, sm: 12, md: 14, lg: 16 },
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {comment.text}
          </Typography>

          {isReplying ? (
            <Stack sx={{ gap: 1, pt: 0.5 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: 9, sm: 10, md: 12, lg: 14 },
                }}
              >
                Replying to {comment.username}
              </Typography>
              <TextField
                multiline
                minRows={2}
                autoFocus
                placeholder="Write a reply..."
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                slotProps={{
                  input: {
                    sx: {
                      fontSize: { xs: 10, sm: 12, md: 14, lg: 16 },
                    },
                  },
                }}
              />
              <AltchaWidget
                ref={replyAltchaRef}
                onVerifiedChange={setReplyAltchaVerified}
              />
              {replyError ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: "error.main",
                    fontSize: { xs: 9, sm: 10, md: 12, lg: 14 },
                  }}
                >
                  {replyError}
                </Typography>
              ) : null}
              <Stack direction="row" sx={{ gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  disabled={!canPostReply}
                  onClick={() => void handleSubmitReply(comment._id)}
                  sx={{ fontSize: { xs: 10, sm: 11, md: 13, lg: 14 } }}
                >
                  {isReplySubmitting ? "Posting..." : "Post reply"}
                </Button>
                <Button
                  variant="text"
                  size="small"
                  disabled={isReplySubmitting}
                  onClick={() => handleStartReply(comment._id)}
                  sx={{ fontSize: { xs: 10, sm: 11, md: 13, lg: 14 } }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          ) : null}
        </Stack>

        {replies.length > 0 ? (
          <Stack sx={{ gap: 1 }}>
            {replies.map((reply) => renderComment(reply, depth + 1))}
          </Stack>
        ) : null}
      </Stack>
    );
  };

  return (
    <Stack sx={{ width: "100%", gap: 2, pt: 3, pb: 8, direction: "ltr" }}>
      <Typography
        component="h2"
        sx={{
          fontSize: { xs: 12, sm: 16, md: 26, lg: 28, xl: 30 },
          color: "primary.main",
          fontFamily: "Namecat",
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          textAlign: "start",
        }}
      >
        People&apos;s Comments on this project
      </Typography>
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{ gap: 2, width: "100%", direction: "ltr" }}
      >
        <Stack
          sx={{
            width: { xs: "100%", md: "70%" },
            order: { xs: 2, md: 1 },
            gap: 2,
            border: "1px solid",
            borderColor: "divider",
            p: 2,
            borderRadius: 2,
          }}
        >
          {currentUser ? (
            <Stack sx={{ gap: 1.5 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: 9, sm: 10, md: 12, lg: 14 },
                }}
              >
                Commenting as:
              </Typography>
              <Stack
                direction="row"
                sx={{
                  gap: 1,
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: "divider",
                  p: 1,
                  borderRadius: 3,
                }}
              >
                <Avatar
                  src={
                    currentUser.showAsAnonymousInDonations
                      ? undefined
                      : currentUser.avatar || undefined
                  }
                  alt={currentUserLabel}
                  sx={{
                    width: { xs: 28, sm: 32, md: 36, lg: 40 },
                    height: { xs: 28, sm: 32, md: 36, lg: 40 },
                  }}
                />
                <Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                      fontSize: { xs: 10, sm: 12, md: 14, lg: 16 },
                    }}
                  >
                    {currentUserLabel}
                  </Typography>
                  {showCurrentUserEmail ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: 9, sm: 10, md: 12, lg: 14 },
                      }}
                    >
                      {currentUser.email}
                    </Typography>
                  ) : null}
                </Stack>
              </Stack>
              <TextField
                multiline
                minRows={3}
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                slotProps={{
                  input: {
                    sx: {
                      fontSize: { xs: 10, sm: 12, md: 14, lg: 16 },
                    },
                  },
                }}
              />
              <AltchaWidget
                ref={altchaRef}
                onVerifiedChange={setAltchaVerified}
              />
              {submitError ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: "error.main",
                    fontSize: { xs: 9, sm: 10, md: 12, lg: 14 },
                  }}
                >
                  {submitError}
                </Typography>
              ) : null}
              <Button
                variant="contained"
                disabled={!canPostComment}
                onClick={() => void handleSubmitComment()}
                sx={{
                  alignSelf: "flex-start",
                  fontSize: { xs: 10, sm: 11, md: 13, lg: 14 },
                }}
              >
                {isSubmitting ? "Posting..." : "Post comment"}
              </Button>
            </Stack>
          ) : (
            <Stack sx={{ gap: 1.5, maxWidth: 420 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: 10, sm: 12, md: 14, lg: 16 },
                }}
              >
                Sign in to leave a comment
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: 9, sm: 10, md: 12, lg: 14 },
                }}
              >
                Create an account or sign in to share your thoughts on this
                project.
              </Typography>
              <Button
                component={Link}
                href={signInHref}
                variant="contained"
                sx={{
                  alignSelf: "flex-start",
                  fontSize: { xs: 10, sm: 11, md: 13, lg: 14 },
                }}
              >
                Sign in
              </Button>
            </Stack>
          )}

          {loading ? (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                py: 2,
                fontSize: { xs: 9, sm: 10, md: 12, lg: 14 },
              }}
            >
              Loading comments...
            </Typography>
          ) : errorMsg ? (
            <Typography
              variant="body2"
              sx={{
                color: "error.main",
                py: 2,
                fontSize: { xs: 9, sm: 10, md: 12, lg: 14 },
              }}
            >
              {errorMsg}
            </Typography>
          ) : comments.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                py: 2,
                fontSize: { xs: 9, sm: 10, md: 12, lg: 14 },
              }}
            >
              No comments yet. Be the first to share your thoughts.
            </Typography>
          ) : (
            <Stack sx={{ gap: 2 }}>
              {roots.map((comment) => renderComment(comment))}
              {totalPages > 1 ? (
                <Stack sx={{ alignItems: "center", pt: 1 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_event, nextPage) => setPage(nextPage)}
                    color="primary"
                    size="small"
                    disabled={loading}
                  />
                </Stack>
              ) : null}
            </Stack>
          )}
        </Stack>
        <Stack
          sx={{
            width: { xs: "100%", md: "30%" },
            order: { xs: 1, md: 2 },
            borderBottom: { xs: "3px solid #e0e0e0", md: "none" },
            borderLeft: { md: "3px solid #e0e0e0" },
            pb: { xs: 2, md: 0 },
            px: { md: 2 },
            gap: 2,
          }}
        >
          <Typography
            component="h3"
            sx={{
              fontSize: { xs: 10, sm: 12, md: 14, lg: 16 },
              width: "100%",
            }}
          >
            This is your space to offer support and feedback. Remember to be
            constructive—there&apos;s a human behind this project.
          </Typography>
          <Typography
            component="h3"
            sx={{
              fontSize: { xs: 10, sm: 12, md: 16, lg: 18 },
              fontWeight: 700,
              width: "100%",
            }}
          >
            Have a question for the creator?
          </Typography>
          <Button variant="text" color="primary" onClick={() => setValue(2)}>
            Check this project&apos;s FAQ
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CommentSection;
