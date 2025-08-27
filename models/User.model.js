import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username:{
        type:String , 
        required : true , 
    },
    name:{
        type:String ,
        required:true ,
    },
    phoneNumber:{
        type : Number , 
        required:true ,
    },
    email:{
        type:String , 
        required : true ,
    },
    gender:{
        type:String , 
        enum:["male", "female" , "other"] , default:"student"
    },
    avatar:{
        type:String , 
        required:true , 
    },
    password:{
        type:String , 
        required:true , 
    }
},{timestamps:true})

export const User = mongoose.model("User" , userSchema) ; 