import React from "react";
import RouteLists from "./RouteLists";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
   palette: {
      mode: "dark",
   },
   typography: { fontFamily: ["Inter", "sans-serif"].join(",") },
   components: {
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 15 } } },
      MuiButton: { styleOverrides: { root: { borderRadius: 15 } } },
      MuiAlert: { styleOverrides: { root: { borderRadius: 15 } } },
   },
});

const App = () => {
   return (
      <>
         <ThemeProvider theme={darkTheme}>
            <RouteLists />
         </ThemeProvider>
      </>
   );
};

export default App;
