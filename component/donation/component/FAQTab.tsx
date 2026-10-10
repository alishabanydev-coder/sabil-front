import {
  alpha,
  Button,
  Stack,
  styled,
  Tab,
  Tabs,
  Typography,
  type SxProps,
} from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type DonationUpdate } from "./UpdateCard";

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
  sections?: {
    id: string;
    header: string;
    text: string;
    images: string[];
    order: number;
  }[];
  updates?: DonationUpdate[];
};

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  width: "100%",
  borderRadius: 12,
  overflow: "hidden",
  border: `1px solid ${theme.palette.secondary.main}`,
  backgroundColor: theme.palette.primary.dark,
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon
        sx={{ fontSize: { xs: 13, sm: 15 }, color: "secondary.main", mt: -0.6 }}
      />
    }
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  color: theme.palette.common.white,
  [`& .${accordionSummaryClasses.expandIconWrapper}`]: {
    color: theme.palette.secondary.main,
  },
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  [`&& .${accordionSummaryClasses.content} .MuiTypography-root`]: {
    fontFamily: "Namecat",
    fontWeight: 700,
    fontSize: 13,
    lineHeight: 1.2,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    textAlign: "start",
    color: theme.palette.common.white,
    [theme.breakpoints.up("sm")]: {
      fontSize: 15,
    },
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.secondary.main}`,
  color: theme.palette.common.white,
}));

const TabLayout = ({
  children,
  value,
  index,
  contentKey,
}: {
  children: React.ReactNode;
  value: string;
  index: string;
  contentKey: string;
}) => {
  const isSelected = value === index;

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={contentKey}
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", height: "100%" }}
        >
          <Stack
            sx={{
              width: "100%",
              height: "100%",
              p: { xs: 1, sm: 1.5, md: 2, lg: 2.5, xl: 3 },
              borderRadius: 5,
              bgcolor: isSelected
                ? (theme) => theme.palette.primary.light
                : "none",
            }}
          >
            {isSelected ? (
              <>{children}</>
            ) : (
              <Stack>
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontSize: { xs: 11, sm: 14, md: 16, lg: 18, xl: 19 },
                    color: "secondary.main",
                    fontFamily: "Namecat",
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    textAlign: "start",
                  }}
                >
                  FAQs
                </Typography>
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontSize: { xs: 12, sm: 16, md: 26, lg: 54, xl: 56 },
                    color: "white",
                    fontFamily: "Arco",
                    fontWeight: 700,
                    letterSpacing: 0.9,
                    textTransform: "uppercase",
                    textAlign: "start",
                  }}
                >
                  Have <br /> questions?
                </Typography>
              </Stack>
            )}
          </Stack>
        </motion.div>
      </AnimatePresence>
    </Stack>
  );
};

const FAQTab = ({
  projectData,
  cardSx,
}: {
  projectData: DonationProject;
  cardSx: SxProps;
}) => {
  const faqs = projectData.faq ?? [];
  const [selectedOrder, setSelectedOrder] = useState<string | false>(false);
  const [expanded, setExpanded] = useState<string | false>(false);
  const selectedFaq = faqs.find(
    (faq) => faq.order.toString() === selectedOrder
  );

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedOrder(newValue);
  };

  const handleAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Stack
      sx={{
        ...cardSx,
        boxShadow: (theme) =>
          `0px 5px 15px 10px ${alpha(theme.palette.primary.main, 0.5)}`,
        width: "100%",
        bgcolor: "primary.main",
      }}
    >
      <Stack
        sx={{
          display: { xs: "flex", md: "none" },
          width: "100%",
          gap: 1.5,
          py: 4,
          px: 2,
        }}
      >
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: 12, sm: 16 },
            color: "secondary.main",
            fontFamily: "Namecat",
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          FAQs
        </Typography>
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <Accordion
              key={faq.order}
              expanded={expanded === faq.order.toString()}
              onChange={handleAccordionChange(faq.order.toString())}
            >
              <AccordionSummary
                aria-controls={`${faq.order}-content`}
                id={`${faq.order}-header`}
              >
                <Typography component="span">{faq.header}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  sx={{
                    fontSize: { xs: 13, sm: 15 },
                    fontFamily: "Namecat",
                    textAlign: "start",
                  }}
                >
                  {faq.summary}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography>No FAQ found</Typography>
        )}
      </Stack>

      <Stack
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "row",
          width: "100%",
          gap: 2,
          py: 7,
          px: 4,
          minHeight: 460,
        }}
      >
        <Stack
          sx={{
            width: "60%",
          }}
        >
          <TabLayout
            value={selectedFaq ? "answer" : "intro"}
            index="answer"
            contentKey={selectedOrder === false ? "intro" : selectedOrder}
          >
            <Typography
              sx={{
                fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 19 },
                color: "white",
                fontFamily: "Namecat",
                letterSpacing: 1.2,
                textAlign: "start",
              }}
            >
              {selectedFaq?.summary}
            </Typography>
          </TabLayout>
        </Stack>

        <Tabs
          orientation="vertical"
          value={selectedOrder}
          onChange={handleChange}
          slotProps={{
            indicator: { sx: { display: "none" } },
          }}
          sx={{
            width: "40%",
            alignItems: "flex-start",
            "& .MuiTabs-list": {
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1,
            },
            "& .MuiTab-root": {
              width: "100%",
              maxWidth: "none",
              alignSelf: "stretch",
            },
          }}
        >
          {faqs.length > 0 ? (
            faqs.map((faq) => (
              <Tab
                key={faq.order}
                value={faq.order.toString()}
                label={
                  <Typography
                    variant="h3"
                    component="h3"
                    sx={{
                      fontSize: { xs: 14, sm: 16, md: 18, lg: 20, xl: 22 },
                      color: "white",
                      fontFamily: "Namecat",
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      textAlign: "start",
                    }}
                  >
                    {faq.header} asjdflk jasdif
                  </Typography>
                }
                sx={{
                  alignItems: "flex-start",
                  bgcolor: "primary.dark",
                  borderRadius: 3,
                  borderColor: "secondary.main",
                  borderWidth: 1,
                  borderStyle: "solid",
                  transition: "all 0.3s ease-in-out",
                  "&.Mui-selected": {
                    bgcolor: "secondary.main",
                    color: "white",
                  },
                }}
              />
            ))
          ) : (
            <Typography>No FAQ found</Typography>
          )}
        </Tabs>
      </Stack>
    </Stack>
  );
};

export default FAQTab;
