"use client";

import SeactionHeader from "@/component/ui/SectionHeader";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

type ProjectData = {
  _id: string;
  name: string;
  title: string;
  thumbnail: string;
  description: string;
  showInHomepage: boolean;
  homepageOrder: number;
};

const OnSubscribtion = ({ projects }: { projects: ProjectData[] }) => {
  const [selectedProject, setSelectedProject] = useState<string>(
    projects[0]._id
  );
  return (
    <Stack
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        pt: 8,
      }}
    >
      <SeactionHeader text="ON SUBSCRIBTION" />
      <Typography
        sx={{
          color: "secondary.main",
          fontSize: { xs: 9, sm: 14 },
          fontFamily: "Namecat",
          letterSpacing: 1.2,
          textdecoreation: "uppercase",
          width: "80%",
          textAlign: "center",
        }}
      >
        A WHOLE WORLD OF AN AMAZING FEATURE AND BENEFITS FOR YOUR FAMILY
      </Typography>
      <Stack
        direction="row"
        sx={{
          width: { xs: "95%", sm: "80%" },
          gap: { xs: 2, sm: 6 },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {projects.map((item) => (
          <Stack
            key={item._id}
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              cursor: "pointer",
              filter: selectedProject === item._id ? "none" : "grayscale(100%)",
              transition: "all 0.3s ease",
            }}
            onClick={() => setSelectedProject(item._id)}
          >
            <Image
              src={item.thumbnail}
              alt={item.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default OnSubscribtion;
