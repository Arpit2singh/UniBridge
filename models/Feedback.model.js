import mongoose from "mongoose" ; 
import { User } from "./User.model";
const feedbackSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User" 
    },
    message:{
        type : String , 
        required : true  , 
    } , 
     rating:{
        type : Number , 
        required : true  , 
    } , 
} , {timestamps:true})

export const Feedback = mongoose.model("Feedback" , feedbackSchema) ; 