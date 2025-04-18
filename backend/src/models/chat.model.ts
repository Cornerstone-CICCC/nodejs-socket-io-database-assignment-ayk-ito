import mongoose from "mongoose";

export interface IChat extends Document {
  username: string;
  message: string;
  room?: string;
  createdAt: Date;
}

const ChatSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    message: { type: String, required: true },
    room: { type: String },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", ChatSchema);
