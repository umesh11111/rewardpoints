// import { useContext } from "react";
// import {
//   Box,
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemText,
//   AppBar,
//   Toolbar,
//   Typography,
//   Button
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../AuthContext";
//
// const drawerWidth = 220;
//
// export default function Layout({ children }) {
//   const navigate = useNavigate();
//   const { user, logout } = useContext(AuthContext);
//
//   return (
//     <Box sx={{ display: "flex" }}>
//
//       {/* Sidebar */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: drawerWidth,
//           [`& .MuiDrawer-paper`]: { width: drawerWidth }
//         }}
//       >
//         <Toolbar />
//         <List>
//           {user?.role && (
//           <ListItemButton onClick={() => navigate("/dashboard")}>
//             <ListItemText primary="Dashboard" />
//           </ListItemButton>
//         )}
//           {user?.role === "LM" && (
//             <ListItemButton onClick={() => navigate("/submit")}>
//               <ListItemText primary="Submit Reward" />
//             </ListItemButton>
//           )}
//
//           {user?.role === "HR" && (
//             <ListItemButton onClick={() => navigate("/hr")}>
//               <ListItemText primary="HR Approvals" />
//             </ListItemButton>
//           )}
//
//           {user?.role === "IDU" && (
//             <ListItemButton onClick={() => navigate("/idu")}>
//               <ListItemText primary="IDU Approvals" />
//             </ListItemButton>
//           )}
//
//         </List>
//       </Drawer>
//
//       {/* Main area */}
//       <Box sx={{ flexGrow: 1 }}>
//
//         {/* Top header */}
//         <AppBar position="static">
//           <Toolbar sx={{ justifyContent: "space-between" }}>
//             <Typography variant="h6">
//               Reward Points Portal
//             </Typography>
//
//             <Box>
//               <Typography variant="body2" sx={{ mr: 2, display: "inline" }}>
//                 Role: {user?.role}
//               </Typography>
//
//               <Button color="inherit" onClick={() => {
//                 logout();
//                 navigate("/");
//               }}>
//                 Logout
//               </Button>
//             </Box>
//           </Toolbar>
//         </AppBar>
//
//         {/* Page content */}
//         <Box sx={{ p: 4 }}>
//           {children}
//         </Box>
//
//       </Box>
//     </Box>
//   );
// }

import { useContext } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Divider
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import companyLogo from "../re.jpg"; // add your logo path
// import companybanner from "../company.jpeg"

const drawerWidth = 240;

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f6f8", minHeight: "100vh" }}>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            bgcolor: "#1e293b",
            color: "#fff",
            borderRight: "none"
          }
        }}
      >
          {/* Logo */}
          <Box textAlign="center" mb={1}>
            <Box
              component="img"
              src={companyLogo}
              alt="Company Logo"
              sx={{ width: 240, mb: 1 }}
            />
          </Box>
        {/*<Toolbar>*/}
        {/*  <Typography variant="h6" sx={{ fontWeight: 600 }}>*/}
        {/*    Rewards Portal*/}
        {/*  </Typography>*/}
        {/*</Toolbar>*/}

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />

        <List sx={{ mt: 1 }}>

          {/* Dashboard for all */}
          {user?.role && (
            <ListItemButton onClick={() => navigate("/dashboard")}>
              <ListItemIcon sx={{ color: "#cbd5f5" }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          )}

          {user?.role === "LM" && (
            <ListItemButton onClick={() => navigate("/submit")}>
              <ListItemIcon sx={{ color: "#cbd5f5" }}>
                <AssignmentTurnedInIcon />
              </ListItemIcon>
              <ListItemText primary="Submit Reward" />
            </ListItemButton>
          )}

          {user?.role === "HR" && (
            <ListItemButton onClick={() => navigate("/hr")}>
              <ListItemIcon sx={{ color: "#cbd5f5" }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="HR Approvals" />
            </ListItemButton>
          )}
            {user?.role === "TM" && (
            <ListItemButton onClick={() => navigate("/emp")}>
              <ListItemIcon sx={{ color: "#cbd5f5" }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Employee Rewards Summary" />
            </ListItemButton>
          )}

          {user?.role === "IDU" && (
            <ListItemButton onClick={() => navigate("/idu")}>
              <ListItemIcon sx={{ color: "#cbd5f5" }}>
                <VerifiedUserIcon />
              </ListItemIcon>
              <ListItemText primary="IDU Approvals" />
            </ListItemButton>
          )}

        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1 }}>

        {/* Top Header */}
        <AppBar
          position="sticky"
          elevation={1}
          sx={{ bgcolor: "#ffffff", color: "#111827" }}
        >
          <Toolbar
              sx={{
                justifyContent: "space-between",
                // backgroundImage: `url(${companybanner})`,
                // backgroundSize: "cover",         // optional: cover the toolbar fully
                backgroundPosition: "right",    // optional: center the image
                backgroundRepeat: "no-repeat",   // optional: no repeating
                color: "black"                   // text color on banner
              }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Reward Points Portal
            </Typography>

            <Box display="flex" alignItems="center">
              <Typography variant="body2" sx={{ mr: 3 }}>
                Role: {user?.role}
              </Typography>

              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          sx={{
            p: 3
          }}
        >
          <Box
            sx={{
              bgcolor: "#ffffff",
              borderRadius: 2,
              p: 3,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
            }}
          >
            {children}
          </Box>
        </Box>

      </Box>
    </Box>
  );
}