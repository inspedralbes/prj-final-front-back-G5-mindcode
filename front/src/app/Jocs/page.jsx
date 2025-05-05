"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/organisms/Navbar";
import SidebarStudent from "../components/organisms/SidebarStudent";
import GameCirclePanel from "../components/organisms/GameCirclePanel";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/authStore";

const JocsPage = () => {
  const classInfo = useAuthStore((state) => state.class_info);
  const [highlightedLanguage, setHighlightedLanguage] = useState(null);
  const router = useRouter();

  const handleSetCurrentLanguage = (language) => {
    setHighlightedLanguage(language);
    router.push("/StPage");
  };

  if (!classInfo || classInfo.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
        ⏳ Carregant informació de la classe...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <SidebarStudent handleSetCurrentLanguage={handleSetCurrentLanguage} />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <GameCirclePanel languages={classInfo[0]?.language_info || []} />
        </div>
      </div>
    </div>
  );
};

export default JocsPage;
