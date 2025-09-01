import { User } from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudianry from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { access } from "fs";
import jwt from "jsonwebtoken";
import TwostepemailService from "./2-stepVerification.controller.js";





const generateRefreshAccessToken = async function (UserId) {
    try {

        const user = await User.findById(UserId);
        console.log(user._id);
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { refreshToken, accessToken };
    }
    catch (error) {
        throw new ApiError(401, `refresh token and access Token not been generated `);
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullname, password, email, phoneNumber, gender , twoStep } = req.body;
    console.log(username);
    console.log(fullname);
    console.log(password);
    console.log(email);
    console.log(gender);
    console.log(phoneNumber); 
    console.log(twoStep) ; 
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
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(401, `user exist`)
    }
    else {
        console.log("user not exists proceeding the registration")

    }
    console.log(req.file);
    const avatarlocalPath = req.file?.path;
    console.log(avatarlocalPath);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("FILES:", req.files);


    if (!avatarlocalPath) {
        throw new ApiError(401, `avatar file required local path is missing `);
    }

    const avatar = await uploadOnCloudianry(avatarlocalPath);
    if (!avatar) {
        throw new ApiError(401, ` avatar path not found `);
    }
    console.log(username);
    console.log(password);
    console.log(email);
    console.log(fullname);

    const user = await User.create({
        username,
        fullname,
        email,
        password,
        phoneNumber,
        avatar: avatar.url,
        gender,
        twoStepVerify : twoStep 


    })
    console.log(password);
    console.log(user);

    const userSelected = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!userSelected) {
        throw new ApiError(401, "there is some error while registering ");
    }

    return res.status(200).json(
        new ApiResponse(201, "user Successfully registered")
    )

})

const loginuser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username),
        console.log(email),
        console.log(password);
  if (!username && !email) {
   throw new ApiError(401, "Either username or email is required");
}

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
      throw new ApiError(404, "User not exists");

    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");

    }

    //check two step verify .. ...
    const checktwoStepVerify = user.twoStepVerify;
    if (!checktwoStepVerify) { // no 
        const { refreshToken, accessToken } = await generateRefreshAccessToken(user._id);
        const LoggedInUser = await User.findById(user._id).select("-refreshToken  -password");
        const options = {
            httpOnly: true,
            secure: true,
        }
        return res.status(200).cookie("refreshToken", refreshToken, options).cookie("accessToken", accessToken, options).json(
            new ApiResponse(201, "user Loggedin SuccessFully", {
                user: accessToken, refreshToken, LoggedInUser
            })
        )
    }

    if (checktwoStepVerify) { // yes in 5 min
        const otp = Math.floor(1000 + Math.random() * 9000);
        user.twoStepOtp = otp;
        await user.save({ validateBeforeSave: false });
       

            // const sendingotp = async function () {
            //     const response = await fetch(`http://localhost:3000/api1/v1/UniBridge/verifyUser`, {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify({
            //             email: user.email,
            //             otp: otp,
            //         })
            //     })
            //     const data = await response.json() ; 
            //     return res.status(201).json(new ApiResponse(201 , "Api hit otp send on the mail" , data))
            // }
            // const sender = await sendingotp() ; 

            // verifying the otp inside the schema and after verifying maaking it null .. 
            // const correctStatus = async function () {
            //     const response = await fetch(`http://localhost:3000/api1/v1/UniBridge/verifier`,
            //         {
            //             method: "POST",
            //             headers: {
            //                 "Content-Type": "application/json",
            //             },
            //             body: JSON.stringify({
            //                 email: user.email,
            //                 otp: otp
            //             })
            //         }
            //     )
                
              
            // }
            //   const data = await sendingotp();

             const data =  await TwostepemailService(user.email , otp)

            
              return res.status(200).json(new ApiResponse(201 , " otp is send to your mail please verify", data))
                
           
            //generating Token Based on the verificationStatus  , 

          
        

    }

})

const Logout = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.body._id, {
        $set: {
            refreshToken: undefined
        }
    }, {
        new: true
    })

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(201, {}, "user Loggout SuccessFully"))
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized user detected , refreshToken");

    }
    try {

        const decodeToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodeToken._id);
        if (!user) {
            throw new ApiError(401, "unauthorized access , refresh token expired");

        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh Token expired or in use");
        }

        const { newRefreshToken, accessToken } = await generateRefreshAccessToken(user._id);
        const options = {
            httpOnly: true,
            secure: true,
        }

        return res.status(200).cookie("refreshToken", newRefreshToken, options).cookie("accessToken", accessToken, options).json(new ApiResponse(201, "Access token Refreshed ", {}))

    } catch (error) {
        throw new ApiError(401, "user not find invalid user ")
    }
})

const changePassword = asyncHandler(async (req, res) => {
    const { oldpassword, newpassword } = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldpassword);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password is wrong");
    }
    user.password = newpassword;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(201, {}, "Password change SuccessFully"));
})

const getUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(201, { user: req.user }, "User fetched Successfully"))
})

const updateAccountDetail = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body;
    if (!fullname || !email) {
        throw new ApiError(404, "All fields are required ");
    }
    const updateAccountDetail = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                email: email,
                fullname
            }
        }, {
        new: true
    }).select("-password");
    return res.status(200).json(new ApiResponse(201, "Account details updated ", updateAccountDetail))
})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(401, "no file found from the user ");
    }

    const avatar = await uploadOnCloudianry(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(401, "cloudinary upload unsuccessfull");
    }

    const updateAvatar = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                avatar: avatar.url
            }

        },
        { new: true }
    ).select("-password");
    return res.status(200).json(new ApiResponse(201, "Avatar change successFully"));
})


export { generateRefreshAccessToken, registerUser, loginuser, Logout, refreshAccessToken, changePassword, updateAccountDetail, updateAvatar, getUser }; 