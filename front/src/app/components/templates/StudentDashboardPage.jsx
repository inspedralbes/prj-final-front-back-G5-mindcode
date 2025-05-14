"use client";

import React, { useState, useEffect } from "react";
import SidebarStudent from "../../components/organisms/SidebarStudent";
import UserChat from "../../components/organisms/UserChat";
import Navbar from "../../components/organisms/Navbar";
import { useAuthStore } from "stores/authStore";
import { sendMessage, getClassMain } from "services/communicationManager";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentDashboardPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [highlightedLanguage, setHighlightedLanguage] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [highlightedLanguageIndex, setHighlightedLanguageIndex] = useState(0);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('showLanguages') === 'true') {
      setShowLanguageSelector(true);
      setHighlightedLanguage(null);
      setHighlightedLanguageIndex(-1);
    }
  }, []);
  const router = useRouter();
  const classInfo = useAuthStore((state) => state.class_info);
  const user_info = useAuthStore.getState().user_info;

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

  const checkUserRole = async () => {
      try {
        if (!user_info) {
          return;
        }
        if (user_info.role === 1) {
          sessionStorage.setItem("fromStudentDashboard", "true");
          router.push("/Login");

        }
      } catch (error) {
        console.error("Error checking user role:", error);
        router.push("/Login");  
      }
    };

  useEffect(() => {
    checkUserRole();
     }, [user_info]);

  const handleSetCurrentLanguage = (language) => {
    setHighlightedLanguage(language);
    setHighlightedLanguageIndex(
      classInfo[0].language_info.findIndex((lang) => lang.id === language.id)
    );
  };

  const parseReceivedMessages = (language_info) => {


    console.log("language_info: ", language_info);
    language_info.forEach(language => {

      let parsedMessages = [];

      let parsedLanguage = [];
      console.log("Language: ", language);

      language.messages.forEach(message => {
        console.log("Message: ", message);
        console.log("Language ID: ", language.id);
        if (message.languageId !== language.id) return; 
        const parsedMessage = {
          sender: "user",
          text: message.userContent,
        };
        parsedLanguage.push(parsedMessage);
        if (message.aiContent) {
          const aiMessage = {
            sender: "ai",
            text: message.aiContent,
          };
          parsedLanguage.push(aiMessage);
        }
      });
      parsedMessages.push(...parsedLanguage);

      console.log("Parsed messages: ", parsedMessages);

      language.messages = parsedMessages;

    })


    return null;
  };

  const handleOpenLanguageList = () => {
    setHighlightedLanguage(null); 
    setHighlightedLanguageIndex(-1); 
  };

  useEffect(() => {
    if (classInfo?.length > 0) {
      setIsClient(true);
      parseReceivedMessages(classInfo[0].language_info);
      setMessages(classInfo[0].language_info.map((lang) => ({ messages: lang.messages })));
    }
  }, [classInfo]);

  useEffect(() => {
    getClassMain();
  }, []);

  if (!isClient) return null;
 return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <SidebarStudent
        handleSetCurrentLanguage={handleSetCurrentLanguage}
        onOpenLanguageList={handleOpenLanguageList} 
      />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4">
          {highlightedLanguage ? (
            <UserChat
              language={highlightedLanguage}
              message={message}
              messages={messages[highlightedLanguageIndex]?.messages || []}
              handleSendMessage={handleSendMessage}
              handleChangeMessage={setMessage}
            />
          ) : (
            <div className="text-purple-500 dark:text-purple-300 text-lg text-center font-medium">
              ✨ Selecciona un llenguatge per començar ✨
            </div>
          )}
        </div>
      </div>
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
export default StudentDashboardPage;