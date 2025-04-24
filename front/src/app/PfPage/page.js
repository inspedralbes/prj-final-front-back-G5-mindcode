"use client"; 

import React from "react";

import Navbar from "../components/Navbar";
import ContentArea from "../components/ContentArea";
import SidebarProf from "app/components/SidebarProf";
import { useAuthStore } from '../../stores/authStore';
import { useState } from "react";
import { useEffect } from "react";

const Page = () => {
  const [selectedField, setSelectedField] = useState("stats");
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);


  const classInfo = useAuthStore((state) => state.class_info);

  useEffect(() => {
    if (classInfo) {
      setSelectedClass(classInfo[0].class_id);
    }
    setLoading(false);
  }
  , []);

  const changeSelectedField = (value) => {
    setSelectedField(value);
  };

  const changeSelectedClass = (value) => {
    setSelectedClass(value);
    console.log(value);
  };

  console.log("Selected class: ", selectedClass);
  console.log("Class info: ", classInfo[0].class_id);

  return (
    <div className="flex h-screen relative bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <div className="max-w-[50vw]">
        <SidebarProf changeSelectedField={changeSelectedField} changeSelectedClass={changeSelectedClass} />
      </div>
      <div className="flex flex-col w-full h-fullc ">
        <Navbar />
        <ContentArea >
          {
          selectedField === "alumne"?<StatsContent classId={selectedClass?selectedClass:classInfo[0].class_id} mode={"alumne"} />:
          selectedField === "llenguatges"?"isLlenguatges":
          "isClass"}
        </ContentArea>
      </div>
    </div>
  );
};

export default Page;
  