import type { NextPage } from "next";
import Head from "next/head";
import { useState, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.scss";
import Cookie from "js-cookie";
import jwt from "jsonwebtoken";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ChangePassword from "../components/ChangePassword";

const Home: NextPage = () => {
  const [userDetails, setUserDetails] = useState<any>();
  const [isProtected, setIsProtected] = useState<boolean>(true);

  const router = useRouter();
  const cookieDecode: () => void = async () => {
    let cookie: any = Cookie.get("authPlay");
    let user_data: any = await jwt.decode(cookie);
    if (!user_data) {
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        You are not logged in. — <strong>Routing back to login page.</strong>
      </Alert>;
      window.setTimeout(() => {
        router.push("/login");
      }, 3000);
      setIsProtected(true);
    } else {
      setIsProtected(false);
    }
    setUserDetails(user_data);
  };

  useLayoutEffect(() => {
    cookieDecode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isProtected) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
          backgroundColor: "#202020",
        }}
      >
        <Alert color="error" severity="error">
          <AlertTitle>Error</AlertTitle>
          You are not logged in. — <strong>Routing back to login page.</strong>
        </Alert>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Auth Play Change Password</title>
        <meta name="description" content="Coded by Collins Rollins" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ChangePassword userDetails={userDetails} />
    </div>
  );
};

export default Home;
