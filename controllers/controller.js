import { User } from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudianry from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { access } from "fs";
import jwt from "jsonwebtoken" ;





const generateRefreshAccessToken = async function(UserId){
    try{

        const user = await User.findById(UserId) ; 
        console.log(user._id) ; 
        const refreshToken = user.generateRefreshToken() ; 
        const accessToken = user.generateAccessToken() ; 
        user.refreshToken = refreshToken ; 
        await user.save({validateBeforeSave : false}) 
        return {refreshToken , accessToken} ;  
    }
    catch(error){
        throw new ApiError(401 , `refresh token and access Token not been generated `) ; 
    }
}

const registerUser = asyncHandler(async(req , res)=>{
    const {username , fullname , password , email  , phoneNumber , gender} = req.body ; 
    console.log(username) ; 
    console.log(fullname) ; 
    console.log(password) ; 
    console.log(email) ; 
     console.log(gender) ; 
      console.log(phoneNumber) ; 
       if (username === "") {
        throw new ApiError(101, "userName is empty ")
    }
    if (email === "") {
        throw new ApiError(101, "email is empty ")
    }
    if (password === "") {
        throw new ApiError(101, "password is empty ")
    }
    if (fullname === "") {
        throw new ApiError(101, "fullName is empty ")
    }

    const existedUser = await User.findOne({
        $or : [{username},{email}] 
    })
    
    if(existedUser) {
        throw new ApiError(401 , `user exist`)
    }
    else{
        console.log("user not exists proceeding the registration") 

    }
    console.log(req.file) ; 
    const avatarlocalPath = req.file?.path ; 
    console.log(avatarlocalPath) ; 
    console.log("BODY:", req.body);
console.log("FILE:", req.file);
console.log("FILES:", req.files);

    
    if(!avatarlocalPath){
        throw new ApiError(401 , `avatar file required local path is missing `) ; 
    }

    const avatar = await uploadOnCloudianry(avatarlocalPath) ; 
    if(!avatar){
        throw new ApiError(401 , ` avatar path not found `) ; 
    }
    console.log(username);
    console.log(password);
    console.log(email);
    console.log(fullname);
    
    const user = await User.create({
        username , 
        fullname , 
        email , 
        password , 
        phoneNumber,
        avatar : avatar.url ,
        gender,


    })
    console.log(password);
    console.log(user);

    const userSelected = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    if(!userSelected){
        throw new ApiError(401 , "there is some error while registering ") ; 
    }
    
    return res.status(200).json(
        new ApiResponse(201 , "user Successfully registered") 
    )

})

const loginuser = asyncHandler(async(req , res)=>{
    const {username , email , password} = req.body ; 
    console.log(username) ,
    console.log(email) , 
    console.log(password) ;
    if(!username && !email){
        throw new ApiError(401 , "username and email not exists") ;
    }
    const user = await User.findOne({
        $or : [{username} , {email}]
    })

    if(!user){
        throw new ApiError("user not Exists") ; 
    }
    const isPasswordValid = await user.isPasswordCorrect(password) ; 
    if(!isPasswordValid){
        throw new ApiError(404 , "password is wrong user not exists") ; 
    }
    const {refreshToken , accessToken} = await generateRefreshAccessToken(user._id) ; 
    const LoggedInUser = await User.findById(user._id).select("-refreshToken  -password") ; 
    const options = {
        httpOnly : true  , 
        secure : true  , 
    }

    return res.status(200).cookie("refreshToken" , refreshToken , options).cookie("accessToken", accessToken , options).json(
        new ApiResponse(201 , {
            user : accessToken , refreshToken , LoggedInUser
        }, "user Loggedin SuccessFully") 
    )

}) 

const Logout = asyncHandler(async(req,res)=>{
    const user = await User.findByIdAndUpdate(req.body._id , {
        $set :{
            refreshToken : undefined 
        }
    },{
        new : true  
    })
    
    const options = {
    httpOnly : true  , 
    secure : true  ,
}

  return res.status(200).clearCookie("accessToken" , options).clearCookie("refreshToken" , options).json(new ApiResponse(201 , {} , "user Loggout SuccessFully"))
})


const refreshAccessToken = asyncHandler(async(req , res)=>{

})

export  {registerUser ,loginuser , Logout} ; 