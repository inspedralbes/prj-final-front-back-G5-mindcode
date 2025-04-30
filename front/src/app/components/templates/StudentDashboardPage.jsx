"use client";

import React, { useState, useEffect } from "react";
import SidebarStudent from "../../components/organisms/SidebarStudent";
import UserChat from "../../components/organisms/UserChat";
import Navbar from "../../components/organisms/Navbar";
import { useAuthStore } from "stores/authStore";
import { sendMessage, getUserInfo } from "services/communicationManager";

const StudentDashboardPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [highlightedLanguage, setHighlightedLanguage] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [highlightedLanguageIndex, setHighlightedLanguageIndex] = useState(0);

  const classInfo = useAuthStore((state) => state.class_info);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message.trim() };
    setMessages((prev) => {
      const newMessages = [...prev];
      if (!newMessages[highlightedLanguageIndex]) {
        newMessages[highlightedLanguageIndex] = { messages: [] };
      }
      newMessages[highlightedLanguageIndex].messages.push(userMessage);
      return newMessages;
    });
    setMessage("");

    try {
      const response = await sendMessage({
        message: message.trim(),
        class_id: classInfo[0].class_id,
        language_id: highlightedLanguage.id,
      });
      if (response) {
        const aiMessage = { sender: "ai", text: response };
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[highlightedLanguageIndex].messages.push(aiMessage);
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSetCurrentLanguage = (language) => {
    setHighlightedLanguage(language);
    setHighlightedLanguageIndex(
      classInfo[0].language_info.findIndex((lang) => lang.id === language.id)
    );
  };

  useEffect(() => {
    if (classInfo?.length > 0) {
      setIsClient(true);
      setMessages(classInfo[0].language_info.map(() => ({ messages: [] })));
    }
  }, [classInfo]);

  useEffect(() => {
    getUserInfo();
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <SidebarStudent handleSetCurrentLanguage={handleSetCurrentLanguage} />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          {highlightedLanguage ? (
            <UserChat
              language={highlightedLanguage}
              message={message}
              messages={messages[highlightedLanguageIndex]?.messages || []}
              handleSendMessage={handleSendMessage}
              handleChangeMessage={setMessage}
            />
          ) : (
            <div className="text-gray-500 text-lg text-center">
              ✨ Selecciona un llenguatge per començar ✨
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
