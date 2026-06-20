"use client";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { IconButton, Stack } from "@mui/material";
import Image from "next/image";
import { useRef, useState } from "react";

const imageFrameSx = {
  position: "relative",
  width: "100%",
  aspectRatio: "16/9",
  borderRadius: 2,
  overflow: "hidden",
} as const;

const FADE_MS = 450;
const SWIPE_THRESHOLD = 48;

type ImageSliderProps = {
  images: string[];
  title: string;
};

const ImageSlider = ({ images, title }: ImageSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const lastIndex = images.length - 1;
  const isBeginning = activeIndex === 0;
  const isEnd = activeIndex === lastIndex;

  const goPrev = () => {
    setActiveIndex((current) => Math.max(0, current - 1));
  };

  const goNext = () => {
    setActiveIndex((current) => Math.min(lastIndex, current + 1));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!swipeStart.current) {
      return;
    }

    const deltaX = event.clientX - swipeStart.current.x;
    const deltaY = event.clientY - swipeStart.current.y;
    swipeStart.current = null;

    if (
      Math.abs(deltaX) < SWIPE_THRESHOLD ||
      Math.abs(deltaX) < Math.abs(deltaY)
    ) {
      return;
    }

    if (deltaX < 0) {
      goNext();
      return;
    }

    goPrev();
  };

  const resetSwipe = () => {
    swipeStart.current = null;
  };

  if (images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <Stack sx={imageFrameSx}>
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
    <Stack sx={{ width: "100%", position: "relative" }}>
      <Stack
        sx={{
          ...imageFrameSx,
          touchAction: "pan-y",
          cursor: "grab",
          userSelect: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={resetSwipe}
        onPointerLeave={resetSwipe}
      >
        {images.map((src, index) => {
          const isActive = index === activeIndex;

          return (
            <Stack
              key={`${src}-${index}`}
              sx={{
                position: "absolute",
                inset: 0,
                opacity: isActive ? 1 : 0,
                transition: `opacity ${FADE_MS}ms ease-in-out`,
                zIndex: isActive ? 1 : 0,
                pointerEvents: "none",
              }}
            >
              <Image
                src={src}
                alt={`${title} ${index + 1}`}
                fill
                sizes="(max-width: 900px) 100vw, 60vw"
                style={{ objectFit: "cover" }}
                draggable={false}
              />
            </Stack>
          );
        })}
      </Stack>

      <Stack
        direction="row"
        sx={{
          position: "absolute",
          inset: 0,
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <Stack sx={{ pointerEvents: "auto" }}>
          {!isBeginning ? (
            <IconButton
              aria-label="Previous image"
              onClick={goPrev}
              sx={{
                bgcolor: "secondary.main",
                color: "warning.main",
                "&:hover": { bgcolor: "secondary.light" },
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>
          ) : null}
        </Stack>

        <Stack sx={{ pointerEvents: "auto" }}>
          {!isEnd ? (
            <IconButton
              aria-label="Next image"
              onClick={goNext}
              sx={{
                bgcolor: "secondary.main",
                color: "warning.main",
                "&:hover": { bgcolor: "secondary.light" },
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          ) : null}
        </Stack>
      </Stack>

      <Stack
        direction="row"
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 10,
          justifyContent: "center",
          alignItems: "center",
          gap: 0.75,
          pointerEvents: "auto",
          zIndex: 2,
        }}
      >
        {images.map((src, index) => {
          const isActive = index === activeIndex;

          return (
            <IconButton
              key={`${src}-${index}-dot`}
              aria-label={`Go to image ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              size="small"
              sx={{
                p: 0,
                width: isActive ? 18 : 12,
                height: isActive ? 18 : 12,
                minWidth: 0,
                bgcolor: isActive ? "primary.main" : "grey.500",
                transition:
                  "width 0.2s ease, height 0.2s ease, background-color 0.2s ease",
                "&:hover": {
                  bgcolor: isActive ? "primary.main" : "grey.400",
                },
              }}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export default ImageSlider;
