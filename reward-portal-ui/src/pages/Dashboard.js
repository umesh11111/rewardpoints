import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import Layout from "../components/Layout";
import API from "../api";
const headerStyle = {
  fontWeight: "bold",
  fontFamily: "Calibri",
  fontSize: "16px",           // bigger than body
  color: "#333333",           // dark header text
  backgroundColor: "#f0f0f0", // subtle gray background
  textTransform: "uppercase", // optional, makes headers stand out
  letterSpacing: "0.5px",     // optional, improves readability
};
/* ---------- KPI CARD ---------- */
function KPICard({ title, value }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontFamily: "Calibri, sans-serif" }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mt: 1, fontFamily: "Calibri, sans-serif" }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

/* ---------- ACTIVITY TABLE ---------- */
function ActivityTable({ rows }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Recent Activity
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Employee</TableCell>
              <TableCell sx={headerStyle}>Points</TableCell>
              <TableCell sx={headerStyle}>Status</TableCell>
              <TableCell sx={headerStyle}>Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.employee}</TableCell>
                <TableCell>{row.points}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={
                      row.status === "APPROVED"
                        ? "success"
                        : row.status === "REJECTED"
                        ? "error"
                        : "warning"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ---------- MAIN DASHBOARD ---------- */
export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [statusData, setStatusData] = useState([]);
  // const [role, setRole] = useState(""); // store role from backend if needed

  useEffect(() => {
    API.get("/dashboard")
      .then(res => {
        setSummary(res.data);
        // Optional: if backend sends role, you can store it
      })
      .catch(err => console.error("Dashboard API error:", err));

    API.get("/dashboard/trend/monthly")
      .then(res => setTrend(res.data))
      .catch(err => console.error("Trend API error:", err));

    API.get("/dashboard/analytics/status")
      .then(res => {
        const data = Object.entries(res.data).map(([name, value]) => ({
          name,
          value
        }));
        setStatusData(data);
      })
      .catch(err => console.error("Status API error:", err));
  }, []);

  /* ---------- ROLE-BASED KPI CARDS ---------- */
  const renderKPIs = () => {
    if (!summary) return null;

    // LM KPIs
    if (summary.totalRewards !== undefined && summary.approvedAwards !== undefined) {
      return (
        <>
          <Grid item xs={12} md={3}>
            <KPICard title="Total Rewards Submitted" value={summary.totalRewards} />
          </Grid>
          <Grid item xs={12} md={3}>
            <KPICard title="Approved Rewards" value={summary.approvedAwards} />
          </Grid>
          <Grid item xs={12} md={3}>
            <KPICard title="Pending Rewards" value={summary.pendingApprovals} />
          </Grid>
          <Grid item xs={12} md={3}>
            <KPICard title="Rejected Rewards" value={summary.totalRejected} />
          </Grid>
        </>
      );
    }

    // HR KPIs
    if (summary.totalSubmissions !== undefined) {
      return (
        <>
          <Grid item xs={12} md={3}>
            <KPICard title="Total Submissions" value={summary.totalSubmissions} />
          </Grid>
          <Grid item xs={12} md={3}>
            <KPICard title="Total Approved" value={summary.totalApproved} />
          </Grid>
          <Grid item xs={12} md={3}>
            <KPICard title="Total Pending" value={summary.totalPending} />
          </Grid>
        </>
      );
    }

    // EMP KPIs
    if (summary.totalRewards !== undefined) {
      return (
        <>

          <Grid item xs={12} md={3}>
            <KPICard title="Total Approved Rewards" value={summary.totalRewards} />
          </Grid>

        </>
      );
    }

    // IDU KPIs
    if (summary.totalApproved !== undefined && summary.totalRejected !== undefined) {
      return (
        <>
          <Grid item xs={12} md={3}>
            <KPICard title="Total Approved" value={summary.totalApproved} />
          </Grid>
          <Grid item xs={12} md={3}>
            <KPICard title="Total Rejected" value={summary.totalRejected} />
          </Grid>
          <Grid item xs={12} md={3}>
            <KPICard title="Total Pending" value={summary.totalPending} />
          </Grid>
           <Grid item xs={12}>
          {summary ? (
            <ActivityTable rows={summary.recentActivity || []} />
          ) : (
            <Skeleton variant="rounded" height={220} />
          )}
        </Grid>
        </>
      );
    }

    return null;
  };

  return (
    <Layout>
      {/* HEADER */}
      <Box mb={3}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Executive Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Performance overview and analytics
        </Typography>
      </Box>

      {/* KPI SECTION */}
      <Grid container spacing={3} mb={2}>
        {!summary &&
          Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} md={3} key={i}>
              <Skeleton variant="rounded" height={110} />
            </Grid>
          ))}

        {summary && renderKPIs()}
      </Grid>

      {/* ANALYTICS SECTION */}
      <Grid container spacing={3}>
        {/* TREND CHART */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Monthly Rewards Trend
              </Typography>

              {trend.length === 0 ? (
                <Skeleton variant="rounded" height={260} />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={trend}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="points" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* STATUS PIE */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Status Distribution
              </Typography>

              {statusData.length === 0 ? (
                <Skeleton variant="rounded" height={260} />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={90}
                      label
                    >
                      {statusData.map((_, index) => (
                        <Cell key={index} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>


      </Grid>
    </Layout>
  );
}