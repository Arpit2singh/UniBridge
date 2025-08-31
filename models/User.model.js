import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    username:{
        type:String , 
        required : true , 
    },
    fullname:{
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
    },
    twoStepVerify:{
        type:Boolean ,
    },
    twoStepOtp:{
        type:String,
        default:null , 
    },
    accessToken:{
        type:String , 
        
    },
    refreshToken:{
        type:String , 
         
    },
    
},{timestamps:true})

// 4 methods  ispasswordModified , isPasswordCorrect , generateRefreshToken , generateAccessToken .. 

 userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next() ; 
    this.password = await bcrypt.hash(this.password ,10) ; 
    next() ; 
 })

 userSchema.methods.isPasswordCorrect =  async function(password){
    return await bcrypt.compare(password , this.password) ; 
 }

 userSchema.methods.checkOtpVerify = async function(otp){
    return otp === twoStepOtp ; 
 }

 userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id , 
            email :  this.email ,
            username : this.username , 
            fullname : this.fullname , 

        } ,
        process.env.ACCESS_TOKEN_SECRET  , 
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY 
        }
    )
 }

 userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id , 

        },
        process.env.REFRESH_TOKEN_SECRET , 
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }

    )
 }

export const User = mongoose.model("User" , userSchema) ; 