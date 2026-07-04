import { Button, Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createComment,
  deleteComment,
  fetchComments,
  updateComment,
} from "../services/commentsApi";
import { fetchBlogs } from "../services/blogApi";
import { fetchDonationProjects } from "../services/donationApi";
import {
  fetchChannelBreakdowns,
  fetchChannelProjects,
  fetchChannelVideos,
} from "../services/projectsApi";

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

type TargetType =
  | "video"
  | "blog"
  | "breakdown"
  | "general"
  | "project"
  | "projectDonation";

type TargetOption = {
  _id: string;
  targetType: TargetType;
  label: string;
};

export const useAdminComments = () => {
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState<CommentModalMode>("add");
  const [threadOpen, setThreadOpen] = useState(false);
  const [threadTarget, setThreadTarget] = useState<CommentThreadTarget | null>(
    null
  );
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [targetType, setTargetType] = useState("");
  const [targetId, setTargetId] = useState("");
  const [parentCommentId, setParentCommentId] = useState("");
  const [rows, setRows] = useState<CommentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterUsername, setFilterUsername] = useState("");
  const [filterTargetType, setFilterTargetType] = useState("");
  const [targetOptions, setTargetOptions] = useState<TargetOption[]>([]);
  const [targetOptionsLoading, setTargetOptionsLoading] = useState(false);
  const [adminRole, setAdminRole] = useState("");
  const [hasProjectScopedChannelAccess, setHasProjectScopedChannelAccess] =
    useState(false);

  const resetForm = useCallback(() => {
    setText("");
    setUsername("");
    setTargetType("");
    setTargetId("");
    setParentCommentId("");
    setSubmitErrorMsg("");
    setEditingCommentId(null);
  }, []);

  const loadComments = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setErrorMsg("");

      const result = await fetchComments(
        { username: filterUsername, targetType: filterTargetType },
        { signal }
      );

      if (!result.ok) {
        setLoading(false);
        setErrorMsg(result.message);
        return;
      }

      const normalizedRows = result.comments.map((comment) => ({
        ...comment,
        id: comment._id,
        parentCommentId: comment.parentCommentId ?? null,
        createdAt: comment.createdAt || "",
        updatedAt: comment.updatedAt || "",
      }));

      setRows(normalizedRows);
      setLoading(false);
    },
    [filterTargetType, filterUsername]
  );

  const loadTargetOptions = useCallback(async (signal?: AbortSignal) => {
    setTargetOptionsLoading(true);

    const [blogsResult, projectsResult, donationProjectsResult] =
      await Promise.all([
        fetchBlogs({ signal }),
        fetchChannelProjects({ signal }),
        fetchDonationProjects({ signal }),
      ]);

    const nextOptions: TargetOption[] = [];

    if (blogsResult.ok) {
      blogsResult.blogs.forEach((blog) => {
        nextOptions.push({
          _id: blog._id,
          targetType: "blog",
          label: blog.title || blog._id,
        });
      });
    }

    if (donationProjectsResult.ok) {
      donationProjectsResult.donationProjects.forEach((donationProject) => {
        nextOptions.push({
          _id: donationProject._id,
          targetType: "projectDonation",
          label: donationProject.title || donationProject._id,
        });
      });
    }

    if (projectsResult.ok) {
      projectsResult.projects.forEach((project) => {
        nextOptions.push({
          _id: project._id,
          targetType: "project",
          label: project.name || project._id,
        });
      });

      const targetsPerProject = await Promise.all(
        projectsResult.projects.map(async (project) => {
          const [videosResult, breakdownsResult] = await Promise.all([
            fetchChannelVideos(project._id, { signal }),
            fetchChannelBreakdowns(project._id, { signal }),
          ]);

          const videoTargets = videosResult.ok
            ? videosResult.videos.map((video) => ({
                _id: video._id,
                targetType: "video" as const,
                label: `${project.name || project._id} - ${
                  video.title || video._id
                }`,
              }))
            : [];

          const breakdownTargets = breakdownsResult.ok
            ? breakdownsResult.breakdowns.map((breakdown) => ({
                _id: breakdown._id,
                targetType: "breakdown" as const,
                label: `${project.name || project._id} - ${
                  breakdown.title || breakdown._id
                }`,
              }))
            : [];

          return [...videoTargets, ...breakdownTargets];
        })
      );

      targetsPerProject.forEach((projectTargets) => {
        nextOptions.push(...projectTargets);
      });
    }

    setTargetOptions(nextOptions);
    setTargetOptionsLoading(false);
  }, []);

  useEffect(() => {
    setAdminRole(localStorage.getItem("role") || "");
    try {
      const savedPermissions = JSON.parse(
        localStorage.getItem("permissions") || "[]"
      );
      const hasScopedChannels = Array.isArray(savedPermissions)
        ? savedPermissions.some(
            (permission) =>
              permission?.tab === "channels" &&
              permission?.canRead === true &&
              Array.isArray(permission?.projectIds) &&
              permission.projectIds.length > 0
          )
        : false;

      setHasProjectScopedChannelAccess(hasScopedChannels);
    } catch {
      setHasProjectScopedChannelAccess(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadComments(controller.signal).catch((error) => {
      if (!controller.signal.aborted) {
        setLoading(false);
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load comments."
        );
      }
    });

    return () => controller.abort("Comments tab unmounted");
  }, [loadComments]);

  useEffect(() => {
    const controller = new AbortController();

    loadTargetOptions(controller.signal).catch(() => {
      if (!controller.signal.aborted) {
        setTargetOptionsLoading(false);
      }
    });

    return () => controller.abort("Comment target options unmounted");
  }, [loadTargetOptions]);

  const availableTargetIdOptions = useMemo(
    () => targetOptions.filter((item) => item.targetType === targetType),
    [targetOptions, targetType]
  );

  const hasVideoTargetOption = targetOptions.some(
    (item) => item.targetType === "video"
  );
  const hasBreakdownTargetOption = targetOptions.some(
    (item) => item.targetType === "breakdown"
  );
  const shouldRestrictToProjectTypes =
    adminRole !== "super_admin" && hasProjectScopedChannelAccess;
  const showBlogTargetOption = !shouldRestrictToProjectTypes;
  const showGeneralTargetOption = !shouldRestrictToProjectTypes;
  const hasProjectTargetOption = targetOptions.some(
    (item) => item.targetType === "project"
  );
  const hasProjectDonationTargetOption = targetOptions.some(
    (item) => item.targetType === "projectDonation"
  );
  const targetIdRequired = targetType !== "general";

  useEffect(() => {
    if (showBlogTargetOption) {
      return;
    }

    if (targetType === "blog") {
      setTargetType("");
      setTargetId("");
    }

    if (filterTargetType === "blog") {
      setFilterTargetType("");
    }
  }, [showBlogTargetOption, targetType, filterTargetType]);

  const handleOpen = useCallback(() => {
    setModalMode("add");
    setOpen(true);
    resetForm();
  }, [resetForm]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setModalMode("add");
    resetForm();
  }, [resetForm]);

  const handleSee = useCallback(
    (comment: CommentRecord) => {
      const matchedTarget = targetOptions.find(
        (option) =>
          option.targetType === comment.targetType &&
          option._id === (comment.targetId || "")
      );

      const label =
        matchedTarget?.label ||
        `${comment.targetType}${
          comment.targetId ? ` · ${comment.targetId}` : ""
        }`;

      setThreadTarget({
        targetType: comment.targetType,
        targetId: comment.targetId,
        label,
      });
      setThreadOpen(true);
    },
    [targetOptions]
  );

  const handleCloseThread = useCallback(() => {
    setThreadOpen(false);
    setThreadTarget(null);
  }, []);

  const handleEdit = useCallback((comment: CommentRecord) => {
    setModalMode("edit");
    setEditingCommentId(comment._id);
    setOpen(true);
    setText(comment.text);
    setUsername(comment.username);
    setTargetType(comment.targetType);
    setTargetId(comment.targetId || "");
    setParentCommentId(comment.parentCommentId || "");
  }, []);

  const handleReply = useCallback((comment: CommentRecord) => {
    setModalMode("reply");
    setEditingCommentId(null);
    setOpen(true);
    setText("");
    setUsername("");
    setTargetType(comment.targetType);
    setTargetId(comment.targetId || "");
    setParentCommentId(comment._id);
  }, []);

  const handleSubmit = useCallback(async () => {
    const normalizedText = text.trim();
    const normalizedUsername = username.trim();
    const normalizedTargetType = targetType.trim();
    const normalizedTargetId = targetId.trim();
    const normalizedParentCommentId = parentCommentId.trim();

    if (!normalizedText || !normalizedTargetType) {
      setSubmitErrorMsg("Text and target type are required.");
      return;
    }

    if (modalMode !== "edit" && !normalizedUsername) {
      setSubmitErrorMsg("Username is required.");
      return;
    }

    if (normalizedTargetType !== "general" && !normalizedTargetId) {
      setSubmitErrorMsg("Target ID is required for this target type.");
      return;
    }

    if (modalMode === "edit" && !editingCommentId) {
      setSubmitErrorMsg("Comment id is missing for update.");
      return;
    }

    setSubmitErrorMsg("");
    setIsSubmitting(true);

    const body = {
      text: normalizedText,
      username: normalizedUsername,
      targetType: normalizedTargetType,
      targetId: normalizedTargetType === "general" ? null : normalizedTargetId,
      parentCommentId: normalizedParentCommentId || null,
    };

    try {
      const result =
        modalMode === "edit"
          ? await updateComment(editingCommentId, body)
          : await createComment(body);

      if (!result.ok) {
        setSubmitErrorMsg(result.message);
        return;
      }

      if (result.comment) {
        const normalizedComment = {
          ...result.comment,
          id: result.comment._id,
          parentCommentId: result.comment.parentCommentId ?? null,
          createdAt: result.comment.createdAt || "",
          updatedAt: result.comment.updatedAt || "",
        };

        setRows((currentRows) =>
          modalMode === "edit"
            ? currentRows.map((row) =>
                row._id === normalizedComment._id ? normalizedComment : row
              )
            : [normalizedComment, ...currentRows]
        );
      } else {
        await loadComments();
      }

      setOpen(false);
      setModalMode("add");
      resetForm();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error
          ? error.message
          : modalMode === "edit"
            ? "Failed to update comment."
            : "Failed to create comment."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    editingCommentId,
    loadComments,
    modalMode,
    parentCommentId,
    resetForm,
    targetId,
    targetType,
    text,
    username,
  ]);

  const handleDelete = useCallback(
    async (comment: CommentRecord) => {
      if (isSubmitting) {
        return;
      }

      const shouldDelete = window.confirm(
        `Delete comment by "${comment.username}"?`
      );
      if (!shouldDelete) {
        return;
      }

      const result = await deleteComment(comment._id);
      if (!result.ok) {
        setErrorMsg(result.message);
        return;
      }

      setRows((currentRows) =>
        currentRows
          .filter((row) => row._id !== comment._id)
          .map((row) =>
            row.parentCommentId === comment._id
              ? {
                  ...row,
                  parentCommentId: null,
                }
              : row
          )
      );
    },
    [isSubmitting]
  );

  const handleTargetTypeChange = useCallback((nextTargetType: string) => {
    setTargetType(nextTargetType);
    setTargetId("");
  }, []);

  const columns: GridColDef<CommentRecord>[] = useMemo(
    () => [
      {
        field: "actions",
        headerName: "Actions",
        width: 340,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Stack
            direction="row"
            sx={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              py: 0.5,
            }}
          >
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleSee(params.row)}
              sx={{ fontSize: 11 }}
            >
              See
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleEdit(params.row)}
              sx={{ fontSize: 11 }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => handleReply(params.row)}
              sx={{ fontSize: 11 }}
            >
              Reply
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => handleDelete(params.row)}
              sx={{ fontSize: 11 }}
            >
              Delete
            </Button>
          </Stack>
        ),
      },
      { field: "id", headerName: "ID", width: 120 },
      { field: "text", headerName: "Text", width: 220 },
      { field: "username", headerName: "Username", width: 150 },
      { field: "targetType", headerName: "Target Type", width: 130 },
      { field: "targetId", headerName: "Target ID", width: 150 },
      { field: "parentCommentId", headerName: "Parent Comment ID", width: 170 },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 170,
        valueFormatter: (value) =>
          value ? new Date(value).toLocaleString() : "",
      },
      {
        field: "updatedAt",
        headerName: "Updated At",
        width: 170,
        valueFormatter: (value) =>
          value ? new Date(value).toLocaleString() : "",
      },
    ],
    [handleDelete, handleEdit, handleReply, handleSee]
  );

  const isSubmitDisabled =
    !text.trim() ||
    (modalMode !== "edit" && !username.trim()) ||
    !targetType.trim() ||
    (targetIdRequired && !targetId.trim()) ||
    isSubmitting;

  return {
    availableTargetIdOptions,
    columns,
    errorMsg,
    filterTargetType,
    filterUsername,
    handleClose,
    handleCloseThread,
    handleDelete,
    handleOpen,
    handleReply,
    handleSee,
    handleSubmit,
    handleTargetTypeChange,
    hasBreakdownTargetOption,
    hasProjectDonationTargetOption,
    hasProjectTargetOption,
    hasVideoTargetOption,
    isSubmitDisabled,
    isSubmitting,
    loading,
    loadComments,
    modalMode,
    open,
    parentCommentId,
    rows,
    setFilterTargetType,
    setFilterUsername,
    setParentCommentId,
    setTargetId,
    setText,
    setUsername,
    showBlogTargetOption,
    showGeneralTargetOption,
    submitErrorMsg,
    targetId,
    targetIdRequired,
    targetOptionsLoading,
    targetType,
    text,
    threadOpen,
    threadTarget,
    username,
  };
};
