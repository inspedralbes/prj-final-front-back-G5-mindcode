'use client';

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UserForm from '../components/UserForm';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from "next/navigation";

const ChatForm = (questions,loading,setLoading,handleAnswerSelect,handleSubmit,error,selectedAnswers,results) => {

    const classInfo = useAuthStore((state) => state.class_info);
    const [highlitedLanguage, setHighlitedLanguage] = useState(null);
    const [highlitedLanguageIndex, setHighlitedLanguageIndex] = useState(0);
    const router = useRouter();

  const handleSetCurrentLanguage = (language) => {
    console.log(language);
    setHighlitedLanguage(language);
    setHighlitedLanguageIndex(classInfo[0].language_info.findIndex(lang => lang.id === language.id));
    router.push("/StPage");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Sidebar classInfo={classInfo} handleSetCurrentLanguage={handleSetCurrentLanguage} />
      <div className="flex flex-col w-full">
        <Navbar />
        <UserForm
          questions={questions} 
          handleAnswerSelect={handleAnswerSelect}
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

export default ChatForm;