import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  getLanguages,
  addLanguageToClass,
  createLanguage,
  updateLanguages,
  deleteLanguageFromClass,
  getUserImage
} from "services/communicationManager.js";
import MediumButton from "./atoms/MediumButton";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'

const SidebarProf = forwardRef((props, ref) => {
  const [openClassId, setOpenClassId] = useState(null);
  const [newLanguage, setNewLanguage] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isLlenguatgesOpen, setIsLlenguatgesOpen] = useState(false);
  const [isAlumnesOpen, setIsAlumnesOpen] = useState(false);
  const [languagesByClass, setLanguagesByClass] = useState({});
  const [editingLanguage, setEditingLanguage] = useState({ classId: null, index: null });
  const [isStudent, setIsStudent] = useState(false);
  const [open, setOpen] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const handleOpen = () => setOpen(!open);

  const user_info = useAuthStore((state) => state.user_info);
  const class_info = useAuthStore((state) => state.class_info);
  const router = useRouter();
  const pathname = usePathname();

  useImperativeHandle(ref, () => ({
    handleSaveEdit0,
    handleSaveEdit1,
    handleSaveEdit2,
  }));

  const handleEditLanguage = (classId, index, isStudent) => {
    props.changeSelectedLanguage(languagesByClass[classId][index]);
    props.changeSelectedField("llenguatges");
    setEditingLanguage({ classId, index });
    setIsStudent(isStudent);
  };

  const handleSaveEdit = async (restrictionId) => {
    console.log(restrictionId);
    if (!editingLanguage.classId || editingLanguage.index === null || restrictionId == null) {
      console.error("Error: Invalid input for editing language.");
      return;
    }
    if (isStudent) {

    } else {

      try {
        const updatedLanguages = [...languagesByClass[editingLanguage.classId]];
        const previousLanguage = updatedLanguages[editingLanguage.index];
        const updatedLanguage = {
          ...previousLanguage,
          restrictionId: restrictionId,
        };
        updatedLanguages[editingLanguage.index] = updatedLanguage;

        await updateLanguages(editingLanguage.classId, updatedLanguages);

        setLanguagesByClass((prev) => ({
          ...prev,
          [editingLanguage.classId]: updatedLanguages,
        }));

        setEditingLanguage({ classId: null, index: null });
      } catch (error) {
        console.error("Error updating language:", error);
      }
    }

  };

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
    const initialLanguages = {};
    class_info.forEach((classItem) => {
      console.log(classItem.language_info);
      initialLanguages[classItem.class_id] = classItem.language_info
        .map((lang) => ({
          id: lang.id,
          name: lang.name,
          restrictionId: lang.restrictionId,
          isActive: lang.isActive ?? true,
        }));

      console.log("initial languages", initialLanguages[classItem.class_id]);
    });
    setLanguagesByClass(initialLanguages);
  }, [class_info]);

  const handleClassClick = (class_id, index) => {
    if (pathname !== "/PfPage") {
      router.push("/PfPage");
    } else {
      setOpenClassId(openClassId === class_id ? null : class_id);
      props.changeSelectedClassPosition(index);
      props.changeSelectedField("stats");
      setIsLlenguatgesOpen(false);
      setIsAlumnesOpen(false);
    }
  };

  useEffect(() => {
    if (openClassId) {
      props.changeSelectedClass(openClassId);
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

      let existingLanguage = allLanguages.find(
        (lang) => lang.name.toLowerCase() === newLanguage.toLowerCase()
      );

      if (!existingLanguage) {
        const newLangResponse = await createLanguage(newLanguage);

        existingLanguage = {
          id: newLangResponse.id,
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
      !languageToDelete?.id ||
      !classId
    ) {
      console.error(" Datos inválidos al eliminar lenguaje:", {
        classId,
        languageToDelete,
      });
      return;
    }

    const countLanguages = (classId) => {
      const languages = languagesByClass[classId] || [];
      return languages.length;
    };

    if (countLanguages(classId) <= 1) {
      console.error("Error: Cannot delete the last remaining language.");
      return;
    }

    try {

      await deleteLanguageFromClass(classId, languageToDelete.id);

      const updatedLanguages = [...languagesByClass[classId]];
      updatedLanguages.splice(index, 1);

      setLanguagesByClass((prev) => ({
        ...prev,
        [classId]: updatedLanguages,
      }));

    } catch (error) {
      console.error(" Error deleting language:", error.message);
    }
  };

  const toggleLanguageActiveStatus = async (classId, index) => {
    try {
      const updatedLanguages = [...languagesByClass[classId]];
      const currentLang = updatedLanguages[index];

      if (currentLang.isActive && updatedLanguages.filter(lang => lang.isActive).length === 1) {
        console.error("Error: Cannot deactivate the last remaining active language.");
        return;
      }

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

    } catch (error) {
      console.error("Error al cambiar el estado del lenguaje:", error.message);
    }
  };

  const handleStudentClick = (studentId) => () => {
    if (pathname !== "/PfPage") {
      router.push("/PfPage");
    } else {
      props.changeSelectedField("alumne");
      props.changeSelectedClass(studentId);
    }
  }

  const handleStatsClick = () => {
    if (pathname !== "/PfPage") {
      router.push("/PfPage");
    } else {
      props.changeSelectedField("stats");
      props.changeSelectedClass(openClassId);
    }
  }

  const handleRedirect = async () => {
    router.push('/PfSettings');
  }

  const handleSaveEdit0 = () => {
    if (pathname !== "/PfPage") {
      router.push("/PfPage");
    } else {
      handleSaveEdit(0);
      setOpen(false);
    }
  }

  const handleSaveEdit1 = () => {
    if (pathname !== "/PfPage") {
      router.push("/PfPage");
    } else {
      handleSaveEdit(1);
      setOpen(false);
    }
  }

  const handleSaveEdit2 = () => {
    if (pathname !== "/PfPage") {
      router.push("/PfPage");
    } else {
      handleSaveEdit(2);
      setOpen(false);
    }
  }

  const handleGoToNewClass = () => {
    router.push('/CreateClass')
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-500 h-full p-4 border-r border-gray-300 dark:border-gray-700">
      <div className="text-center mb-6">
        <button 
          className="w-16 h-16 rounded-full bg-gradient-to-br emerald-900 to-purple-900 hover:from-emerald-800 hover:to-purple-700 mx-auto mb-2 overflow-hidden border-2 border-purple-400 dark:border-purple-500 transition-all shadow-lg"
          onClick={handleRedirect}
        >
          {userImage ? (
            <img src={userImage} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <img
              src={user_info.photoURL}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          )}
        </button>
        <h2 className="text-lg font-semibold text-purple-500">PROFESSOR</h2>
        <p className="text-sm text-purple-500 dark:text-purple-400">Admin</p>
      </div>

      <nav className="space-y-2 flex-1 overflow-y-auto items-center justify-center">
        {class_info && class_info.length > 0 ? (
          class_info.map(({ class_id, name, classmate_info }, index) => (
            <div key={class_id}>
              <button
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-900 to-purple-900 hover:from-emerald-800 hover:to-purple-700 text-white rounded-lg flex justify-between items-center transition-all shadow-md"
                onClick={() => handleClassClick(class_id, index)}
              >
                {name} <span className="transition-transform duration-300">{openClassId === class_id ? '▼' : '▶'}</span>
              </button>

              {openClassId === class_id && (
                <div className="mt-2 space-y-2 pl-2">
                  <button
                    className="w-full px-4 py-2 bg-gradient-to-r from-cyan-900 to-fuchsia-900 hover:from-cyan-700 hover:to-fuchsia-700 text-white rounded-lg transition-all"
                    onClick={() => setIsLlenguatgesOpen(!isLlenguatgesOpen)}
                  >
                    📄 Llenguatges
                  </button>

                  {isLlenguatgesOpen && (
                    <div className="ml-4 mt-2 space-y-2">
                      {languagesByClass[class_id] && languagesByClass[class_id].length > 0 ? (
                        languagesByClass[class_id].map((lang, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <button 
                              className={`w-3/4 px-3 py-2 text-white rounded-lg ${
                                lang.restrictionId == 2 
                                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                                  : lang.restrictionId == 1 
                                    ? "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500"
                                    : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500"
                              } transition-all`}
                            >
                              {lang.name}
                            </button>
                            <button 
                              onClick={() => handleEditLanguage(class_id, index, false)} 
                              className="px-2 py-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-400 hover:to-yellow-500 transition-all"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDeleteLanguage(class_id, index)} 
                              className="px-2 py-1 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-400 hover:to-rose-500 transition-all"
                            >
                              🗑️
                            </button>

                            <label className="relative inline-flex items-center cursor-pointer ml-2">
                              <input
                                type="checkbox"
                                checked={lang.isActive}
                                onChange={() => toggleLanguageActiveStatus(class_id, index)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
                              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-purple-300 dark:text-purple-400">No hi ha llenguatges</p>
                      )}

                      {!showInput ? (
                        <button
                          className="w-full px-4 py-2  text-white rounded-lg bg-gradient-to-r from-cyan-900 to-fuchsia-900 hover:from-cyan-700 hover:to-fuchsia-700 mt-2 transition-all"
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
                            className="flex-1 px-3 py-2 border border-purple-300 dark:border-purple-500 rounded-lg bg-purple-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Nom del llenguatge"
                          />
                          <button 
                            onClick={handleAddLanguage} 
                            className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-400 hover:to-emerald-500 transition-all"
                          >
                            ✅
                          </button>
                          <button 
                            onClick={() => { setShowInput(false); setNewLanguage(""); }} 
                            className="px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-400 hover:to-rose-500 transition-all"
                          >
                            ✖
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <button 
                    className="w-full px-4 py-2 text-white bg-gradient-to-r from-cyan-900 to-fuchsia-900 hover:from-cyan-700 hover:to-fuchsia-700text-white rounded-lg transition-all"
                    onClick={handleStatsClick}
                  >
                    📊 Estadístiques
                  </button>

                  <button
                    className="w-full px-4 py-2 bg-gradient-to-r from-cyan-900 to-fuchsia-900 hover:from-cyan-700 hover:to-fuchsia-700 text-white rounded-lg transition-all"
                    onClick={() => setIsAlumnesOpen(!isAlumnesOpen)}
                  >
                    🎓 Alumnes
                  </button>

                  {isAlumnesOpen && (
                    <div className="ml-4 mt-2 space-y-2">
                      {classmate_info && classmate_info.length > 0 ? (
                        classmate_info.map((student) => (
                          <div 
                            key={student.id} 
                            className="px-3 py-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-blue-500/40 hover:to-purple-600/40 text-purple-700 rounded-lg border border-purple-400/30 cursor-pointer transition-all"
                            onClick={handleStudentClick(student.id)}
                          >

                            {student.name}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-purple-300 dark:text-purple-400">No hi ha alumnes</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-purple-300 dark:text-purple-400">No tens classes assignades</p>
        )}

        <button 
          onClick={handleGoToNewClass}
          className="w-full px-4 py-3 bg-gradient-to-r from-emerald-900 to-purple-900 hover:from-emerald-800 hover:to-purple-700 text-white rounded-lg font-medium mt-4 transition-all shadow-lg"
        >
          ➕ Nova classe
        </button>
      </nav>
    </div>
  );
});

export default SidebarProf;