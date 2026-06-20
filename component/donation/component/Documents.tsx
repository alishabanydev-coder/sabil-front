"use client";

import { Button, Stack, Typography } from "@mui/material";
import { useMemo, useRef } from "react";
import { useScrollSpy } from "@/component/donation/hooks/useScrollSpy";
import ImageSlider from "./ImageSlider";

type DocSection = {
  id: string;
  header?: string | null;
  text?: string | null;
  images?: string[] | null;
  order: number;
};

type DocumentsProps = {
  projectData: {
    sections: DocSection[];
  };
};

const hasHeader = (section: DocSection) =>
  typeof section.header === "string" && section.header.trim().length > 0;

const hasSectionContent = (section: DocSection) =>
  hasHeader(section) ||
  (typeof section.text === "string" && section.text.trim().length > 0) ||
  (section.images?.length ?? 0) > 0;

const SectionImages = ({
  images,
  title,
}: {
  images: string[];
  title: string;
}) => <ImageSlider images={images} title={title} />;

const SCROLL_SPY_OFFSET = 120;

const Documents = ({ projectData }: DocumentsProps) => {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const sections = useMemo(
    () =>
      [...(projectData.sections ?? [])]
        .filter(hasSectionContent)
        .sort((a, b) => a.order - b.order),
    [projectData.sections]
  );

  const navSections = useMemo(() => sections.filter(hasHeader), [sections]);
  const navSectionIds = useMemo(
    () => navSections.map((section) => section.id),
    [navSections]
  );

  const { activeId: activeSectionId, scrollToSection } = useScrollSpy(
    navSectionIds,
    sectionRefs,
    { offset: SCROLL_SPY_OFFSET }
  );

  if (sections.length === 0) {
    return null;
  }

  return (
    <Stack
      sx={{
        flexDirection: "row",
        width: "100%",
      }}
    >
      <Stack
        sx={{
          display: { xs: "none", sm: "flex" },
          width: { xs: 0, sm: 180, md: 220 },
          flexShrink: 0,
          borderRight: "1px solid #e0e0e0",
          py: 2,
          pr: 0.5,
          gap: 1,
          position: "sticky",
          top: 50,
          alignSelf: "flex-start",
          height: "calc(100vh - 50px)",
          overflowY: "auto",
        }}
      >
        {navSections.map((section) => {
          const isActive = activeSectionId === section.id;

          return (
            <Button
              key={section.id}
              variant="text"
              onClick={() => scrollToSection(section.id)}
              sx={{
                width: "100%",
                justifyContent: "start",
                borderRadius: 1,
                px: 1.5,
                bgcolor: isActive ? "action.selected" : "transparent",
                borderLeft: "3px solid",
                borderColor: isActive ? "primary.main" : "transparent",
                "&:hover": {
                  bgcolor: isActive ? "action.selected" : "action.hover",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  width: "100%",
                  fontWeight: isActive ? 800 : 700,
                  fontFamily: "Namecat",
                  color: isActive ? "primary.main" : "text.secondary",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  textAlign: "start",
                  fontSize: { xs: 10, sm: 10, md: 14, lg: 16, xl: 18 },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {section.header}
              </Typography>
            </Button>
          );
        })}
      </Stack>

      <Stack
        sx={{
          flex: 1,
          px: { xs: 0, sm: 1, md: 3 },
          py: 2,
          gap: 4,
        }}
      >
        {sections.map((section) => (
          <Stack
            key={section.id}
            ref={(node) => {
              if (hasHeader(section)) {
                sectionRefs.current[section.id] = node;
              }
            }}
            id={section.id}
            sx={{
              gap: 2,
              pb: { xs: 0, md: 5 },
              scrollMarginTop: `${SCROLL_SPY_OFFSET}px`,
            }}
          >
            <SectionImages
              images={section.images ?? []}
              title={section.header?.trim() || section.id}
            />

            {hasHeader(section) ? (
              <Typography
                component="h3"
                sx={{
                  fontWeight: 700,
                  fontFamily: "Namecat",
                  color: "primary.main",
                  letterSpacing: 1.5,
                  fontSize: { xs: 12, sm: 14, md: 18, lg: 22 },
                }}
              >
                {section.header}
              </Typography>
            ) : null}

            {section.text?.trim() ? (
              <Typography
                sx={{
                  fontSize: { xs: 11, sm: 13, md: 15, lg: 17 },
                  lineHeight: 1.6,
                  color: "text.primary",
                }}
              >
                {section.text}
              </Typography>
            ) : null}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default Documents;
