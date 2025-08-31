import { User } from "../models/User.model.js"; 
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

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
    if(verificationStatus){
        const resetOtp = await User.findByIdAndUpdate(userId , {
            $set : {
                twoStepOtp : null 
            }
        })
    }

    return res.status(200).json({verificationStatus}) ; 

   
})
export default verifier ; 