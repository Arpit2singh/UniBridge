import mongoose from "mongoose";

const summarySchema = mongoose.Schema({
    summary : {
        type : String , 
    }
})

export const SUMMARY = mongoose.model("SUMMARY" , summarySchema) ; 