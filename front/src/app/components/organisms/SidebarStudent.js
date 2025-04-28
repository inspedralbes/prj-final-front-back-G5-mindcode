"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import LanguageList from "../molecules/LanguageList";
import Button from "../atoms/Button";
import { useAuthStore} from "stores/authStore";


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

  const handleRedirect = () => {
    router.push('/StSettings');
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white w-1/4 h-full p-4 border-r border-gray-300 dark:border-gray-700">
      <div className="text-center mb-6">
        <Button onClick={handleRedirect} className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 mx-auto mb-2"></Button>
        <h2 className="text-lg font-semibold">ALUMNE</h2>
      </div>

      <nav className="space-y-4">
        <LanguageList 
          languages={languages} 
          onLanguageClick={handleSetCurrentLanguage} 
          isOpen={isLlenguatgesOpen} 
          toggleOpen={() => setIsLlenguatgesOpen(!isLlenguatgesOpen)}
        />
        <Button className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-left">
          🎮 Jocs
        </Button>
      </nav>
    </div>
  );
};

export default SidebarStudent;
