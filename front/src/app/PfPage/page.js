"use client"; 

import React from "react";

import Navbar from "../components/Navbar";
import ContentArea from "../components/ContentArea";
import SidebarProf from "app/components/SidebarProf";

const Page = () => {


  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <SidebarProf />
      <div className="flex flex-col w-full">
        <Navbar />
        <ContentArea />
      </div>
    </div>
  );
};

export default Page;
  