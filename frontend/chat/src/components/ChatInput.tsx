import React, { useState } from "react";

interface ChatInputProps {
  onSendMessage: (username: string, message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !message.trim()) return;

    onSendMessage(username, message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="chat-form">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default ChatInput;
