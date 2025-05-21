

"use client"

import React, { useState } from "react"
import "./globals.css";

import Login from "./Login/page";

const Page = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login />;
      default:
        return <Login />;

    }
  }

  return (
    <div>
      {renderPage()}
    </div>
  );
};

export default Page;