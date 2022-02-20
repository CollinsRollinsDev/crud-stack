import type { NextPage } from "next";
import Head from "next/head";
import Homepage from "../components/Homepage";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Auth Play</title>
        <meta name="description" content="Coded by Collins Rollins" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Homepage />
    </div>
  );
};

export default Home;
