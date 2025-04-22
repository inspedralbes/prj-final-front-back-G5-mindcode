"use client";
import React, {useEffect, useState} from "react";
import Navbar from "app/components/Navbar";
import Sidebar from "app/components/Sidebar";
import Settings from "app/components/Settings";
import ClassSettings from "app/components/ClassSettings";
import { getUserInfo, getClassInfo, getClassDetails, leaveClass, getUserById } from "services/communicationManager";
import Dialog from "app/components/atoms/Dialog";
import { useRouter } from "next/navigation";
import { useAuthStore } from '../../stores/authStore';
import SidebarProf from "app/components/SidebarProf";

const PfSettings = () => {
  const [userSettings, setUserSettings] = useState(null);
  const [classSettings, setClassSettings] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
            const classDetails = await getClassDetails(); 
        
            if (!Array.isArray(classData) || classData.length === 0) {
              console.warn("No class data found.");
              return;
            }
        
            const teacherIds = classDetails.teacher_id || [];
            console.log("Teacher IDs:", teacherIds);
        
            const teacherNames = await Promise.all(
              teacherIds.map(async (id) => {
                const teacherInfo = await getUserById(id);
                return teacherInfo.name; 
              })
            );
        
            console.log("Teacher Names:", teacherNames);
        
            const classMates = classData
              .filter(user => !teacherIds.includes(user.id))
              .map(user => user.name);
        
            const className = classDetails.name;
        
            setClassSettings({ className, teacher: teacherNames, classMates });
        
          } catch (error) {
            console.error("Error fetching class settings:", error);
          }
        };  
 
    fetchUser();
    fetchClassSettings();
  }, []);
  
  const handleKickUser = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };
  
  const confirmKickUser = async () => {
    try {
      await leaveClass(selectedUser);
      setIsDialogOpen(false);
      
      if (classSettings) {
        const updatedUsers = classSettings.users.filter(user => user !== selectedUser);
        setClassSettings({...classSettings, users: updatedUsers});
      }
    } catch (error) {
      console.error("Error kicking user from class:", error);
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
        <SidebarProf className="w-full md:w-1/4 lg:w-1/5" classInfo={classInfo} handleSetCurrentLanguage={handleSetCurrentLanguage} />
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
                        teacher={classSettings.teacher}
                        classMates={classSettings.classMates}
                        isStudent={false}
                        onKickUser={handleKickUser}
                        className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
                    />
                )}
            </div>
        </div>
        
        {isDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <Dialog
                    title="Confirmació"
                    message={`Estàs segur que vols expulsar a ${selectedUser} de la classe?`}
                    onConfirm={confirmKickUser}
                    onCancel={() => setIsDialogOpen(false)}
                    className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
                />
            </div>
        )}
      </div>
    );
};

export default PfSettings;