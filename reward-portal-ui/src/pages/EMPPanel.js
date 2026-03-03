import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Layout from "../components/Layout";
import StatusChip from "../components/StatusChip";
import API from "../api";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
export default function EMPPanel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const headerStyle = {
    fontWeight: "bold",
    fontFamily: "Calibri",
    fontSize: "16px",
    color: "#333333",
    backgroundColor: "#f0f0f0",
    // textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/emp/summary");
      setData(res.data);
    } catch {
      toast.error("Failed to load reward details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Employee Rewards
        </Typography>

        {loading ? (
          <Loader />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>Reward</TableCell>
                <TableCell sx={headerStyle}>Points</TableCell>
                <TableCell sx={headerStyle}>Status</TableCell>
                <TableCell sx={headerStyle}>Submission Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.reward_type}</TableCell>
                  <TableCell>{r.reward_points}</TableCell>
                  <TableCell>
                    <StatusChip status={r.status} />
                  </TableCell>
                  <TableCell>{r.submission_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Layout>
  );
}