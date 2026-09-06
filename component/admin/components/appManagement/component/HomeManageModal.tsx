import {
  Button,
  Checkbox,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import type { ChangeEvent } from "react";
import type {
  AppManagementModalItem,
  AppManagementProjectPreviewData,
  AppManagementSection,
} from "@/types/admin";

const style = {
  direction: "ltr",
  height: "auto",
  maxHeight: "85vh",
  width: "80%",
  position: "absolute",
  flexDirection: "column",
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

type HomeManageModalProps = {
  handleCloseModal: () => void;
  handleHomeImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isRandomVideosSelected: boolean;
  modalItems: AppManagementModalItem[];
  modalSelectedIds: string[];
  open: boolean;
  projectById: Map<string, AppManagementProjectPreviewData>;
  saveModalChanges: () => void;
  saving: boolean;
  selectedSection: AppManagementSection | null;
  toggleModalSelection: (id: string) => void;
};

const HomeManageModal = ({
  handleCloseModal,
  handleHomeImageFileChange,
  isRandomVideosSelected,
  modalItems,
  modalSelectedIds,
  open,
  projectById,
  saveModalChanges,
  saving,
  selectedSection,
  toggleModalSelection,
}: HomeManageModalProps) => {
  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Stack sx={style}>
        <Stack direction="row" sx={{ alignItems: "baseline", gap: 2 }}>
          <Typography variant="h6">
            Manage {selectedSection?.title || "App Catalogue"}
          </Typography>
          {selectedSection?.name === "navBtn" ? (
            <Button component="label" variant="outlined" disabled={saving}>
              Upload Home Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleHomeImageFileChange}
              />
            </Button>
          ) : null}
        </Stack>

        {selectedSection?.name === "homeVideo" ? (
          <Typography variant="body2" color="text.secondary">
            {isRandomVideosSelected
              ? "Random mode is active. You can still prepare manual order for later."
              : "Manual mode is active. Ordered list below is used on Home."}
          </Typography>
        ) : null}

        {selectedSection?.name === "suggestedVideo" ? (
          <Typography variant="body2" color="text.secondary">
            Pick suggested videos from all uploaded videos. Order is the
            selection order.
          </Typography>
        ) : null}

        {selectedSection?.name === "featuredVideo" ? (
          <Typography variant="body2" color="text.secondary">
            Pick featured videos from this channel only. Order is the selection
            order.
          </Typography>
        ) : null}

        <Stack sx={{ width: "100%", gap: 2 }}>
          <Stack
            direction="row"
            sx={{
              border: (theme) => `1px solid ${theme.palette.divider}`,
              justifyContent: "center",
              borderRadius: 1,
              width: "100%",
              minHeight: 320,
              maxHeight: 420,
              overflowY: "auto",
              gap: 1,
              p: 1,
              flexWrap: "wrap",
            }}
          >
            {modalItems.map((item) => {
              const project =
                (selectedSection?.name === "homeVideo" ||
                  selectedSection?.name === "suggestedVideo" ||
                  selectedSection?.name === "featuredVideo") &&
                item.projectId
                  ? projectById.get(item.projectId)
                  : undefined;
              const projectLogo = project?.image || item.image;
              const projectName = project?.name || "Project";
              const isSelected = modalSelectedIds.includes(item.id);
              const selectedOrder = isSelected
                ? modalSelectedIds.indexOf(item.id) + 1
                : null;

              return (
                <Stack
                  key={item.id}
                  onClick={() => toggleModalSelection(item.id)}
                  sx={{
                    width: 250,
                    height: 180,
                    border: (theme) =>
                      `1px solid ${
                        isSelected
                          ? theme.palette.primary.main
                          : theme.palette.divider
                      }`,
                    borderRadius: 1,
                    cursor: "pointer",
                    bgcolor: isSelected ? "action.selected" : "transparent",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%",
                      aspectRatio: "16 / 9",
                      objectFit: "contain",
                      borderRadius: 8,
                    }}
                  />
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      size="small"
                      checked={isSelected}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => toggleModalSelection(item.id)}
                      disabled={saving}
                    />
                    <Image
                      src={projectLogo}
                      alt={projectName}
                      width={32}
                      height={32}
                      style={{
                        objectFit: "contain",
                        border: "1px solid #aaa",
                        borderRadius: "50%",
                        marginRight: 3,
                      }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 600,
                        width: 120,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.title || item.id}
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

          <Stack
            direction="row"
            sx={{ width: "100%", gap: 2, alignItems: "center" }}
          >
            <Button
              fullWidth
              variant="contained"
              onClick={saveModalChanges}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default HomeManageModal;
