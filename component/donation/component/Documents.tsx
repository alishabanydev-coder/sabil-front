"use client";

import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

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
}) => {
  if (images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <Stack
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Image
          src={images[0]}
          alt={title}
          fill
          sizes="(max-width: 900px) 100vw, 60vw"
          style={{ objectFit: "cover" }}
        />
      </Stack>
    );
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      slidesPerView={1}
      style={{ width: "100%" }}
    >
      {images.map((img, index) => (
        <SwiperSlide key={`${img}-${index}`}>
          <Stack
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Image
              src={img}
              alt={`${title} ${index + 1}`}
              fill
              sizes="(max-width: 900px) 100vw, 60vw"
              style={{ objectFit: "cover" }}
            />
          </Stack>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

const Documents = ({ projectData }: DocumentsProps) => {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const sections = useMemo(
    () =>
      [...(projectData.sections ?? [])]
        .filter(hasSectionContent)
        .sort((a, b) => a.order - b.order),
    [projectData.sections]
  );

  const navSections = useMemo(() => sections.filter(hasHeader), [sections]);

  const scrollToSection = (sectionId: string) => {
    sectionRefs.current[sectionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <Stack
      sx={{
        flexDirection: "row",
        width: "100%",
        // height: "calc(100dvh - 50px)",
      }}
    >
      <Stack
        sx={{
          width: 220,
          flexShrink: 0,
          borderRight: "1px solid #e0e0e0",
          py: 2,
          gap: 1,

          position: "sticky",
          top: 50,
          alignSelf: "flex-start",
          height: "calc(100vh - 50px)",
          overflowY: "auto",
        }}
      >
        {navSections.map((section) => (
          <Button
            key={section.id}
            variant="text"
            onClick={() => scrollToSection(section.id)}
            sx={{ width: "100%", justifyContent: "start" }}
          >
            <Typography
              variant="h6"
              sx={{
                width: "100%",
                fontWeight: 700,
                fontFamily: "Namecat",
                color: "primary.main",
                letterSpacing: 2,
                textTransform: "uppercase",
                textAlign: "start",
                fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {section.header}
            </Typography>
          </Button>
        ))}
      </Stack>

      <Stack
        sx={{
          flex: 1,
          px: 3,
          py: 2,
          gap: 4,
          overflow: "auto",
        }}
      >
        {sections.map((section) => (
          <Stack
            key={section.id}
            id={section.id}
            ref={(node) => {
              sectionRefs.current[section.id] = node;
            }}
            sx={{
              gap: 3,
              scrollMarginTop: 8,
              "& .swiper-button-prev, & .swiper-button-next": {
                color: "primary.main",
              },
              "& .swiper-pagination-bullet": {
                bgcolor: "grey.600",
                opacity: 1,
                width: 8,
                height: 8,
              },
              "& .swiper-pagination-bullet-active": {
                bgcolor: "primary.main",
                width: 12,
                height: 12,
              },
            }}
          >
            <SectionImages
              images={section.images ?? []}
              title={section.header?.trim() || section.id}
            />

            {hasHeader(section) ? (
              <Typography
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
