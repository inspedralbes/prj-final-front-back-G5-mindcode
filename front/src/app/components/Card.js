import React from "react";

const Card = () => {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 w-full flex items-center p-4 border-b border-gray-300 dark:border-gray-600">
      <button className="mr-4 text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400">
        <span className="text-2xl">&larr;</span>
      </button>
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        User Dashboard
      </h1>
    </div>
  );
};

export default Card;