import React, { useState, useEffect } from "react";
import {
  getLanguages,
  addLanguageToClass,
  createLanguage,
  updateLanguages,
  deleteLanguageFromClass
} from "services/communicationManager.js";
import { useAuthStore } from "../../stores/authStore";

const SidebarProf = () => {
  const [openClassId, setOpenClassId] = useState(null);
  const [newLanguage, setNewLanguage] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isLlenguatgesOpen, setIsLlenguatgesOpen] = useState(false);
  const [isAlumnesOpen, setIsAlumnesOpen] = useState(false);
  const [languagesByClass, setLanguagesByClass] = useState({});
  const [editingLanguage, setEditingLanguage] = useState({ classId: null, index: null, name: '' });

  const user_info = useAuthStore((state) => state.user_info);
  const class_info = useAuthStore((state) => state.class_info);

  const handleEditLanguage = (classId, index, name) => {
    setEditingLanguage({ classId, index, name });
  };

  const handleSaveEdit = async () => {
    if (!editingLanguage.classId || editingLanguage.index === null || !editingLanguage.name) {
      console.error("Error: Invalid input for editing language.");
      return;
    }

    try {
      const updatedLanguages = [...languagesByClass[editingLanguage.classId]];
      const previousLanguage = updatedLanguages[editingLanguage.index];
      const updatedLanguage = {
        ...previousLanguage,
        name: editingLanguage.name,
      };
      updatedLanguages[editingLanguage.index] = updatedLanguage;

      await updateLanguages(editingLanguage.classId, updatedLanguages);

      setLanguagesByClass((prev) => ({
        ...prev,
        [editingLanguage.classId]: updatedLanguages,
      }));

      setEditingLanguage({ classId: null, index: null, name: '' });
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  useEffect(() => {
    const initialLanguages = {};
    class_info.forEach((classItem) => {
      initialLanguages[classItem.class_id] = classItem.language_info
        .filter((lang) => typeof lang === "object" && lang.idlanguage)
        .map((lang) => ({
          idlanguage: lang.idlanguage,
          name: lang.name,
          restrictionId: lang.restrictionId,
          isActive: lang.isActive ?? true,
        }));
    });
    setLanguagesByClass(initialLanguages);
  }, [class_info]);

  const handleClassClick = (class_id) => {
    setOpenClassId(openClassId === class_id ? null : class_id);
    setIsLlenguatgesOpen(false);
    setIsAlumnesOpen(false);
  };

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

      let existingLanguage = allLanguages.find(
        (lang) => lang.name.toLowerCase() === newLanguage.toLowerCase()
      );

      if (!existingLanguage) {
        console.log(`Language "${newLanguage}" not found in database, creating it...`);
        const newLangResponse = await createLanguage(newLanguage);

        existingLanguage = {
          idlanguage: newLangResponse.idlanguage,
          name: newLangResponse.name,
          restrictionId: Math.floor(Math.random() * 3) + 1,
        };
      } else {
        existingLanguage = {
          ...existingLanguage,
          restrictionId: Math.floor(Math.random() * 3) + 1,
        };
      }

      await addLanguageToClass(openClassId, existingLanguage);

      setLanguagesByClass((prev) => ({
        ...prev,
        [openClassId]: [...(prev[openClassId] || []), existingLanguage],
      }));

      setNewLanguage("");
      setShowInput(false);
    } catch (error) {
      console.error("Error adding new language:", error);
    }
  };

  const handleDeleteLanguage = async (classId, index) => {
    const languageToDelete = languagesByClass[classId]?.[index];

    if (
      typeof languageToDelete !== "object" ||
      !languageToDelete?.idlanguage ||
      !classId
    ) {
      console.error(" Datos inválidos al eliminar lenguaje:", {
        classId,
        languageToDelete,
      });
      return;
    }

    try {
      console.log(`Eliminando lenguaje "${languageToDelete.name}" (ID: ${languageToDelete.idlanguage}) de la clase ${classId}`);

      await deleteLanguageFromClass(classId, languageToDelete.idlanguage); 

      const updatedLanguages = [...languagesByClass[classId]];
      updatedLanguages.splice(index, 1);

      setLanguagesByClass((prev) => ({
        ...prev,
        [classId]: updatedLanguages,
      }));

      console.log(`Lenguaje eliminado correctamente de la clase ${classId}`);
    } catch (error) {
      console.error(" Error deleting language:", error.message);
    }
  };

 const toggleLanguageActiveStatus = async (classId, index) => {
    try {
      const updatedLanguages = [...languagesByClass[classId]];
      const currentLang = updatedLanguages[index];
  
      const updatedLang = {
        ...currentLang,
        isActive: !currentLang.isActive
      };
  
      updatedLanguages[index] = updatedLang;
  
      await updateLanguages(classId, updatedLanguages);
  
      setLanguagesByClass((prev) => ({
        ...prev,
        [classId]: updatedLanguages,
      }));
  
      console.log(`Idioma "${updatedLang.name}" ahora está ${updatedLang.isActive ? "activo" : "inactivo"}`);
    } catch (error) {
      console.error("Error al cambiar el estado del lenguaje:", error.message);
    }
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white w-1/4 h-full p-4 border-r border-gray-300 dark:border-gray-700">
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
                            {editingLanguage.classId === class_id && editingLanguage.index === index ? (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={editingLanguage.name}
                                  onChange={(e) => setEditingLanguage({ ...editingLanguage, name: e.target.value })}
                                  className="w-32 px-2 py-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                                />
                                <button onClick={handleSaveEdit} className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">✅</button>
                                <button onClick={() => setEditingLanguage({ classId: null, index: null, name: '' })} className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">✖</button>
                              </div>
                            ) : (
                              <>
                                <button className="w-3/4 px-3 py-2 bg-green-500 hover:bg-green-700 rounded-md text-white">{lang.name}</button>
                                <button onClick={() => handleEditLanguage(class_id, index, lang.name)} className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">✏️</button>
                                <button onClick={() => handleDeleteLanguage(class_id, index)} className="px-1 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">🗑️</button>
                              </>
                              
                            )}
                             <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={lang.isActive}
                              onChange={() => toggleLanguageActiveStatus(class_id, index)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
                            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></                          div>
                          </label>

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
                          <button onClick={handleAddLanguage} className="px-1 py-1 bg-green-500 size-8 text-white rounded-md hover:bg-green-600 text-sm">✅</button>
                          <button onClick={() => { setShowInput(false); setNewLanguage(""); }} className="px-1 py-1 size-8 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm">✖</button>
                        </div>
                      )}
                    </div>
                  )}

                  <button className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white">📊 Estadístiques</button>

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
                          <div key={student.id} className="px-3 py-2 bg-blue-200 dark:bg-blue-800 text-black dark:text-white rounded-md">
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
