"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = require("../models/chat.model");
const setupChatSocket = (io) => {
    io.on("connection", (socket) => {
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
        socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { username, message, room } = data;
            try {
                // Save message to database
                const chat = new chat_model_1.Chat({ username, message, room });
                yield chat.save();
                if (room) {
                    // Send message to specific room
                    io.to(room).emit("newMessage", chat);
                }
                else {
                    // Send to everyone
                    io.emit("newMessage", chat);
                }
            }
            catch (error) {
                console.error("Error saving chat:", error);
            }
        }));
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
exports.default = setupChatSocket;
