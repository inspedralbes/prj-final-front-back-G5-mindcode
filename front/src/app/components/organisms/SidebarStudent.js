"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import LanguageList from "../molecules/LanguageList";
import Button from "../atoms/Button";
import LoadingScreen from "../LoadingScreen";
import { useAuthStore } from "stores/authStore";
import { getUserImage, checkQuizAvailability } from '../../../services/communicationManager';

const SidebarStudent = ({ handleSetCurrentLanguage,onOpenLanguageList }) => {
  const [isLlenguatgesOpen, setIsLlenguatgesOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [userImage, setUserImage] = useState(null);
  const [isQuizAvailable, setIsQuizAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  const user_info = useAuthStore.getState().user_info;
  const router = useRouter();
  const pathname = usePathname();
  const classInfo = useAuthStore((state) => state.class_info);

  useEffect(() => {
    if (classInfo?.length > 0 && classInfo[0]?.language_info) {
      setLanguages(classInfo[0].language_info);
    }
  }, [classInfo]);

  const handleRedirect = () =>{
    setLoading(true);
    router.push('/StSettings');

  };
  const handleFormClick = () => {
    setLoading(true); 
    router.push('/UserForm'); 
  };
  const handleGoToGames = () =>{
    setLoading(true); 
    router.push('/Jocs');
  } 


  useEffect(() => {
    if (classInfo?.length > 0 && classInfo[0]?.language_info) {
      setLanguages(classInfo[0].language_info);
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

  useEffect(() => {
    const checkForQuiz = async () => {
      try {
        const data = await checkQuizAvailability();
        setIsQuizAvailable(data.quizAvailable);
      } catch (error) {
        console.error('Error checking quiz:', error);
      }
    };

    checkForQuiz();
    const interval = setInterval(checkForQuiz, 10000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white w-1/4 relative h-full p-4 border-r border-gray-300 dark:border-gray-700">
      {loading && <LoadingScreen />} 

      <div className="text-center mb-6">
        <button  
          onClick={handleRedirect} 
          className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-1  00 hover:bg-purple-500 dark:hover:bg-purple-600 mx-auto mb-2 overflow-hidden transition-colors duration-300 border-2 border-purple-400 dark:border-purple-500"
        >
          {userImage ? (
            <img src={userImage} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <img
              src={user_info?.photoURL? user_info.photoURL : '/default-avatar.png'}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          )}
        </button>
        <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">ALUMNE</h2>
      </div>

      <nav className="space-y-4">
        <LanguageList 
          languages={languages.filter(lang => lang.isActive)} 
          onLanguageClick={handleSetCurrentLanguage} 
          isOpen={isLlenguatgesOpen} 
          toggleOpen={() => {
            if (pathname !== '/StPage') {
              setLoading(true);
              router.push('/StPage');
            } else {
              setIsLlenguatgesOpen(!isLlenguatgesOpen);
            }
          }}
        />

        <Button 
          onClick={handleGoToGames}
          className={`text-left p-4 w-full rounded-lg font-medium transition-all ${
            pathname === '/Jocs'
            ? 'bg-gradient-to-r from-cyan-900 to-fuchsia-900 hover:from-cyan-700 hover:to-fuchsia-700 text-white shadow-lg'
            : 'bg-gradient-to-r from-cyan-900 to-fuchsia-900 hover:from-cyan-700 hover:to-fuchsia-700 text-white'
          }`}
        >
          🎮 Jocs
        </Button>

        <button 
          onClick={handleFormClick}
          disabled={!isQuizAvailable}
          className={`w-full px-4 py-3 rounded-lg text-left flex items-center justify-between font-medium transition-all ${
            isQuizAvailable
              ? 'bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg'
              : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50'
          }`}
        >
          <span>📝 Qüestionari</span>
          {isQuizAvailable && <span className="animate-pulse text-yellow-300">⚡</span>}
        </button>
      </nav>
    </div>
  );
};

export default SidebarStudent;