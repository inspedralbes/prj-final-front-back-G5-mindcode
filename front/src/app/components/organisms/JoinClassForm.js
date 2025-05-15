"use client";

import React, { useState } from "react";
import { joinClass } from "../../../services/communicationManager"; // Import joinClass function
import BaseForm from "../molecules/BaseForm";
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../stores/authStore';
 


const JoinClassForm = ({  }) => {
    const userInfo = useAuthStore.getState();
    const router = useRouter();
    const [classCode, setClassCode] = useState(""); // Add state for class code
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    const topText = "Uneix-te a una classe existent"

    const handleJoin = async () => {
        if ( classCode) {
          try {
            console.log("Attempting to join class...");
            const response = await joinClass(classCode);
            console.log("Join class response:", response);
    
            if (response.class_info) {
              if (userInfo.role == 1)
                router.push('/PfPage');
              else
                router.push('/StPage');
            } else {
              alert("Failed to join class. Please check your details.");
            }
          } catch (error) {
            console.error("Error joining class:", error);
            alert("An error occurred while joining the class.");
          }
        } else {
          alert("Please enter all required fields.");
        }
      };
    
      if (isAuthenticated) {
        
      }
    return (
        
        <div className="flex-1 flex">
          <BaseForm topText={topText} sendButtonText={"Join Class"} onSendButtonClick={handleJoin} formValues={
            [
              {placeholder: "Class Code", text: classCode, handleOnChange: (e) => setClassCode(e.target.value)}
            ]
          } />
           
        </div>
    )
};

export default JoinClassForm;