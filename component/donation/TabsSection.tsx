"use client";

import { Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Documents from "./component/Documents";
import Updates from "./component/Updates";
import FAQTab from "./component/FAQTab";
import { type DonationUpdate } from "./component/UpdateCard";

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

const TabLayout = ({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) => {
  return (
    <Stack sx={{ width: "88%", mx: "auto" }}>
      {value === index && <>{children}</>}
    </Stack>
  );
};

const TabsSection = ({ projectData }: { projectData: DonationProject }) => {
  const [value, setValue] = useState(0);
  return (
    <Stack
      sx={{
        width: "100%",
        position: "relative",
      }}
    >
      <Stack
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          bgcolor: "background.paper",
          width: "100%",
          borderTop: "1px solid #e0e0e0",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Tabs
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          sx={{ width: { xs: "98%", md: "88%" }, mx: "auto" }}
        >
          <Tab
            label="Overview"
            sx={{ fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 } }}
          />
          <Tab
            label="Updates"
            sx={{ fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 } }}
          />
          <Tab
            label="FAQ"
            sx={{ fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 } }}
          />
          <Tab
            label="Comments"
            sx={{ fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 } }}
          />
        </Tabs>
      </Stack>
      <TabLayout value={value} index={0}>
        <Documents projectData={projectData} />
      </TabLayout>
      <TabLayout value={value} index={1}>
        <Updates projectData={projectData} />
      </TabLayout>
      <TabLayout value={value} index={2}>
        <FAQTab projectData={projectData} />
      </TabLayout>
      <TabLayout value={value} index={3}>
        comments
      </TabLayout>
    </Stack>
  );
};

export default TabsSection;
