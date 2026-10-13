import { alpha, Stack, Typography } from "@mui/material";
import Image from "next/image";

const impactData = [
  {
    title: "Educating Minds",
    description:
      "Creating content that teaches Islamic values in a fun and engaging way.",
    image: "/educating-minds.png",
  },
  {
    title: "Building Character",
    description:
      "Helping children grow with faith, kindness, and responsibility.",
    image: "/green-note.png",
  },
  {
    title: "Inspiring Generations",
    description:
      "Preparing a generation that will lead with iman and knowledge.",
    image: "/inspire-generation.png",
  },
  {
    title: "Spreading Worldwide",
    description: "Reaching children in many countries and communities.",
    image: "/world-wide.png",
  },
];

const YourImpact = () => {
  return (
    <Stack
      sx={{
        borderColor: "#A0CB45",
        borderWidth: 2,
        borderStyle: "solid",
        borderRadius: 5,
        backgroundColor: alpha("#A0CB45", 0.1),
        px: { xs: 1.5, sm: 2 },
        py: { xs: 3, sm: 5 },
        gap: 2,
        direction: "ltr",
      }}
    >
      <Stack
        sx={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: 20, sm: 25, md: 38, lg: 45, xl: 54 },
            fontWeight: 800,
            color: "primary.main",
            whiteSpace: "pre-line",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Our Projects
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
            textAlign: "center",
          }}
        >
          choose a project to see details, updates and how your donation is
          making impact.
        </Typography>
      </Stack>
      <Stack
        sx={{
          flexDirection: "row",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          rowGap: { xs: 3, sm: 0 },
          px: { xs: 1, md: 4, lg: 5 },
        }}
      >
        {impactData.map((item) => (
          <Stack
            key={item.title}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              width: { xs: "48%", sm: 150, md: 180, lg: 190, xl: 200 },
              gap: 1.5,
              "& img": {
                width: { xs: 65, sm: 70, md: 85, lg: 110, xl: 120 },
                height: { xs: 65, sm: 70, md: 85, lg: 110, xl: 120 },
              },
            }}
          >
            <Image src={item.image} alt={item.title} width={100} height={100} />
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: 14, sm: 16, md: 20, lg: 22, xl: 24 },
                lineHeight: 1.1,
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              {item.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: 9, sm: 11, md: 14, lg: 15, xl: 16 },
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {item.description}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default YourImpact;
