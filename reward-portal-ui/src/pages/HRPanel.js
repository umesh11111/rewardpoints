import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Stack,
  Divider
} from "@mui/material";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import StatusChip from "../components/StatusChip";
import ConfirmDialog from "../components/ConfirmDialog";
import API from "../api";
import { toast } from "react-toastify";

export default function HRPanel() {
  // ===== REWARD STATES =====
  const [rewardData, setRewardData] = useState([]);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(true);

  // ===== USER STATES =====
  const [userData, setUserData] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [actionTarget, setActionTarget] = useState(null);

  // ===============================
  // LOAD REWARD REQUESTS
  // ===============================
  const loadRewards = async () => {
    try {
      setLoadingRewards(true);
      const res = await API.get("/hr/pending");
      setRewardData(res.data);
      setFilteredRewards(res.data);
    } catch {
      toast.error("Failed to load reward approvals");
    } finally {
      setLoadingRewards(false);
    }
  };

  // ===============================
  // LOAD PENDING USERS
  // ===============================
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await API.get("/hr/pending-users");
      setUserData(res.data);
    } catch {
      toast.error("Failed to load pending users");
    } finally {
      setLoadingUsers(false);
    }
  };
  const handleDownload = async (rewardId) => {
  try {
    const response = await API.get(`/hr/download/${rewardId}`, {
      responseType: "blob"
    });

    const blob = new Blob([response.data], {
      type: response.headers["content-type"]
    });

    const contentDisposition = response.headers["content-disposition"];
    let filename = "attachment";

    if (contentDisposition) {
      const utfMatch = contentDisposition.match(/filename\*=utf-8''(.+)/i);
      if (utfMatch && utfMatch[1]) {
        filename = decodeURIComponent(utfMatch[1]);
      } else {
        const asciiMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (asciiMatch && asciiMatch[1]) {
          filename = asciiMatch[1];
        }
      }
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    console.error("Download failed", error);
  }
};
  useEffect(() => {
    loadRewards();
    loadUsers();
  }, []);

  useEffect(() => {
    const f = rewardData.filter(r =>
      r.employee_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRewards(f);
  }, [search, rewardData]);

  const confirmAction = (record, type, target) => {
    setSelected(record);
    setActionType(type);
    setActionTarget(target);
  };

  const handleConfirm = async () => {
    try {
      if (actionTarget === "reward") {
        await API.post(`/hr/${actionType}/${selected.id}`);
      } else {
        await API.post(`/hr/${actionType}-user/${selected.employee_id}`);
      }

      toast.success("Action completed");
      loadRewards();
      loadUsers();
    } catch {
      toast.error("Action failed");
    } finally {
      setSelected(null);
      setActionType(null);
      setActionTarget(null);
    }
  };

  const headerStyle = {
    fontWeight: "bold",
    fontFamily: "Calibri",
    backgroundColor: "#f0f0f0"
    // textTransform: "uppercase"
  };

  return (
    <Layout>
      <Paper sx={{ p: 3 }}>

        {/* ================= REWARD APPROVAL ================= */}
        <Typography variant="h5" gutterBottom>
          Reward Approval Queue
        </Typography>

        <TextField
          fullWidth
          label="Search reward by employee name"
          sx={{ mb: 3 }}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loadingRewards ? (
          <Loader />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>Employee</TableCell>
                <TableCell sx={headerStyle}>Reward</TableCell>
                <TableCell sx={headerStyle}>Points</TableCell>
                <TableCell sx={headerStyle}>Status</TableCell>
                <TableCell sx={headerStyle}>Attachment</TableCell>
                <TableCell sx={headerStyle} align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRewards.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.employee_name}</TableCell>
                  <TableCell>{r.reward_type}</TableCell>
                  <TableCell>{r.reward_points}</TableCell>
                  <TableCell>
                    <StatusChip status={r.status} />
                  </TableCell>
                  <TableCell>
                    {r.attachment ? (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleDownload(r.id)}
                      >
                        Download
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        variant="contained"
                        onClick={() => confirmAction(r, "approve", "reward")}
                      >
                        Approve
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => confirmAction(r, "reject", "reward")}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Divider sx={{ my: 5 }} />

        {/* ================= USER APPROVAL ================= */}
        <Typography variant="h5" gutterBottom>
          Employee Registration Approval
        </Typography>

        {loadingUsers ? (
          <Loader />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>Employee Name</TableCell>
                <TableCell sx={headerStyle}>Employee ID</TableCell>
                <TableCell sx={headerStyle}>Email</TableCell>
                <TableCell sx={headerStyle}>Role</TableCell>
                <TableCell sx={headerStyle}>Country</TableCell>
                <TableCell sx={headerStyle}>State</TableCell>
                <TableCell sx={headerStyle} align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {userData.map((u) => (
                <TableRow key={u.employee_id}>
                  <TableCell>{u.employee_name}</TableCell>
                  <TableCell>{u.employee_id}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.country}</TableCell>
                  <TableCell>{u.state}</TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        variant="contained"
                        onClick={() => confirmAction(u, "approve", "user")}
                      >
                        Approve
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => confirmAction(u, "reject", "user")}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

      </Paper>

      <ConfirmDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        onConfirm={handleConfirm}
      />
    </Layout>
  );
}