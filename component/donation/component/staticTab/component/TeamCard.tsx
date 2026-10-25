import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Avatar,
  IconButton,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { useLayoutEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { DonationProject, DonationStaffMember } from "../../../BodySection";

const slotSx = {
  alignItems: "center",
  textAlign: "center",
  gap: 0.5,
  width: { xs: 80, sm: 100, md: 120, lg: 130, xl: 145 },
  flexShrink: 0,
};

const avatarSizeSx = {
  width: { xs: 64, sm: 80, md: 96, lg: 105, xl: 110 },
  height: { xs: 64, sm: 80, md: 96, lg: 105, xl: 110 },
};

const nameSx = {
  fontWeight: 700,
  fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
  width: "100%",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  cursor: "pointer",
  lineHeight: 1,
};

const roleSx = {
  color: "text.secondary",
  fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 },
  fontWeight: 500,
  width: "100%",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  lineHeight: 1,
};

const EllipsisText = ({ text, sx }: { text: string; sx: SxProps }) => {
  const [tooltip, setTooltip] = useState("");

  return (
    <Tooltip title={tooltip} disableInteractive>
      <Typography
        sx={sx}
        onPointerEnter={(event) => {
          const el = event.currentTarget;
          setTooltip(el.scrollWidth - el.clientWidth > 1 ? text : "");
        }}
        onPointerLeave={() => setTooltip("")}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

const MemberSlot = ({ member }: { member: DonationStaffMember }) => (
  <Stack data-team-slot sx={slotSx}>
    <Avatar
      src={member.photo || undefined}
      alt={member.name}
      sx={avatarSizeSx}
    />
    <EllipsisText text={member.name} sx={nameSx} />
    <EllipsisText text={member.role} sx={roleSx} />
  </Stack>
);

const TeamCard = ({
  projectData,
  cardSx,
  cardHeaderSx,
}: {
  projectData: DonationProject;
  cardSx: SxProps;
  cardHeaderSx: SxProps;
}) => {
  const staff = [...(projectData.staff ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const rowRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [capacity, setCapacity] = useState(staff.length);
  const [isSwiper, setIsSwiper] = useState(false);
  const [navState, setNavState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  const updateNavState = (swiper: SwiperType) => {
    setNavState({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  };

  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row || staff.length === 0 || isSwiper) {
      return;
    }

    const measure = () => {
      const gap = Number.parseFloat(getComputedStyle(row).columnGap) || 0;
      const slot = row.querySelector<HTMLElement>("[data-team-slot]");
      const slotWidth = slot?.getBoundingClientRect().width ?? 0;
      if (slotWidth <= 0) {
        return;
      }

      const next = Math.max(
        1,
        Math.floor((row.clientWidth + gap) / (slotWidth + gap))
      );
      setCapacity((current) => (current === next ? current : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, [staff.length, isSwiper]);

  const hasOverflow = staff.length > capacity;
  const visibleStaff = hasOverflow
    ? staff.slice(0, Math.max(capacity - 1, 0))
    : staff;
  const hiddenCount = staff.length - visibleStaff.length;

  return (
    <Stack sx={{ ...cardSx, gap: { xs: 1, sm: 2, md: 3 } }}>
      <Stack sx={cardHeaderSx}>
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            fontWeight: 800,
            letterSpacing: 1.2,
            fontSize: { xs: 16, sm: 20, md: 24, lg: 28, xl: 30 },
          }}
        >
          meet the team
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 14, sm: 16, md: 18, lg: 20, xl: 22 },
            fontWeight: 600,
            color: "text.secondary",
          }}
        >
          the passionate people behind the project
        </Typography>
      </Stack>

      {isSwiper ? (
        <Stack sx={{ position: "relative", width: "100%" }}>
          <Swiper
            slidesPerView="auto"
            grabCursor
            watchOverflow
            breakpoints={{
              0: { spaceBetween: 16 },
              600: { spaceBetween: 24 },
              900: { spaceBetween: 32 },
            }}
            style={{ width: "100%" }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              updateNavState(swiper);
            }}
            onSlideChange={updateNavState}
            onResize={updateNavState}
            onBreakpoint={updateNavState}
          >
            {staff.map((member, index) => (
              <SwiperSlide
                key={`${member.id}-${index}`}
                style={{ width: "auto", height: "auto" }}
              >
                <MemberSlot member={member} />
              </SwiperSlide>
            ))}
          </Swiper>
          <Stack
            direction="row"
            sx={{
              position: "absolute",
              inset: 0,
              alignItems: "center",
              justifyContent: "space-between",
              pointerEvents: "none",
            }}
          >
            <Stack sx={{ pointerEvents: "auto", zIndex: 2 }}>
              {!navState.isBeginning ? (
                <IconButton
                  aria-label="Previous team members"
                  onClick={() => swiperRef.current?.slidePrev()}
                  sx={{
                    bgcolor: "background.paper",
                    boxShadow: 2,
                    "&:hover": { bgcolor: "background.paper" },
                  }}
                >
                  <NavigateBeforeIcon />
                </IconButton>
              ) : null}
            </Stack>
            <Stack sx={{ pointerEvents: "auto", zIndex: 2 }}>
              {!navState.isEnd ? (
                <IconButton
                  aria-label="Next team members"
                  onClick={() => swiperRef.current?.slideNext()}
                  sx={{
                    bgcolor: "background.paper",
                    boxShadow: 2,
                    "&:hover": { bgcolor: "background.paper" },
                  }}
                >
                  <NavigateNextIcon />
                </IconButton>
              ) : null}
            </Stack>
          </Stack>
        </Stack>
      ) : (
        <Stack
          ref={rowRef}
          sx={{
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "center",
            overflow: "hidden",
            gap: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {visibleStaff.map((member, index) => (
            <MemberSlot key={`${member.id}-${index}`} member={member} />
          ))}
          {hasOverflow ? (
            <Stack
              data-team-slot
              role="button"
              tabIndex={0}
              aria-label="Show all team members"
              onClick={() => setIsSwiper(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setIsSwiper(true);
                }
              }}
              sx={{
                ...slotSx,
                width: { xs: 90, sm: 110, md: 130, lg: 140, xl: 155 },
                cursor: "pointer",
                border: "2px solid #e0e0e0",
                py: 1,
                px: 1.2,
                borderRadius: 3,
              }}
            >
              <Avatar
                sx={{
                  ...avatarSizeSx,
                  color: "primary.main",
                  lineHeight: 1,
                  fontWeight: 700,
                  fontSize: { xs: 24, sm: 28, md: 32, lg: 40, xl: 45 },
                }}
              >
                +{hiddenCount}
              </Avatar>
              <Typography sx={nameSx}>more member</Typography>
              <Typography sx={roleSx}>{staff.length} total member</Typography>
            </Stack>
          ) : null}
        </Stack>
      )}
    </Stack>
  );
};

export default TeamCard;
