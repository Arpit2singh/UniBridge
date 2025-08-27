import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,  // every notification must have a recipient
    },
    content: {
      type: String,
      required: true,  // notification must have content
    },
    isRead: {
      type: Boolean,
      default: false,  // unread by default
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,  // optional: who generated this notification
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

export const Notification = mongoose.model(
  "Notification",
  NotificationSchema
);
