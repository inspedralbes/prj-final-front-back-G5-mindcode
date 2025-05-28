"use client";

import React from "react";

const PanelBox = ({ children, className = "" }) => {
  return (
    <div className={`w-[100%] max-w-[360px] mr-10  backdrop-blur-xl bg-gray-700 p-8 rounded-lg shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_0_rgba(255,255,255,0.2)] hover:scale-[1.01] ${className}`}>
      {children}
    </div>
  );
};

export default PanelBox;
