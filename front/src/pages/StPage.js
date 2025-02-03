
"use client"; 

import React from "react";
import Sidebar from "../app/components/Sidebar";
import Navbar from "../app/components/Navbar";
import UserChat from "./UserChat";


const Page = () => {


  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <UserChat />
      </div>
    </div>
  );
};

export default Page;