import {
  Button,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAdminComments } from "../hooks/useAdminComments";
import CommentThreadModal from "./CommentThreadModal";

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
  const {
    availableTargetIdOptions,
    columns,
    errorMsg,
    filterTargetType,
    filterUsername,
    handleClose,
    handleCloseThread,
    handleOpen,
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
  } = useAdminComments();

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
              onChange={(event) => handleTargetTypeChange(event.target.value)}
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
                disabled={isSubmitDisabled}
                variant="contained"
                color="primary"
                onClick={() => void handleSubmit()}
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
