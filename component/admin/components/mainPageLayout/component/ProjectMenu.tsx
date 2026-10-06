import { alpha, Menu, MenuItem, Stack, type SxProps, type Theme } from "@mui/material";
import type { RefObject } from "react";
import type { AdminProjectRecord } from "@/types/admin";

const menuItemSx: SxProps<Theme> = {
  mx: 0.5,
  mb: 0.5,
  borderRadius: 2,
  "&:hover": {
    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
  },
  "&.Mui-selected": {
    border: (theme) => `1px solid ${theme.palette.primary.main}`,
  },
};

type ProjectMenuProps = {
  anchorRef: RefObject<HTMLButtonElement | null>;
  open: boolean;
  onClose: () => void;
  projects: AdminProjectRecord[];
  selectedProject: AdminProjectRecord | null;
  onSelect: (project: AdminProjectRecord | null) => void;
  showAllProjectsOption?: boolean;
};

const ProjectMenu = ({
  anchorRef,
  open,
  onClose,
  projects,
  selectedProject,
  onSelect,
  showAllProjectsOption = false,
}: ProjectMenuProps) => {
  return (
    <Menu anchorEl={anchorRef.current} open={open} onClose={onClose}>
      {showAllProjectsOption ? (
        <MenuItem
          selected={selectedProject === null}
          onClick={() => onSelect(null)}
          sx={menuItemSx}
        >
          <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
            All Projects
          </Stack>
        </MenuItem>
      ) : null}
      {projects.map((project) => (
        <MenuItem
          key={project._id}
          value={project._id}
          selected={selectedProject?._id === project._id}
          onClick={() => onSelect(project)}
          sx={menuItemSx}
        >
          <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
            <img
              src={project.thumbnail}
              alt={project.name}
              style={{ width: 20, height: 20, objectFit: "contain" }}
            />
            {project.name}
          </Stack>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ProjectMenu;
