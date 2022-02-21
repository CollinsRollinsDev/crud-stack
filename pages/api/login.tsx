// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from '../../models/User';
import dbConnection from "./utils/dbConnection";
import { compare } from "bcrypt";
import { sign } from 'jsonwebtoken';
import cookie from 'cookie'



dbConnection();

type Data = {
  name: string
}

let jwtKey:any = process.env.JWT_SIGN_KEY

let proceed:any
export default async function handler(
  req:any,
  res:any
) {
  const method = req.method;
  const { emailAddress, username } = req.body;
  const { queryP } = req.query;

  // based on outcome, query db vis email or username
  let user:any;
  if (queryP === "email") {
    user = await User.findOne({
      emailAddress,
    });
  } else {
    user = await User.findOne({
      username: emailAddress,
    });
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      message: `We could not find anyone with this credentials`,
    });
  }

  if (user) {
    //   Check if emailAddress matches emailAddress on the database
    if (queryP === "email") {
      (await user.emailAddress) === emailAddress
        ? (proceed = true)
        : (proceed = false);
    } else {
      (await user.username) === emailAddress
        ? (proceed = true)
        : (proceed = false);
    }
    if (proceed) {
      // Check if password matches password on the database using bcrypt and log user in.
      compare(req.body.password, user.password, async function (err:any, result:any) {
        if (!err && result) {
          const userData = {
            id: user.id,
           emailAddress: user.emailAddress.toLowerCase(),
           username: user.username.toLowerCase(),
            createdAt: user.createdAt,
          };


          let token:any = sign(userData, jwtKey, {
            expiresIn: "1h",
          });
         const setMyCookie = res.setHeader(
            "Set-Cookie",
            cookie.serialize("authplay_auth", token, {
              httpOnly: false,
              // not a very serious app to set secure=true to only production
              secure: process.env.NODE_ENV !== 'development',
              sameSite: "strict",
              maxAge: 36000000000,
              path: "/",
            })
          );
        // let options = {
        //         httpOnly: false,
        //         // not a very serious app to set secure=true to only production
        //         secure: false,
        //         // maxAge: 3600,
        //         sameSite:'none',
        //         path: "/",
        // }

        //   res.cookie('authplay_auth', token, options)
          // res.cookie('authplay_auth', token)
          // if(setMyCookie){
            return res.status(200).json({
              success: true,
              message: "Welcome to Auth Play",
            });
          // } 

	
        } else {
          return res.status(401).json({
            success: false,
            message: `Sorry, something went wrong. Consider checking your password.`,
          });
        }
      });
    }
  }
}
