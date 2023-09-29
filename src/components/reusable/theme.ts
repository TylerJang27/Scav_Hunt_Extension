import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#fdd835",
      contrastText: "rgba(0,0,0,0.95)",
    },
    secondary: {
      main: "#7646f3",
    },
    text: {
      primary: "rgba(255,255,255,0.87)",
      secondary: "rgba(235,235,235,0.7)",
      disabled: "rgba(133,133,133,0.5)",
    },
    background: {
      default: "rgba(0,0,0,0.87)",
      paper: "#575555",
    },
    error: {
      main: "#f44336",
    },
  },
});
