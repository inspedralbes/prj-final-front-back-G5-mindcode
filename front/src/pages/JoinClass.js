"use client";

import React, { useState } from "react";
import StPage from "../pages/StPage";
import { joinClass } from "../services/communicationManager"; // Import joinClass function

const JoinClass = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [classCode, setClassCode] = useState(""); // Add state for class code
  const [userId, setUserId] = useState(""); // Add state for user ID
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const handleLogin = async () => {
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
    <div className="min-h-screen bg-black text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-black shadow sm:rounded-lg flex flex-row-reverse justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-60 flex-col items-center">
            {!showLogin ? (
              <div className="w-full flex-1 mt-8">
                <div className="flex flex-col items-center">
                  <button
                    className="w-40 max-w-xs font-bold shadow-sm rounded-lg py-3 bg-white text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                    onClick={() => setShowLogin(true)}
                  >
                    <span className="ma-4">JOIN CLASS</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex-1 mt-8">
                <div className="flex flex-col items-center gap-4"> 
                  <input
                    type="text"
                    placeholder="Class Code"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    className="w-full max-w-xs p-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full max-w-xs p-2 border rounded-lg"
                  />
                  <button
                    className="w-40 max-w-xs font-bold shadow-sm rounded-lg py-3 bg-blue-500 text-white flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                    onClick={handleLogin}
                  >
                    Log In & Join Class
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 bg-black text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/IA.png')`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default JoinClass;
