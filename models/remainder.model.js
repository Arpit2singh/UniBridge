import mongoose from "mongoose";

const remainderSchema = new mongoose.Schema(
    {
 email: {
    type: String, // or ObjectId if you're linking with Users collection
    required: true
  },
  task: {
    type: String,
    required: true
  },
  remind_at: {
    type: Date,
    required: true
  },
  custom_message: {
  type: String,
  required: false // ✅ make optional
},

  status: {
    type: String, 
    enum: ["pending", "sent", "failed"],
    default: "pending"
  },
  subject: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  sentAt: {
    type: Date
  }
    }, {timestamps : true})

 export const REMAINDER = mongoose.model("REMAINDER",remainderSchema)