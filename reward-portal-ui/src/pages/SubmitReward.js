import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Divider,
  Stack,
  CircularProgress
} from "@mui/material";
import Layout from "../components/Layout";
import API from "../api";

const rewardTypes = [
  "Spot Award",
  "Coupon",
  "Recognition",
  "Performance Bonus"
];

export default function SubmitReward() {
  const [form, setForm] = useState({
    employee_name: "",
    employee_id: "",
    reward_type: "",
    reward_points: "",
    description: ""
  });

  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const submit = async () => {
    if (
      !form.employee_name ||
      !form.employee_id ||
      !form.reward_type ||
      !form.reward_points ||
      !form.description
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = new FormData();
      data.append("employee_name", form.employee_name);
      data.append("employee_id", form.employee_id);
      data.append("reward_type", form.reward_type);
      data.append("reward_points", parseInt(form.reward_points));
      data.append("description", form.description);

      if (file) {
        data.append("file", file);
      }

      await API.post("/rewards/submit", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setSuccess("Reward submitted successfully");

      setForm({
        employee_name: "",
        employee_id: "",
        reward_type: "",
        reward_points: "",
        description: ""
      });

      setFile(null);

    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Submission failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>

        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>

          {/* Header */}
          <Box
            sx={{
              px: 4,
              py: 2,
              background: "linear-gradient(90deg, #1e3c72, #2a5298)",
              color: "white"
            }}
          >
            <Typography variant="h5">
              Reward Request Submission
            </Typography>
            <Typography variant="body2">
              Submit employee recognition for approval workflow
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>

            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Typography variant="subtitle1" gutterBottom>
              Employee Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Employee Name"
                  value={form.employee_name}
                  onChange={(e) => handleChange("employee_name", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  value={form.employee_id}
                  onChange={(e) => handleChange("employee_id", e.target.value)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom>
              Reward Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <TextField
                  select
                  fullWidth
                  label="Reward Type"
                  value={form.reward_type}
                  onChange={(e) => handleChange("reward_type", e.target.value)}
                  sx={{ minWidth: 200 }}
                >
                  {rewardTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Reward Points"
                  value={form.reward_points}
                  onChange={(e) => handleChange("reward_points", e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Business Justification"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  sx={{ width: 417 }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom>
              Supporting Document
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <Button variant="outlined" component="label">
                Upload Attachment
                <input
                  hidden
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Button>

              {file && (
                <Typography variant="body2">
                  {file.name}
                </Typography>
              )}
            </Stack>

            <Box sx={{ mt: 4 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={submit}
                disabled={loading}
                sx={{ width: 250 }} // adjust width as needed
              >
                {loading ? <CircularProgress size={22} /> : "Submit Reward Request"}
              </Button>
            </Box>

          </Box>
        </Paper>

      </Box>
    </Layout>
  );
}