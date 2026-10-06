import {
  Button,
  CircularProgress,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import type { MouseEvent, RefObject } from "react";
import type {
  AdminProjectRecord,
  MainPageLayoutItem,
  MainPageLayoutSection,
} from "@/types/admin";
import ProjectMenu from "./ProjectMenu";
import SectionItemCard from "./SectionItemCard";

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

type SectionItemsModalProps = {
  open: boolean;
  openedSection: MainPageLayoutSection | null;
  modalItems: MainPageLayoutItem[];
  selectedItemIds: string[];
  loading: boolean;
  errorMsg: string;
  isSaving: boolean;
  saveErrorMsg: string;
  projects: AdminProjectRecord[];
  selectedProject: AdminProjectRecord | null;
  openProjectMenu: boolean;
  menuElRef: RefObject<HTMLButtonElement | null>;
  handleClose: () => void;
  handleSave: () => void;
  toggleItemSelection: (itemId: string) => void;
  handleProjectMenuClick: (event: MouseEvent<HTMLButtonElement>) => void;
  handleProjectMenuClose: () => void;
  handleProjectSelect: (project: AdminProjectRecord | null) => void;
};

const SectionItemsModal = ({
  open,
  openedSection,
  modalItems,
  selectedItemIds,
  loading,
  errorMsg,
  isSaving,
  saveErrorMsg,
  projects,
  selectedProject,
  openProjectMenu,
  menuElRef,
  handleClose,
  handleSave,
  toggleItemSelection,
  handleProjectMenuClick,
  handleProjectMenuClose,
  handleProjectSelect,
}: SectionItemsModalProps) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Stack sx={style}>
        <Stack direction="row" sx={{ alignItems: "baseline", gap: 2 }}>
          <Typography variant="h6">Add {openedSection?.title}</Typography>
          {openedSection?.title === "Catalogues" ? (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleProjectMenuClick}
            >
              {selectedProject ? selectedProject.name : "Select Project"}
            </Button>
          ) : null}

          <ProjectMenu
            anchorRef={menuElRef}
            open={openProjectMenu}
            onClose={handleProjectMenuClose}
            projects={projects}
            selectedProject={selectedProject}
            onSelect={handleProjectSelect}
          />
        </Stack>
        {loading ? (
          <Stack sx={{ width: "100%", alignItems: "center", py: 3 }}>
            <CircularProgress size={28} />
          </Stack>
        ) : errorMsg ? (
          <Typography color="error">{errorMsg}</Typography>
        ) : (
          <Stack sx={{ width: "100%", gap: 2 }}>
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
              }}
            >
              {modalItems.map((item) => {
                const isUnpublished =
                  openedSection?.name === "video" &&
                  item.isPublished === false;
                const isSelected =
                  !isUnpublished && selectedItemIds.includes(item._id);
                const selectedOrder = isSelected
                  ? selectedItemIds.indexOf(item._id) + 1
                  : null;
                return (
                  <SectionItemCard
                    key={item._id}
                    item={item}
                    section={openedSection}
                    isSelected={isSelected}
                    isUnpublished={isUnpublished}
                    selectedOrder={selectedOrder}
                    isSaving={isSaving}
                    onToggle={toggleItemSelection}
                  />
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

              <Button variant="outlined" color="primary" onClick={handleClose}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
};

export default SectionItemsModal;
