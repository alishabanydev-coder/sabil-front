import {
  Button,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import {
  createComment,
  deleteComment,
  fetchComments,
  updateComment,
} from "../services/commentsApi";
import CommentThreadModal from "./CommentThreadModal";
import { fetchBlogs } from "../services/blogApi";
import { fetchDonationProjects } from "../services/donationApi";
import {
  fetchChannelBreakdowns,
  fetchChannelProjects,
  fetchChannelVideos,
} from "../services/projectsApi";

type CommentRecord = {
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

const style = {
  direction: "ltr",
  height: "auto",
  maxHeight: "80vh",
  width: "50%",
  position: "absolute",
  flexDirection: "row",
  overflow: "auto",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
  gap: 2,
};

const Comment = () => {
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "reply">("add");
  const [threadOpen, setThreadOpen] = useState(false);
  const [threadTarget, setThreadTarget] = useState<{
    targetType: string;
    targetId: string | null;
    label: string;
  } | null>(null);
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

  const resetForm = () => {
    setText("");
    setUsername("");
    setTargetType("");
    setTargetId("");
    setParentCommentId("");
    setSubmitErrorMsg("");
    setEditingCommentId(null);
  };

  const handleOpen = () => {
    setModalMode("add");
    setOpen(true);
    resetForm();
  };

  const handleSee = (comment: CommentRecord) => {
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
  };

  const handleCloseThread = () => {
    setThreadOpen(false);
    setThreadTarget(null);
  };

  const handleEdit = (comment: CommentRecord) => {
    setModalMode("edit");
    setEditingCommentId(comment._id);
    setOpen(true);
    setText(comment.text);
    setUsername(comment.username);
    setTargetType(comment.targetType);
    setTargetId(comment.targetId || "");
    setParentCommentId(comment.parentCommentId || "");
  };

  const handleReply = (comment: CommentRecord) => {
    setModalMode("reply");
    setEditingCommentId(null);
    setOpen(true);
    setText("");
    setUsername("");
    setTargetType(comment.targetType);
    setTargetId(comment.targetId || "");
    setParentCommentId(comment._id);
  };

  const handleClose = () => {
    setOpen(false);
    setModalMode("add");
    resetForm();
  };

  const loadComments = async (signal?: AbortSignal) => {
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
  };

  const loadTargetOptions = async (signal?: AbortSignal) => {
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
  };

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
  }, [filterTargetType, filterUsername]);

  useEffect(() => {
    const controller = new AbortController();

    loadTargetOptions(controller.signal).catch(() => {
      if (!controller.signal.aborted) {
        setTargetOptionsLoading(false);
      }
    });

    return () => controller.abort("Comment target options unmounted");
  }, []);

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

  const handleSubmit = async () => {
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

      handleClose();
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
  };

  const handleDelete = async (comment: CommentRecord) => {
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
  };

  console.log("theared: ", threadOpen);
  console.log("add: ", open);

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
    [isSubmitting]
  );

  return (
    <Stack>
      <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1 }}>
        <Typography component="h2" sx={{ fontSize: 22, fontWeight: 700 }}>
          Comments
        </Typography>
        <Stack direction="row" sx={{ gap: 1 }}>
          <TextField
            size="small"
            label="Filter Username"
            value={filterUsername}
            onChange={(event) => setFilterUsername(event.target.value)}
          />
          <TextField
            size="small"
            label="Filter Target Type"
            select
            value={filterTargetType}
            onChange={(event) => setFilterTargetType(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All target types</MenuItem>
            {hasVideoTargetOption ? (
              <MenuItem value="video">video</MenuItem>
            ) : (
              <MenuItem value="video" disabled>
                video (not allowed)
              </MenuItem>
            )}
            {showBlogTargetOption ? (
              <MenuItem value="blog">blog</MenuItem>
            ) : (
              <MenuItem value="blog" disabled>
                blog (not allowed)
              </MenuItem>
            )}
            {hasBreakdownTargetOption ? (
              <MenuItem value="breakdown">breakdown</MenuItem>
            ) : (
              <MenuItem value="breakdown" disabled>
                breakdown (not allowed)
              </MenuItem>
            )}
            {hasProjectTargetOption ? (
              <MenuItem value="project">project</MenuItem>
            ) : (
              <MenuItem value="project" disabled>
                project (not allowed)
              </MenuItem>
            )}
            {hasProjectDonationTargetOption ? (
              <MenuItem value="projectDonation">projectDonation</MenuItem>
            ) : (
              <MenuItem value="projectDonation" disabled>
                projectDonation (not allowed)
              </MenuItem>
            )}
            {showGeneralTargetOption ? (
              <MenuItem value="general">general</MenuItem>
            ) : (
              <MenuItem value="general" disabled>
                general (not allowed)
              </MenuItem>
            )}
          </TextField>
          <Button variant="contained" onClick={handleOpen}>
            Add Comment
          </Button>
        </Stack>
      </Stack>
      {errorMsg ? (
        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
          {errorMsg}
        </Typography>
      ) : null}
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
      />

      {threadTarget ? (
        <CommentThreadModal
          open={threadOpen}
          onClose={handleCloseThread}
          targetType={threadTarget.targetType}
          targetId={threadTarget.targetId}
          targetLabel={threadTarget.label}
          onThreadChanged={() => {
            void loadComments();
          }}
        />
      ) : null}

      <Modal open={open} onClose={handleClose}>
        <Stack sx={style}>
          <Stack sx={{ width: "100%", gap: 2 }}>
            <Typography variant="h6">
              {modalMode === "edit"
                ? "Edit Comment"
                : modalMode === "reply"
                ? "Reply Comment"
                : "Add Comment"}
            </Typography>

            <TextField
              label="Username"
              variant="standard"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              fullWidth
              disabled={modalMode === "edit"}
            />
            <TextField
              label="Target Type"
              select
              variant="standard"
              value={targetType}
              onChange={(event) => {
                const nextTargetType = event.target.value;
                setTargetType(nextTargetType);
                setTargetId("");
              }}
              fullWidth
              disabled={targetOptionsLoading}
            >
              <MenuItem value="">Select target type</MenuItem>
              {hasVideoTargetOption ? (
                <MenuItem value="video">video</MenuItem>
              ) : (
                <MenuItem value="video" disabled>
                  video (not allowed)
                </MenuItem>
              )}
              {showBlogTargetOption ? (
                <MenuItem value="blog">blog</MenuItem>
              ) : (
                <MenuItem value="blog" disabled>
                  blog (not allowed)
                </MenuItem>
              )}
              {hasBreakdownTargetOption ? (
                <MenuItem value="breakdown">breakdown</MenuItem>
              ) : (
                <MenuItem value="breakdown" disabled>
                  breakdown (not allowed)
                </MenuItem>
              )}
              {hasProjectTargetOption ? (
                <MenuItem value="project">project</MenuItem>
              ) : (
                <MenuItem value="project" disabled>
                  project (not allowed)
                </MenuItem>
              )}
              {hasProjectDonationTargetOption ? (
                <MenuItem value="projectDonation">projectDonation</MenuItem>
              ) : (
                <MenuItem value="projectDonation" disabled>
                  projectDonation (not allowed)
                </MenuItem>
              )}
              {showGeneralTargetOption ? (
                <MenuItem value="general">general</MenuItem>
              ) : (
                <MenuItem value="general" disabled>
                  general (not allowed)
                </MenuItem>
              )}
            </TextField>
            {targetIdRequired ? (
              <TextField
                label="Target ID"
                select
                variant="standard"
                value={targetId}
                onChange={(event) => setTargetId(event.target.value)}
                fullWidth
                disabled={!targetType || targetOptionsLoading}
              >
                <MenuItem value="">
                  {targetType
                    ? "Select target item"
                    : "Select target type first"}
                </MenuItem>
                {availableTargetIdOptions.map((item) => (
                  <MenuItem
                    key={`${item.targetType}-${item._id}`}
                    value={item._id}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : null}
            <TextField
              label="Parent Comment ID"
              variant="standard"
              value={parentCommentId}
              onChange={(event) => setParentCommentId(event.target.value)}
              fullWidth
            />

            <TextField
              label="Text"
              multiline
              value={text}
              onChange={(event) => setText(event.target.value)}
              fullWidth
            />
            <Stack direction="row" sx={{ gap: 2 }}>
              <Button
                fullWidth
                disabled={
                  !text.trim() ||
                  !username.trim() ||
                  !targetType.trim() ||
                  (targetIdRequired && !targetId.trim()) ||
                  isSubmitting
                }
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {modalMode === "edit"
                  ? isSubmitting
                    ? "Saving..."
                    : "Save"
                  : modalMode === "reply"
                  ? isSubmitting
                    ? "Replying..."
                    : "Reply"
                  : isSubmitting
                  ? "Adding..."
                  : "Add"}
              </Button>
              <Button variant="outlined" color="primary" onClick={handleClose}>
                Cancel
              </Button>
            </Stack>
            {submitErrorMsg ? (
              <Typography color="error" variant="body2">
                {submitErrorMsg}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default Comment;
