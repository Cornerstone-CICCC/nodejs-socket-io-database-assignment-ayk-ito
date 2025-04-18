import { Server, Socket } from "socket.io";
import { Chat } from "../models/chat.model";

const setupChatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join room
    socket.on("joinRoom", ({ room, username }) => {
      socket.join(room);
      socket.to(room).emit("message", `${username} has joined the room`);
    });

    // Leave room
    socket.on("leaveRoom", ({ room, username }) => {
      socket.to(room).emit("message", `${username} has left the room`);
      socket.leave(room);
    });

    // Send message
    socket.on("sendMessage", async (data) => {
      const { username, message, room } = data;

      try {
        // Save message to database
        const chat = new Chat({ username, message, room });
        await chat.save();

        if (room) {
          // Send message to specific room
          io.to(room).emit("newMessage", chat);
        } else {
          // Send to everyone
          io.emit("newMessage", chat);
        }
      } catch (error) {
        console.error("Error saving chat:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default setupChatSocket;
