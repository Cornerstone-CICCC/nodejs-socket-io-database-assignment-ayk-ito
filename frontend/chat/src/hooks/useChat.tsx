import { useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";
import { ChatMessage } from "../types";

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chat`);
        setMessages(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to retrieve messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Socket.IO event listener setup
  useEffect(() => {
    // Handle new message received
    socket.on("newMessage", (newMessage: ChatMessage) => {
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    });

    return () => {
      // Remove event listener when component unmounts
      socket.off("newMessage");
    };
  }, []);

  // Send message
  const sendMessage = (username: string, message: string) => {
    socket.emit("sendMessage", { username, message });
  };

  return { messages, loading, error, sendMessage };
};
