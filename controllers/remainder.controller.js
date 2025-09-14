import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { REMAINDER } from "../models/remainder.model.js";
import ApiError from "../utils/ApiError.js";

// ✅ Helper to create or reuse session
const getSessionId = async () => {
  try {
    const appName = "manager";
    const userId = "test-user";
    
    // Create a new session
    const sessionResponse = await fetch(`https://unibridge-agent.onrender.com/apps/${appName}/users/${userId}/sessions` , {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}) // optional: can pass initial state here
    });

    if (!sessionResponse.ok) {
      throw new Error("Failed to create session: ${sessionResponse.status}");
    }

    const sessionData = await sessionResponse.json();
    return sessionData.sessionId || sessionData.id || "temp-session"; // depends on agent response structure
  } catch (err) {
    console.error("❌ Session creation failed:", err);
    return "temp-session"; // fallback random session
  }
};

const remainder = asyncHandler(async (req, res) => {
  const { question } = req.body;

  try {
    const sessionId = await getSessionId();
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

    if (!response.ok) {
      throw new ApiError(response.status, "Agent API request failed");
    }

    const text = await response.text();
    console.log("🟢 Raw Agent Response:", text);
   


    let data;
    try {
      data = JSON.parse(text);
     
    } catch (err) {
      console.error("❌ Failed to parse agent response:", err);
      return res.status(200).json(
        new ApiResponse(200, "Agent raw reply (not JSON)", { raw: text })
      );
    }
     const parsedInnerText = JSON.parse(data[2].content.parts[0].text);
    // ✅ Store in DB if schema exists
    if (parsedInnerText.email && parsedInnerText.task && parsedInnerText.remind_at) {
      const remainderData = await REMAINDER.create({
        email: parsedInnerText.email,
        task: parsedInnerText.task,
        remind_at: parsedInnerText.remind_at,
        custom_message: parsedInnerText.custom_message || "No message",
        status: parsedInnerText.status || "pending",
        subject: parsedInnerText.subject || "Reminder",
        sentAt: parsedInnerText.sentAt || null,
      });
      if(!remainderData){
        throw new ApiError(401 , "Data is not being stored in the database") 
      }else{
        console.log("data is stored in the data base done done")
      }
      return res.status(201).json(
        new ApiResponse(201, "Data successfully stored in the database", remainderData)
      );
    }

    // ✅ Otherwise return raw agent reply
    return res.status(200).json(
      new ApiResponse(200, "Answer from the agent", data)
    );

  } catch (error) {
    console.error("❌ Error in remainder controller:", error);
    return res.status(500).json(
      new ApiResponse(500, error.message || "Something went wrong", null)
    );
  }
});

export default remainder;