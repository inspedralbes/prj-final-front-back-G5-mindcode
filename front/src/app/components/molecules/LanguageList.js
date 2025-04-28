"use client";

import React from "react";
import LanguageButton from "../atoms/LanguageButton";

const LanguageList = ({ languages, onLanguageClick, isOpen, toggleOpen }) => (
  <div>
    <button
      className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-left"
      onClick={toggleOpen}
    >
      📄 Llenguatges
    </button>

    {isOpen && (
      <div className="ml-4 mt-2 space-y-2">
        {languages.length > 0 ? (
          languages.filter(lang => lang.isActive).map((lang, idx) => (
            <LanguageButton key={idx} name={lang.name} onClick={() => onLanguageClick(lang)} />
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No hi ha llenguatges</p>
        )}
      </div>
    )}
  </div>
);

export default LanguageList;
