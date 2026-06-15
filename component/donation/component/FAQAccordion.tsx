"use client";

import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { type AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  type AccordionSummaryProps,
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const faqs = [
  {
    id: "panel1",
    question: "How can I donate to Sabil Kids?",
    answer:
      "You can donate directly through the Donate Now button on this page. We accept secure online payments, and you can choose a one-time gift or set up a recurring monthly contribution.",
  },
  {
    id: "panel2",
    question: "Where does my donation go?",
    answer:
      "Your support helps fund animation projects, educational content, and community programs for children. Every contribution goes toward creating safe, meaningful Islamic entertainment and learning resources.",
  },
  {
    id: "panel3",
    question: "Can I donate on behalf of someone else?",
    answer:
      "Yes. You can make a donation in honor or in memory of a loved one. Add the name during checkout and we can include it in our donor acknowledgments when requested.",
  },
  {
    id: "panel4",
    question: "Is my donation tax deductible?",
    answer:
      "Sabil Kids operates as a non-profit organization. Depending on your country and local tax laws, your donation may be tax deductible. Please consult your tax advisor for details specific to your situation.",
  },
];

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  width: "100%",
  border: `1px solid ${theme.palette.primary.main}33`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon
        sx={{ fontSize: "0.9rem", color: "primary.main" }}
      />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: `${theme.palette.primary.main}08`,
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.primary.main}22`,
}));

export default function FAQAccordion() {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      if (!newExpanded) {
        return;
      }

      setExpanded(panel);
    };

  return (
    <Stack sx={{ width: "100%" }}>
      {faqs.map((faq) => (
        <Accordion
          key={faq.id}
          expanded={expanded === faq.id}
          onChange={handleChange(faq.id)}
        >
          <AccordionSummary
            aria-controls={`${faq.id}-content`}
            id={`${faq.id}-header`}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: "Namecat",
                fontSize: { xs: 11, sm: 14, md: 16 },
                fontWeight: 700,
                color: "primary.main",
                letterSpacing: 1,
                textAlign: "left",
              }}
            >
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{
                fontSize: { xs: 10, sm: 12, md: 14 },
                lineHeight: 1.7,
                color: "text.primary",
                textAlign: "left",
              }}
            >
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
