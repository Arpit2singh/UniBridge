import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken" ; 
import asyncHandler from "../utils/asyncHandler.js"; 
import ApiError from "../utils/ApiError.js";



const verifyJwt = asyncHandler(async(req ,res ,next)=>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer " , "");
        if(!token){
            throw new ApiError(401 , "unauthorized  user") ; 
        }
        if(!token || typeof token !== "string"){
            throw new ApiError(401 , "token not found") ; 
        }
        const decodeToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET) ; 
        const user = await User.findById(decodeToken._id).select("-password -refreshToken") ; 
        if(!user){
            throw new ApiError(404 , "invalid accessToken") ; 
        }
        req.user = user ; 
        next() ; 

    }
    catch(error){
        throw new ApiError(401 , `${error.message}` || `Jwt middleWare error` )
    }
})

export default verifyJwt ; 