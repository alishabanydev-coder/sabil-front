"use client";

import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import sabeelToons from "@/public/sabeel-toons.png";
import sabeelKids from "@/public/sabeel-kids.png";
import storyBook from "@/public/story-book.png";
import yousofMaryam from "@/public/yousef-maryam.png";
import { useState } from "react";

const ProjectImage = [
  { id: 4, name: "yousof maryam", src: yousofMaryam },
  { id: 3, name: "sabeel kids", src: sabeelKids },
  { id: 2, name: "story book", src: storyBook },
  { id: 1, name: "sabeel toons", src: sabeelToons },
];

const OnSubscribtion = () => {
  const [selectedProject, setSelectedProject] = useState(1);
  return (
    <Stack
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        pt: 8,
      }}
    >
      <Typography
        sx={{ fontSize: "30px", fontWeight: "bold", color: "primary.main" }}
      >
        ON SUBSCRIBTION
      </Typography>
      <Typography sx={{ color: "secondary.main", fontSize: 14 }}>
        A WHOLE WORLD OF AN AMAZING FEATURE AND BENEFITS FOR YOUR FAMILY
      </Typography>
      <Stack
        direction="row"
        sx={{
          gap: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {ProjectImage.map((item) => (
          <Image
            key={item.name}
            src={item.src}
            alt={item.name}
            style={{
              cursor: "pointer",
              filter: selectedProject === item.id ? "none" : "grayscale(100%)",
              transition: "all 0.3s ease",
            }}
            onClick={() => setSelectedProject(item.id)}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default OnSubscribtion;
