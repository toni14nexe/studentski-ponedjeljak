import { AppProps } from "next/app";
import Layout from "@/components/Layout/Layout";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import StoreProvider from "@/components/StoreProvider";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
});

function MyApp({
  Component,
  pageProps,
}: {
  Component: any | undefined;
  pageProps: any | undefined;
}) {
  return (
    <StoreProvider>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </StoreProvider>
  );
}

export default MyApp;
