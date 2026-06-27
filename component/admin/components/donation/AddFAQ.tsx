import {
  Button,
  Divider,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { secondaryModalSlotProps } from "./secondaryModalBackdrop";
import { useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";

//FIXME: FInish this FAQ modal and add dummy and test it


const AddFAQ = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  const formRef = useRef<HTMLDivElement>(null);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSummary("");
  };

  const handleOpenForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleCancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  const handleSubmit = () => {
    console.log('submitting...')
    // if (!isValid) {
    //   return;
    // }
  };

  const isEditing = editingId !== null;
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
        <Stack sx={{ gap: 1, height: "auto", overflow: "auto" }}>
          <Typography variant="h6">FAQs</Typography>
          <Divider flexItem />

          {showForm ? (
            <Stack
              ref={formRef}
              sx={{
                width: "100%",
                gap: 2,
                border: (theme) => `1px solid ${theme.palette.primary.light}`,
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: "primary.main",
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                {isEditing ? "Edit FAQ" : "New FAQ"}
              </Typography>

              <TextField
                label="Title"
                variant="standard"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Summary"
                variant="outlined"
                required
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                multiline
                minRows={3}
                fullWidth
              />
              
              <Stack
                sx={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                <Button color="inherit" onClick={handleCancelForm}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                //   disabled={!isValid}
                  onClick={handleSubmit}
                >
                  {isEditing ? "Update" : "Submit"}
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
            >
              Add Section
            </Button>
          )}

          <Divider flexItem />
          <Stack
            sx={{
              direction: "ltr",
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Button variant="outlined" color="primary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary">
              Submit
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default AddFAQ;
