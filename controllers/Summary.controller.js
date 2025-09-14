import { SUMMARY } from "../models/Summary.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const createSession = async()=>{
    try {
        const appname = "manager" ;
        const userId = "test-user"
        const sessionResponse = await fetch(`https://unibridge-agent.onrender.com/apps/${appname}/users/${userId}/sessions` , {
            method : "POST" , 
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify({}) 
        }) 

        if(!sessionResponse.ok){
          throw new ApiError(401 , "error while making the session")
        } 
        const sessionData = await sessionResponse.json() ;
        const sessionId =  sessionData.id || sessionData.sessionId
        return sessionId    
    } catch (error) {
        throw new ApiError(401 , "error occured while creating the session" , error) ; 
    }
}

const summary = asyncHandler(async(req , res)=>{
    const {question} = req.body  ;
    
const sessionId = await createSession() ; 
console.log(sessionId)
     const response = await fetch("https://unibridge-agent.onrender.com/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appName: "manager",      
        userId: "test-user",     
        sessionId,               // 👈 proper session
        newMessage: {
          parts: [{ text: question }],
          role: "user"
        },
        streaming: false
      }),
    });
     
    if(!response.ok){
        throw new ApiError(401, "not able to catchup the resonse formthe agent ") ; 

    }
    let responseData;
try {
  responseData = await response.json();
} catch (err) {
  responseData = await response.text();
}


    // return res.status(201).json(new ApiResponse(201 , "data fetched Successfully from the agent", responseData))
    
    const summary = responseData
  .map(item => item.content?.parts?.[0]?.text)
  .filter(Boolean)
  .pop();

console.log("Summary:", summary);

    const summarycreation = await SUMMARY.create({
        summary
    }) 
    
    if(!summarycreation){
        throw new ApiError(401 , " summary not been inserted inside the db ")
    }
    
    return res.status(201).json(new ApiResponse( summary), {
        summary : summary
    }) ;


})
export default summary ;