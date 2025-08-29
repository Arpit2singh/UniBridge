import { Router } from "express"; 
import express from "express" 
import {registerUser , loginuser , Logout} from "../controllers/controller.js";
import upload from "../middleware/multer.js";
import verifyJwt from "../middleware/auth.middleware.js";
const router = express.Router() ; 

router.route("/register").post(
    upload.single("avatar"),
    registerUser) ;

    router.route("/LoggedIn").post(loginuser) ; 
     router.route("/Logout").post( verifyJwt ,Logout) ; 
     
export default router ;
