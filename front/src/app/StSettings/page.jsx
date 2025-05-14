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
import ContentArea from "../components/ContentArea";

const StSettings = () => {
  const [userSettings, setUserSettings] = useState(null);
  const [classSettings, setClassSettings] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [highlightedLanguage, setHighlightedLanguage] = useState(null);
  const [highlightedLanguageIndex, setHighlightedLanguageIndex] = useState(0);
  const router = useRouter();
  const classInfo = useAuthStore((state) => state.class_info);
  const user_info = useAuthStore.getState().user_info;

  const checkUserRole = async () => {
        try {
          if (!user_info) {
            return;
          }
          if (user_info.role === 1) {
            router.push("/Login");
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          router.push("/Login");  
        }
      };
  
    useEffect(() => {
      checkUserRole();
       }, [user_info]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserInfo();
        setUserSettings(userData);
        toast.success("Usuari carregat correctament");
      } catch (error) {
        console.error("Error fetching user settings:", error);
        toast.error("No s'han pogut carregar les dades de l'usuari");
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
          .filter((user) => user.teacher === 0 && user.id !== userSettings.id)
          .map((user) => ({ id: user.id, name: user.name }));

        setClassSettings({
          className: classDetails.name,
          teacher: teacherNames,
          classMates,
        });

        toast.info("Informació de la classe carregada");
      } catch (error) {
        console.error("Error fetching class settings:", error);
        toast.error("Error en carregar la informació de la classe");
      }
    };

    fetchClassSettings();
  }, [userSettings]);

  const handleLeaveClass = async () => {
    try {
      await leaveClass({});
      setIsDialogOpen(false);
      setClassSettings(null);
      toast.success("Has sortit de la classe correctament");
      router.push("/JoinClass");
    } catch (error) {
      console.error("Error leaving class:", error);
      toast.error("No s'ha pogut sortir de la classe");
    }
  };

  const handleSetCurrentLanguage = (language) => {
    setHighlightedLanguage(language);
    setHighlightedLanguageIndex(
      classInfo[0].language_info.findIndex((lang) => lang.id === language.id)
    );
    toast.info(`Idioma canviat a: ${language.name}`);
    router.push("/StPage");
  };

  if (!userSettings) return <div>Loading...</div>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <SidebarStudent handleSetCurrentLanguage={handleSetCurrentLanguage} />
        <div className="flex flex-col w-full">
          <Navbar />
          <ContentArea>
        <div className="flex flex-wrap justify-center items-center w-full h-full p-4 min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-5xl flex flex-wrap justify-center space-x-6 gap-8 px-4">
              <Settings
                id={userSettings.id}
                name={userSettings.name}
                gmail={userSettings.gmail}
                className="w-full md:w-5/12 lg:w-5/12"
            />
              {classSettings && (
                <ClassSettings
                  name={classSettings.className}
                  teacher={classSettings.teacher}
                  classMates={classSettings.classMates}
                  onLeaveClass={() => setIsDialogOpen(true)}
                  isStudent={true}
                  className="w-full md:w-5/12 lg:w-5/12"
              />
              )}
              </div>
            </div>
        </ContentArea>
      </div>
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <Dialog
              title="Confirmació"
              message="Estàs segur que vols sortir de la classe?"
              onConfirm={handleLeaveClass}
              onCancel={() => setIsDialogOpen(false)}
              className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-2xl"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default StSettings
