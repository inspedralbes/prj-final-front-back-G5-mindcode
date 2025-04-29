"use client";

import React from "react";

const Button = ({ onClick, children, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={` text-black font-semibold py-3 w-full rounded-lg transition duration-200 hover:scale-[1.01] ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
