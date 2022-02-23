import User from '../../models/User';
import dbConnection from "./utils/dbConnection";
import { compare } from "bcrypt";
import { sign } from 'jsonwebtoken';
import cookie from 'cookie'

dbConnection();



export default async function handler(
  req:any,
  res:any
){
  const { id } = req.body;
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

  try {
    const deleted = user.delete();
    if (deleted) {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("authPlay", "", {
          maxAge: -1,
          path: "/",
        })
      );
      return res.status(200).json({
        success: true,
        message: "User deleted successfully!!!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Sorry, something went wrong.`,
    });
  }
}