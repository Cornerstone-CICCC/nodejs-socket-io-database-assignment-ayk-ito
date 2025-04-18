import express from "express";
import chatController from "../controllers/chat.controller";

const chatRouter = express.Router();

// Get all chat messages
chatRouter.get("/", chatController.getAllChats);
// Get chat messages by room
chatRouter.get("/room/:room", chatController.getMessagesByRoom);

export default chatRouter;
