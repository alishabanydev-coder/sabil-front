import {
  Button,
  Checkbox,
  CircularProgress,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import type { AdminDonationCommentRecord } from "@/types/admin";

const style = {
  direction: "ltr",
  height: "auto",
  maxHeight: "80vh",
  width: "80%",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  gap: 2,
};

type CommentSelectModalProps = {
  open: boolean;
  comments: AdminDonationCommentRecord[];
  selectedItemIds: string[];
  loading: boolean;
  errorMsg: string;
  isSaving: boolean;
  saveErrorMsg: string;
  handleClose: () => void;
  handleSave: () => void | Promise<void>;
  toggleItemSelection: (itemId: string) => void;
};

const CommentSelectModal = ({
  open,
  comments,
  selectedItemIds,
  loading,
  errorMsg,
  isSaving,
  saveErrorMsg,
  handleClose,
  handleSave,
  toggleItemSelection,
}: CommentSelectModalProps) => {
  return (
    <Modal open={open} onClose={isSaving ? undefined : handleClose}>
      <Stack sx={style}>
        <Typography variant="h6">Add Comments</Typography>
        {loading ? (
          <Stack sx={{ width: "100%", alignItems: "center", py: 3 }}>
            <CircularProgress size={28} />
          </Stack>
        ) : (
          <Stack sx={{ width: "100%", gap: 2 }}>
            {errorMsg ? (
              <Typography color="error">{errorMsg}</Typography>
            ) : null}
            <Stack
              direction={"row"}
              sx={{
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                width: "100%",
                height: 400,
                overflowY: "auto",
                gap: 1,
                p: 1,
                flexWrap: "wrap",
                alignContent: "flex-start",
              }}
            >
              {comments.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{
                    width: "100%",
                    textAlign: "center",
                    color: "text.secondary",
                    py: 4,
                  }}
                >
                  No comments available to feature yet.
                </Typography>
              ) : null}
              {comments.map((item) => {
                const isSelected = selectedItemIds.includes(item._id);
                const selectedOrder = isSelected
                  ? selectedItemIds.indexOf(item._id) + 1
                  : null;
                return (
                  <Stack
                    key={item._id}
                    onClick={() => {
                      if (!isSaving) {
                        toggleItemSelection(item._id);
                      }
                    }}
                    sx={{
                      width: 250,
                      height: 180,
                      p: 1,
                      border: (theme) =>
                        `1px solid ${
                          isSelected
                            ? theme.palette.primary.main
                            : theme.palette.divider
                        }`,
                      borderRadius: 1,
                      cursor: isSaving ? "default" : "pointer",
                      bgcolor: isSelected ? "action.selected" : "transparent",
                      overflow: "hidden",
                      gap: 0.5,
                    }}
                  >
                    <Stack
                      sx={{
                        flex: 1,
                        minHeight: 0,
                        width: "100%",
                        border: (theme) =>
                          `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          wordBreak: "break-word",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.text || "No text"}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "start",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Checkbox
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => toggleItemSelection(item._id)}
                        disabled={isSaving}
                      />
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.username}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ) : null}
                      <Typography
                        sx={{
                          fontWeight: 600,
                          width: 120,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.username || item._id}
                      </Typography>
                      {selectedOrder ? (
                        <Typography
                          variant="caption"
                          sx={{ color: "primary.main", fontWeight: 700 }}
                        >
                          #{selectedOrder}
                        </Typography>
                      ) : null}
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>

            <Stack direction="row" sx={{ width: "100%", gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              {saveErrorMsg ? (
                <Typography color="error" variant="body2">
                  {saveErrorMsg}
                </Typography>
              ) : null}

              <Button
                variant="outlined"
                color="primary"
                onClick={handleClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
};

export default CommentSelectModal;
