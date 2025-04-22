import React, { useState, useEffect } from "react";
import { getLanguages, addLanguageToClass, createLanguage, deleteLanguage } from "services/communicationManager.js";
import { useAuthStore } from "../../stores/authStore";

const SidebarProf = ({changeSelectedField, changeSelectedClass}) => {
  const [openClassId, setOpenClassId] = useState(null);
  const [newLanguage, setNewLanguage] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isLlenguatgesOpen, setIsLlenguatgesOpen] = useState(false);
  const [isAlumnesOpen, setIsAlumnesOpen] = useState(false);
  const [languagesByClass, setLanguagesByClass] = useState({});

  const user_info = useAuthStore((state) => state.user_info);
  const class_info = useAuthStore((state) => state.class_info);

  useEffect(() => {
    if (!class_info || class_info.length === 0) {
      console.log("No classes available.");
      return;
    }
    console.log("Clases en el store Zustand:", class_info);

    const initialLanguages = {};
    class_info.forEach((classItem) => {
      initialLanguages[classItem.class_id] = classItem.language_info.map(lang => lang.name);
    });
    setLanguagesByClass(initialLanguages);
  }, [class_info]);

  const handleClassClick = (class_id) => {
    setOpenClassId(openClassId === class_id ? null : class_id);
    setIsLlenguatgesOpen(false);
    setIsAlumnesOpen(false);
  };

  useEffect(() => {
    if (openClassId) {
      changeSelectedClass(openClassId);
    }
  }, [openClassId]);

  const handleAddLanguage = async () => {
    if (!newLanguage || !openClassId) {
        console.error("Error: Class not selected or language name is empty.");
        return;
    }

    try {
        if (!user_info || !user_info.token) {
            console.error("No token available, user not authenticated.");
            return;
        }

        const allLanguages = await getLanguages();
        
        let existingLanguage = allLanguages.find(lang => lang.name.toLowerCase() === newLanguage.toLowerCase());

        if (!existingLanguage) {
            console.log(`Language "${newLanguage}" not found in database, creating it...`);

            const newLangResponse = await createLanguage(newLanguage);
            existingLanguage = {
                idlanguage: newLangResponse.idlanguage, 
                name: newLangResponse.name,
                restrictionId: Math.floor(Math.random() * 3) + 1, 
            };
        }

        if (!existingLanguage.restrictionId) {
            console.error("No restrictionId found for language:", existingLanguage);
            existingLanguage.restrictionId = 1;
        }

        console.log(`Adding language to class ${openClassId}:`, existingLanguage);

        await addLanguageToClass(openClassId, existingLanguage);

        setLanguagesByClass((prev) => ({
            ...prev,
            [openClassId]: [...(prev[openClassId] || []), existingLanguage.name], 
        }));

        setNewLanguage("");
        setShowInput(false);
    } catch (error) {
        console.error("Error adding new language:", error);
    }
  };

  const handleStudentClick = (studentId) => () => {
    changeSelectedField("alumne");
    changeSelectedClass(studentId);
  }

  return (
    <div className="sticky-sidebar flex-shrink-0 bg-gray-200 dark:bg-gray-800 text-black dark:text-white h-full p-4 border-r border-gray-300 dark:border-gray-700">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 mx-auto mb-2"></div>
        <h2 className="text-lg font-semibold">PROFESSOR</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Admin</p>
      </div>
  
      <nav className="space-y-2">
        {class_info && class_info.length > 0 ? (
          class_info.map(({ class_id, name, classmate_info }) => (
            <div key={class_id}>
              <button
                className="w-full px-4 py-2 bg-gray-700 hover:bg-blue-500 text-white rounded-md flex justify-between items-center"
                onClick={() => handleClassClick(class_id)}
              >
                {name} <span>▼</span>
              </button>
  
              {openClassId === class_id && (
                <div className="mt-1 space-y-1 pl-2">
                  <button
                    className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white"
                    onClick={() => setIsLlenguatgesOpen(!isLlenguatgesOpen)}
                  >
                    📄 Llenguatges
                  </button>
  
                  {isLlenguatgesOpen && (
                    <div className="ml-4 mt-2 space-y-2">
                      {languagesByClass[class_id] && languagesByClass[class_id].length > 0 ? (
                        languagesByClass[class_id].map((lang, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <button className="w-3/4 px-3 py-2 bg-green-500 hover:bg-green-700 rounded-md text-white">
                              {lang}
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No hi ha llenguatges</p>
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
                            className="px-1 py-1 bg-green-500 size-8 text-white rounded-md hover:bg-green-600 text-sm"
                          >
                            ✅
                          </button>
                          <button
                            onClick={() => {
                              setShowInput(false);
                              setNewLanguage("");
                            }}
                            className="px-1 py-1 size-8 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                          >
                            ✖
                          </button>
                        </div>
                      )}
                    </div>
                  )}
  
                  <button className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white">📊​ Estadístiques</button>
  
                  <button
                    className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white"
                    onClick={() => setIsAlumnesOpen(!isAlumnesOpen)}
                  >
                    🎓 Alumnes
                  </button>
  
                  {isAlumnesOpen && (
                    <div className="ml-4 mt-2 space-y-2">
                      {classmate_info && classmate_info.length > 0 ? (
                        classmate_info.map((student) => (
                          <div
                            onClick={handleStudentClick(student.id)}
                            key={student.id}
                            className="px-3 py-2 bg-blue-200 dark:bg-blue-800 text-black dark:text-white rounded-md"
                          >
                            {student.name}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No hi ha alumnes</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No tienes clases asignadas</p>
        )}
      </nav>
    </div>
  );
};

export default SidebarProf;
