import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button
} from "@mui/material";

export default function ConfirmDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}