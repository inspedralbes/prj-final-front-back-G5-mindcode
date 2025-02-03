import React from "react";

const Sidebar = () => {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white w-1/4 h-full p-4 border-r border-gray-300 dark:border-gray-700">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 mx-auto mb-2"></div>
        <h2 className="text-lg font-semibold">USER</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Admin</p>
      </div>
      <nav className="space-y-4">
        <button className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-left">
          📄 Languages
        </button>
        <button className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-left">
          🎮 Juegos
        </button>
        <button className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-left">
          ⚙️ Configuración
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;