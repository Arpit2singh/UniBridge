import mongoose from "mongoose" ; 
import { User } from "./User.model.js";
const feedbackSchema = new mongoose.Schema({
    name : {
        type :String,
        required : true,
    },
    message:{
        type : String , 
        required : true  , 
    } , 
     email:{
        type : String , 
        required : true  , 
    } , 
} , {timestamps:true})

export const Feedback = mongoose.model("Feedback" , feedbackSchema) ; 