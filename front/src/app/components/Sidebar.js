import React, { useState, useEffect } from "react";
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'next/navigation';
import { checkQuizAvailability } from '../../services/communicationManager';

const URL = process.env.NEXT_PUBLIC_URL;
const Sidebar = ({handleSetCurrentLanguage}) => {
  const [isLlenguatgesOpen, setIsLlenguatgesOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [isQuizAvailable, setIsQuizAvailable] = useState(false);
  const [quizAvailable, setQuizAvailable] = useState(false);
  const user_info = useAuthStore.getState().user_info
  const router = useRouter();
  const classInfo = useAuthStore((state) => state.class_info);

  useEffect(() => {
    if (classInfo && classInfo.length > 0) {
      if (classInfo[0]?.language_info && JSON.stringify(classInfo[0].language_info) !== JSON.stringify(languages)) {
        setLanguages(classInfo[0].language_info);
      }
    }
  }, [classInfo]);

  const checkForQuiz = async () => {
    try {
      const data = await checkQuizAvailability();
      setQuizAvailable(data.quizAvailable);
      setIsQuizAvailable(data.quizAvailable);
    } catch (error) {
      console.error('Error checking quiz:', error);
    }
  };

  useEffect(() => {
    checkForQuiz();

    const interval = setInterval(checkForQuiz, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLanguageClick = async (language) => {
    console.log("Lenguaje seleccionado:", language);
    handleSetCurrentLanguage(language);
  };

  const handleRedirect = async () => {
    router.push('/StSettings');
  }
  const handleFormClick = () => {
    router.push('/UserForm'); 
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white w-1/4 h-full p-4 border-r border-gray-300 dark:border-gray-700">
      <div className="text-center mb-6">
        <button 
          className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 mx-auto mb-2"
          onClick={handleRedirect}
        ></button>
        <h2 className="text-lg font-semibold">ALUMNE</h2>
      </div>
      <nav className="space-y-4">
        <div>
          <button
            className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-left"
            onClick={() => setIsLlenguatgesOpen(!isLlenguatgesOpen)}
          >
            📄 Llenguatges
          </button>
          {isLlenguatgesOpen && (
            <div className="ml-4 mt-2 space-y-2">
              {languages.length > 0 ? (
                languages.filter((language) => language.isActive).map((lang, index) => (
                  <button key={index} onClick={() => handleLanguageClick(lang)} className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-left">
                    {lang.name}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No hi ha llenguatges</p>
              )}
            </div>
          )}
        </div>
        <button className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-left">
          🎮 Jocs
        </button>
        <button className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-left">
          ⚙️ Configuració
        </button>
        <button 
          onClick={handleFormClick}
          disabled={!isQuizAvailable}
          className={`w-full px-4 py-2 rounded-md text-left flex items-center justify-between ${isQuizAvailable ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50'}`}
        >
          <span>📝 Qüestionari</span>
          {isQuizAvailable && <span className="animate-pulse text-yellow-300">⚡</span>}
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
