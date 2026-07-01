"use client";

import {
  fetchCurrentUser,
  getStoredUserToken,
} from "@/component/auth/services/userAuthApi";
import {
  createPublicComment,
  fetchPublicComments,
} from "@/component/donation/services/commentsPublicApi";
import {
  Avatar,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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
};

type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  avatar?: string | null;
};

const CommentSection = ({ projectData }: { projectData: DonationProject }) => {
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const signInHref = `/sign-in?returnUrl=${encodeURIComponent(`/donation/${projectData.slug}`)}`;

  const loadComments = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");

    const result = await fetchPublicComments(
      "projectDonation",
      projectData._id
    );

    if (!result.ok) {
      setComments([]);
      setErrorMsg(result.message);
      setLoading(false);
      return;
    }

    setComments(result.comments);
    setLoading(false);
  }, [projectData._id]);

  const loadCurrentUser = useCallback(async () => {
    if (!getStoredUserToken()) {
      setCurrentUser(null);
      return;
    }

    const result = await fetchCurrentUser();
    setCurrentUser(result.ok ? result.user : null);
  }, []);

  useEffect(() => {
    void loadComments();
    void loadCurrentUser();
  }, [loadComments, loadCurrentUser]);

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
      const result = await createPublicComment({
        text: normalizedText,
        targetType: "projectDonation",
        targetId: projectData._id,
      });

      if (!result.ok || !result.comment) {
        setSubmitError(result.message);
        return;
      }

      setCommentText("");
      setComments((current) => [result.comment as PublicComment, ...current]);
    } finally {
      setIsSubmitting(false);
    }
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
      <Stack direction={{ xs: "column", md: "row" }} sx={{ gap: 2, width: "100%" }}>
        <Stack sx={{ width: { xs: "100%", md: "70%" }, gap: 2 }}>
          {currentUser ? (
            <Stack sx={{ gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Commenting as {currentUser.displayName}
              </Typography>
              <TextField
                multiline
                minRows={3}
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
              />
              {submitError ? (
                <Typography variant="body2" sx={{ color: "error.main" }}>
                  {submitError}
                </Typography>
              ) : null}
              <Button
                variant="contained"
                disabled={isSubmitting}
                onClick={() => void handleSubmitComment()}
                sx={{ alignSelf: "flex-start" }}
              >
                {isSubmitting ? "Posting..." : "Post comment"}
              </Button>
            </Stack>
          ) : (
            <Stack sx={{ gap: 1.5, maxWidth: 420 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Sign in to leave a comment
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Create an account or sign in to share your thoughts on this
                project.
              </Typography>
              <Button
                component={Link}
                href={signInHref}
                variant="contained"
                sx={{ alignSelf: "flex-start" }}
              >
                Sign in
              </Button>
            </Stack>
          )}

          {loading ? (
            <Typography variant="body2" sx={{ color: "text.secondary", py: 2 }}>
              Loading comments...
            </Typography>
          ) : errorMsg ? (
            <Typography variant="body2" sx={{ color: "error.main", py: 2 }}>
              {errorMsg}
            </Typography>
          ) : comments.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary", py: 2 }}>
              No comments yet. Be the first to share your thoughts.
            </Typography>
          ) : (
            comments.map((comment) => (
              <Stack
                key={comment._id}
                sx={{
                  gap: 1,
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
                  <Avatar
                    src={comment.avatar || undefined}
                    alt={comment.username}
                    sx={{ width: 36, height: 36 }}
                  />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {comment.username}
                  </Typography>
                </Stack>
                <Typography variant="body2">{comment.text}</Typography>
              </Stack>
            ))
          )}
        </Stack>
        <Stack
          sx={{
            width: { xs: "100%", md: "30%" },
            borderLeft: { md: "3px solid #e0e0e0" },
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
          <Button variant="text" color="primary" component={Link} href="#faq">
            Check this project&apos;s FAQ
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CommentSection;
