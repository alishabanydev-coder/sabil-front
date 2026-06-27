import { Modal, Stack } from "@mui/material";
import { secondaryModalSlotProps } from "./secondaryModalBackdrop";

const AddUpdate = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal open={open} onClose={onClose} slotProps={secondaryModalSlotProps}>
      <Stack
        sx={{
          direction: "ltr",
          width: 500,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          overflow: "auto",
          maxHeight: "94vh",
          p: 2,
        }}
      >
        hi
      </Stack>
    </Modal>
  );
};

export default AddUpdate;
