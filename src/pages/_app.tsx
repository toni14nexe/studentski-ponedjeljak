import Layout from "@/components/Layout/Layout";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import StoreProvider from "@/components/StoreProvider";
import { Notifications } from "@mantine/notifications";
import Head from "next/head";
import "@/assets/style.scss";

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
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <title>Studentski Ponedjeljak</title>
      </Head>
      <StoreProvider>
        <MantineProvider theme={theme}>
          <Notifications position="top-right" />
          <Layout>
            <link rel="icon" href="../assets/favicon.ico" />
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
      </StoreProvider>
    </>
  );
}

export default MyApp;
