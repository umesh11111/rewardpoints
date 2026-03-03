// import { useState, useEffect } from "react";
// import { Country, State } from "country-state-city";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   MenuItem,
//   Alert,
//   IconButton,
//   InputAdornment,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import API from "../api";
//
// export default function Register() {
//   const navigate = useNavigate();
//
//   const [form, setForm] = useState({
//     employee_name: "",
//     employee_id: "",
//     email: "",
//     password: "",
//     confirm_password: "",
//     role: "",
//     country: "",
//     state: "",
//   });
//
//   const [asianCountries, setAsianCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showPwd, setShowPwd] = useState(false);
//
//   useEffect(() => {
//     const allCountries = Country.getAllCountries();
//
//     // Fixed list of Asian country ISO codes
//     const asianCountryCodes = [
//       "IN",
//       "CN",
//       "JP",
//       "KR",
//       "SG",
//       "MY",
//       "TH",
//       "VN",
//       "PH",
//       "ID",
//       "PK",
//       "BD",
//       "LK",
//       "NP",
//       "KH",
//       "LA",
//       "MN",
//       "BT",
//       "MV",
//       "TW",
//       "HK",
//       "MO",
//       "BN",
//     ];
//
//     const asiaCountries = allCountries.filter((c) =>
//       asianCountryCodes.includes(c.isoCode)
//     );
//     setAsianCountries(asiaCountries);
//   }, []);
//
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//
//     if (name === "country") {
//       const selectedCountry = asianCountries.find((c) => c.isoCode === value);
//       const countryStates = selectedCountry
//         ? State.getStatesOfCountry(selectedCountry.isoCode)
//         : [];
//
//       setStates(countryStates);
//
//       setForm((prev) => ({
//         ...prev,
//         country: value,
//         state: "", // Reset state on country change
//       }));
//     } else {
//       setForm((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };
//
//   const handleSubmit = async () => {
//     setError("");
//     setSuccess("");
//
//     if (form.password !== form.confirm_password) {
//       setError("Passwords do not match");
//       return;
//     }
//
//     try {
//       await API.post("/register", {
//         employee_name: form.employee_name,
//         employee_id: form.employee_id,
//         email: form.email,
//         password: form.password,
//         role: form.role,
//         country:form.country,
//         state:form.state,
//       });
//
//       setSuccess("Registration submitted Successfully.");
//       setTimeout(() => navigate("/"), 2000);
//     } catch (err) {
//       const msg =
//         err.response?.data?.detail?.[0]?.msg ||
//         err.response?.data?.detail ||
//         "Registration failed, please try again";
//
//       setError(msg);
//     }
//   };
//
//   return (
//     <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
//       <Paper sx={{ p: 4, width: 420 }}>
//         <Typography variant="h5" align="center" mb={2}>
//           Employee Registration
//         </Typography>
//
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}
//         {success && (
//           <Alert severity="success" sx={{ mb: 2 }}>
//             {success}
//           </Alert>
//         )}
//
//         <TextField
//           fullWidth
//           margin="normal"
//           label="Employee Name"
//           name="employee_name"
//           value={form.employee_name}
//           onChange={handleChange}
//         />
//
//         <TextField
//           fullWidth
//           margin="normal"
//           label="Employee ID"
//           name="employee_id"
//           value={form.employee_id}
//           onChange={handleChange}
//         />
//
//         <TextField
//           fullWidth
//           margin="normal"
//           label="Email"
//           name="email"
//           value={form.email}
//           onChange={handleChange}
//         />
//
//         <TextField
//           fullWidth
//           margin="normal"
//           type={showPwd ? "text" : "password"}
//           label="Password"
//           name="password"
//           value={form.password}
//           onChange={handleChange}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton onClick={() => setShowPwd(!showPwd)} edge="end">
//                   {showPwd ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//
//         <TextField
//           fullWidth
//           margin="normal"
//           type={showPwd ? "text" : "password"}
//           label="Confirm Password"
//           name="confirm_password"
//           value={form.confirm_password}
//           onChange={handleChange}
//         />
//
//         <TextField
//           select
//           fullWidth
//           margin="normal"
//           label="Role"
//           name="role"
//           value={form.role}
//           onChange={handleChange}
//         >
//           <MenuItem value="LM">Line Manager</MenuItem>
//           <MenuItem value="HR">HR</MenuItem>
//           <MenuItem value="IDU">IDU</MenuItem>
//           <MenuItem value="TM">Team Member</MenuItem>
//         </TextField>
//
//         <TextField
//           select
//           fullWidth
//           margin="normal"
//           label="Country"
//           name="country"
//           value={form.country}
//           onChange={handleChange}
//         >
//           <MenuItem value="">Select Country</MenuItem>
//           {asianCountries.map((c) => (
//             <MenuItem key={c.isoCode} value={c.isoCode}>
//               {c.name}
//             </MenuItem>
//           ))}
//         </TextField>
//
//         <TextField
//           select
//           fullWidth
//           margin="normal"
//           label="State"
//           name="state"
//           value={form.state}
//           onChange={handleChange}
//           disabled={!form.country}
//         >
//           <MenuItem value="">Select State</MenuItem>
//           {states.map((s) => (
//             <MenuItem key={s.isoCode} value={s.name}>
//               {s.name}
//             </MenuItem>
//           ))}
//         </TextField>
//
//         <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
//           SUBMIT REQUEST
//         </Button>
//
//         <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate("/")}>
//           BACK TO LOGIN
//         </Button>
//       </Paper>
//     </Box>
//   );
// }

// import { useState, useEffect } from "react";
// import { Country, State } from "country-state-city";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   MenuItem,
//   Alert,
//   IconButton,
//   InputAdornment,
//   CircularProgress,
//   Divider
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import API from "../api";
// import bgImage from "../images.png";
//
// export default function Register() {
//   const navigate = useNavigate();
//
//   const [form, setForm] = useState({
//     employee_name: "",
//     employee_id: "",
//     email: "",
//     password: "",
//     confirm_password: "",
//     role: "",
//     country: "",
//     state: "",
//   });
//
//   const [asianCountries, setAsianCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showPwd, setShowPwd] = useState(false);
//   const [loading, setLoading] = useState(false);
//
//   useEffect(() => {
//     const allCountries = Country.getAllCountries();
//
//     const asianCountryCodes = [
//      "IN",
//       "CN",
//       "JP",
//       "KR",
//       "SG",
//       "MY",
//       "TH",
//       "VN",
//       "PH",
//       "ID",
//       "PK",
//       "BD",
//       "LK",
//       "NP",
//       "KH",
//       "LA",
//       "MN",
//       "BT",
//       "MV",
//       "TW",
//       "HK",
//       "MO",
//       "BN",
//     ];
//
//     const asiaCountries = allCountries.filter((c) =>
//       asianCountryCodes.includes(c.isoCode)
//     );
//
//     setAsianCountries(asiaCountries);
//   }, []);
//
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//
//     if (name === "country") {
//       const selectedCountry = asianCountries.find(
//         (c) => c.isoCode === value
//       );
//
//       const countryStates = selectedCountry
//         ? State.getStatesOfCountry(selectedCountry.isoCode)
//         : [];
//
//       setStates(countryStates);
//
//       setForm((prev) => ({
//         ...prev,
//         country: value,
//         state: "",
//       }));
//     } else {
//       setForm((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };
//
//   const handleSubmit = async () => {
//     setError("");
//     setSuccess("");
//
//     if (form.password !== form.confirm_password) {
//       setError("Passwords do not match");
//       return;
//     }
//
//     try {
//       setLoading(true);
//
//       await API.post("/register", {
//         employee_name: form.employee_name,
//         employee_id: form.employee_id,
//         email: form.email,
//         password: form.password,
//         role: form.role,
//         country: form.country,
//         state: form.state,
//       });
//
//       setSuccess("Registration submitted successfully.");
//       setTimeout(() => navigate("/"), 2000);
//
//     } catch (err) {
//       const msg =
//         err.response?.data?.detail?.[0]?.msg ||
//         err.response?.data?.detail ||
//         "Registration failed, please try again";
//
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${bgImage})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         fontFamily: "Calibri"
//       }}
//
//     >
//       <Paper
//         elevation={12}
//         sx={{
//           width: 450,
//           p: 5,
//           borderRadius: 3,
//           backdropFilter: "blur(10px)",
//           backgroundColor: "rgba(255,255,255,0.96)"
//         }}
//       >
//         {/* Header */}
//         <Box textAlign="center" mb={3}>
//           <Typography
//             variant="h5"
//             fontWeight="bold"
//             sx={{ color: "#0B3C5D" }}
//           >
//             Employee Registration
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Access Request Form
//           </Typography>
//         </Box>
//
//         <Divider sx={{ mb: 3 }} />
//
//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//         {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
//
//         <TextField fullWidth margin="normal" label="Employee Name"
//           name="employee_name" value={form.employee_name} onChange={handleChange} />
//
//         <TextField fullWidth margin="normal" label="Employee ID"
//           name="employee_id" value={form.employee_id} onChange={handleChange} />
//
//         <TextField fullWidth margin="normal" label="Corporate Email"
//           name="email" value={form.email} onChange={handleChange} />
//
//         <TextField
//           fullWidth
//           margin="normal"
//           type={showPwd ? "text" : "password"}
//           label="Password"
//           name="password"
//           value={form.password}
//           onChange={handleChange}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton onClick={() => setShowPwd(!showPwd)}>
//                   {showPwd ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//
//         <TextField
//           fullWidth
//           margin="normal"
//           type={showPwd ? "text" : "password"}
//           label="Confirm Password"
//           name="confirm_password"
//           value={form.confirm_password}
//           onChange={handleChange}
//         />
//
//         <TextField select fullWidth margin="normal"
//           label="Role" name="role" value={form.role} onChange={handleChange}>
//           <MenuItem value="LM">Line Manager</MenuItem>
//           <MenuItem value="HR">HR</MenuItem>
//           <MenuItem value="IDU">IDU</MenuItem>
//           <MenuItem value="TM">Team Member</MenuItem>
//         </TextField>
//
//         <TextField select fullWidth margin="normal"
//           label="Country" name="country"
//           value={form.country} onChange={handleChange}>
//           <MenuItem value="">Select Country</MenuItem>
//           {asianCountries.map((c) => (
//             <MenuItem key={c.isoCode} value={c.isoCode}>
//               {c.name}
//             </MenuItem>
//           ))}
//         </TextField>
//
//         <TextField select fullWidth margin="normal"
//           label="State" name="state"
//           value={form.state} onChange={handleChange}
//           disabled={!form.country}>
//           <MenuItem value="">Select State</MenuItem>
//           {states.map((s) => (
//             <MenuItem key={s.isoCode} value={s.name}>
//               {s.name}
//             </MenuItem>
//           ))}
//         </TextField>
//
//         <Button
//           fullWidth
//           variant="contained"
//           size="large"
//           sx={{
//             mt: 3,
//             py: 1.3,
//             fontWeight: "bold",
//             letterSpacing: 1,
//             backgroundColor: "#0B3C5D",
//             "&:hover": { backgroundColor: "#072F4A" }
//           }}
//           onClick={handleSubmit}
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "SUBMIT REQUEST"}
//         </Button>
//
//         <Button
//           fullWidth
//           sx={{ mt: 2, fontWeight: 600 }}
//           onClick={() => navigate("/")}
//         >
//           BACK TO LOGIN
//         </Button>
//       </Paper>
//     </Box>
//   );
// }
import { useState, useEffect } from "react";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  // Divider
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import API from "../api";
import bgImage from "../images.png";
import companyLogo from "../re.jpg"; // add your logo path

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employee_name: "",
    employee_id: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "",
    country: "",
    state: "",
  });

  const [asianCountries, setAsianCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load Countries
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    const asianCountryCodes = ["IN", "CN", "JP"];

    const asiaCountries = allCountries.filter((c) =>
      asianCountryCodes.includes(c.isoCode)
    );

    setAsianCountries(asiaCountries);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      const selectedCountry = asianCountries.find(
        (c) => c.isoCode === value
      );

      const countryStates = selectedCountry
        ? State.getStatesOfCountry(selectedCountry.isoCode)
        : [];

      setStates(countryStates);

      setForm((prev) => ({
        ...prev,
        country: value,
        state: "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await API.post("/register", {
        employee_name: form.employee_name,
        employee_id: form.employee_id,
        email: form.email,
        password: form.password,
        role: form.role,
        country: form.country,
        state: form.state,
      });

      setSuccess("Registration submitted successfully.");
      setTimeout(() => navigate("/"), 2000);

    } catch (err) {
      const msg =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Registration failed, please try again";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f4f6f9",
        fontFamily: "Calibri"
      }}
    >

      {/* ===== CORPORATE HEADER BANNER ===== */}
      <Box
        sx={{
          // position: "absolute",
          width: "100%",
          height: "50vh",
          // backgroundImage: `linear-gradient(rgba(11,60,93,0.9), rgba(11,60,93,0.9)), url(${bgImage})`,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          px: 2
        }}
      >
        {/*<Box>*/}
        {/*  <Typography variant="h4" fontWeight="bold">*/}
        {/*    GFT Recognition Portal*/}
        {/*  </Typography>*/}
        {/*  <Typography variant="body1" sx={{ opacity: 0.85, mt: 1 }}>*/}
        {/*    Employee Access Request*/}
        {/*  </Typography>*/}
        {/*</Box>*/}
      </Box>

      {/* ===== FORM SECTION ===== */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          mt: "-90px"
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: 480,
            p: 5,
            borderRadius: 4,
            backgroundColor: "#ffffff",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
          }}
        >

          {/* Logo */}
          <Box textAlign="center" mb={2}>
            <Box
              component="img"
              src={companyLogo}
              alt="Company Logo"
              sx={{ width: 90, mb: 1 }}
            />
          </Box>

          {/* Title */}
          <Box textAlign="center" mb={3}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Register for Access
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete the form below for approval
            </Typography>
          </Box>

          {/*<Divider sx={{ mb: 3 }} />*/}

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {/* Form Fields */}
          <TextField fullWidth label="Employee Name"
            name="employee_name" value={form.employee_name}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField fullWidth label="Employee ID"
            name="employee_id" value={form.employee_id}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, mt: 2 }}
          />

          <TextField fullWidth label="Corporate Email"
            name="email" value={form.email}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, mt: 2 }}
          />

          <TextField
            fullWidth
            type={showPwd ? "text" : "password"}
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, mt: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            type={showPwd ? "text" : "password"}
            label="Confirm Password"
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, mt: 2 }}
          />

          <TextField select fullWidth label="Role"
            name="role" value={form.role}
            onChange={handleChange}
            sx={{ mt: 2 }}>
            <MenuItem value="LM">Line Manager</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="IDU">IDU</MenuItem>
            <MenuItem value="TM">Team Member</MenuItem>
          </TextField>

          <TextField select fullWidth label="Country"
            name="country" value={form.country}
            onChange={handleChange}
            sx={{ mt: 2 }}>
            <MenuItem value="">Select Country</MenuItem>
            {asianCountries.map((c) => (
              <MenuItem key={c.isoCode} value={c.isoCode}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField select fullWidth label="State"
            name="state" value={form.state}
            onChange={handleChange}
            disabled={!form.country}
            sx={{ mt: 2 }}>
            <MenuItem value="">Select State</MenuItem>
            {states.map((s) => (
              <MenuItem key={s.isoCode} value={s.name}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 4,
              py: 1.4,
              fontWeight: "bold",
              letterSpacing: 1,
              borderRadius: 2,
              background: "linear-gradient(90deg, #0B3C5D, #145374)",
              "&:hover": {
                background: "linear-gradient(90deg, #072F4A, #0B3C5D)"
              }
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Submit Request"}
          </Button>

          <Button
            fullWidth
            sx={{ mt: 2, fontWeight: 600 }}
            onClick={() => navigate("/")}
          >
            Back to Login
          </Button>

        </Paper>
      </Box>
    </Box>
  );
}