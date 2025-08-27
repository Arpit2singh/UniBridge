import mongoose from "mongoose" ; 
import dbName from "../constant.js";


const dbLogic = async ()=>{
    try{
         const mongooseInstance = mongoose.connect(`${process.env.URL}/${dbName}`) ; 
         console.log("db is connected") ; 
         console.log(`db is connected at the ${mongooseInstance.connection.host}`) ; 
    }
    catch(error){
       console.log("db not being connected") ; 
    }
}

export default dbLogic ; 