import { Chip } from "@mui/material";

export default function StatusChip({ status }) {
  const map = {
    PENDING: "warning",
    HR_APPROVED: "info",
    IDU_APPROVED: "success",
    REJECTED: "error"
  };

  return <Chip label={status} color={map[status] || "default"} />;
}