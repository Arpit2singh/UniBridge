import express from "express" ; 
import dotenv from "dotenv" ; 

dotenv.config({
    path:"./.env",
})

const app = express() ; 

app.get('/' , (req , res)=>{
    res.send("hey i am arpit") ; 
})

app.listen(process.env.PORT ,()=>{  
    console.log(`server si lsistening on the host ${process.env.PORT}`)
} )