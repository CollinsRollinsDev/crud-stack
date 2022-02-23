/* eslint-disable import/no-anonymous-default-export */
import cookie from "cookie";

export default async function handler(
  req:any,
  res:any
){
  try {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("authPlay", "", {
        maxAge: -1,
        path: "/",
      })
    );
    // res.clearCookie("authPlay");
    return res.status(200).json({
      success: true,
      message: `you are logged out`,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: `Sorry, something went wrong. Try again`,
    });
  }
}