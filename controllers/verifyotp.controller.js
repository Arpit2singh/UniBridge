import { User } from "../models/User.model.js"; 
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateRefreshAccessToken } from "./controller.js";

const verifier = asyncHandler(async(req , res)=>{
    const {otp , email} = req.body ; 
    if(!otp || !email){
        throw new ApiError(401 , "all field required otp and email")
    }
   const user = await User.findOne({ email });

    if(!user){
          throw new ApiError(401 , "user not found during verifying otp ") ; 
    }
    const userId = user._id ; 
    // const userActualOtp = user.twoStepOtp ; 

    const verificationStatus = await user.checkOtpVerify(String(otp)) ; 
    if(!verificationStatus) {
        throw new ApiError(401 , "verification not Successfully") ; 
    }
    
      user.twoStepOtp = null ; 
      await user.save({validateBeforeSave : false}) ;
      
      const {refreshToken , accessToken} = await generateRefreshAccessToken(user._id) ;
      const LoggedInUser = await User.findById(user._id).select("-password -refreshToken")
      const options = {
        httpOnly : true , 
        secure : true  
      }

      return res.status(200).cookie("refreshToken" , refreshToken , options).cookie("accessToken" , accessToken , options).json(new ApiResponse(201 , "User Login Successfully" , {
        user : accessToken , refreshToken , 
      }))



    

    return res.status(200).json({verificationStatus}) ; 

   
})
export default verifier ; 