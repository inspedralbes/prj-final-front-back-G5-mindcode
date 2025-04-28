"use client";

import React from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

const UserChat = ({ language, message, messages, handleSendMessage, handleChangeMessage }) => {
  return (
    <div className="flex flex-col flex-grow p-6 overflow-hidden">
      <div className="flex-grow overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 my-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white self-start'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <Input
          value={message}
          onChange={(e) => handleChangeMessage(e.target.value)}
          placeholder={`Escriu un missatge per ${language?.name || ''}...`}
        />
        <Button onClick={handleSendMessage} className="ml-2">
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default UserChat;
