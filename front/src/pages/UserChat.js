'use client';

import React, { useState } from "react";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import { RiRobot3Line } from "react-icons/ri";
import { sendMessage, chargeMessages } from "services/communicationManager"; // Asegúrate de importar sendMessage
import MarkdownView from 'react-showdown';

const UserChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: 'user', text: message.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessage("");

    try {

      const response = await sendMessage({ text: message.trim() });
      console.log("Respuesta del servidor:", response);


      if (response) {
        const aiMessage = { sender: 'ai', text: response };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col pl-[20%] pr-[20%] bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 mx-auto">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 rounded-md">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <RiRobot3Line className="w-10 h-10 mr-2" />
            )}
            <div
              className={`px-4 py-2 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-700 text-white' : 'bg-gray-700 text-white'}`}
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
            >
              <MarkdownView
                markdown={msg.text}
                options={{ tables: true, emoji: true }}
              />
            </div>
            {msg.sender === 'user' && (
              <FaUserCircle className="w-10 h-10 ml-2" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <textarea
          placeholder="Escriu un missatge..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
        />
        <button
          onClick={handleSendMessage}  // Llamada correcta a handleSendMessage
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <FaPaperPlane className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default UserChat;


