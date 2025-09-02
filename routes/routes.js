import { Router } from "express"; 
import express from "express" 
import {registerUser , loginuser , Logout , refreshAccessToken} from "../controllers/controller.js";
import upload from "../middleware/multer.js";
import verifyJwt from "../middleware/auth.middleware.js"; 
import emailService from "../controllers/email.controller.js";
import TwostepemailService from "../controllers/2-stepVerification.controller.js";
import verifier from "../controllers/verifyotp.controller.js";


const router = express.Router() ; 


router.route("/register").post(
    upload.single("avatar"),
    registerUser) ;

    router.route("/LoggedIn").post(loginuser) ; 
     router.route("/Logout").post( verifyJwt ,Logout) ; 
      router.route("/refreshToken").post( refreshAccessToken) ; 
       router.route("/emailgo").post(emailService) ; 
       router.route("/verifyUser").post(TwostepemailService)
       router.route("/verifier").post(verifier) ; 
    //    router.route('*' , (req ,res)=>{
    //     res.status(401).sendFile(__dirname + "backend\public\error404.html")
    //    })
export default router ;
