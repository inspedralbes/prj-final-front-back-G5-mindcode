"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import LanguageList from "../molecules/LanguageList";
import Button from "../atoms/Button";
import { useAuthStore } from "stores/authStore";

const SidebarStudent = ({ handleSetCurrentLanguage }) => {
  const [isLlenguatgesOpen, setIsLlenguatgesOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const router = useRouter();
  const classInfo = useAuthStore((state) => state.class_info);

  useEffect(() => {
    if (classInfo?.length > 0 && classInfo[0]?.language_info) {
      setLanguages(classInfo[0].language_info);
    }
  }, [classInfo]);

  const handleRedirect = () => router.push('/StSettings');
  const handleFormClick = () => router.push('/UserForm');
  const handleGoToGames = () => router.push('/Jocs');

  return (
    <div className="w-1/6 h-full p-4 border-r border">
      <div className="text-center mb-6">
        <Button  
          onClick={handleRedirect} 
          className="w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-2 text-3xl"
        >
          👤
        </Button>
        <h2 className="text-lg font-semibold">ALUMNE</h2>
      </div>

      <nav className="space-y-4">
        <LanguageList 
          languages={languages} 
          onLanguageClick={handleSetCurrentLanguage} 
          isOpen={isLlenguatgesOpen} 
          toggleOpen={() => setIsLlenguatgesOpen(!isLlenguatgesOpen)}
        />

        <Button 
          onClick={handleGoToGames}
          className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-left p-5"
        >
          🎮 Jocs
        </Button>

        <Button 
          onClick={handleFormClick}
          className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-left p-5"
        >
          📝 Qüestionari
        </Button>
      </nav>
    </div>
  );
};

export default SidebarStudent;
