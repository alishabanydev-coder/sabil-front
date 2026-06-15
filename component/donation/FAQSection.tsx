import { Stack, Typography } from "@mui/material";
import FAQAccordion from "./component/FAQAccordion";
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';

const FAQSection = () => {
  return (
    <Stack
      sx={{
        direction: "ltr",
        width: "100%",
        justifyContent: "center",
        alignItems: "stretch",
        gap: 2,
        mt: 5,
      }}
    >
      <Stack
        direction="row"
        sx={{
          width: "100%",
          alignItems: "center",
          gap: { xs: 1, sm: 1 },
        }}
      >
        <LiveHelpOutlinedIcon
          sx={{
            fontSize: { xs: 16, sm: 22, md: 32 },
            color: "primary.main",
          }}
        />
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: 10, sm: 14, md: 24 },
            fontWeight: 700,
            color: "primary.main",
            fontFamily: "Bhel Puri",
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}
        >
          FAQ
        </Typography>
      </Stack>

      <Stack sx={{ width: "100%" }}>
        <FAQAccordion />
      </Stack>
    </Stack>
  );
};

export default FAQSection;
