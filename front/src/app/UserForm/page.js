'use client';

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UserForm from '../components/UserForm';
import { useAuthStore } from '../../stores/authStore';
const ChatForm = (questions,loading,setLoading,handleAnswerSelect,handleSubmit,error,selectedAnswers,results) => {
  const { classInfo, handleSetCurrentLanguage } = useAuthStore();

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