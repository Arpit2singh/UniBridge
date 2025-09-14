
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Feedback } from "../models/Feedback.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const feedback = asyncHandler(async(req ,res)=>{
    const  {name , email , message} = req.body
    console.log(name) 
     console.log(email) 
     console.log(message)
    const feedbackInsertion = await Feedback.create({
        name : name ,
         email : email  ,
          message : message , 
    })
    
    if(!feedbackInsertion) {
        throw new ApiError(401 , " feedback data cannot be inserted inside the db") ; 
    }
    return res.status(201).json(new ApiResponse(201 , "data successfully stored inside the db ")) ; 
}) 

export default feedback ; 