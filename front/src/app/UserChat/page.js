
import React from "react";
import UserChat from "../components/UserChat";

const ChatPage = (language, message, messages, handleSendMessage, handleSetMessage) => {
  return (
    <div className="w-full h-full">
      <UserChat language={language} message={message} messages={messages} handleSendMessage={handleSendMessage} handleSetMessage={handleSetMessage} />
    </div>
  );
};

export default ChatPage;

