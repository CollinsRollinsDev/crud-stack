import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React from "react";
import { ThemeProvider } from "next-themes";
import { createTheme, ThemeProvider as MuiProvider } from "@mui/material";

const theme: any = createTheme({
  palette: {
    info: {
      main: "#fafafa",
      light: "#fafafa",
    },
    error: {
      main: "#ff0000",
      light: "#ff0000",
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="light">
      <MuiProvider theme={theme}>
        <Component {...pageProps} />
      </MuiProvider>
    </ThemeProvider>
  );
}

export default MyApp;
