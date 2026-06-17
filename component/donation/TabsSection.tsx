"use client";

import { Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";

const TabsSection = () => {
  const [value, setValue] = useState(0);
  return (
    <Stack
      sx={{
        width: "100%",
        borderTop: "1px solid #e0e0e0",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Tabs value={value} onChange={(event, newValue) => setValue(newValue)}>
        <Tab label="Overview" />
        <Tab label="Updates" />
        <Tab label="Comments" />
      </Tabs>
    </Stack>
  );
};

export default TabsSection;
