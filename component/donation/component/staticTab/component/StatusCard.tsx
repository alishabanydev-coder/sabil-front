import { ProjectStepStatus } from "@/component/admin/components/donation/donationDrafts";
import {
  Stack,
  Step,
  StepLabel,
  Stepper,
  SxProps,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";

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
  faq?: {
    header: string;
    summary: string;
    order: number;
  }[];
  steps?: ProjectStep[];
};

type ProjectStep = {
  id: string;
  label: string;
  status: ProjectStepStatus;
  spentAmount?: number;
  order?: number;
};

const fluidStepIcon = "clamp(20px, calc(42cqw / var(--step-count)), 60px)";
const fluidStepLabel = "clamp(11px, calc(16cqw / var(--step-count)), 22px)";
const fluidStepStatus = "clamp(10px, calc(13cqw / var(--step-count)), 18px)";

const STATUS_LABEL: Record<ProjectStepStatus, string> = {
  upcoming: "Upcoming",
  in_progress: "In progress",
  completed: "Completed",
  skipped: "Skipped",
};

const StatusCard = ({
  projectData,
  cardSx,
  cardHeaderSx,
}: {
  projectData: DonationProject;
  cardSx: SxProps;
  cardHeaderSx: SxProps;
}) => {
  const steps = [...(projectData.steps ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const activeStep = steps.findIndex((step) => step.status === "in_progress");
  const stepCount = Math.max(steps.length, 1);
  const isXs = useMediaQuery((theme) => theme.breakpoints.only("xs"));
  const stepIconSize = isXs ? "46px" : fluidStepIcon;
  const stepLabelSize = isXs ? "16px" : fluidStepLabel;
  const stepStatusSize = isXs ? "14px" : fluidStepStatus;

  return (
    <Stack sx={{ ...cardSx, gap: { xs: 1, sm: 2, md: 4 } }}>
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
          Project Status
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 14, sm: 16, md: 18, lg: 20, xl: 22 },
            letterSpacing: 1,
            color: "text.secondary",
            fontFamily: "Namecat",
          }}
        >
          track our progress in real time
        </Typography>
      </Stack>

      <Stack sx={{ width: "100%", minWidth: 0 }}>
        {steps.length === 0 ? (
          <Typography color="text.secondary">No steps yet.</Typography>
        ) : (
          <Stepper
            nonLinear
            activeStep={activeStep}
            orientation={isXs ? "vertical" : "horizontal"}
            alternativeLabel={!isXs}
            style={{ ["--step-count" as string]: stepCount }}
            sx={{
              containerType: "inline-size",
              width: "100%",
              minWidth: 0,
              pl: { xs: "10%", sm: 0 },
              "& .MuiStep-root": {
                minWidth: 0,
              },
              "& .MuiStep-horizontal": {
                px: "clamp(2px, calc(6cqw / var(--step-count)), 8px)",
              },
              "& .MuiStepIcon-root": {
                color: "grey.500",
                fontSize: stepIconSize,
              },
              "& .MuiStepConnector-horizontal": {
                top: `calc(${fluidStepIcon} / 2)`,
                left: `calc(-50% + ${fluidStepIcon} / 2 + 6px)`,
                right: `calc(50% + ${fluidStepIcon} / 2 + 6px)`,
              },
              "& .MuiStepConnector-vertical": {
                marginLeft: "calc(41px / 2 - 1px)",
              },
              "& .MuiStepConnector-vertical .MuiStepConnector-line": {
                borderLeftWidth: 2,
                minHeight: 28,
              },
              "& .MuiStepIcon-root.Mui-active": {
                color: "primary.main",
              },
              "& .MuiStepIcon-root.Mui-completed": {
                color: "success.main",
              },
              "& .MuiStepConnector-line": {
                borderTopWidth: 2,
                borderColor: "grey.400",
              },
              "& .MuiStep-root.Mui-completed + .MuiStep-root .MuiStepConnector-line, & .MuiStep-root.Mui-completed + .MuiStepConnector-root .MuiStepConnector-line":
                {
                  borderColor: "success.main",
                },
            }}
          >
            {steps.map((step) => {
              const statusColor =
                step.status === "completed"
                  ? "success.main"
                  : step.status === "in_progress"
                  ? "primary.main"
                  : "grey.500";

              return (
                <Step
                  key={step.id}
                  active={step.status === "in_progress"}
                  completed={step.status === "completed"}
                  disabled={step.status === "skipped"}
                >
                  <StepLabel
                    icon={
                      step.status === "in_progress" ? (
                        <DonutLargeRoundedIcon
                          sx={{
                            fontSize: stepIconSize,
                            color: "primary.main",
                          }}
                        />
                      ) : undefined
                    }
                    optional={
                      <Typography
                        variant="caption"
                        sx={{
                          color: statusColor,
                          fontSize: stepStatusSize,
                          letterSpacing:
                            "clamp(0.2px, calc(4cqw / var(--step-count)), 1.1px)",
                          fontFamily: "Namecat",
                          lineHeight: 1.2,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {STATUS_LABEL[step.status] ?? step.status}
                      </Typography>
                    }
                  >
                    <Typography
                      sx={{
                        fontSize: stepLabelSize,
                        color: "text.primary",
                        letterSpacing:
                          "clamp(0.2px, calc(4cqw / var(--step-count)), 1.1px)",
                        fontFamily: "Namecat",
                        lineHeight: 1.2,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {step.label}
                    </Typography>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        )}
      </Stack>
    </Stack>
  );
};

export default StatusCard;
