// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from '../../models/User';
import dbConnection from "./utils/dbConnection";
import { compare } from "bcrypt";
import { hash } from "bcrypt";
import { sign } from 'jsonwebtoken';
import cookie from 'cookie'

dbConnection();

type Data = {
  name: string
}

let jwtKey:any = process.env.JWT_SIGN_KEY;
export default async function handler(
  req:any,
  res:any
) {
  const { username, emailAddress, password } = req.body;

  if (!username || !emailAddress || !password) {
    return res.status(401).json({
      stats: "failed",
      reason: "One or more input seems left out",
    });
  }

  // check is user already exist with the credentials provided
  try {
    const user = await User.findOne({
      emailAddress,
      username,
    });
    if (user) {
      return res.status(401).json({
        stats: "failed",
        reason: "You already have an account created here.",
      });
    }
    // if all validation is done and passed, create user account.
    hash(req.body.password, 10, async function (err, hash) {
      // Store hash in your password DB.
      // Convert incoming password to hashed password
      req.body.password = hash;
      //  save user to database
      const user = await User.create(req.body);
      return res.status(201).json({
        stats: "success",
        reason: "User created successfully! You can now login.",
      });
    });
  } catch (error) {
    return res.status(501).json({
      stats: "failed",
      reason: "An unidentified error occured!!",
    });
  }


}