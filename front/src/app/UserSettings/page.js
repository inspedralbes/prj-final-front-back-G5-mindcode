"use client";

import React, {useEffect, useState} from "react"
import Navbar from "app/components/Navbar"
import Sidebar from "app/components/Sidebar"
import Settings from "app/components/Settings"
import { getUserInfo } from "services/communicationManager"


const UserSettings = () => {
  
  const [userSettings, setUserSettings] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try{
        const userData = await getUserInfo();
        setUserSettings(userData);
      }catch(error){
        console.error("Error fetching user settings:", error);
      }
    };

    fetchUser();
  }, []);

  if(!userSettings){
    return <div>Loading...</div>;
  }

    return(
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <Sidebar />
          <div className="flex flex-col w-full">
          <Navbar />
          <Settings 
            name={userSettings.name}
            gmail={userSettings.gmail}
          />
          </div>    
        </div>
    );
}

export default UserSettings;
