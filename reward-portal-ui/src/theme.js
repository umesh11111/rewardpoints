// import { createTheme } from "@mui/material/styles";
//
// const theme = createTheme({
//   palette: {
//     primary: { main: "#1e3c72" },
//     secondary: { main: "#2a5298" },
//     background: { default: "#f4f6f8" }
//   },
//   shape: { borderRadius: 10 },
//   typography: {
//     fontFamily: "Calibri, Arial, sans-serif",
//     h5: { fontWeight: 600 },
//     h6: { fontWeight: 600 }
//   }
// });
//
// export default theme;

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0B3C5D",   // corporate navy
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#145374"
    },
    background: {
      default: "#f4f6f9",
      paper: "#ffffff"
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280"
    }
  },

  typography: {
    fontFamily: "Calibri, Roboto, sans-serif",
    h4: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 600
    },
    button: {
      textTransform: "none",
      fontWeight: 600
    }
  },

  shape: {
    borderRadius: 10
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "10px 18px",
          borderRadius: 8
        },
        containedPrimary: {
          background: "linear-gradient(90deg, #0B3C5D, #145374)"
        }
      }
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "12px"
        }
      }
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 15px 35px rgba(0,0,0,0.08)"
        }
      }
    }
  }
});

export default theme;