"use client"; 

import React from "react";

import Navbar from "../components/Navbar";
import ContentArea from "../components/ContentArea";
import SidebarProf from "app/components/SidebarProf";
import ImageWithSubtitle from "../components/molecules/ImageWithSubtitle";
import { useState } from "react";
import { useEffect } from "react";

const Page = () => {
  const [selected, setSelected] = useState("stats");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }
  , []);

  const changeSelected = (value) => {
    setSelected(value);
  };

  return (
    <div className="flex h-screen relative bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <SidebarProf changeSelected={changeSelected} />
      <div className="flex flex-col w-full">
        <Navbar />
        <ContentArea >
          {selected === "stats"?<ImageWithSubtitle />:selected === "alumnes"?"isAlumnes":selected === "llenguatges"?"isLlenguatges":"isClass"}
        </ContentArea>
      </div>
    </div>
  );
};

export default Page;
  