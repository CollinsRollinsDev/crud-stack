import User from '../../models/User';
import dbConnection from "./utils/dbConnection";
import { compare } from "bcrypt";
import { sign } from 'jsonwebtoken';
import cookie from 'cookie'

dbConnection();

let jwtKey:any = process.env.JWT_SIGN_KEY

export default async function handler(
  req:any,
  res:any
){

  const { emailAddress, username, password, id } = req.body;
  // find unique user by email
  const user = await User.findOne({
    _id: id,
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: `We could not find anyone with this credentials`,
    });
  }

  if (emailAddress == user.emailAddress && username == user.username) {
    return res.status(401).json({
      success: false,
      message: `Sorry, you should change some details to update your profile.`,
    });
  }

  compare(req.body.password, user.password, async function (err, result) {
    if (!err && result) {
      if (username) {
        user.username = username;
      }
      if (emailAddress) {
        user.emailAddress = emailAddress;
      }

      const updated = await user.save();

      const userData = {
        id: user.id,
        emailAddress: user.emailAddress.toLowerCase(),
        username: user.username.toLowerCase(),
        createdAt: user.createdAt,
      };

      let token = sign(userData, jwtKey, {
        expiresIn: "2h",
      });
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("authPlay", token, {
          httpOnly: false,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 720000000000,
          path: "/",
        })
      );

      return res.status(200).json({
        success: true,
        message: "User updated successfully!!!",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Sorry, something went wrong. Consider checking your password.`,
      });
    }
  });

}