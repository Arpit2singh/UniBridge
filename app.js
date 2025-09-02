import express, { urlencoded } from "express" ; 
import dotenv from "dotenv" ; 
import cors from "cors" 
import cookieParser from "cookie-parser";
import userRoutes from "./routes/routes.js";
import {fileURLToPath} from "url" ; 
import { dirname } from "path";
import path from "path";
dotenv.config({
    path: './.env' , 

})


const app = express() ;  

const _fileName = fileURLToPath(import.meta.url) ; 
const _dirName = path.dirname(_fileName) ;

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

app.use(express.static(path.join(_dirName, "public")));
app.use("/api1/v1/UniBridge" , userRoutes) ; 

app.use((req, res) => {
  res.status(404).sendFile(path.join(_dirName,  "public", "error404.html"));
});

app.listen(process.env.PORT , (req ,res)=>{
    console.log(`server is running on the port ${process.env.PORT}` )
})

export default app ; 