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
  Stack
} from "@mui/material";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import StatusChip from "../components/StatusChip";
import ConfirmDialog from "../components/ConfirmDialog";
import API from "../api";
import { toast } from "react-toastify";

export default function IDUPanel() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null);
  const [actionType, setActionType] = useState(null);
  const headerStyle = {
  fontWeight: "bold",
  fontFamily: "Calibri",
  fontSize: "16px",           // bigger than body
  color: "#333333",           // dark header text
  backgroundColor: "#f0f0f0", // subtle gray background
  textTransform: "uppercase", // optional, makes headers stand out
  letterSpacing: "0.5px",     // optional, improves readability
};
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/idu/approved-by-hr");
      setData(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load IDU approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const f = data.filter(r =>
      r.employee_name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, data]);

  const confirmAction = (record, type) => {
    setSelected(record);
    setActionType(type);
  };

  const handleConfirm = async () => {
    try {
      await API.post(`/idu/${actionType}/${selected.id}`);
      toast.success(`Request ${actionType.toLowerCase()} successfully`);
      loadData();
    } catch {
      toast.error("Action failed");
    } finally {
      setSelected(null);
      setActionType(null);
    }
  };

  return (
    <Layout>
      <Paper sx={{ p: 3 }}>

        <Typography variant="h5" gutterBottom>
          IDU Approval Queue
        </Typography>

        <TextField
          fullWidth
          label="Search by employee name"
          sx={{ mb: 3 }}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <Loader />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>Employee</TableCell>
                <TableCell sx={headerStyle}>Reward</TableCell>
                <TableCell sx={headerStyle}>Points</TableCell>
                <TableCell sx={headerStyle}>Status</TableCell>
                <TableCell sx={headerStyle} align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.employee_name}</TableCell>
                  <TableCell>{r.reward_type}</TableCell>
                  <TableCell>{r.reward_points}</TableCell>
                  <TableCell>
                    <StatusChip status={r.status} />
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        variant="contained"
                        onClick={() => confirmAction(r, "approve")}
                      >
                        Approve
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => confirmAction(r, "reject")}
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