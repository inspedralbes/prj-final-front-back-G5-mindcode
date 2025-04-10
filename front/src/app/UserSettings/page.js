"use client";

import React, {useEffect, useState} from "react"
import Navbar from "app/components/Navbar"
import Sidebar from "app/components/Sidebar"
import Settings from "app/components/Settings"
import ClassSettings from "app/components/ClassSettings";
import { getUserInfo, getClassInfo, getClassDetails, leaveClass } from "services/communicationManager"
import Dialog from "app/components/atoms/Dialog";
import { useRouter } from "next/navigation";

const UserSettings = () => {
  const [userSettings, setUserSettings] = useState(null);
  const [classSettings, setClassSettings] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

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


  if(!userSettings){
    return <div>Loading...</div>;
  }

    return(
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <Sidebar />
          <div className="flex flex-col w-full">
          <Navbar />
          <div className="flex flex-grow items-center justify-center gap-6">
          <Settings 
            id={userSettings.id}
            name={userSettings.name}
            gmail={userSettings.gmail}
            />
            {classSettings && (
                    <ClassSettings
                    name={classSettings.className}
                    users={classSettings.users}
                    onLeaveClass={() => setIsDialogOpen(true)} 
              />
                )}
                </div>
          </div>
          {isDialogOpen && (
            <div className="fixed inset-0 z-50">
          <Dialog
          title="Confirmació"
          message="Estàs segur que vols sortir de la classe?"
          onConfirm={handleLeaveClass} 
          onCancel={() => setIsDialogOpen(false)}
        />
        </div>
      )}
        </div>
    );
}

export default UserSettings;
