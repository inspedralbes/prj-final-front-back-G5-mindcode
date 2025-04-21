"use client";
import React, {useEffect, useState} from "react";
import Navbar from "app/components/Navbar";
import Sidebar from "app/components/Sidebar";
import Settings from "app/components/Settings";
import ClassSettings from "app/components/ClassSettings";
import { getUserInfo, getClassInfo, getClassDetails, leaveClass } from "services/communicationManager";
import Dialog from "app/components/atoms/Dialog";
import { useRouter } from "next/navigation";
import { useAuthStore } from '../../stores/authStore';

const StSettings = () => {
  const [userSettings, setUserSettings] = useState(null);
  const [classSettings, setClassSettings] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [highlitedLanguage, setHighlitedLanguage] = useState(null);
  const [highlitedLanguageIndex, setHighlitedLanguageIndex] = useState(0);
  const router = useRouter();
  const classInfo = useAuthStore((state) => state.class_info);
  
  useEffect(() => {
    const fetchUser = async () => {
      try{
        const userData = await getUserInfo();
        setUserSettings(userData);
      }catch(error){
        console.error("Error fetching user settings:", error);
      }
    };
    
    const fetchClassSettings = async () => {
      try {
          const classData = await getClassInfo();
          const classInfo = await getClassDetails();
         
          if (!Array.isArray(classData) || classData.length === 0) {
              console.warn("No class data found.");
              return;
          }
          const className = classInfo.name;
          const users = classData.map(user => user.name);
          setClassSettings({ users, className });
 
      } catch (error) {
          console.error("Error fetching class settings:", error);
      }
    };
 
    fetchUser();
    fetchClassSettings();
  }, []);
  
  const handleLeaveClass = async () => {
    try {
      await leaveClass({});
      router.push("/JoinClass");
      setIsDialogOpen(false);
      setClassSettings(null);
    } catch (error) {
      console.error("Error leaving class:", error);
    }
  };
  
  const handleSetCurrentLanguage = (language) => {
    console.log(language);
    setHighlitedLanguage(language);
    setHighlitedLanguageIndex(classInfo[0].language_info.findIndex(lang => lang.id === language.id));
  };
  
  if(!userSettings){
    return <div>Loading...</div>;
  }
  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <Sidebar className="w-full md:w-1/4 lg:w-1/5" classInfo={classInfo} handleSetCurrentLanguage={handleSetCurrentLanguage} />
        <div className="flex flex-col w-full">
            <Navbar className="w-full" />
            <div className="flex flex-grow flex-wrap items-center justify-center gap-4 p-4">
                <Settings
                    id={userSettings.id}
                    name={userSettings.name}
                    gmail={userSettings.gmail}
                    className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
                />
                {classSettings && (
                    <ClassSettings
                        name={classSettings.className}
                        users={classSettings.users}
                        onLeaveClass={() => setIsDialogOpen(true)}
                        isStudent={true}
                        className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
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
      </div>
    );
};

export default StSettings;