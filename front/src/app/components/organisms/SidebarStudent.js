"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import LanguageList from "../molecules/LanguageList";
import Button from "../atoms/Button";
import { useAuthStore } from "stores/authStore";
import { getUserImage } from '../../../services/communicationManager';

const SidebarStudent = ({ handleSetCurrentLanguage }) => {
  const [isLlenguatgesOpen, setIsLlenguatgesOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [userImage, setUserImage] = useState(null);
  const user_info = useAuthStore.getState().user_info;
  const router = useRouter();
  const pathname = usePathname();
  const classInfo = useAuthStore((state) => state.class_info);

  useEffect(() => {
    if (classInfo?.length > 0 && classInfo[0]?.language_info) {
      setLanguages(classInfo[0].language_info);
    }
  }, [classInfo]);

  const handleRedirect = () => router.push('/StSettings');
  const handleFormClick = () => router.push('/UserForm');
  const handleGoToGames = () => router.push('/Jocs');

  useEffect(() => {
    if (classInfo && classInfo.length > 0) {
      if (classInfo[0]?.language_info && JSON.stringify(classInfo[0].language_info) !== JSON.stringify(languages)) {
        setLanguages(classInfo[0].language_info);
      }
    }
  }, [classInfo]);

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const img = await getUserImage(user_info.userId);
        setUserImage(img);
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    fetchUserImage();
  }, [user_info]);

  return (
    <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white w-1/4 h-full p-4 border-r border-gray-300 dark:border-gray-700">
      <div className="text-center mb-6">
        <button  
          onClick={handleRedirect} 
          className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 mx-auto mb-2 overflow-hidden"
        >
          {userImage ? (
            <img
              src={userImage}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={user_info.photoURL}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          )}
        </button>
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
          className={`text-left p-5 w-full
            ${pathname === '/Jocs'
              ? 'bg-purple-700 text-white'
              : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'}`}
        >
          🎮 Jocs
        </Button>

        <Button 
          onClick={handleFormClick}
          className={`text-left p-5 w-full
            ${pathname === '/UserForm'
              ? 'bg-purple-700 text-white'
              : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'}`}
        >
          📝 Qüestionari
        </Button>
      </nav>
    </div>
  );
};

export default SidebarStudent;
