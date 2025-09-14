import nodemailer from "nodemailer" ; 
import { User } from "../models/User.model.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken" ; 
import cron from "node-cron" 
import { REMAINDER } from "../models/remainder.model.js";


  const RemainderEmailService = ()=>{

    const Transporter = nodemailer.createTransport({
    host : "smtp.gmail.com" ,
    port : 587 ,
    secure : false , 
    auth :{
        user : "arpitno57@gmail.com",
        pass : process.env.SMTP ,
    }
})


    // const token  = req.cookies.accessToken ; 
    // if (!token) throw new ApiError(401, "Unauthorized, no token");
    // const decoded = jwt.verify(token ,process.env.ACCESS_TOKEN_SECRET ) ; 

    // if(!decoded){
    //     console.log("user not found pr accessToken expired || missing ") ;
    //     throw new ApiError(400 , "user not found") ;
    // }
    // const user = await User.findById(decoded._id).select("-password -refreshToken") ;  
    // if(!user){
    //     console.log("user not Found") ; 
    //     throw new ApiError(401 , "user not found") ; 
    // }
    // const email = user.email ; 
    // if(!email){
    //     console.log("email not found") ; 
    //     throw new ApiError(400 , "email not found") ; 
    // }


        cron.schedule("*/10 * * * * *", async ()=>{
         const dateNow = new Date() ; 
         const remainders = await REMAINDER.find({
            remind_at : {
                $gte : new Date(dateNow.getTime()-10000),
                $lte : dateNow } , 
            status : "pending" ,
         })

         for( const remainder of remainders){
               try {
                 
                const sender = await Transporter.sendMail({
                    from : '"uniBridge" <arpitno57@gmail.com>', 
                    to : remainder.email , 
                    subject : remainder.subject ,
                    text : remainder.custom_message , 
                })

                if(!sender){
                    throw new ApiError(401 , "Message not being send ") ; 
                }
                remainder.status = "sent" ; 
                remainder.sentAt = new Date() ; 
                await remainder.save(); 
                 console.log(`✅ Sent reminder to ${remainder.email}`);
               } catch (error) {
                 console.error("❌ Error sending reminder:", error);
               }
         }

        })
   




//     const info = await Transporter.sendMail({
//         from : '"uniBridhge" <arpitno57@gmail.com>' , 
//         to :  `${email}` , 
//         subject : "lemon rice khaye kya",
//         text : "hey order it by today" ,
//         html : "<h1>order now on zomato</h1>" , 
//     })

//     return res.status(200).json(new ApiResponse(201 , "email has been send")) 
// } 
// catch(error){
//     throw new ApiError(401 ,"email sending interuption " , error.message )
// }
// } )
  }

export default RemainderEmailService ; 


