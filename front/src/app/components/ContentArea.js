import React from "react";

const ContentArea = ({ children }) => {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0 flex flex-col">
        <div className="flex-1 overflow-y-auto bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 border border-gray-400 dark:border-gray-600 rounded-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ContentArea;