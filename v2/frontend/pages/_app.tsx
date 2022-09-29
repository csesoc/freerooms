import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme } from "@mui/material/styles";
import { orange, pink } from "@mui/material/colors";
import ThemeProvider from "@mui/system/ThemeProvider";
import { SWRConfig } from "swr";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: orange[800],
    },
    secondary: {
      main: pink[500],
    },
  },
});

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 30000, // update every 30 seconds
        fetcher: fetcher,
      }}
    >
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </SWRConfig>
  );
}

export default MyApp;
