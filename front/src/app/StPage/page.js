
"use client"; 

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UserChat from "../UserChat/page";

const Page = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner, or some fallback UI
  }
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