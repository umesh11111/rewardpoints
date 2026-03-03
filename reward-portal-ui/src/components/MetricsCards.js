import { Grid, Paper, Typography } from "@mui/material";

export default function MetricsCards({ stats }) {
  const items = [
    { label: "Total Requests", value: stats.total },
    { label: "Pending", value: stats.pending },
    { label: "Approved", value: stats.approved }
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {items.map(i => (
        <Grid item xs={12} md={4} key={i.label}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">{i.value}</Typography>
            <Typography color="text.secondary">{i.label}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}