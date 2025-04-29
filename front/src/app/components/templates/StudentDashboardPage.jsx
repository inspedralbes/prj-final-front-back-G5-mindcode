"use client";

import React, { useState, useEffect } from "react";
import SidebarStudent from "../../components/organisms/SidebarStudent";
import UserChat from "../../components/organisms/UserChat"; 
import GameCirclePanel from "../../components/organisms/GameCirclePanel"; 
import Navbar from "../../components/organisms/Navbar";
import { useAuthStore } from "stores/authStore";
import { sendMessage, getUserInfo } from "services/communicationManager";

const StudentDashboardPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [highlightedLanguage, setHighlightedLanguage] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [highlightedLanguageIndex, setHighlightedLanguageIndex] = useState(0);
  const [selectedSection, setSelectedSection] = useState(""); 

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
          if (!newMessages[highlightedLanguageIndex]) {
            newMessages[highlightedLanguageIndex] = { messages: [] };
          }
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
    setSelectedSection("chat");
    setHighlightedLanguageIndex(
      classInfo[0].language_info.findIndex((lang) => lang.id === language.id)
    );
  };

  const handleSelectGame = () => {
    setSelectedSection("jocs"); 
    setHighlightedLanguage(null); 
  };

  useEffect(() => {
    if (classInfo?.length > 0) {
      setIsClient(true);
      setMessages(classInfo[0].language_info.map(() => ({ messages: [] })));
      setHighlightedLanguage(null);
      setHighlightedLanguageIndex(0);
    }
  }, [classInfo]);

  useEffect(() => {
    getUserInfo();
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <SidebarStudent
        handleSetCurrentLanguage={handleSetCurrentLanguage}
        handleSelectGame={handleSelectGame}
      />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          {selectedSection === "chat" && highlightedLanguage ? (
            <UserChat
              language={highlightedLanguage}
              message={message}
              messages={messages[highlightedLanguageIndex]?.messages || []}
              handleSendMessage={handleSendMessage}
              handleChangeMessage={setMessage}
            />
          ) : selectedSection === "jocs" ? (
            <GameCirclePanel />
          ) : (
            <div className="text-gray-500 text-lg text-center">
              ✨ Selecciona un llenguatge o joc per començar ✨
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
