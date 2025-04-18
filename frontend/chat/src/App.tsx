import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "./socket";
import "./App.css";

interface ChatMessage {
  _id?: string;
  username: string;
  message: string;
  room?: string;
  createdAt?: string;
}

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  const rooms = ["room1", "room2", "room3"];

  // Load initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedRoom) {
        try {
          const response = await axios.get(
            `${
              process.env.REACT_APP_API_URL || "http://localhost:3500"
            }/api/chat/room/${selectedRoom}`
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      } else {
        setMessages([]);
      }
    };
    fetchMessages();
  }, [selectedRoom]);

  // Socket.io event listeners
  useEffect(() => {
    socket.on("newMessage", (newMessage: ChatMessage) => {
      if (selectedRoom && newMessage.room === selectedRoom) {
        setMessages((prev) => [newMessage, ...prev]);
      }
    });

    socket.on("message", (msg: string) => {
      setSystemMessage(msg);
      setTimeout(() => {
        setSystemMessage(null);
      }, 10000);
    });

    return () => {
      socket.off("newMessage");
      socket.off("message");
    };
  }, [selectedRoom]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !message.trim() || !selectedRoom) return;

    socket.emit("sendMessage", {
      username,
      message,
      room: selectedRoom,
    });

    setMessage("");
  };

  const joinRoom = (room: string) => {
    if (!username) {
      alert("Please enter a username");
      return;
    }

    // Leave previous room
    if (selectedRoom) {
      socket.emit("leaveRoom", { room: selectedRoom, username });
    }

    // Join new room
    socket.emit("joinRoom", { room, username });
    setSelectedRoom(room);
    setMessages([]);
    setSystemMessage(null);
  };

  const leaveRoom = () => {
    if (selectedRoom) {
      socket.emit("leaveRoom", { room: selectedRoom, username });
      setSelectedRoom(null);
      setMessages([]);
      setSystemMessage(null);
    }
  };

  return (
    <div className="app-container">
      <div className="user-input">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="room-selector">
        <h3>Select Room</h3>
        <div className="room-buttons">
          {rooms.map((room) => (
            <button
              key={room}
              onClick={() => joinRoom(room)}
              className={selectedRoom === room ? "active" : ""}
            >
              {room}
            </button>
          ))}

          {selectedRoom && (
            <button onClick={leaveRoom} className="leave-button">
              Leave
            </button>
          )}
        </div>
      </div>
      {systemMessage && (
        <div className="system-messages">
          <div className="system-message">{systemMessage}</div>
        </div>
      )}
      {selectedRoom ? (
        <div className="chat-container">
          <h2>Conversation in {selectedRoom}</h2>

          <div className="messages">
            <ul>
              {messages.map((msg, index) => (
                <li key={msg._id || index} className="message">
                  <strong>{msg.username}:</strong> {msg.message}
                  {msg.createdAt && (
                    <span className="timestamp">{new Date(msg.createdAt).toLocaleString()}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      ) : (
        <div className="no-room-selected">
          <h2>Please select a room</h2>
        </div>
      )}{" "}
    </div>
  );
}

export default App;
