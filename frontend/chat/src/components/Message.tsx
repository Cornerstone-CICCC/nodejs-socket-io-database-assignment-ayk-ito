import React from "react";
import { ChatMessage } from "../types";

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const formattedTime = message.createdAt ? new Date(message.createdAt).toLocaleString() : "";

  return (
    <li className="message-item">
      <div className="message-header">
        <span className="username">{message.username}</span>
        {formattedTime && <span className="timestamp">{formattedTime}</span>}
      </div>
      <div className="message-content">{message.message}</div>
    </li>
  );
};

export default Message;
