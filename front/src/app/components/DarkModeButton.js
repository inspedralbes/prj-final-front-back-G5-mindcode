"use client"; 

import React, { useState, useEffect } from "react";

const DarkModeButton = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="h-12 w-12 rounded-lg p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
    >
      {darkMode ? (
        <svg
          className="fill-yellow-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 4a1 1 0 100 2 6 6 0 110 12 1 1 0 100 2 8 8 0 100-16z" />
        </svg>
      ) : (
        <svg
          className="fill-violet-700"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16z" />
        </svg>
      )}
    </button>
  );
};

export default DarkModeButton;