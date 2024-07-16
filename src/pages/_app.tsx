import { AppProps } from "next/app";
import Layout from "../components/Layout";
import "@/assets/style/index.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
