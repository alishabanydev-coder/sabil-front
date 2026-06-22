"use client";

import { Stack } from "@mui/material";
import RtlProvider from "@mui/system/RtlProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Dayjs } from "dayjs";

type DonationDateFieldsProps = {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (value: Dayjs | null) => void;
  onEndDateChange: (value: Dayjs | null) => void;
};

const datePickerSlotProps = {
  textField: {
    variant: "standard" as const,
    fullWidth: true,
    sx: { direction: "ltr" as const },
  },
  desktopPaper: {
    dir: "ltr" as const,
    sx: { direction: "ltr" as const },
  },
  mobilePaper: {
    dir: "ltr" as const,
    sx: { direction: "ltr" as const },
  },
  popper: {
    dir: "ltr" as const,
    sx: { direction: "ltr" as const },
  },
};

const DonationDateFields = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DonationDateFieldsProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RtlProvider value={false}>
        <Stack
          dir="ltr"
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            gap: 3,
            direction: "ltr",
          }}
        >
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={onStartDateChange}
            maxDate={endDate ?? undefined}
            slotProps={datePickerSlotProps}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={onEndDateChange}
            minDate={startDate ?? undefined}
            slotProps={datePickerSlotProps}
          />
        </Stack>
      </RtlProvider>
    </LocalizationProvider>
  );
};

export default DonationDateFields;
