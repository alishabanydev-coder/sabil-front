import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

const Projects = () => {
  const [projectImage, setProjectImage] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  return (
    <Stack>
      <Stack sx={{ width: "100%", height: 200 }}></Stack>
      <Stack
        direction={"row"}
        sx={{
          width: "100%",
          gap: 2,
          border: (theme) => `1px solid ${theme.palette.primary.dark}`,
          borderRadius: 2,
          p: 2,
        }}
      >
        <Stack sx={{ alignItems: "center", gap: 1 }}>
          <Box
            sx={{ width: 200, height: 200, bgcolor: "#bbb", borderRadius: 3 }}
          >
            <img
              src={projectImage}
              alt="project"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          <Button variant="contained" color="primary">
            {projectImage ? "Change Image" : "Upload Image"}
          </Button>
        </Stack>

        <Stack sx={{ width: "100%", gap: 1 }}>
          <Stack sx={{ gap: 3 }}>
            <TextField
              variant="standard"
              label="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              sx={{ width: 400 }}
            />
            <TextField
              label="Project Description"
              multiline
              rows={4}
              fullWidth
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </Stack>

          <Stack
            direction={"row"}
            sx={{
              width: "100%",
              justifyContent: "end",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button variant="outlined">Cancel</Button>
            <Button variant="contained">Submit</Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Projects;
