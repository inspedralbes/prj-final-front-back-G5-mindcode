"use client";

import React, { useState } from "react";
import StPage from "../../../pages/StPage";
import { joinClass } from "../../../services/communicationManager"; // Import joinClass function
import BaseForm from "../molecules/BaseForm"

const JoinClassForm = ({  }) => {
    const [classCode, setClassCode] = useState(""); // Add state for class code
    const [userId, setUserId] = useState(""); // Add state for user ID
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const topText = "Uneix-te a una classe existent"

    const handleJoin = async () => {
        if ( classCode && userId) {
          try {
            console.log("Attempting to join class...");
            const response = await joinClass(classCode, userId);
            console.log("Join class response:", response);
    
            if (response.class_details) {
              setIsAuthenticated(true);
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
        return <StPage />;
      }
    return (
        
        <div className="flex-1 flex">
          <BaseForm topText={topText} sendButtonText={"Join Class"} onSendButtonClick={handleJoin} formValues={
            [
              {placeholder: "Class Code", text: classCode, handleOnChange: (e) => setClassCode(e.target.value)},
              {placeholder: "User Id", text: userId, handleOnChange: (e) => setUserId(e.target.value)},
            ]
          } />
           
        </div>
    )
};

export default JoinClassForm;