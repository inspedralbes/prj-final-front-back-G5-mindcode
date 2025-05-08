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

  // Expose this function to parent via ref
  useImperativeHandle(ref, () => ({
    handleSaveEdit0,
    handleSaveEdit1,
    handleSaveEdit2,
    // Add other functions here if needed
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
        // .filter((lang) => {console.log(lang); return typeof lang === "object" && lang.id})
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
        // console.log(`Language "${newLanguage}" not found in database, creating it...`);
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
      // console.log(`Eliminando lenguaje "${languageToDelete.name}" (ID: ${languageToDelete.id}) de la clase ${classId}`);

      await deleteLanguageFromClass(classId, languageToDelete.id);

      const updatedLanguages = [...languagesByClass[classId]];
      updatedLanguages.splice(index, 1);

      setLanguagesByClass((prev) => ({
        ...prev,
        [classId]: updatedLanguages,
      }));

      // console.log(`Lenguaje eliminado correctamente de la clase ${classId}`);
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

      // console.log(`Idioma "${updatedLang.name}" ahora está ${updatedLang.isActive ? "activo" : "inactivo"}`);
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
    <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white h-full p-4 border-r border-gray-300 dark:border-gray-700">
      <div className="text-center mb-6">
        <button className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 mx-auto mb-2 overflow-hidden" onClick={handleRedirect}>
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
        <h2 className="text-lg font-semibold">PROFESSOR</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Admin</p>
      </div>

      <nav className="space-y-2 flex-1 overflow-y-auto items-center justify-center">
        {class_info && class_info.length > 0 ? (
          class_info.map(({ class_id, name, classmate_info }, index) => (
            <div key={class_id}>
              <button
                className="w-full px-4 py-2 bg-gray-700 hover:bg-blue-500 text-white rounded-md flex justify-between items-center"
                onClick={() => handleClassClick(class_id, index)}
              >
                {name} <span>▼</span>
              </button>

              {openClassId === class_id && (
                <div className="mt-1 space-y-2 pl-2">
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

                            <button className={`w-3/4 px-3 py-2 ${lang.restrictionId == 2 ? "bg-green-500 hover:bg-green-700" : lang.restrictionId == 1 ? "bg-yellow-500 hover:bg-yellow-700" : "bg-red-500 hover:bg-red-700"} rounded-md text-white`}>{lang.name}</button>
                            <button onClick={() => handleEditLanguage(class_id, index, false)} className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">✏️</button>
                            <button onClick={() => handleDeleteLanguage(class_id, index)} className="px-1 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">🗑️</button>

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

                  <button className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white"
                    onClick={handleStatsClick}
                  >
                    📊 Estadístiques
                  </button>

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
                          <div key={student.id} className="px-3 py-2 bg-blue-200 dark:bg-blue-800 text-black dark:text-white rounded-md"
                            onClick={handleStudentClick(student.id)}
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

        <MediumButton onClick={handleGoToNewClass} label={"➕ Nova classe"} />
      </nav>

    </div>
  );
});

export default SidebarProf;
