import mongoose from "mongoose" ; 
import { User } from "./User.model";
const VotingSchema = new mongoose.Schema({

    question:{
        type : String, 
    } ,
    options :{
        type : [String] , 
    } , 
    vote : [
        {
            user : mongoose.Schema.Types.ObjectId  , 
            ref: "User" , 
            required: true , 
        } ,
        {
             option : String ,
             required : true , 
        }
    ] , 
    createdBy :{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }

},{timestamps : true }) 

export const Voting = mongoose.model("Voting" , VotingSchema)
