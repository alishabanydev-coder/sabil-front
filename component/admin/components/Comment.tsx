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
import { fetchBlogs } from "../services/blogApi";
import { fetchBreakdowns } from "../services/breakdownApi";
import {
  fetchChannelProjects,
  fetchChannelVideos,
} from "../services/projectsApi";

type CommentRecord = {
  id: string;
  _id: string;
  text: string;
  username: string;
  targetType: string;
  targetId: string;
  parentCommentId: string | null;
  createdAt: string;
  updatedAt: string;
};

type TargetType = "video" | "blog" | "breakdown";

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
  p: 3,
  gap: 2,
};

const Comment = () => {
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "reply">("add");
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

  const handleEdit = (comment: CommentRecord) => {
    setModalMode("edit");
    setEditingCommentId(comment._id);
    setOpen(true);
    setText(comment.text);
    setUsername(comment.username);
    setTargetType(comment.targetType);
    setTargetId(comment.targetId);
    setParentCommentId(comment.parentCommentId || "");
  };

  const handleReply = (comment: CommentRecord) => {
    setModalMode("reply");
    setEditingCommentId(null);
    setOpen(true);
    setText("");
    setUsername("");
    setTargetType(comment.targetType);
    setTargetId(comment.targetId);
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

    const [blogsResult, breakdownsResult, projectsResult] = await Promise.all([
      fetchBlogs({ signal }),
      fetchBreakdowns({ signal }),
      fetchChannelProjects({ signal }),
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

    if (breakdownsResult.ok) {
      breakdownsResult.breakdowns.forEach((breakdown) => {
        nextOptions.push({
          _id: breakdown._id,
          targetType: "breakdown",
          label: breakdown.title || breakdown._id,
        });
      });
    }

    if (projectsResult.ok) {
      const videosPerProject = await Promise.all(
        projectsResult.projects.map(async (project) => {
          const videosResult = await fetchChannelVideos(project._id, {
            signal,
          });
          if (!videosResult.ok) {
            return [];
          }

          return videosResult.videos.map((video) => ({
            _id: video._id,
            targetType: "video" as const,
            label: `${project.name || project._id} - ${video.title || video._id}`,
          }));
        })
      );

      videosPerProject.forEach((projectVideos) => {
        nextOptions.push(...projectVideos);
      });
    }

    setTargetOptions(nextOptions);
    setTargetOptionsLoading(false);
  };

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

  const handleSubmit = async () => {
    const normalizedText = text.trim();
    const normalizedUsername = username.trim();
    const normalizedTargetType = targetType.trim().toLowerCase();
    const normalizedTargetId = targetId.trim();
    const normalizedParentCommentId = parentCommentId.trim();

    if (
      !normalizedText ||
      !normalizedUsername ||
      !normalizedTargetType ||
      !normalizedTargetId
    ) {
      setSubmitErrorMsg(
        "Text, username, target type, and target ID are required."
      );
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
      targetId: normalizedTargetId,
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
      currentRows.filter(
        (row) => row._id !== comment._id && row.parentCommentId !== comment._id
      )
    );
  };

  const columns: GridColDef<CommentRecord>[] = useMemo(
    () => [
      {
        field: "actions",
        headerName: "Actions",
        width: 280,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Stack direction="row" sx={{ gap: 1, py: 0.5 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleEdit(params.row)}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => handleReply(params.row)}
            >
              Reply
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => handleDelete(params.row)}
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
            <MenuItem value="video">video</MenuItem>
            <MenuItem value="blog">blog</MenuItem>
            <MenuItem value="breakdown">breakdown</MenuItem>
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
              <MenuItem value="video">video</MenuItem>
              <MenuItem value="blog">blog</MenuItem>
              <MenuItem value="breakdown">breakdown</MenuItem>
            </TextField>
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
                {targetType ? "Select target item" : "Select target type first"}
              </MenuItem>
              {availableTargetIdOptions.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
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
              <Button variant="contained" color="primary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
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
