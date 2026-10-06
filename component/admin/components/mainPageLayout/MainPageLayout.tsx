"use client";

import { Stack } from "@mui/material";
import { useAdminMainPageLayout } from "../../hooks/useAdminMainPageLayout";
import ProjectMenu from "./component/ProjectMenu";
import SectionItemsModal from "./component/SectionItemsModal";
import SectionPreview from "./component/SectionPreview";

const MainPageLayout = () => {
  const {
    errorMsg,
    getSectionPreviewItems,
    handleClose,
    handleDelete,
    handleOpen,
    handleProjectMenuClick,
    handleProjectMenuClose,
    handleProjectSelect,
    handleSave,
    isSaving,
    loading,
    menuElRef,
    modalItems,
    open,
    openedSection,
    openProjectMenu,
    projects,
    saveErrorMsg,
    sections,
    selectedItemIds,
    selectedProject,
    toggleItemSelection,
  } = useAdminMainPageLayout();

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        border: (theme) => `1px solid ${theme.palette.primary.main}`,
        borderRadius: 2,
        pt: 1,
      }}
    >
      <Stack sx={{ width: "100%", height: "100%", overflowY: "auto", gap: 2 }}>
        {sections.map((section) => (
          <SectionPreview
            key={section.name}
            section={section}
            items={getSectionPreviewItems(section.name)}
            loading={loading}
            selectedProject={selectedProject}
            onOpen={handleOpen}
            onDelete={handleDelete}
            onProjectMenuClick={handleProjectMenuClick}
          />
        ))}
      </Stack>

      <SectionItemsModal
        open={open}
        openedSection={openedSection}
        modalItems={modalItems}
        selectedItemIds={selectedItemIds}
        loading={loading}
        errorMsg={errorMsg}
        isSaving={isSaving}
        saveErrorMsg={saveErrorMsg}
        projects={projects}
        selectedProject={selectedProject}
        openProjectMenu={openProjectMenu}
        menuElRef={menuElRef}
        handleClose={handleClose}
        handleSave={handleSave}
        toggleItemSelection={toggleItemSelection}
        handleProjectMenuClick={handleProjectMenuClick}
        handleProjectMenuClose={handleProjectMenuClose}
        handleProjectSelect={handleProjectSelect}
      />

      <ProjectMenu
        anchorRef={menuElRef}
        open={openProjectMenu}
        onClose={handleProjectMenuClose}
        projects={projects}
        selectedProject={selectedProject}
        onSelect={handleProjectSelect}
        showAllProjectsOption
      />
    </Stack>
  );
};

export default MainPageLayout;
