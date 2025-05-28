"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/organisms/Navbar";
import Settings from "app/components/Settings";
import ClassSettings from "app/components/ClassSettings";
import { getUserInfo, getClassInfo, getClassDetails, leaveClass, getUserById, kickClass, getUserRole } from "services/communicationManager";
import Dialog from "app/components/atoms/Dialog";
import { useRouter } from "next/navigation";
import { useAuthStore } from '../../stores/authStore';
import SidebarProf from "app/components/SidebarProf";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentArea from "../components/ContentArea";

const PfSettings = () => {
  const [userSettings, setUserSettings] = useState(null);
  const [classSettings, setClassSettings] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isKickStudentOpen, setIsKickStudentOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedField, setSelectedField] = useState("stats");
  const [selectedClass, setSelectedClass] = useState(null);
  const [highlitedLanguage, setHighlitedLanguage] = useState(null);
  const [highlitedLanguageIndex, setHighlitedLanguageIndex] = useState(0);
  const router = useRouter();
  const classInfo = useAuthStore((state) => state.class_info);
  const user_info = useAuthStore.getState().user_info;

  const checkUserRole = async () => {
    try {
      if (!user_info) {
        return;
      }
      if (user_info.role === 0) {
        sessionStorage.setItem("fromStudentDashboard", "true");
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
        toast.success("Informació de l'usuari carregada");
      } catch (error) {
        console.error("Error fetching user settings:", error);
        toast.error("No s'han pogut carregar les dades de l'usuari");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (classInfo) {
      setSelectedClass(classInfo[0]?.class_id);
    }
  }, [classInfo]);

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

        const loggedInUserId = userSettings.id;

        const classMates = classData
          .filter((user) => user.teacher === 0 && user.id !== loggedInUserId)
          .map((user) => ({ id: user.id, name: user.name }));

        const className = classDetails.name;

        setClassSettings({ className, teacher: teacherNames, classMates });
        toast.info("Informació de la classe carregada");
      } catch (error) {
        console.error("Error fetching class settings:", error);
        toast.error("Error en carregar la informació de la classe");
      }
    };

    fetchClassSettings();
  }, [userSettings]);

  const handleKickUser = (user) => {
    setSelectedUser(user);
    setIsKickStudentOpen(true);
  };

  const confirmKickUser = async () => {
    try {
      if (!selectedUser) return;
      const classId = selectedClass || classInfo[0]?.class_id;
      await kickClass(selectedUser.id, classId);

      setClassSettings((prevSettings) => ({
        ...prevSettings,
        classMates: prevSettings.classMates.filter((user) => user.id !== selectedUser.id),
      }));

      toast.success(`L'alumne ha estat expulsat correctament`);
      setIsKickStudentOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error kicking user from class:", error);
      toast.error("No s'ha pogut expulsar a l'alumne");
    }
  };

  const handleCloseClass = async () => {
    try {
      router.push("/CreateClass"); 
      await leaveClass({});
      setClassSettings(null); 
      toast.success("Has tancat la classe correctament");
    } catch (error) {
      console.error("Error closing class:", error);
      toast.error("No s'ha pogut tancar la classe");
    }
  };

  const changeSelectedField = (value) => {
    setSelectedField(value);
  };

  const changeSelectedClass = (value) => {
    setSelectedClass(value);
  };

  if (!userSettings) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <div className="w-[25vw]">
          <SidebarProf changeSelectedField={changeSelectedField} changeSelectedClass={changeSelectedClass} />
        </div>
        <div className="flex flex-col w-full">
          <Navbar className="w-full" />
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
                    onKickUser={handleKickUser}
                    isStudent={false}
                    className="w-full md:w-5/12 lg:w-5/12"
                  />
                )}
                </div>
              </div>
          </ContentArea>
        </div>

        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Dialog
              title="Confirmació"
              message={`Estàs segur que vols sortir de la classe?`}
              onConfirm={handleCloseClass}
              onCancel={() => setIsDialogOpen(false)}
              className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
            />
          </div>
        )}
        {isKickStudentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Dialog
              title="Confirmació"
              message={`Estàs segur que vols expulsar a l'alumne de la classe?`}
              onConfirm={confirmKickUser}
              onCancel={() => setIsKickStudentOpen(false)}
              className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PfSettings;
