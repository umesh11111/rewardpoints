// import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Alert,
//   InputAdornment,
//   IconButton,
//   CircularProgress
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import API from "../api";
// import { AuthContext } from "../AuthContext";
// import bgImage from "../images.png";
//
// export default function Login() {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();
//
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPwd, setShowPwd] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//
//   const handleLogin = async () => {
//     if (!email || !password) {
//       setError("Please enter username and password");
//       return;
//     }
//
//     try {
//       setLoading(true);
//       setError("");
//
//       const form = new URLSearchParams();
//       form.append("username", email.trim());
//       form.append("password", password.trim());
//
//       const res = await API.post("/auth/login", form, {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" }
//       });
//
//       const token = res.data.access_token;
//       if (!token) throw new Error("Token not received");
//
//       const payload = JSON.parse(atob(token.split(".")[1]));
//
//       // 🚫 HR approval check
//       if (payload.status !== "APPROVED") {
//         setError("Your account is pending HR approval");
//         return;
//       }
//
//       login(
//         token,
//         payload.role,
//         payload.employee_id,
//         payload.status
//       );
//
//       // 🎯 role based routing
//       if (payload.role === "LM") navigate("/submit");
//       else if (payload.role === "HR") navigate("/hr");
//       else if (payload.role === "IDU") navigate("/idu");
//       else navigate("/");
//
//     } catch (err) {
//       let message = "Invalid credentials or user not registered";
//
//       if (err.response?.data?.detail) {
//         const detail = err.response.data.detail;
//
//         if (Array.isArray(detail)) {
//           message = detail.map(d => d.msg).join(", ");
//         } else if (typeof detail === "string") {
//           message = detail;
//         }
//       }
//
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <Box
//       sx={{
//         height: "120vh",
//         display: "flex",
//         fontFamily: "Calibri",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundImage: `url(${bgImage})`,
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "top"
//       }}
//     >
//       <Paper elevation={6} sx={{ width: 400, p: 4, borderRadius: 3 }}>
//
//         <Typography variant="h5" align="center" gutterBottom>
//           Reward Points Portal
//         </Typography>
//
//         <Typography variant="body2" align="center" color="text.secondary" mb={3}>
//           Sign in to continue
//         </Typography>
//
//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//
//         <TextField
//           fullWidth
//           label="Username / Email"
//           margin="normal"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//
//         <TextField
//           fullWidth
//           label="Password"
//           type={showPwd ? "text" : "password"}
//           margin="normal"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton onClick={() => setShowPwd(!showPwd)}>
//                   {showPwd ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             )
//           }}
//         />
//
//         <Button
//           fullWidth
//           variant="contained"
//           size="large"
//           sx={{ mt: 3 }}
//           onClick={handleLogin}
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={22} /> : "Sign In"}
//         </Button>
//
//         <Typography align="center" mt={2}>
//   New user?
//   <Button
//   type="button"   // ⭐ IMPORTANT
//   onClick={() => navigate("/register")}
// >
//   Register here
// </Button>
// </Typography>
//
//       </Paper>
//     </Box>
//   );
// }

// import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Alert,
//   InputAdornment,
//   IconButton,
//   CircularProgress,
//   Divider
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import API from "../api";
// import { AuthContext } from "../AuthContext";
// import bgImage from "../images.png";
//
// export default function Login() {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();
//
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPwd, setShowPwd] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//
//   const handleLogin = async () => {
//     if (!email || !password) {
//       setError("Please enter username and password");
//       return;
//     }
//
//     try {
//       setLoading(true);
//       setError("");
//
//       const form = new URLSearchParams();
//       form.append("username", email.trim());
//       form.append("password", password.trim());
//
//       const res = await API.post("/auth/login", form, {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" }
//       });
//
//       const token = res.data.access_token;
//       if (!token) throw new Error("Token not received");
//
//       const payload = JSON.parse(atob(token.split(".")[1]));
//
//       // HR approval check
//       if (payload.status !== "APPROVED") {
//         setError("Your account is pending HR approval");
//         return;
//       }
//
//       login(token, payload.role, payload.employee_id, payload.status);
//
//       // Role-based routing
//       if (payload.role === "LM") navigate("/submit");
//       else if (payload.role === "HR") navigate("/hr");
//       else if (payload.role === "IDU") navigate("/idu");
//       else navigate("/");
//
//     } catch (err) {
//       let message = "Invalid credentials or user not registered";
//
//       if (err.response?.data?.detail) {
//         const detail = err.response.data.detail;
//
//         if (Array.isArray(detail)) {
//           message = detail.map(d => d.msg).join(", ");
//         } else if (typeof detail === "string") {
//           message = detail;
//         }
//       }
//
//       setError(message);
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
//     >
//       <Paper
//         elevation={12}
//         sx={{
//           width: 420,
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
//             Employee Reward Portal
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             GFT Recognition System
//           </Typography>
//         </Box>
//
//         <Divider sx={{ mb: 3 }} />
//
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}
//
//         {/* Username */}
//         <TextField
//           fullWidth
//           label="Corporate Email"
//           margin="normal"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//
//         {/* Password */}
//         <TextField
//           fullWidth
//           label="Password"
//           type={showPwd ? "text" : "password"}
//           margin="normal"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton onClick={() => setShowPwd(!showPwd)}>
//                   {showPwd ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             )
//           }}
//         />
//
//         {/* Login Button */}
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
//             "&:hover": {
//               backgroundColor: "#072F4A"
//             }
//           }}
//           onClick={handleLogin}
//           disabled={loading}
//         >
//           {loading ? (
//             <CircularProgress size={22} sx={{ color: "white" }} />
//           ) : (
//             "SIGN IN"
//           )}
//         </Button>
//
//         {/* Footer */}
//         <Typography align="center" mt={3} fontSize={14}>
//           New employee?
//           <Button
//             type="button"
//             onClick={() => navigate("/register")}
//             sx={{ textTransform: "none", fontWeight: 600 }}
//           >
//             Request Access
//           </Button>
//         </Typography>
//       </Paper>
//     </Box>
//   );
// }
// import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Alert,
//   InputAdornment,
//   IconButton,
//   CircularProgress,
//   Divider
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import API from "../api";
// import { AuthContext } from "../AuthContext";
// import bgImage from "../images.png";
//
// export default function Login() {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();
//
//   // Login states
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPwd, setShowPwd] = useState(false);
//
//   // Reset password states
//   const [employeeId, setEmployeeId] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resetMode, setResetMode] = useState(false); // toggle login/reset
//
//   // ---------------- Login Handler ---------------- //
//   const handleLogin = async () => {
//   if (!email || !password) {
//     setError("Please enter username and password");
//     return;
//   }
//
//   try {
//     setLoading(true);
//     setError("");
//
//     const form = new URLSearchParams();
//     form.append("username", email.trim());
//     form.append("password", password.trim());
//
//     // const res = await API.post(
//     //   "/auth/login",
//     //   form,
//     //   {
//     //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     //     validateStatus: () => true
//     //   }
//     // );
//     // console.log('UMESHssssssssssss',res.status)
//     // if (res.status !== 200) {
//     //   setError(res);
//     // }
//     //
//     // const token = res.data.access_token;
//     // if (!token) throw new Error("Token not received");
//     //
//     // const payload = JSON.parse(atob(token.split(".")[1]));
//     // if (payload.status !== "APPROVED") {
//     //   setError("Your account is pending HR approval");
//     //   return;
//     // }
//     // login(token, payload.role, payload.employee_id, payload.status);
//     const res = await API.post("/auth/login", form, {
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       validateStatus: () => true
//     });
//
//     if (res.status !== 200) {
//       setError(res.data?.detail || "Invalid credentials  user not registered");
//       return;
//     }
//
//     const token = res.data.access_token;
//     if (!token) {
//       setError("Token not received");
//       return;
//     }
//
//     const payload = JSON.parse(atob(token.split(".")[1]));
//
//     if (payload.status !== "APPROVED") {
//       setError("Your account is pending HR approval");
//       return;
//     }
//
//     login(token, payload.role, payload.employee_id, payload.status);
//     if (payload.role === "LM") navigate("/submit");
//     else if (payload.role === "HR") navigate("/hr");
//     else if (payload.role === "IDU") navigate("/idu");
//     else if (payload.role === "TM") navigate("/emp");
//     else navigate("/");
//
//   } catch (err) {
//     let message = "Invalid credentials or user not registered";
//     if (err.response?.data?.detail) {
//       const detail = err.response.data.detail;
//       message = Array.isArray(detail)
//         ? detail.map(d => d.msg).join(", ")
//         : detail;
//     }
//     setError(message);
//     setTimeout(() => setError(""), 8000);
//   } finally {
//     setLoading(false);
//   }
// };
//
//   // ---------------- Reset Password Handler ---------------- //
//   const handleResetPassword = async () => {
//     if (!employeeId || !newPassword || !confirmPassword) {
//       setError("All fields are required");
//       return;
//     }
//
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }
//
//     try {
//       setLoading(true);
//       setError("");
//       setSuccess("");
//
//       const res = await API.post("/auth/reset-password", {
//         employee_id: employeeId,
//         new_password: newPassword,
//         confirm_password: confirmPassword
//       });
//
//       setSuccess(res.data.message);
//       // Reset form
//       setEmployeeId("");
//       setNewPassword("");
//       setConfirmPassword("");
//       setTimeout(() => setResetMode(false), 2000); // go back to login
//
//     } catch (err) {
//       setError(err.response?.data?.detail || "Reset password failed");
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
//     >
//       <Paper
//         elevation={12}
//         sx={{
//           width: 420,
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
//             {resetMode ? "Reset Password" : "Employee Reward Portal"}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {resetMode ? "Enter new credentials" : "GFT Recognition System"}
//           </Typography>
//         </Box>
//
//         <Divider sx={{ mb: 3 }} />
//
//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//         {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
//
//         {!resetMode ? (
//           <>
//             {/* Login Form */}
//             <TextField
//               fullWidth
//               label="Email"
//               margin="normal"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <TextField
//               fullWidth
//               label="Password"
//               type={showPwd ? "text" : "password"}
//               margin="normal"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={() => setShowPwd(!showPwd)}>
//                       {showPwd ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 )
//               }}
//             />
//             <Button
//               fullWidth
//               variant="contained"
//               size="large"
//               sx={{ mt: 3, py: 1.3, fontWeight: "bold", letterSpacing: 1, backgroundColor: "#0B3C5D", "&:hover": { backgroundColor: "#072F4A" } }}
//               onClick={handleLogin}
//               disabled={loading}
//             >
//               {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "SIGN IN"}
//             </Button>
//
//             <Typography align="center" mt={2} fontSize={14}>
//               <Button
//                 type="button"
//                 sx={{ textTransform: "none", fontWeight: 600 }}
//                 onClick={() => setResetMode(true)}
//               >
//                 Forgot Password?
//               </Button>
//             </Typography>
//
//             <Typography align="center" mt={1} fontSize={14}>
//               New employee?
//               <Button
//                 type="button"
//                 onClick={() => navigate("/register")}
//                 sx={{ textTransform: "none", fontWeight: 600 }}
//               >
//                 Request Access
//               </Button>
//             </Typography>
//           </>
//         ) : (
//           <>
//             {/* Reset Password Form */}
//             <TextField
//               fullWidth
//               label="Employee ID"
//               margin="normal"
//               value={employeeId}
//               onChange={(e) => setEmployeeId(e.target.value)}
//             />
//             <TextField
//               fullWidth
//               label="New Password"
//               type={showPwd ? "text" : "password"}
//               margin="normal"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//             />
//             <TextField
//               fullWidth
//               label="Confirm Password"
//               type={showPwd ? "text" : "password"}
//               margin="normal"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//             <Button
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3 }}
//               onClick={handleResetPassword}
//               disabled={loading}
//             >
//               {loading ? <CircularProgress size={22} /> : "RESET PASSWORD"}
//             </Button>
//
//             <Typography align="center" mt={2}>
//               <Button
//                 type="button"
//                 sx={{ textTransform: "none", fontWeight: 600 }}
//                 onClick={() => setResetMode(false)}
//               >
//                 Back to Login
//               </Button>
//             </Typography>
//           </>
//         )}
//       </Paper>
//     </Box>
//   );
// }

// import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Alert,
//   InputAdornment,
//   IconButton,
//   CircularProgress,
//   Divider
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import API from "../api";
// import { AuthContext } from "../AuthContext";
// import bgImage from "../images.png";
// import companylogo from "../re.jpg";
//
// export default function Login() {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();
//
//   // Login states
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPwd, setShowPwd] = useState(false);
//
//   // Reset password states
//   const [employeeId, setEmployeeId] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resetMode, setResetMode] = useState(false);
//
//   // ---------------- Login Handler ---------------- //
//   const handleLogin = async () => {
//     if (!email || !password) {
//       setError("Please enter username and password");
//       return;
//     }
//
//     try {
//       setLoading(true);
//       setError("");
//
//       const form = new URLSearchParams();
//       form.append("username", email.trim());
//       form.append("password", password.trim());
//
//       const res = await API.post(
//         "/auth/login",
//         form,
//         {
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//           validateStatus: () => true
//         }
//       );
//
//       // ✅ Stop execution if login failed
//       if (res.status !== 200) {
//         setError(res.data?.detail || "Invalid credentials or user not registered");
//         return;
//       }
//
//       const token = res.data?.access_token;
//
//       if (!token) {
//         setError("Token not received from server");
//         return;
//       }
//
//       const payload = JSON.parse(atob(token.split(".")[1]));
//
//       // ✅ HR approval check
//       if (payload.status !== "APPROVED") {
//         setError("Your account is pending HR approval");
//         return;
//       }
//
//       // ✅ Successful login
//       login(token, payload.role, payload.employee_id, payload.status);
//
//       if (payload.role === "LM") navigate("/submit");
//       else if (payload.role === "HR") navigate("/hr");
//       else if (payload.role === "IDU") navigate("/idu");
//       else if (payload.role === "TM") navigate("/emp");
//       else navigate("/");
//
//     } catch (err) {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//       setTimeout(() => setError(""), 8000);
//     }
//   };
//
//   // ---------------- Reset Password Handler ---------------- //
//   const handleResetPassword = async () => {
//     if (!employeeId || !newPassword || !confirmPassword) {
//       setError("All fields are required");
//       return;
//     }
//
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }
//
//     try {
//       setLoading(true);
//       setError("");
//       setSuccess("");
//
//       const res = await API.post("/auth/reset-password", {
//         employee_id: employeeId,
//         new_password: newPassword,
//         confirm_password: confirmPassword
//       });
//
//       setSuccess(res.data?.message || "Password reset successful");
//
//       setEmployeeId("");
//       setNewPassword("");
//       setConfirmPassword("");
//
//       setTimeout(() => {
//         setResetMode(false);
//         setSuccess("");
//       }, 2000);
//
//     } catch (err) {
//       setError(err.response?.data?.detail || "Reset password failed");
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
//     >
//       <Paper
//         elevation={12}
//         sx={{
//           width: 420,
//           p: 5,
//           borderRadius: 3,
//           backdropFilter: "blur(10px)",
//           backgroundColor: "rgba(255,255,255,0.96)"
//         }}
//       >
//         <Box textAlign="center" mb={3}>
//           <Box mb={2}>
//     <img
//       src={companylogo}
//       alt="Company Logo"
//       style={{
//         width: 80,
//         height: "auto",
//         objectFit: "contain"
//       }}
//     /></Box>
//           <Typography variant="h5" fontWeight="bold" sx={{ color: "#0B3C5D" }}>
//             {resetMode ? "Reset Password" : "Employee Reward Portal"}
//           </Typography>
//           {/* 🔹 Company Logo */}
//
//           {/*<Typography variant="body2" color="text.secondary">*/}
//           {/*  {resetMode ? "Enter new credentials" : "GFT Recognition System"}*/}
//           {/*</Typography>*/}
//         </Box>
//
//         <Divider sx={{ mb: 3 }} />
//
//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//         {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
//
//         {!resetMode ? (
//           <>
//             <TextField
//               fullWidth
//               label="Email"
//               margin="normal"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//
//             <TextField
//               fullWidth
//               label="Password"
//               type={showPwd ? "text" : "password"}
//               margin="normal"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={() => setShowPwd(!showPwd)}>
//                       {showPwd ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 )
//               }}
//             />
//
//             <Button
//               fullWidth
//               variant="contained"
//               size="large"
//               sx={{
//                 mt: 3,
//                 py: 1.3,
//                 fontWeight: "bold",
//                 letterSpacing: 1,
//                 backgroundColor: "#0B3C5D",
//                 "&:hover": { backgroundColor: "#072F4A" }
//               }}
//               onClick={handleLogin}
//               disabled={loading}
//             >
//               {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "SIGN IN"}
//             </Button>
//
//             <Typography align="center" mt={2} fontSize={14}>
//               <Button
//                 type="button"
//                 sx={{ textTransform: "none", fontWeight: 600 }}
//                 onClick={() => setResetMode(true)}
//               >
//                 Forgot Password?
//               </Button>
//             </Typography>
//
//             <Typography align="center" mt={1} fontSize={14}>
//               New employee?
//               <Button
//                 type="button"
//                 onClick={() => navigate("/register")}
//                 sx={{ textTransform: "none", fontWeight: 600 }}
//               >
//                 Request Access
//               </Button>
//             </Typography>
//           </>
//         ) : (
//           <>
//             <TextField
//               fullWidth
//               label="Employee ID"
//               margin="normal"
//               value={employeeId}
//               onChange={(e) => setEmployeeId(e.target.value)}
//             />
//
//             <TextField
//               fullWidth
//               label="New Password"
//               type={showPwd ? "text" : "password"}
//               margin="normal"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//             />
//
//             <TextField
//               fullWidth
//               label="Confirm Password"
//               type={showPwd ? "text" : "password"}
//               margin="normal"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//
//             <Button
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3 }}
//               onClick={handleResetPassword}
//               disabled={loading}
//             >
//               {loading ? <CircularProgress size={22} /> : "RESET PASSWORD"}
//             </Button>
//
//             <Typography align="center" mt={2}>
//               <Button
//                 type="button"
//                 sx={{ textTransform: "none", fontWeight: 600 }}
//                 onClick={() => setResetMode(false)}
//               >
//                 Back to Login
//               </Button>
//             </Typography>
//           </>
//         )}
//       </Paper>
//     </Box>
//   );
// }
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  // Divider
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import API from "../api";
import { AuthContext } from "../AuthContext";
import bgImage from "../images.png";
import companyLogo from "../re.jpg"; // add your logo path

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // Reset password states
  const [employeeId, setEmployeeId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  // ---------------- LOGIN ---------------- //
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const form = new URLSearchParams();
      form.append("username", email.trim());
      form.append("password", password.trim());

      const res = await API.post("/auth/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        validateStatus: () => true
      });

      if (res.status !== 200) {
        setError(res.data?.detail || "Invalid credentials");
        return;
      }

      const token = res.data?.access_token;
      if (!token) {
        setError("Token not received");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.status !== "APPROVED") {
        setError("Your account is pending HR approval");
        return;
      }

      login(token, payload.role, payload.employee_id, payload.status);

      if (payload.role === "LM") navigate("/submit");
      else if (payload.role === "HR") navigate("/hr");
      else if (payload.role === "IDU") navigate("/idu");
      else if (payload.role === "TM") navigate("/emp");
      else navigate("/");

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setTimeout(() => setError(""), 8000);
      setLoading(false);
    }
  };

  // ---------------- RESET PASSWORD ---------------- //
  const handleResetPassword = async () => {
    if (!employeeId || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await API.post("/auth/reset-password", {
        employee_id: employeeId,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      setSuccess(res.data?.message || "Password reset successful");

      setEmployeeId("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setResetMode(false);
        setSuccess("");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.detail || "Reset password failed");
    } finally {
      setTimeout(() => setError(""), 8000);
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

      {/* ===== TOP CORPORATE BANNER ===== */}
      <Box
        sx={{
          height: "50vh",
          // backgroundImage: `linear-gradient(rgba(11,60,93,0.9), rgba(11,60,93,0.9)), url(${bgImage})`,
          backgroundImage: ` url(${bgImage})`,
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
        {/*    Empowering Employee Excellence*/}
        {/*  </Typography>*/}
        {/*</Box>*/}
      </Box>

      {/* ===== LOGIN CARD SECTION ===== */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          mt: "-100px"
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: 420,
            p: 5,
            borderRadius: 4,
            backgroundColor: "#ffffff",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
          }}
        >

          {/* Logo */}
          <Box textAlign="center" mb={2}>
            <Box
              component="img"
              src={companyLogo}
              alt="Company Logo"
              sx={{ width: 100, mb: 1 }}
            />
          </Box>

          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#0B3C5D" }}
            >
              {resetMode ? "Reset Password" : "Empowering Employee Excellence\n" +
                  "\n"}
            </Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {!resetMode ? (
            <>
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPwd ? "text" : "password"}
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPwd(!showPwd)}>
                        {showPwd ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  py: 1.4,
                  fontWeight: "bold",
                  letterSpacing: 1,
                  background: "linear-gradient(90deg, #0B3C5D, #145374)",
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(90deg, #072F4A, #0B3C5D)"
                  }
                }}
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "white" }} />
                ) : (
                  "Sign In"
                )}
              </Button>

              <Typography align="center" mt={2} fontSize={14}>
                <Button
                  type="button"
                  sx={{ textTransform: "none", fontWeight: 600 }}
                  onClick={() => setResetMode(true)}
                >
                  Forgot Password?
                </Button>
              </Typography>

              <Typography align="center" mt={1} fontSize={14}>
                New employee?
                <Button
                  type="button"
                  onClick={() => navigate("/register")}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Request Access
                </Button>
              </Typography>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="Employee ID"
                margin="normal"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />

              <TextField
                fullWidth
                label="New Password"
                type={showPwd ? "text" : "password"}
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type={showPwd ? "text" : "password"}
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? <CircularProgress size={22} /> : "Reset Password"}
              </Button>

              <Typography align="center" mt={2}>
                <Button
                  type="button"
                  sx={{ textTransform: "none", fontWeight: 600 }}
                  onClick={() => setResetMode(false)}
                >
                  Back to Login
                </Button>
              </Typography>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}