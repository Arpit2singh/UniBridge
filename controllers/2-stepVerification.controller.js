import nodemailer from "nodemailer" ; 
import { User } from "../models/User.model.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken" ; 



  const TwostepemailService = asyncHandler(async(req,res)=>{
    try{
    const Transporter = nodemailer.createTransport({
    host : "smtp.gmail.com" ,
    port : 587 ,
    secure : false , 
    auth :{
        user : "arpitno57@gmail.com",
        pass : "" ,
    }
})
    const {otp} = req.body; 


    const token  = req.cookies.accessToken ; 
    if (!token) throw new ApiError(401, "Unauthorized, no token");
    const decoded = jwt.verify(token ,process.env.ACCESS_TOKEN_SECRET ) ; 

    if(!decoded){
        console.log("user not found pr accessToken expired || missing ") ;
        throw new ApiError(400 , "user not found") ;
    }
    const user = await User.findById(decoded._id).select("-password -refreshToken") ;  
    if(!user){
        console.log("user not Found") ; 
        throw new ApiError(401 , "user not found") ; 
    }
    const email = user.email ; 
    if(!email){
        console.log("email not found") ; 
        throw new ApiError(400 , "email not found") ; 
    }


    const info = await Transporter.sendMail({
        from : '"uniBridge" <arpitno57@gmail.com>' , 
        to :  `${email}` , 
        subject : "lemon rice khaye kya",
        text : `hey order it by today ${otp}` ,
        html : `<h1>order now on zomato ${otp}</h1>` , 
    })

    return res.status(200).json(new ApiResponse(201 , "email has been send")) 
} 
catch(error){
    throw new ApiError(401 ,"email sending interuption " , error.message )
}
} )

export default TwostepemailService ; 


