"use client";

import React from "react";

const Panel = ({ children }) => {
  return (
    <div className="w-full lg:w-1/2 h-[500px] p-10 flex items-center justify-center z-10">
      {children}
    </div>
  );
};

export default Panel;
