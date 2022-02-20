import React, { useState, useLayoutEffect } from "react";
import styles from "./Header.module.scss";
import { useTheme } from "next-themes";
import Link from "next/link";
import Cookie from "js-cookie";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
interface Incoming {
  currentPage: String;
}

const Header = ({ currentPage }: Incoming) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bgColor, setBgColor] = useState("var(--primaryContainerBgColor)");
  const { theme, setTheme } = useTheme();
  const [openMenu, setOpenMenu] = useState(false);

  const cookieDecode: () => void = async () => {
    let cookie: any = Cookie.get("authplay_auth");
    let user_data: any = await jwt.decode(cookie);
    if (!user_data) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  };

  useLayoutEffect(() => {
    cookieDecode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = () => {
    theme == "dark" ? setTheme("light") : setTheme("dark");
  };

  const lightIcon = (
    <svg
      onClick={handleToggle}
      fill="#4e00ad"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
    >
      <path d="M19 6.734c0 4.164-3.75 6.98-3.75 10.266h-6.5c0-3.286-3.75-6.103-3.75-10.266 0-4.343 3.498-6.734 6.996-6.734 3.502 0 7.004 2.394 7.004 6.734zm-4.5 11.266h-5c-.276 0-.5.224-.5.5s.224.5.5.5h5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm0 2h-5c-.276 0-.5.224-.5.5s.224.5.5.5h5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm.25 2h-5.5l1.451 1.659c.19.216.465.341.753.341h1.093c.288 0 .562-.125.752-.341l1.451-1.659z" />
    </svg>
  );

  const darkIcon = (
    <svg
      onClick={handleToggle}
      fill="#f5a104"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
    >
      <path d="M9.25 22h5.5l-1.451 1.659c-.19.216-.465.341-.753.341h-1.093c-.288 0-.562-.125-.752-.341l-1.451-1.659zm-.535-5.514c.019.171.035.342.035.514h6.5c0-3.171 3.483-5.91 3.727-9.84l-10.262 9.326zm5.785 1.514h-5c-.276 0-.5.224-.5.5s.224.5.5.5h5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm0 2h-5c-.276 0-.5.224-.5.5s.224.5.5.5h5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm7.149-20l-3.594 3.263c-1.268-2.116-3.654-3.263-6.059-3.263-3.498 0-6.996 2.391-6.996 6.734 0 2.427 1.268 4.396 2.33 6.267l-6.33 5.733 1.346 1.5 20.654-18.75-1.351-1.484z" />
    </svg>
  );

  // useEffect(() => {
  //   // theme == "dark" ? setTheme("light") : setTheme("dark");
  //   setTheme('light')
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  const handleLogout = async () => {
    const confirmUserRequst = confirm("You sure you wanna log out??");
    if (!confirmUserRequst) {
      // do nothing
      return;
    }
    try {
      const res = await fetch(
        `https://crud-stack-server-side.vercel.app/logout`,
        {
          credentials: "include",
        }
      );
      const { success } = await res.json();
      if (success != true) {
        alert("Something went wrong. We could not log you out. Try again.");
        return;
      }
      alert(
        "You have logged out successfully. You will be taken to the home page now."
      );
      if (router.pathname == "/") {
        location.reload();
        return;
      }
      router.push("/");
      return;
    } catch (error) {
     
      alert("Unexpected error occurred!.");
      return;
    }
  };

  const handleOpenMenu = () => {
    openMenu ? setOpenMenu(false) : setOpenMenu(true);
  };

  const menu = (
    <>
      <div onClick={handleOpenMenu} className={styles.overall}>
        <section className={styles.menuContainer}>
          <Link href={"/"} passHref>
            <div
              style={{ backgroundColor: currentPage == "home" ? bgColor : "" }}
            >
              Home
            </div>
          </Link>
          <Link href={"/update"} passHref>
            <div
              style={{
                backgroundColor: currentPage == "update" ? bgColor : "",
              }}
            >
              Update User
            </div>
          </Link>
          <Link href={"/delete"} passHref>
            <div
              style={{
                backgroundColor: currentPage == "delete" ? bgColor : "",
              }}
            >
              Delete User
            </div>
          </Link>
          <Link href={"/changepassword"} passHref>
            <div
              style={{
                backgroundColor: currentPage == "changepassword" ? bgColor : "",
              }}
            >
              Change Pasword
            </div>
          </Link>
          {!isLoggedIn && (
            <Link href={"/register"} passHref>
              <div
                style={{
                  backgroundColor: currentPage == "register" ? bgColor : "",
                }}
              >
                Register
              </div>
            </Link>
          )}
          {isLoggedIn ? (
            <div
              onClick={handleLogout}
              style={{
                backgroundColor: currentPage == "logout" ? bgColor : "",
              }}
            >
              Logout
            </div>
          ) : (
            <Link href={"/login"} passHref>
              <div
                style={{
                  backgroundColor: currentPage == "login" ? bgColor : "",
                }}
              >
                Login
              </div>
            </Link>
          )}
        </section>
      </div>
    </>
  );

  return (
    <section className={styles.container}>
      <div className={styles.left}>
        <div className={styles.toggle}>
          {theme == "dark" ? lightIcon : darkIcon}
        </div>{" "}
        <h3>AuthPlay From Collins Rollins</h3>
      </div>

      <nav className={styles.right}>
        <Link href={"/"} passHref>
          <div
            style={{ backgroundColor: currentPage == "home" ? bgColor : "" }}
          >
            Home
          </div>
        </Link>
        <Link href={"/update"} passHref>
          <div
            style={{ backgroundColor: currentPage == "update" ? bgColor : "" }}
          >
            Update User
          </div>
        </Link>
        <Link href={"/delete"} passHref>
          <div
            style={{ backgroundColor: currentPage == "delete" ? bgColor : "" }}
          >
            Delete User
          </div>
        </Link>
        <Link href={"/changepassword"} passHref>
          <div
            style={{
              backgroundColor: currentPage == "changepassword" ? bgColor : "",
            }}
          >
            Change Pasword
          </div>
        </Link>
        {!isLoggedIn && (
          <Link href={"/register"} passHref>
            <div
              style={{
                backgroundColor: currentPage == "register" ? bgColor : "",
              }}
            >
              Register
            </div>
          </Link>
        )}
        {isLoggedIn ? (
          <div
            onClick={handleLogout}
            style={{ backgroundColor: currentPage == "logout" ? bgColor : "" }}
          >
            Logout
          </div>
        ) : (
          <Link href={"/login"} passHref>
            <div
              style={{ backgroundColor: currentPage == "login" ? bgColor : "" }}
            >
              Login
            </div>
          </Link>
        )}

        {/* <div className={styles.toggle}>

          </div> */}
        <div className={styles.menu}>
          <svg
            onClick={handleOpenMenu}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z" />
          </svg>
        </div>
      </nav>
      {openMenu && menu}
    </section>
  );
};

export default Header;
