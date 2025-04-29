"use client";

import React from "react";
import Button from "../atoms/Button";

const LanguageList = ({ languages, onLanguageClick, isOpen, toggleOpen }) => {
  return (
    <div className="space-y-2">
      <Button
        onClick={toggleOpen}
        className="bg-gray-300 p-5 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-left w-full flex items-center gap-2"
      >📄 Llenguatges </Button>

      {isOpen && (
        <div className="ml-4 mt-2 space-y-2">
          {languages.length > 0 ? (
            languages.map((language) => (
              <Button
                key={language.id}
                onClick={() => onLanguageClick(language)}
                className="bg-blue-200 dark:bg-blue-700 hover:bg-blue-400 dark:hover:bg-blue-600 text-black dark:text-white w-full text-left px-3 py-2 rounded-md"
              >
                {language.name}
              </Button>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No hi ha llenguatges</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageList;
