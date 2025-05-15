import React, { useState, useEffect } from "react";
// import { useAuthStore } from '../../stores/authStore';

const URL = process.env.NEXT_PUBLIC_URL;
const Sidebar = ({classInfo, handleSetCurrentLanguage}) => {
  const [isLlenguatgesOpen, setIsLlenguatgesOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  // const classInfo = useAuthStore((state) => state.class_info);
  // const user_info = useAuthStore.getState().user_info

  useEffect(() => {
    if (classInfo) {
      if (classInfo[0]?.language_info && JSON.stringify(classInfo[0].language_info) !== JSON.stringify(languages)) {
        setLanguages(classInfo[0].language_info);
      }
      console.log(classInfo[0].language_info);
    }
  }, [classInfo]);

  const handleLanguageClick = async (language) => {
    console.log("Lenguaje seleccionado:", language);


    handleSetCurrentLanguage(language);
  };


  return (
    <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white w-1/4 h-full p-4 border-r border-gray-300 dark:border-gray-700">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 mx-auto mb-2"></div>
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
                languages.map((lang, index) => (
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
      </nav>
    </div>
  );
};

export default Sidebar;
