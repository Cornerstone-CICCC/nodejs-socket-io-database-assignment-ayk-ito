import React from "react";
import Message from "./Message";
import { ChatMessage } from "../types";

interface ChatBoxProps {
  messages: ChatMessage[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  return (
    <div className="chat-box">
      <h2>Message History</h2>
      <ul className="message-list">
        {messages.map((msg, index) => (
          <Message key={msg._id || index} message={msg} />
        ))}
      </ul>
    </div>
  );
};

export default ChatBox;
