import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Divider, Stack, SxProps, Typography } from "@mui/material";
import { Fragment, useMemo } from "react";
import { DonationProject } from "@/component/donation/BodySection";

type BudgetSlice = {
  id: string;
  label: string;
  value: number;
  color: string;
};

const STEP_COLORS = [
  "#2A9AFE",
  "#02B1B4",
  "#02CAE4",
  "#78CF44",
  "#FEA90E",
  "#FD699D",
  "#9358E4",
  "#FF6B4A",
  "#5C6CFF",
];
const REMAINDER_COLOR = "#C8C8CA";

const LegendItem = ({
  slice,
  currencySymbol,
  align = "left",
}: {
  slice: BudgetSlice;
  currencySymbol: string;
  align?: "left" | "right";
}) => (
  <Stack
    direction="row"
    sx={{
      alignItems: "center",
      gap: { xs: 0.8, sm: 1.2 },
      maxWidth: "100%",
      width: "fit-content",
    }}
  >
    <Box
      sx={{
        width: { xs: 16, sm: 22, md: 28, lg: 32, xl: 36 },
        height: { xs: 16, sm: 22, md: 28, lg: 32, xl: 36 },
        borderRadius: "50%",
        bgcolor: slice.color,
        flexShrink: 0,
      }}
    />
    <Stack
      sx={{
        minWidth: 0,
        alignItems: "flex-start",
        gap: { xs: 0.4, sm: 0.5, md: 0.5, lg: 0.6, xl: 0.8 },
      }}
    >
      <Typography
        sx={{
          fontFamily: "Namecat",
          lineHeight: 1.15,
          fontSize: { xs: 14, sm: 16, md: 16, lg: 22 },
          textAlign: align === "left" ? "right" : "left",
          overflowWrap: "anywhere",
        }}
      >
        {slice.label}
      </Typography>
      <Typography
        sx={{
          fontFamily: "Namecat",
          color: "text.secondary",
          lineHeight: 1.2,
          fontSize: { xs: 12, sm: 14, md: 14, lg: 18 },
          textAlign: align === "left" ? "right" : "left",
        }}
      >
        {currencySymbol}
        {slice.value.toLocaleString()}
      </Typography>
    </Stack>
  </Stack>
);

const LegendColumn = ({
  items,
  side,
  currencySymbol,
}: {
  items: BudgetSlice[];
  side: "left" | "right";
  currencySymbol: string;
}) => (
  <Stack
    sx={{
      flex: 1,
      minWidth: 0,
      width: "fit-content",
      height: "100%",
      justifyContent: "space-between",
      gap: { xs: 0, md: 2.5, lg: 3.5, xl: 4.5 },
      alignItems: "flex-start",
    }}
  >
    {items.map((slice) => (
      <LegendItem
        key={slice.id}
        slice={slice}
        currencySymbol={currencySymbol}
        align={side}
      />
    ))}
  </Stack>
);

const ChartCard = ({
  projectData,
  cardSx,
  cardHeaderSx,
}: {
  projectData: DonationProject;
  cardSx: SxProps;
  cardHeaderSx: SxProps;
}) => {
  const currencySymbol = projectData.currency === "INR" ? "₹" : "$";
  const { pieSlices, legendItems } = useMemo(() => {
    const ordered = [...(projectData.steps ?? [])].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    let colorIndex = 0;
    const legend: BudgetSlice[] = ordered.map((step) => {
      const spentAmount = Number(step.spentAmount ?? 0);
      if (spentAmount > 0) {
        const slice: BudgetSlice = {
          id: step.id,
          label: step.label,
          value: spentAmount,
          color: STEP_COLORS[colorIndex % STEP_COLORS.length],
        };
        colorIndex += 1;
        return slice;
      }

      return {
        id: step.id,
        label: step.label,
        value: 0,
        color: REMAINDER_COLOR,
      };
    });

    const spent = legend.filter((slice) => slice.value > 0);
    const spentTotal = spent.reduce((sum, slice) => sum + slice.value, 0);
    const remaining = Math.max(
      0,
      Number(projectData.goalAmount ?? 0) - spentTotal
    );

    const pie = [...spent];
    if (remaining > 0) {
      pie.push({
        id: "remaining",
        label: "Remaining",
        value: remaining,
        color: REMAINDER_COLOR,
      });
    }

    return { pieSlices: pie, legendItems: legend };
  }, [projectData.goalAmount, projectData.steps]);
  const totalBudget =
    Number(projectData.goalAmount ?? 0) > 0
      ? Number(projectData.goalAmount)
      : pieSlices.reduce((sum, slice) => sum + slice.value, 0);
  const leftLegend = legendItems.slice(0, Math.ceil(legendItems.length / 2));
  const rightLegend = legendItems.slice(Math.ceil(legendItems.length / 2));

  return (
    <Stack sx={{ ...cardSx, gap: { xs: 0 }, direction: "ltr" }}>
      <Stack sx={cardHeaderSx}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Namecat",
            color: "primary.main",
            fontWeight: 900,
            letterSpacing: 1.2,
            fontSize: { xs: 16, sm: 20, md: 24, lg: 28, xl: 30 },
          }}
        >
          where your donation goes?
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 14, sm: 16, md: 18, lg: 20, xl: 22 },
            letterSpacing: 1,
            color: "text.secondary",
            fontFamily: "Namecat",
          }}
        >
          detailed breakdown of project budget
        </Typography>
      </Stack>

      <Stack
        sx={{
          width: "100%",
          minWidth: 0,
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        {legendItems.length === 0 && pieSlices.length === 0 ? (
          <Typography color="text.secondary">
            No budget breakdown yet.
          </Typography>
        ) : (
          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: { xs: "center", md: "space-between" },
              gap: { xs: 2, sm: 2.5, md: 2 },
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flex: 1,
                minWidth: 0,
                height: "100%",
              }}
            >
              <LegendColumn
                items={leftLegend}
                side="left"
                currencySymbol={currencySymbol}
              />
            </Box>
            <Box
              sx={{
                position: "relative",
                width: { xs: "100%", md: "50%" },
                aspectRatio: "1",
                flex: { md: "0 0 50%" },
              }}
            >
              <PieChart
                hideLegend
                margin={28}
                sx={{ width: "100%", height: "100%" }}
                series={[
                  {
                    data: pieSlices,
                    outerRadius: "88%",
                    innerRadius: "56%",
                    paddingAngle: 0,
                    cornerRadius: 4,
                    highlightScope: { fade: "global", highlight: "item" },
                    highlighted: { additionalRadius: 16 },
                    valueFormatter: (item) =>
                      item == null
                        ? ""
                        : `${currencySymbol}${Number(
                            item.value
                          ).toLocaleString()}`,
                  },
                ]}
              />
              <Stack
                sx={{
                  position: "absolute",
                  inset: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  gap: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Namecat",
                    fontWeight: 700,
                    lineHeight: 1,
                    textAlign: "center",
                    color: "text.primary",
                    fontSize: { xs: 18, sm: 24, md: 28, lg: 36, xl: 40 },
                  }}
                >
                  {currencySymbol}
                  {totalBudget.toLocaleString()}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Namecat",
                    lineHeight: 1.2,
                    textAlign: "center",
                    color: "text.secondary",
                    fontSize: { xs: 12, sm: 14, md: 18, lg: 24, xl: 28 },
                  }}
                >
                  Total budget
                </Typography>
              </Stack>
            </Box>
            <Stack
              sx={{
                display: { xs: "flex", md: "none" },
                width: "100%",
                alignItems: "flex-start",
                px: 2,
              }}
            >
              {legendItems.map((slice, index) => (
                <Fragment key={slice.id}>
                  {index > 0 ? (
                    <Divider
                      flexItem
                      sx={{ width: "100%", my: { xs: 1.2, sm: 1.5 } }}
                    />
                  ) : null}
                  <LegendItem slice={slice} currencySymbol={currencySymbol} />
                </Fragment>
              ))}
            </Stack>
            <Box
              sx={{ display: { xs: "none", md: "flex" }, flex: 1, minWidth: 0 }}
            >
              <LegendColumn
                items={rightLegend}
                side="right"
                currencySymbol={currencySymbol}
              />
            </Box>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
export default ChartCard;
