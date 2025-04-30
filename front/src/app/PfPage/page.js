"use client"; 

import React from "react";

import Navbar from "../components/Navbar";
import ContentArea from "../components/ContentArea";
import SidebarProf from "app/components/SidebarProf";
import { useAuthStore } from '../../stores/authStore';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { getClassMain, getRestrictions } from "services/communicationManager";
import StatsContent from "../components/organisms/StatsContent";
import EditRestrictions from "app/components/organisms/EditRestrictions";

const Page = () => {
  const [selectedField, setSelectedField] = useState("stats");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [restrictions, setRestrictions] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const classInfo = useAuthStore((state) => state.class_info);

  const childRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getClassMain();
        const res = await getRestrictions();
        setRestrictions(res);
        console.log(res);

        if (classInfo) {
          setSelectedClass(classInfo[0].class_id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const changeSelectedField = (value) => {
    setSelectedField(value);
  };

  const changeSelectedClass = (value) => {
    setSelectedClass(value);
  };

  const changeSelectedLanguage = (value) => {
    setSelectedLanguage(value);
  };

  const handleEdit0 = () => {
    if (childRef.current) {
      const result = childRef.current.handleSaveEdit0();
      setSelectedField("stats");
    }
  };
  const handleEdit1 = () => {
    if (childRef.current) {
      const result = childRef.current.handleSaveEdit1();
      setSelectedField("stats");
    }
  };
  const handleEdit2 = () => {
    if (childRef.current) {
      const result = childRef.current.handleSaveEdit2();
      setSelectedField("stats");
    }
  };

  if (loading) {
    // Show a loading spinner or message while data is being fetched
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <div className="text-center">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen relative bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <div className="w-[25vw]">
        <SidebarProf ref={childRef} changeSelectedField={changeSelectedField} changeSelectedClass={changeSelectedClass} changeSelectedLanguage={changeSelectedLanguage} />
      </div>
      <div className="flex flex-col w-full h-full">
        <Navbar />
        <ContentArea>
          {selectedField === "stats" ? (
            <StatsContent classId={selectedClass ? selectedClass : classInfo[0].class_id} mode={"professor"} />
          ) : selectedField === "alumne" ? (
            <StatsContent classId={selectedClass ? selectedClass : classInfo[0].class_id} mode={"alumne"} />
          ) : selectedField === "llenguatges" ? (
            <EditRestrictions
              buttons={[
                {
                  text: restrictions[2].content,
                  onClick: handleEdit2,
                  bgColorClass: "bg-green-600",
                  borderColorClass: "border-green-700",
                },
                {
                  text: restrictions[1].content,
                  onClick: handleEdit1,
                  bgColorClass: "bg-yellow-600",
                  borderColorClass: "border-yellow-700",
                },
                {
                  text: restrictions[0].content,
                  onClick: handleEdit0,
                  bgColorClass: "bg-red-600",
                  borderColorClass: "border-red-700",
                },
              ]}
              lang={classInfo[0].language_info}
            />
          ) : (
            "isClass"
          )}
        </ContentArea>
      </div>
    </div>
  );
};

export default Page;