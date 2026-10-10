"use client";

import { Divider, Stack, Tab, Tabs } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import ArtTrackRoundedIcon from "@mui/icons-material/ArtTrackRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import { useEffect, useRef, useState } from "react";
import Documents from "./component/Documents";
import Updates from "./component/Updates";
import FAQTab from "./component/FAQTab";
import CommentSection from "./component/CommentSection";

type DonationProject = {
  _id: string;
  title: string;
  slug: string;
  poster: string;
  shortDescription: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  currency?: "USD" | "INR" | string;
  videoUrl?: string | null;
  status: string;
};

const cardSx = {
  gap: 2,
  px: { xs: 0, sm: 1, md: 3 },
  py: 3,
  boxShadow: 8,
  borderRadius: 5,
};

const TabLayout = ({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: string;
  index: string;
}) => {
  return (
    <Stack sx={{ width: "100%" }}>{value === index && <>{children}</>}</Stack>
  );
};

const SLIDE_MS = 300;
const SHRINK_MS = 50;
const BOUNCE_MS = 200;
const SLIDE_EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

const indicatorBounce = keyframes`
  0% {
    transform: scale(0.9);
  }
  36% {
    transform: scale(1.1);
  }
  64% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
`;

type IndicatorMotion = "idle" | "travel" | "settle";

const tabs = [
  { name: "Summary", icon: <ArtTrackRoundedIcon /> },
  { name: "Statistics", icon: <QueryStatsRoundedIcon /> },
  { name: "FAQ", icon: <LiveHelpOutlinedIcon /> },
  { name: "Comments", icon: <QuestionAnswerOutlinedIcon /> },
  { name: "Updates", icon: <UpdateRoundedIcon /> },
];

const BodySection = ({ projectData }: { projectData: DonationProject }) => {
  const [activeTab, setActiveTab] = useState<string>("Summary");
  const [motion, setMotion] = useState<IndicatorMotion>("idle");
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const tabsRootRef = useRef<HTMLDivElement | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    if (newValue === activeTab) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setMotion(reduceMotion ? "idle" : "travel");
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (motion !== "travel") return;
    const node = indicatorRef.current;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setMotion("settle");
    };
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== node) return;
      if (
        event.propertyName !== "left" &&
        event.propertyName !== "right" &&
        event.propertyName !== "width"
      ) {
        return;
      }
      finish();
    };
    node?.addEventListener("transitionend", onTransitionEnd);
    const timer = window.setTimeout(finish, SLIDE_MS + 70);
    return () => {
      node?.removeEventListener("transitionend", onTransitionEnd);
      window.clearTimeout(timer);
    };
  }, [motion, activeTab]);

  useEffect(() => {
    if (motion !== "settle") return;
    const timer = window.setTimeout(() => setMotion("idle"), BOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [motion]);

  useEffect(() => {
    const scroller =
      tabsRootRef.current?.querySelector<HTMLDivElement>(".MuiTabs-scroller");
    if (!scroller) return;

    let dragOriginX = 0;
    let dragOriginScroll = 0;
    let dragged = false;
    let pointerId: number | null = null;

    const onWheel = (event: WheelEvent) => {
      if (scroller.scrollWidth <= scroller.clientWidth + 1) return;
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      if (delta === 0) return;
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      const next = Math.min(
        maxScroll,
        Math.max(0, scroller.scrollLeft + delta)
      );
      if (next === scroller.scrollLeft) return;
      event.preventDefault();
      scroller.scrollLeft = next;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragged = false;
      pointerId = event.pointerId;
      dragOriginX = event.clientX;
      dragOriginScroll = scroller.scrollLeft;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      const distance = event.clientX - dragOriginX;
      if (!dragged && Math.abs(distance) < 6) return;
      dragged = true;
      scroller.scrollLeft = dragOriginScroll - distance;
    };

    const endDrag = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      pointerId = null;
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("pointerdown", onPointerDown);
    scroller.addEventListener("pointermove", onPointerMove);
    scroller.addEventListener("pointerup", endDrag);
    scroller.addEventListener("pointercancel", endDrag);
    scroller.addEventListener("click", onClickCapture, true);
    return () => {
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("pointerdown", onPointerDown);
      scroller.removeEventListener("pointermove", onPointerMove);
      scroller.removeEventListener("pointerup", endDrag);
      scroller.removeEventListener("pointercancel", endDrag);
      scroller.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  return (
    <Stack
      sx={{
        width: { xs: "90%", sm: "85%" },
        height: "88%",
        mx: "auto",
        gap: 3,
      }}
    >
      <Tabs
        ref={tabsRootRef}
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        textColor="inherit"
        slotProps={{
          indicator: {
            ref: indicatorRef,
            sx: {
              height: "calc(100% - 16px)",
              top: 8,
              bottom: "auto",
              borderRadius: 3,
              bgcolor: "primary.main",
              zIndex: 0,
              transformOrigin: "center",
              "&&": {
                transform: motion === "idle" ? "none" : "scale(0.9)",
                transition:
                  motion === "settle"
                    ? `left ${SLIDE_MS}ms ${SLIDE_EASE}, width ${SLIDE_MS}ms ${SLIDE_EASE}`
                    : `left ${SLIDE_MS}ms ${SLIDE_EASE}, width ${SLIDE_MS}ms ${SLIDE_EASE}, transform ${SHRINK_MS}ms ease-out`,
                animation:
                  motion === "settle"
                    ? `${indicatorBounce} ${BOUNCE_MS}ms ease-out forwards`
                    : "none",
              },
            },
          },
        }}
        sx={{
          minHeight: 52,
          p: "4px",
          "& .MuiTabs-scroller": {
            py: "8px",
            overflowX: "auto !important",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x pan-y",
            cursor: "grab",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          },
          "& .MuiTabs-list": {
            position: "relative",
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
            width: "max-content",
            minWidth: "100%",
            zIndex: 1,
            gap: { xs: 1, sm: 1.5, md: 2, lg: 3, xl: 3.5 },
          },
          "&& .MuiTab-root": {
            px: { xs: 1, sm: 1.5, md: 2, lg: 2.5, xl: 3 },
            py: { xs: 0, sm: 1, md: 1.5, lg: 2, xl: 2.5 },
            minHeight: 42,
            zIndex: 1,
            textTransform: "none",
            lineHeight: 1,
            fontWeight: 600,
            color: "text.secondary",
            opacity: 1,
            transition: "color 40ms linear",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 0.5, sm: 0.7, md: 1, xl: 1.5 },
            fontSize: { xs: 12, sm: 15, md: 16, lg: 22, xl: 24 },
            "& svg": {
              width: { xs: 18, sm: 24, md: 32, lg: 36, xl: 40 },
              height: { xs: 18, sm: 24, md: 32, lg: 36, xl: 40 },
              mr: 0,
            },
            "&.Mui-selected": {
              color: "primary.contrastText",
              "& svg": {
                color: "secondary.main",
              },
            },
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            disableRipple
            key={tab.name}
            value={tab.name}
            label={tab.name}
            icon={tab.icon}
            iconPosition="start"
          />
        ))}
      </Tabs>

      <Divider flexItem />

      <Stack>
        <TabLayout value={activeTab} index="Summary">
          <Documents projectData={projectData} cardSx={cardSx} />
        </TabLayout>
        <TabLayout value={activeTab} index="Statistics">
          <Updates projectData={projectData} cardSx={cardSx} />
        </TabLayout>
        <TabLayout value={activeTab} index="FAQ">
          <FAQTab projectData={projectData} cardSx={cardSx} />
        </TabLayout>
        <TabLayout value={activeTab} index="Comments">
          <CommentSection
            setActiveTab={setActiveTab}
            projectData={projectData}
          />
        </TabLayout>
      </Stack>
    </Stack>
  );
};

export default BodySection;
