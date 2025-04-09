"use client";

import React, {useEffect, useState} from "react"
import Navbar from "app/components/Navbar"
import Sidebar from "app/components/Sidebar"
import Settings from "app/components/Settings"
import ClassSettings from "app/components/ClassSettings";
import { getUserInfo, updateUserInfo, getClassInfo } from "services/communicationManager"


const UserSettings = () => {
  
  const [userSettings, setUserSettings] = useState(null);
  const [newName, setNewName] = useState("");

  const [classSettings, setClassSettings] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try{
        const userData = await getUserInfo();
        setUserSettings(userData);
        setNewName(userData.name);
      }catch(error){
        console.error("Error fetching user settings:", error);
      }
    };

    const fetchClassSettings = async () => {
      try {
          const classData = await getClassInfo();
          
          if (!Array.isArray(classData) || classData.length === 0) {
              console.warn("No class data found.");
              return;
          }
          const users = classData.map(user => user.name);
          setClassSettings({ users });
  
      } catch (error) {
          console.error("Error fetching class settings:", error);
      }
  };
  

    fetchUser();
    fetchClassSettings();
  }, []);

  const handleUpdateName = async () => {
    if (!newName.trim()) return alert("El nombre no puede estar vacío");
    
    try {
      const updatedUser = await updateUserInfo(userSettings.id, newName, userSettings.gmail);
      setUserSettings((prev) => ({ ...prev, name: updatedUser.name }));
      alert("Nombre actualizado con éxito");
    } catch (error) {
      alert("Error al actualizar el nombre: " + error.message);
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
          <div className="flex gap-4 p-4 sticky top-0">
          <Settings 
            name={userSettings.name}
            gmail={userSettings.gmail}
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
              Editar Perfil
            </button>
            {classSettings && (
              <div className="flex flex-col gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <ClassSettings
                    users={classSettings.users}/>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                      Sortir de la clase
                  </button>
              </div>
                )}
                </div>
          </div>    
        </div>
    );
}

export default UserSettings;
