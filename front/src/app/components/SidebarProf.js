import React, { useState, useEffect, use } from "react";
import { getLanguages, createLanguage } from "services/communicationManager.js";
import { useAuthStore } from "../../stores/authStore";

const SidebarProf = ({ classId }) => {
  const [isLlenguatgesOpen, setIsLlenguatgesOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState("");
  const [showInput, setShowInput] = useState(false);
  const classInfo = useAuthStore((state) => state.class_info);

  useEffect(() => {
    async function fetchLanguages() {
      try {
        if (!classId) return;
        const data = await getLanguages(classId);
        setLanguages(data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    }

    fetchLanguages();
  }, [classId]);

  const handleAddLanguage = async () => {
    if (!newLanguage.trim()) return;

    try {
      const response = await createLanguage(newLanguage);
      setLanguages([...languages, response.name]); 
      setNewLanguage(""); 
      setShowInput(false); 
    } catch (error) {
      console.error("Error adding new languages:", error);
    }
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white w-1/4 h-full p-4 border-r border-gray-300 dark:border-gray-700">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 mx-auto mb-2"></div>
        <h2 className="text-lg font-semibold">PROFESSOR</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Admin</p>
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
                  <button
                    key={index}
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-left"
                  >
                    {lang}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No hi ha llenguatges
                </p>
              )}
              {!showInput ? (
                <button
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-2"
                  onClick={() => setShowInput(true)}
                >
                  ➕ Nou llenguatge
                </button>
              ) : (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-32 px-2 py-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                    placeholder="Llenguatge"
                  />
                  <button
                    onClick={handleAddLanguage}
                    className="px-1 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                  >
                    ✅
                  </button>
                  <button
                    onClick={() => {
                      setShowInput(false);
                      setNewLanguage("");
                    }}
                    className="px-1 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                  >
                    ❌
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <button className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-left">
          🎓​ Alumnes
        </button>
        <button className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-left">
          📊​ Estadísitques
        </button>
      </nav>
    </div>
  );
};

export default SidebarProf;
