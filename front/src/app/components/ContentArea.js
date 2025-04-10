import React from "react";

const ContentArea = ({children}) => {
  return (
    <div className="w-full h-full p-6">
      <div className="h-full max-h-[calc(100%-3rem)] overflow-y-auto bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 border border-gray-400 dark:border-gray-600 rounded-md">
        {children}
      </div>
    </div>
  );
};

export default ContentArea;