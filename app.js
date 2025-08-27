import express, { urlencoded } from "express" ; 
import dotenv from "dotenv" ; 
import cors from "cors" 
import cookieParser from "cookie-parser";
import userRoutes from "./routes/routes.js";
dotenv.config({
    path: './.env' , 

})

const app = express() ;  

app.use(express.json({
    limit:"40kb" , 
}))

app.use(express.urlencoded({
      extended:true , 
      limit:"40kb"
}))

app.use(cors({
    origin : process.env.CORS ,
   credentials:true , 

}))

app.use(cookieParser()); 

app.use("api1/v1/UniBridge" , userRoutes) ; 

app.listen(process.env.PORT , (req ,res)=>{
    console.log(`server is running on the port ${process.env.PORT}` )
})

export default app ; 