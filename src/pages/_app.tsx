import { AppProps } from "next/app";
import Layout from "@/components/Layout/Layout";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import StoreProvider from "@/components/StoreProvider"; // Adjust path as necessary

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider>
      <MantineProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </StoreProvider>
  );
}

export default MyApp;
