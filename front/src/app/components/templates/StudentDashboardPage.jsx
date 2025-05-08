"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/organisms/Navbar";
import SidebarStudent from "../components/organisms/SidebarStudent";
import Settings from "../components/Settings";
import ClassSettings from "../components/ClassSettings";
import Dialog from "../components/atoms/Dialog";
import { useRouter } from "next/navigation";
import { useAuthStore } from "stores/authStore";
import {
  getUserInfo,
  getClassInfo,
  getClassDetails,
  leaveClass,
  getUserById,
} from "services/communicationManager";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StSettings = () => {
  const [userSettings, setUserSettings] = useState(null);
  const [classSettings, setClassSettings] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [highlightedLanguage, setHighlightedLanguage] = useState(null);
  const [highlightedLanguageIndex, setHighlightedLanguageIndex] = useState(0);
  const router = useRouter();
  const classInfo = useAuthStore((state) => state.class_info);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserInfo();
        setUserSettings(userData);
        console.log("Usuario obtenido:", userData);
        toast.success("Usuario cargado correctamente");
      } catch (error) {
        console.error("Error fetching user settings:", error);
        toast.error("Error al obtener los datos del usuario");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userSettings) return;

    const fetchClassSettings = async () => {
      try {
        const classData = await getClassInfo();
        const classDetails = await getClassDetails();

        if (!Array.isArray(classData) || classData.length === 0) return;

        const teacherIds = classDetails.teacher_id || [];
        const teacherNames = await Promise.all(
          teacherIds.map(async (id) => {
            const teacherInfo = await getUserById(id);
            return teacherInfo.name;
          })
        );

        const classMates = classData
          .filter(
            (user) => user.teacher === 0 && user.id !== userSettings.id
          )
          .map((user) => ({ id: user.id, name: user.name }));

        setClassSettings({
          className: classDetails.name,
          teacher: teacherNames,
          classMates,
        });

        console.log("Configuración de clase cargada");
        toast.info("Información de la clase cargada");
      } catch (error) {
        console.error("Error fetching class settings:", error);
        toast.error("Error al obtener información de la clase");
      }
    };

    fetchClassSettings();
  }, [userSettings]);

  const handleLeaveClass = async () => {
    try {
      await leaveClass({});
      toast.success("Has salido de la clase");
      router.push("/JoinClass");
      setIsDialogOpen(false);
      setClassSettings(null);
    } catch (error) {
      console.error("Error leaving class:", error);
      toast.error("No se pudo salir de la clase");
    }
  };

  const handleSetCurrentLanguage = (language) => {
    setHighlightedLanguage(language);
    setHighlightedLanguageIndex(
      classInfo[0].language_info.findIndex(
        (lang) => lang.id === language.id
      )
    );
    toast.info(`Idioma cambiado a: ${language.name}`);
    router.push("/StPage");
  };

  if (!userSettings) return <div>Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <SidebarStudent handleSetCurrentLanguage={handleSetCurrentLanguage} />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex flex-grow flex-wrap items-center justify-center gap-4 p-4">
          <Settings
            id={userSettings.id}
            name={userSettings.name}
            gmail={userSettings.gmail}
          />
          {classSettings && (
            <ClassSettings
              name={classSettings.className}
              teacher={classSettings.teacher}
              classMates={classSettings.classMates}
              onLeaveClass={() => setIsDialogOpen(true)}
              isStudent={true}
            />
          )}
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog
            title="Confirmació"
            message="Estàs segur que vols sortir de la classe?"
            onConfirm={handleLeaveClass}
            onCancel={() => setIsDialogOpen(false)}
            className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
          />
        </div>
      )}

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StSettings;
