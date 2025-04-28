
"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UserChat from "../components/UserChat";
import { useAuthStore } from '../../stores/authStore';
import { sendMessage, getClassMain } from "services/communicationManager";


const Page = () => {
  const [isClient, setIsClient] = useState(false);
  const [highlitedLanguage, setHighlitedLanguage] = useState(null)
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [highlitedLanguageIndex, setHighlitedLanguageIndex] = useState(0);

  const classInfo = useAuthStore((state) => state.class_info);
  const userInfo = useAuthStore((state) => state.user_info);


  const handleSendMessage = async () => {
    console.log("MESSAGE BEING SENT");
    if (!message.trim()) return;

    const userMessage = { sender: 'user', text: message.trim() };

    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      console.log("index: ", highlitedLanguageIndex);
      console.log("New messages: ", newMessages);
      if (!newMessages[highlitedLanguageIndex]) {
        newMessages[highlitedLanguageIndex] = { messages: [] };
      }
      newMessages[highlitedLanguageIndex].messages.push(userMessage);
      return newMessages;
    })
    setMessage("");

    try {
      const response = await sendMessage({ message: message.trim(), class_id: classInfo[0].class_id, language_id: highlitedLanguage.id });
      console.log("Respuesta del servidor:", response);

      if (response) {
        const aiMessage = { sender: 'ai', text: response };
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          console.log("index: ", highlitedLanguageIndex);
          console.log("New messages: ", newMessages);
          if (!newMessages[highlitedLanguageIndex]) {
            newMessages[highlitedLanguageIndex] = { messages: [] };
          }
          newMessages[highlitedLanguageIndex].messages.push(aiMessage);
          return newMessages;
        })
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };
  const handleSetMessage = (message) => {
    setMessage(message);
  }

  const handleSetCurrentLanguage = (language) => {
    console.log(language);
    setHighlitedLanguage(language);
    setHighlitedLanguageIndex(classInfo[0].language_info.findIndex(lang => lang.id === language.id));

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
        if (message.languageId !== language.id) return; // Filter messages by languageId
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



  useEffect(() => {
    console.log("classInfo", classInfo);
    if (classInfo && classInfo.length > 0) {
<<<<<<< HEAD
      /*classInfo[0].language_info.forEach(language => {
        language.messages = [];
      });*/
=======
      // classInfo[0].language_info.forEach(language => {
      //   language.messages = [];
      // });

>>>>>>> e90a1c742b41bb378d1e04fd4007a76dcf1a6d95
      setIsClient(true);
      setHighlitedLanguage(classInfo[0].language_info[0])
      const parsedMessages = parseReceivedMessages(classInfo[0].language_info);
      setMessages(classInfo[0].language_info.map(lang => ({ messages: lang.messages })));
      setHighlitedLanguageIndex(0);
    }
  }, [classInfo]);

  useEffect(() => {
    getClassMain();
  }
    , []);

  if (!isClient) {
    return null;
  }
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Sidebar handleSetCurrentLanguage={handleSetCurrentLanguage} />
      <div className="flex flex-col w-full">
        <Navbar />
        <UserChat
          language={highlitedLanguage}
          message={message}
          messages={messages[highlitedLanguageIndex].messages}
          handleSendMessage={handleSendMessage}
          handleChangeMessage={handleSetMessage}
        />
      </div>
    </div>
  );
};

export default Page;