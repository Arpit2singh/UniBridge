import express from "express" ; 
import dotenv from "dotenv" ; 
import dbLogic from "./db/db.connection.js";
import app from "./app.js";

dotenv.config({
    path:"./.env",
})



// app.get('/' , (req , res)=>{
//     res.send("hey i am arpit") ; 
// })

// app.listen(process.env.PORT ,()=>{  
//     console.log(`server si lsistening on the host ${process.env.PORT}`)
// } )

dbLogic().then(app.listen(process.env.PORT , ()=>{
    console.log(`server is listening on the port ${process.env.PORT}` ) ; 
        console.log(`db is connected at the port http://localhost:${process.env.PORT}`) 


    })).catch((error)=>{
        console.log(error)
    })
